from flask import Flask, jsonify, request, render_template, make_response
from flask_restful import Resource, Api
import json
import my_secrets as secrets
from square.client import Client
import os
import uuid

app = Flask(__name__)
api = Api(app)

client = Client(
    access_token=secrets.SQUARE_ACCESS_TOKEN,
    environment='sandbox')

def pprint(x):
    return json.dumps(x, indent=2)

def handle_result(res):
    if res.is_success():
        return res.body, 200
    elif res.is_error():
        return res.errors, 500
    else:
        return 404

class Test(Resource):
    def get(self):
        result = client.payments.list_payments()

        return {"res":result.body}, 200


class Catalog(Resource):
    def get(self):
        """
        Lists CatalogObjects
        """
        result = client.catalog.list_catalog(
            types = "item" #just sticking to items in catalog for now
        )

        return handle_result(result)
    
    def post(self):
        data = json.loads(request.json)

        #basic check if object exists by name
        item_names = [item["item_data"]["name"] for item in client.catalog.list_catalog(types = "item" ).body["objects"]]
 
        if data["object"]["item_data"]["name"] in item_names:
            return {"res":"item " + str(data["object"]["item_data"]["name"]) + " already exists"}, 201

        result = client.catalog.upsert_catalog_object(body=data)

        return handle_result(result)



class Orders(Resource):
    def get(self):
        """
        Lists all orders
        """
        result = client.orders.search_orders(
            body = {
                "location_ids": [
                secrets.SELLER_LOC_ID
                ]
            }
        )
        return handle_result(result)


    def post(self):
        data = json.loads(request.json)
        result = client.orders.create_order(body = data)

        return handle_result(result)


class Loyalty(Resource):
    def get(self):
        program_id = client.loyalty.retrieve_loyalty_program(program_id = "main").body["program"]["id"]
        loyal_acc = client.loyalty.search_loyalty_accounts(
                    body = {
                        "query": {
                        "mappings": [
                            {
                            "phone_number": "+19085528307" #sample account
                            }
                        ]
                        }
                    }
                    ).body

        return {"program":program_id, "user_loyacc_id": loyal_acc}, 200
    
    def post(self):
        loyal_acc_id = client.loyalty.search_loyalty_accounts(
                    body = {
                        "query": {
                        "mappings": [
                            {
                            "phone_number": "+19085528307" #sample account
                            }
                        ]
                        }
                    }
                    ).body["loyalty_accounts"][0]["id"]
        
        order_data = json.loads(request.json)

        result = client.loyalty.accumulate_loyalty_points(
                account_id = loyal_acc_id,
                body = {
                    "accumulate_points": {
                    "order_id": order_data["id"]
                    },
                    "idempotency_key": uuid.uuid4().hex,
                    "location_id": secrets.SELLER_LOC_ID
                }
                )
        
        return handle_result(result)


    # def post(self):
    #     result = client.loyalty.create_loyalty_account(
    #     body = {
    #         "loyalty_account": {
    #         "program_id": "d619f755-2d17-41f3-990d-c04ecedd64dd",
    #         "mapping": {
    #             "phone_number": "+14155551234"
    #         }
    #         },
    #         "idempotency_key": "ec78c477-b1c3-4899-a209-a4e71337c996"
    #     }
    #     )

    #     return handle_result(result)

api.add_resource(Test, '/')
api.add_resource(Catalog, '/catalog')
api.add_resource(Loyalty, '/loyalty')
api.add_resource(Orders, '/orders')


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)