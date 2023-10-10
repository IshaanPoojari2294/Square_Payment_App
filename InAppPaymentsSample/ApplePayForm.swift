//
//  ApplePayForm.swift
//  InAppPaymentsSample
//
//  Created by Brayton Lordianto on 10/7/23.
//  Copyright © 2023 Stephen Josey. All rights reserved.
//

import PassKit
import SquareInAppPaymentsSDK
import SwiftUI

struct ApplePayFormViewController: UIViewControllerRepresentable {
    typealias UIViewControllerType = PKPaymentAuthorizationViewController
    
    func makeUIViewController(context: Context) -> UIViewControllerType {
        guard SQIPInAppPaymentsSDK.canUseApplePay else {
            fatalError()
        }
        
        let paymentRequest = PKPaymentRequest.squarePaymentRequest(
            merchantIdentifier: Constants.ApplePay.MERCHANT_IDENTIFIER,
            countryCode: Constants.ApplePay.COUNTRY_CODE,
            currencyCode: Constants.ApplePay.CURRENCY_CODE
        )
        
        paymentRequest.paymentSummaryItems = [
            PKPaymentSummaryItem(label: "Testing Apple Pay", amount: 0.01),
        ]
        
        let applePayController = PKPaymentAuthorizationViewController(paymentRequest: paymentRequest)
        applePayController?.delegate = context.coordinator
        
        return applePayController!
    }
    
    func updateUIViewController(_: UIViewControllerType, context _: Context) {}
    
    func makeCoordinator() -> Coordinator { Coordinator() }
}

extension ApplePayFormViewController {
    class Coordinator: NSObject, PKPaymentAuthorizationViewControllerDelegate {
        func paymentAuthorizationViewControllerDidFinish(_ controller: PKPaymentAuthorizationViewController) {
            print("ran did finish")
            controller.dismiss(animated: true, completion: nil)
        }
        
        func paymentAuthorizationViewController(_ controller: PKPaymentAuthorizationViewController, didAuthorizePayment payment: PKPayment, handler completion: @escaping (PKPaymentAuthorizationResult) -> Void) {
            print("ran did authorize payment")
            
            let nonceRequest = SQIPApplePayNonceRequest(payment: payment)
            nonceRequest.perform { cardDetails, error in
                if let cardDetails = cardDetails {
                    // Send the card nonce to your server to charge the card or store
                    // the card on file.
                    print("AAA \(cardDetails)")
                    
                    TransactionHandler.processPayment(withNonce: cardDetails.nonce) { chargeError in
                        if let chargeError {
                            if case let AppError.nocontextError(message) = chargeError {
                                print("the error is " + message)
                            }
                            completion(PKPaymentAuthorizationResult(status: .failure,
                                                                    errors: [chargeError]))
                        }
                        else {
                            completion(PKPaymentAuthorizationResult(status: .success,
                                                                    errors: nil))
                        }
                    }
                } else if let error = error {
                    print(error)
                    completion(PKPaymentAuthorizationResult(status: .failure, errors: [error]))
                }
            }
            
            // in 5 seconds, call completionHandler(nil) to indicate success
            DispatchQueue.main.asyncAfter(deadline: .now() + 5) {
                completion(PKPaymentAuthorizationResult(status: .success, errors: nil))
            }
        }
    }
}



