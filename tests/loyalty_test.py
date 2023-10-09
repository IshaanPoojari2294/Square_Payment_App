import requests
import json
import uuid

USER_LOYACC_ID = "d6567122-2351-4517-87f6-22ec8177f37d"

idem_key = uuid.uuid4().hex

order_info = {"id":"cMR8aMSSECBBKHtT0YDjxYO67IJZY"} #10011

res = requests.post("http://127.0.0.1:8080/loyalty", json=json.dumps(order_info))
print(res.text)

