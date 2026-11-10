//
//  ExtensionActivity.swift
//  Shared (Extension)
//

import Foundation

/// Records when the Safari extension last ran on youtube.com, in the App Group shared by
/// the iOS app and its extension. Before iOS 26.2 the app cannot read the extension state,
/// so this is how the setup screen confirms the extension is on *and* allowed on YouTube.
/// Built into the iOS targets only.
enum ExtensionActivity {
  static let appGroupIdentifier = "group.com.guillaumeclaverie.No-Youtube-Shorts"

  private static let lastActiveOnYouTubeKey = "extension.lastActiveOnYouTube"

  private static var defaults: UserDefaults? {
    UserDefaults(suiteName: appGroupIdentifier)
  }

  static var lastActiveOnYouTube: Date? {
    defaults?.object(forKey: lastActiveOnYouTubeKey) as? Date
  }

  static func recordYouTubeVisit(at date: Date = Date()) {
    defaults?.set(date, forKey: lastActiveOnYouTubeKey)
  }
}
