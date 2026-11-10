//
//  ViewController.swift
//  Shared (App)
//
//  Created by Guillaume Claverie on 08/01/2024.
//

import WebKit

#if os(iOS)
  import SafariServices
  import StoreKit
  import UIKit
  typealias PlatformViewController = UIViewController
#elseif os(macOS)
  import Cocoa
  import SafariServices
  typealias PlatformViewController = NSViewController
#endif

#if os(iOS)
  let extensionBundleIdentifier = "com.guillaumeclaverie.No-Youtube-Shorts.iOS-Extension"
#elseif os(macOS)
  let extensionBundleIdentifier = "com.guillaumeclaverie.No-Youtube-Shorts.Extension"
#endif

/// App Store bundle with the Instagram and X extensions by the same developer.
let extensionBundleAppStoreURL = URL(string: "https://apps.apple.com/app-bundle/id1878643524")!

#if os(iOS)
  /// Treat the extension as working when it ran on YouTube this recently.
  let recentYouTubeActivityInterval: TimeInterval = 14 * 24 * 60 * 60

  /// Dismissible cross-promotion card for BrowseKind, a separate iPhone-only app (iOS 17+)
  /// by the same developer. No tracking or network call: the card is local HTML and the
  /// App Store page is shown with StoreKit's overlay (apps.apple.com as a fallback).
  enum BrowseKindPromo {
    static let appStoreID = "6796664167"
    static let appStoreURL = URL(string: "https://apps.apple.com/app/id6796664167")!
    static let dismissedDefaultsKey = "browseKindPromo.dismissed"

    static var shouldShow: Bool {
      guard #available(iOS 17.0, *) else {
        return false
      }
      guard !ProcessInfo.processInfo.isiOSAppOnMac,
        UIDevice.current.userInterfaceIdiom == .phone
      else {
        return false
      }
      return !UserDefaults.standard.bool(forKey: dismissedDefaultsKey)
    }

    static func dismiss() {
      UserDefaults.standard.set(true, forKey: dismissedDefaultsKey)
    }
  }
#endif

class ViewController: PlatformViewController, WKNavigationDelegate, WKScriptMessageHandler {

  @IBOutlet var webView: WKWebView!

  override func viewDidLoad() {
    super.viewDidLoad()

    self.webView.navigationDelegate = self

    #if os(iOS)
      self.webView.scrollView.isScrollEnabled = false

      // People leave for Settings and Safari during setup; refresh the status when they return.
      NotificationCenter.default.addObserver(
        self, selector: #selector(applicationWillEnterForeground),
        name: UIApplication.willEnterForegroundNotification, object: nil)
    #endif

    self.webView.configuration.userContentController.add(self, name: "controller")

    self.webView.loadFileURL(
      Bundle.main.url(forResource: "Main", withExtension: "html")!,
      allowingReadAccessTo: Bundle.main.resourceURL!)
  }

  #if os(iOS)
    override func viewDidAppear(_ animated: Bool) {
      super.viewDidAppear(animated)
      ReviewRequestCoordinator.shared.recordActiveDay()
      // The setup status is refreshed once Main.html finishes loading (see didFinish).
    }

    @objc private func applicationWillEnterForeground() {
      ReviewRequestCoordinator.shared.recordActiveDay()
      refreshSetupStatus()
    }

    /// Shows whether the extension is on and has run on YouTube, then asks for a review when
    /// it is clearly working. The extension state API needs iOS 26.2; on earlier versions the
    /// last YouTube visit recorded by the extension is the only signal.
    private func refreshSetupStatus() {
      let lastActiveOnYouTube = ExtensionActivity.lastActiveOnYouTube

      guard #available(iOS 26.2, *) else {
        applySetupStatus(lastActiveOnYouTube: lastActiveOnYouTube, isEnabled: nil)
        return
      }

      SFSafariExtensionManager.getStateOfExtension(withIdentifier: extensionBundleIdentifier) {
        [weak self] state, error in
        DispatchQueue.main.async {
          self?.applySetupStatus(
            lastActiveOnYouTube: lastActiveOnYouTube,
            isEnabled: error == nil ? state?.isEnabled : nil)
        }
      }
    }

    private func applySetupStatus(lastActiveOnYouTube: Date?, isEnabled: Bool?) {
      let lastActiveArgument =
        lastActiveOnYouTube.map { String(Int64($0.timeIntervalSince1970 * 1000)) } ?? "null"
      let isEnabledArgument = isEnabled.map { String($0) } ?? "null"
      webView.evaluateJavaScript("showSetupStatus(\(lastActiveArgument), \(isEnabledArgument))")

      let ranOnYouTubeRecently =
        lastActiveOnYouTube.map { Date().timeIntervalSince($0) < recentYouTubeActivityInterval }
        ?? false
      ReviewRequestCoordinator.shared.requestReviewIfAppropriate(
        extensionIsEnabled: isEnabled ?? ranOnYouTubeRecently,
        in: view.window?.windowScene)
    }
  #elseif os(macOS)
    override func viewDidAppear() {
      super.viewDidAppear()
      ReviewRequestCoordinator.shared.recordActiveDay()

      SFSafariExtensionManager.getStateOfSafariExtension(
        withIdentifier: extensionBundleIdentifier
      ) { [weak self] state, error in
        guard let self = self, let state = state, error == nil else {
          return
        }

        DispatchQueue.main.async {
          ReviewRequestCoordinator.shared.requestReviewIfAppropriate(
            extensionIsEnabled: state.isEnabled,
            from: self)
        }
      }
    }
  #endif

  func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
    #if os(iOS)
      webView.evaluateJavaScript("show('ios')")

      if BrowseKindPromo.shouldShow {
        webView.evaluateJavaScript("showBrowseKindPromo()")
      }

      refreshSetupStatus()
    #elseif os(macOS)
      webView.evaluateJavaScript("show('mac')")

      SFSafariExtensionManager.getStateOfSafariExtension(withIdentifier: extensionBundleIdentifier)
      { (state, error) in
        guard let state = state, error == nil else {
          // Insert code to inform the user that something went wrong.
          return
        }

        DispatchQueue.main.async {
          if #available(macOS 13, *) {
            webView.evaluateJavaScript("show('mac', \(state.isEnabled), true)")
          } else {
            webView.evaluateJavaScript("show('mac', \(state.isEnabled), false)")
          }
        }
      }
    #endif
  }

  func userContentController(
    _ userContentController: WKUserContentController, didReceive message: WKScriptMessage
  ) {
    #if os(iOS)
      if message.body as? String == "open-ios-settings" {
        if let url = URL(string: "App-prefs:root=SAFARI&path=WEB_EXTENSIONS") {
          UIApplication.shared.open(url, options: [:], completionHandler: nil)
        }
      } else if message.body as? String == "open-youtube" {
        openYouTubeInSafari()
      } else if message.body as? String == "open-bundle" {
        UIApplication.shared.open(extensionBundleAppStoreURL, options: [:], completionHandler: nil)
      } else if message.body as? String == "open-browsekind" {
        presentBrowseKindOnAppStore()
      } else if message.body as? String == "dismiss-browsekind-promo" {
        BrowseKindPromo.dismiss()
      }
    #elseif os(macOS)
      if message.body as? String == "open-bundle" {
        NSWorkspace.shared.open(extensionBundleAppStoreURL)
        return
      }

      if message.body as? String != "open-preferences" {
        return
      }

      SFSafariApplication.showPreferencesForExtension(withIdentifier: extensionBundleIdentifier) {
        error in
        guard error == nil else {
          // Insert code to inform the user that something went wrong.
          return
        }

        DispatchQueue.main.async {
          NSApp.terminate(self)
        }
      }
    #endif
  }

}

#if os(iOS)
  extension ViewController {
    /// Opens YouTube in Safari, where the extension runs, even when another browser is the
    /// default. `x-safari-https` exists on iOS 17+; older versions fall back to the default browser.
    func openYouTubeInSafari() {
      let youTubeURL = URL(string: "https://www.youtube.com/")!
      let safariURL = URL(string: "x-safari-https://www.youtube.com/")!

      UIApplication.shared.open(safariURL, options: [:]) { opened in
        if !opened {
          UIApplication.shared.open(youTubeURL, options: [:], completionHandler: nil)
        }
      }
    }
  }

  extension ViewController: SKOverlayDelegate {
    func presentBrowseKindOnAppStore() {
      guard let scene = view.window?.windowScene else {
        openBrowseKindAppStoreURL()
        return
      }

      let configuration = SKOverlay.AppConfiguration(
        appIdentifier: BrowseKindPromo.appStoreID, position: .bottom)
      configuration.userDismissible = true

      let overlay = SKOverlay(configuration: configuration)
      overlay.delegate = self
      overlay.present(in: scene)
    }

    func storeOverlayDidFailToLoad(_ overlay: SKOverlay, error: Error) {
      DispatchQueue.main.async {
        self.openBrowseKindAppStoreURL()
      }
    }

    private func openBrowseKindAppStoreURL() {
      UIApplication.shared.open(BrowseKindPromo.appStoreURL, options: [:], completionHandler: nil)
    }
  }
#endif
