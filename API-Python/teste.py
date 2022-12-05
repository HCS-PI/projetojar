import tkinter
import platform
from random import *
import time
import psutil
import matplotlib.pyplot as plt
from matplotlib.backends.backend_tkagg import FigureCanvasTkAgg
from comandoAzure import *
import pandas as pd
import datetime as dt
from conexaoBanco import criar_conexao
from wordcloud import WordCloud
from conexaoBanco import criar_conexao_local, criar_conexao_cloud


# crawler
from urllib3 import PoolManager
from json import loads


def testeConexao():
    conexao = criar_conexao_cloud()
    cursor = conexao.cursor()
    query = 'insert into Medida values (CURRENT_TIMESTAMP,' + '13.3' + ', 3);'
    cursor.execute(query)
    print(conexao)
    conexao.commit()
    cursor.close()


def testProc():
    while True:
        for proc in psutil.process_iter():
            cpu_percent = proc.cpu_percent(interval=1)
            horario = dt.datetime.fromtimestamp(
                proc.create_time()).strftime("%d-%m-%Y %H:%M")
            info = proc.as_dict(
                attrs=['pid', 'name', 'cpu_percent', 'create_time'])
            info['cpu_percent'] = round(cpu_percent / psutil.cpu_count(), 1)
            info['create_time'] = horario
            print(info)
            if (cpu_percent > 0):
                dados = info['pid'], info['name'], info['cpu_percent']
                insert_proc(dados)



testProc()