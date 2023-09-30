//
//  CardEntryForm.swift
//  Square-Google-AI-Hackathon
//
//  Created by Brayton Lordianto on 9/26/23.
//

import SwiftUI
import SquareInAppPaymentsSDK

struct CardEntryForm: UIViewControllerRepresentable {
    typealias UIViewControllerType = SQIPCardEntryViewController
    
    func makeUIViewController(context: Context) -> SQIPCardEntryViewController {
        let theme = SQIPTheme()
        let cardEntry = SQIPCardEntryViewController(theme: theme)
        cardEntry.collectPostalCode = false
        cardEntry.delegate = context.coordinator
        return cardEntry
    }

    func updateUIViewController(_: SQIPCardEntryViewController, context _: Context) {}
    
    func makeCoordinator() -> Coordinator { Coordinator() }
}

extension CardEntryForm {
    class Coordinator: NSObject, SQIPCardEntryViewControllerDelegate {
        func cardEntryViewController(_ cardEntryViewController: SQIPCardEntryViewController, didObtain cardDetails: SQIPCardDetails, completionHandler: @escaping (Error?) -> Void) {
            print("ran did obtain card details \(cardDetails)")
            
            // in 5 seconds, call completionHandler(nil) to indicate success
            DispatchQueue.main.asyncAfter(deadline: .now() + 5) {
                completionHandler(nil)
            }
        
        }
        
        func cardEntryViewController(_ cardEntryViewController: SQIPCardEntryViewController, didCompleteWith status: SQIPCardEntryCompletionStatus) {
            print("ran did complete with status \(status)")
        }
    }
}
