import requests
import json
import uuid

idem_key = uuid.uuid4().hex

body = {
    "idempotency_key": idem_key,
    "object": {
      "type": "ITEM",
      "id": "#WCMocha",
      "item_data": {
        "name": "White Chocolate Mocha",
        "description": "Creamy mocha with Swiss white chocolate-y flavor.",
        "variations": [
          {
            "type": "ITEM_VARIATION",
            "id": "#Regular",
            "item_variation_data": {
              "item_id": "#WCMocha",
              "name": "Regular",
              "pricing_type": "FIXED_PRICING",
              "price_money": {
                "amount": 350,
                "currency": "USD"
              }
            }
          }
        ]
      }
    }
}

res = requests.post("http://127.0.0.1:8080/catalog", json=json.dumps(body))
print(res.text)

