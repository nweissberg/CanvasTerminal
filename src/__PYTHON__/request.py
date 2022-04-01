import requests
import json

email = "api_techmahindra@pontotel.com.br"
senha = "TM&PT@2021"
headers = {
	"accept": "application/json",
	"Content-Type": "application/json",
	"Cache-Control": "no-cache",
}
payload = {"email": email, "senha": senha}
auth = requests.post(
	"https://homolog-api.pontotel.com.br/v3/login/", data=json.dumps(payload), headers=headers,
)

print(auth.status_code)

if auth.status_code == 404:
	token = auth.json()
	print(token)

if auth.status_code == 400:
	token = auth.json()["access_token"]
	print(token)

if auth.status_code == 200:
	token = auth.json()["access_token"]
	headers.update({"Authorization": "Bearer " + token})
	print(token)