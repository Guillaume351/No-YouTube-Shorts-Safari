//
//  SafariWebExtensionHandler.swift
//  Shared (Extension)
//
//  Created by Guillaume Claverie on 08/01/2024.
//

import SafariServices
import os.log

class SafariWebExtensionHandler: NSObject, NSExtensionRequestHandling {

    func beginRequest(with context: NSExtensionContext) {
        let request = context.inputItems.first as? NSExtensionItem

        let profile: UUID?
        if #available(iOS 17.0, macOS 14.0, *) {
            profile = request?.userInfo?[SFExtensionProfileKey] as? UUID
        } else {
            profile = request?.userInfo?["profile"] as? UUID
        }

        let message: Any?
        if #available(iOS 17.0, macOS 14.0, *) {
            message = request?.userInfo?[SFExtensionMessageKey]
        } else {
            message = request?.userInfo?["message"]
        }

        os_log(.default, "Received message from browser.runtime.sendNativeMessage: %@ (profile: %@)", String(describing: message), profile?.uuidString ?? "none")

        #if os(iOS)
        if let body = message as? [String: Any], body["type"] as? String == "youtube-visit" {
            ExtensionActivity.recordYouTubeVisit()
        }
        #endif

        let response = NSExtensionItem()
        response.userInfo = [ SFExtensionMessageKey: [ "echo": message ] ]

        context.completeRequest(returningItems: [ response ], completionHandler: nil)
    }

}
