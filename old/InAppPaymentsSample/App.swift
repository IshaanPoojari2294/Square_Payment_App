//
//  App.swift
//  InAppPaymentsSample
//
//  Created by Brayton Lordianto on 9/30/23.
//  Copyright © 2023 Stephen Josey. All rights reserved.
//

import Foundation
import SwiftUI

@main
struct NewIn14App: App {
    @UIApplicationDelegateAdaptor(AppDelegate.self) var appDelegate

    var body: some Scene {
        WindowGroup {
            CardEntryForm()
        }
    }
}
