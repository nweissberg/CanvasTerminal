# -*- coding: utf-8 -*-
import numpy
import csv
import matplotlib.pyplot as plt



mes = {
	"janeiro":1,
	"fevereiro":2,
	"março":3,
	"abril":4,
	"maio":5,
	"junho":6,
	"julho":7,
	"agosto":8,
	"setembro":9,
	"outubro":10,
	"novembro":11,
	"dezembro":12		
}
meses = [1,2,3,4,5,6,7,8,9,10,11,12]
data_mes = [[],[],[],[],[],[],[],[],[],[],[],[]]

def get_data(file,key,mode):
	values = []
	print(file,mode)
	with open(file) as csvfile:
		reader = csv.DictReader(csvfile)

		for row in reader:
			val = float(row[key].replace(",","."))
			data_mes[mes[row["Mês"]]-1].append(val)

		for v in data_mes:
			if mode == "mean":
				values.append(numpy.mean(v))
			if mode == "add":
				values.append(numpy.sum(v))

	return values

fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2)
fig.canvas.set_window_title('School Guardian')
fig.subplots_adjust(wspace=0.4, hspace=0.6)

key_1 = "tempo_med_espera5"
table_1 = get_data('data/Tempo Médio de Espera por Período.csv',key_1,"mean")
ax1.set_title("Tempo de espera")
ax1.bar(meses, table_1)
ax1.set_xlabel("Mes")

key_2 = "Contagem de id_busca"
table_2 = get_data('data/Quantidades de Eventos de Busca.csv',key_2,"add")
ax2.set_title("Eventos de busca")
ax2.bar(meses, table_2)
ax2.set_xlabel("Mes")

key_3 = "Média de temperature"
table_3 = get_data('data/Média de temperature por Ano e Mês.csv',key_3,"mean")
ax3.set_title("Temperatura")
ax3.bar(meses, table_3)
ax3.set_xlabel("Mes")

key_4 = "Média de batteryVoltage"
table_4 = get_data('data/Média de batteryVoltage por Ano e Mês.csv',key_4,"mean")
ax4.set_title("Voltagem da bateria")
ax4.bar(meses, table_4)
ax4.set_xlabel("Mes")

plt.show()