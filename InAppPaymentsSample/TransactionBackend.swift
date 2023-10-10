//
//  TransactionBackend.swift
//  InAppPaymentsSample
//
//  Created by Brayton Lordianto on 10/7/23.
//  Copyright © 2023 Stephen Josey. All rights reserved.
//

// the purpose of this class is to do the actual transaction of the card given all the information, and will
// for simplicity, I am putting the backend here, instead of making a server endpoint for it
/* SAMPLE REQUEST
 curl https://connect.squareup.com/v2/payments \
   -X POST \
   -H 'Square-Version: 2023-09-25' \
   -H 'Authorization: Bearer ACCESS_TOKEN' \
   -H 'Content-Type: application/json' \
   -d '{
     "idempotency_key": "7b0f3ec5-086a-4871-8f13-3c81b3875218",
     "amount_money": {
       "amount": 1000,
       "currency": "USD"
     },
     "source_id": "ccof:GaJGNaZa8x4OgDJn4GB",
     "autocomplete": true,
     "customer_id": "W92WH6P11H4Z77CTET0RNTGFW8",
     "location_id": "L88917AVBK2S5",
     "reference_id": "123456",
     "note": "Brief description",
     "app_fee_money": {
       "amount": 10,
       "currency": "USD"
     }
   }'
 */
/*SAMPLE RESPONSE
 {
   "payment": {
     "id": "R2B3Z8WMVt3EAmzYWLZvz7Y69EbZY",
     "created_at": "2021-10-13T21:14:29.577Z",
     "updated_at": "2021-10-13T21:14:30.504Z",
     "amount_money": {
       "amount": 1000,
       "currency": "USD"
     },
     "app_fee_money": {
       "amount": 10,
       "currency": "USD"
     },
     "status": "COMPLETED",
     "delay_duration": "PT168H",
     "source_type": "CARD",
     "card_details": {
       "status": "CAPTURED",
       "card": {
         "card_brand": "VISA",
         "last_4": "1111",
         "exp_month": 11,
         "exp_year": 2022,
         "fingerprint": "sq-1-Hxim77tbdcbGejOejnoAklBVJed2YFLTmirfl8Q5XZzObTc8qY_U8RkwzoNL8dCEcQ",
         "card_type": "DEBIT",
         "prepaid_type": "NOT_PREPAID",
         "bin": "411111"
       },
       "entry_method": "ON_FILE",
       "cvv_status": "CVV_ACCEPTED",
       "avs_status": "AVS_ACCEPTED",
       "auth_result_code": "vNEn2f",
       "statement_description": "SQ *EXAMPLE TEST GOSQ.C",
       "card_payment_timeline": {
         "authorized_at": "2021-10-13T21:14:29.732Z",
         "captured_at": "2021-10-13T21:14:30.504Z"
       }
     },
     "location_id": "L88917AVBK2S5",
     "order_id": "pRsjRTgFWATl7so6DxdKBJa7ssbZY",
     "reference_id": "123456",
     "risk_evaluation": {
       "created_at": "2021-10-13T21:14:30.423Z",
       "risk_level": "NORMAL"
     },
     "note": "Brief Description",
     "customer_id": "W92WH6P11H4Z77CTET0RNTGFW8",
     "total_money": {
       "amount": 1000,
       "currency": "USD"
     },
     "approved_money": {
       "amount": 1000,
       "currency": "USD"
     },
     "receipt_number": "R2B3",
     "receipt_url": "https://squareup.com/receipt/preview/EXAMPLE_RECEIPT_ID",
     "delay_action": "CANCEL",
     "delayed_until": "2021-10-20T21:14:29.577Z",
     "application_details": {
       "square_product": "ECOMMERCE_API",
       "application_id": "sq0ids-TcgftTEtKxJTRF1lCFJ9TA"
     },
     "version_token": "TPtNEOBOa6Qq6E3C3IjckSVOM6b3hMbfhjvTxHBQUsB6o"
   }
 }
 */

import Foundation

enum AppError: Error {
    case nocontextError(String)
}

class TransactionHandler {
    static func processPayment(withNonce nonce: String,
                               _ completion: @escaping (Error?) -> Void)
    {
        let url = URL(string: Constants.Square.CHARGE_URL)!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        
        // set the request headers
        request.addValue("Bearer \(Constants.Square.ACCESS_TOKEN)", forHTTPHeaderField: "Authorization")
        request.addValue("2023-09-25", forHTTPHeaderField: "Square-Version")
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        
        // set the request body
        let body: [String: Any] = [
            "idempotency_key": UUID().uuidString,
            "amount_money": [
                "amount": 1,
                "currency": "USD"
            ],
            "source_id": nonce,
            "autocomplete": true,
            "customer_id": "W92WH6P11H4Z77CTET0RNTGFW8",
//            "location_id": Constants.Square.SQUARE_LOCATION_ID,
            "reference_id": "123456",
            "note": "Brief description",
            "app_fee_money": [
                "amount": 0,
                "currency": "USD"
            ]
        ]
        
        // convert the body to JSON
        let jsonData = try? JSONSerialization.data(withJSONObject: body)
        request.httpBody = jsonData
        
        // send the request
        Self.sendRequest(request, completion)
    
    }
    
    static func sendRequest(_ request: URLRequest, _ completion: @escaping (Error?) -> Void) {
        let task = URLSession.shared.dataTask(with: request) { data, response, error in
            guard let data = data else {
                completion(AppError.nocontextError("No data in response"))
                return
            }
            
            // decode data as a raw json string
            let json = String(data: data, encoding: .utf8)
            print("response \(response) \njson \(json) \nerror \(error)")
            fatalError()
            
            do {
                if try statusIsCompleted(data) {
                    completion(nil)
                    return
                }
            } catch {
                print(error)
                completion(AppError.nocontextError("Error parsing response"))
            }
        }
        
        task.resume()
    }
    
    // returns based on the result, whether the status field is completed or whether it failed
    static func statusIsCompleted(_ result: Data) throws -> Bool  {
        do {
            let json = try JSONSerialization.jsonObject(with: result, options: []) as? [String: Any]
            let payment = json?["payment"] as? [String: Any]
            let status = payment?["status"] as? String
            return status == "COMPLETED"
        } catch {
            print(error)
            return false
        }
    }


}
