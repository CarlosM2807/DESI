import numpy as np
import csv
import pandas as pd

##########################
# TRANSFORMA CSV CARDANO #
##########################

datos = pd.read_csv(r"C:\Users\carlo\OneDrive\Escritorio\Tercero Uni\DESI\Laboratorio\ProyectoFinal\datos\all_coins_2021.csv")

datos2 = pd.read_csv(r"C:\Users\carlo\OneDrive\Escritorio\Tercero Uni\DESI\Laboratorio\ProyectoFinal\DatosFinales\coin_BinanceCoin.csv")

#datos3 = pd.read_csv(r"C:\Users\carlo\OneDrive\Escritorio\Tercero Uni\DESI\Laboratorio\ProyectoFinal\DatosFinales\coin_EOS.csv")

datos['binance'] = datos2['binance']
#datos['eos'] = datos3['eos']

del(datos['nem'])
del(datos['cardano'])
datos.to_csv('all_coins_2021.csv', index=False)