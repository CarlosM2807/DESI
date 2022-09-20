import numpy as np
import csv
import pandas as pd

##########################
# TRANSFORMA CSV CARDANO #
##########################

datos = pd.read_csv(r"C:\Users\carlo\OneDrive\Escritorio\Tercero Uni\DESI\Laboratorio\ProyectoFinal\DatosFinales\coin_EOS.csv")
del(datos['SNo'])
del(datos['Marketcap'])
del(datos['Symbol'])
del(datos['Volume'])
del(datos['Open'])
del(datos['Close'])
datos['eos'] = (datos['High']+datos['Low'])/2
del(datos['Name'])
del(datos['High'])
del(datos['Low'])
del(datos['Date'])




datos.to_csv('coin_EOS.csv', index=False)