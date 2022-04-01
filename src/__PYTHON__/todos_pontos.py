# -*- coding: utf-8 -*-
def consulta_todos_pontos(login=None, senha=None, inicio=None, fim=None):
	import requests
	import json
	
	url_apis = "https://homolog-api.pontotel.com.br/v3/"

	if not login or not senha:
		ret = {"error": "por favor, informar o login e senha para autenticação da API"}
		print(ret)
		return ret
	
	if not inicio or not fim:
		ret = {"error": "por favor, informar a data de inicio e fim para consulta dos pontos"}
		print(ret)
		return ret
	
	### autenticação ###
	headers = {
		"accept": "application/json",
		"Content-Type": "application/json",
		"Cache-Control": "no-cache",
	}

	payload = {"email": login, "senha": senha}

	auth = requests.post(url_apis + "login/", data=json.dumps(payload), headers=headers, verify=False)
	

	if auth.status_code == 200:
		token = auth.json()["access_token"]
		headers.update({"Authorization": "Bearer " + token})

		empregados_iterados = 0
		limite = 100
		resposta_final = []
		
		primeiro_request = requests.get( url_apis
			+ "timelogs/empresa?inicio={}&fim={}&limit={}&skip={}".format(
				inicio, fim, limite, empregados_iterados
			),
			headers=headers, verify=False
		)

		if primeiro_request.status_code == 200:
			resposta_para_json = primeiro_request.json()
			paginas_total = resposta_para_json["pagination"]["totalPages"]
			resposta_final += resposta_para_json["data"]
			empregados_iterados += 1

			### iterar até a última pagina
			for numero_de_empregados in range(empregados_iterados, paginas_total + 1):
				novo_request = requests.get(
					url_apis
					+ "timelogs/empresa?inicio={}&fim={}&limit={}&skip={}".format(
						inicio, fim, limite, numero_de_empregados * limite
					),
					headers=headers, verify=False
				)

				if novo_request.status_code == 200:
					nova_resposta_para_json = novo_request.json()
					resposta_final += nova_resposta_para_json["data"]
				else:
					erro_na_consulta = novo_request.json()
					ret = erro_na_consulta
					print(ret)
					return ret

			ret = {"success": {"total": len(resposta_final), "pontos": resposta_final}}
			print(ret)
			return ret
		else:
			erro_na_consulta = primeiro_request.json()
			ret = erro_na_consulta
			print(ret)
			return ret

	else:
		ret = auth.status_code
		print(ret)
		return ret
		# print({"error": "Verificar email e senha"})

consulta_todos_pontos("api_techmahindra@pontotel.com.br","TM&PT@2021","2021-04-01","2021-04-02")