import requests
import json
import uuid

SELLER_LOC_ID = "L83Q4Y2YRB6C2"

idem_key = uuid.uuid4().hex

#from /catalog
cocoa_l = "425GQCKJDMTYFY4C2OIG7YNC"
cocoa_s = "3GZCVRNZJE2D5DGDAUKASWCX"
mocha_r = "7AYLQX6IMDOEC6D7Y2IBOKW6"

basic_order = [
    {
        "quantity": "2",
        "catalog_object_id": cocoa_l,
        # "applied_discounts": [
        # {
        #     "discount_uid": "one-dollar-off"
        # }
        # ]
    },
    {
        "quantity": "1",
        "catalog_object_id": mocha_r,
    },
]

create_req = {
    "order": {
      "location_id": SELLER_LOC_ID,
      "line_items": basic_order,
      "taxes": [
        {
          "uid": "state-sales-tax",
          "name": "State Sales Tax",
          "percentage": "7",
          "scope": "ORDER"
        }
      ],
    #   "discounts": [
    #     {
    #       "uid": "point-discount",
    #       "name": "Loyalty Point Discount - $1.00 off",
    #       "amount_money": {
    #         "amount": 100,
    #         "currency": "USD"
    #       },
    #       "scope": "LINE_ITEM"
    #     }
    #   ]
    },
    "idempotency_key": idem_key
  }


res = requests.post("http://127.0.0.1:8080/orders", json=json.dumps(create_req))
print(res.text)