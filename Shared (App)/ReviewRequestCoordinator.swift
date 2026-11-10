//
//  ReviewRequestCoordinator.swift
//  Shared (App)
//

import Foundation
import StoreKit

#if os(iOS)
  import UIKit
#elseif os(macOS)
  import AppKit
#endif

final class ReviewRequestCoordinator {

  static let shared = ReviewRequestCoordinator()

  private enum Constants {
    static let minimumActiveDays = 3
    static let minimumAppAge: TimeInterval = 7 * 24 * 60 * 60
    static let minimumRequestInterval: TimeInterval = 120 * 24 * 60 * 60
  }

  private enum Key {
    static let firstActiveDate = "review.firstActiveDate"
    static let lastActiveDate = "review.lastActiveDate"
    static let activeDayCount = "review.activeDayCount"
    static let lastRequestDate = "review.lastRequestDate"
    static let lastRequestedVersion = "review.lastRequestedVersion"
  }

  private let defaults: UserDefaults
  private let calendar: Calendar
  private let now: () -> Date

  init(
    defaults: UserDefaults = .standard,
    calendar: Calendar = .current,
    now: @escaping () -> Date = Date.init
  ) {
    self.defaults = defaults
    self.calendar = calendar
    self.now = now
  }

  func recordActiveDay() {
    let currentDate = now()

    if defaults.object(forKey: Key.firstActiveDate) == nil {
      defaults.set(currentDate, forKey: Key.firstActiveDate)
    }

    if let lastActiveDate = defaults.object(forKey: Key.lastActiveDate) as? Date,
      calendar.isDate(lastActiveDate, inSameDayAs: currentDate)
    {
      return
    }

    defaults.set(currentDate, forKey: Key.lastActiveDate)
    defaults.set(defaults.integer(forKey: Key.activeDayCount) + 1, forKey: Key.activeDayCount)
  }

  #if os(iOS)
    @MainActor
    func requestReviewIfAppropriate(extensionIsEnabled: Bool, in scene: UIWindowScene?) {
      guard let scene = scene, markRequestIfEligible(extensionIsEnabled: extensionIsEnabled) else {
        return
      }

      if #available(iOS 16.0, *) {
        AppStore.requestReview(in: scene)
      } else {
        SKStoreReviewController.requestReview(in: scene)
      }
    }
  #elseif os(macOS)
    @MainActor
    func requestReviewIfAppropriate(
      extensionIsEnabled: Bool, from viewController: NSViewController
    ) {
      guard markRequestIfEligible(extensionIsEnabled: extensionIsEnabled) else {
        return
      }

      if #available(macOS 13.0, *) {
        AppStore.requestReview(in: viewController)
      } else {
        SKStoreReviewController.requestReview()
      }
    }
  #endif

  private func markRequestIfEligible(extensionIsEnabled: Bool) -> Bool {
    let currentDate = now()
    let currentVersion = Bundle.main.object(
      forInfoDictionaryKey: "CFBundleShortVersionString") as? String

    guard extensionIsEnabled,
      let firstActiveDate = defaults.object(forKey: Key.firstActiveDate) as? Date,
      let currentVersion = currentVersion,
      defaults.integer(forKey: Key.activeDayCount) >= Constants.minimumActiveDays,
      currentDate.timeIntervalSince(firstActiveDate) >= Constants.minimumAppAge,
      defaults.string(forKey: Key.lastRequestedVersion) != currentVersion
    else {
      return false
    }

    if let lastRequestDate = defaults.object(forKey: Key.lastRequestDate) as? Date,
      currentDate.timeIntervalSince(lastRequestDate) < Constants.minimumRequestInterval
    {
      return false
    }

    // Store the attempt before asking StoreKit. The system can decide not to show a prompt.
    defaults.set(currentDate, forKey: Key.lastRequestDate)
    defaults.set(currentVersion, forKey: Key.lastRequestedVersion)
    return true
  }
}
