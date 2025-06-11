//
//  ViewController.swift
//  Shared (App)
//
//  Created by Guillaume Claverie on 08/01/2024.
//

import WebKit

#if os(iOS)
  import UIKit
  typealias PlatformViewController = UIViewController
#elseif os(macOS)
  import Cocoa
  import SafariServices
  typealias PlatformViewController = NSViewController
#endif

let extensionBundleIdentifier = "com.guillaumeclaverie.No-Youtube-Shorts.Extension"

class ViewController: PlatformViewController, WKNavigationDelegate, WKScriptMessageHandler {

  @IBOutlet var webView: WKWebView!

  override func viewDidLoad() {
    super.viewDidLoad()

    self.webView.navigationDelegate = self

    #if os(iOS)
      self.webView.scrollView.isScrollEnabled = false
    #endif

    self.webView.configuration.userContentController.add(self, name: "controller")

    self.webView.loadFileURL(
      Bundle.main.url(forResource: "Main", withExtension: "html")!,
      allowingReadAccessTo: Bundle.main.resourceURL!)
  }

  func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
    #if os(iOS)
      webView.evaluateJavaScript("show('ios')")
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
      }
    #elseif os(macOS)
      if message.body as! String != "open-preferences" {
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
