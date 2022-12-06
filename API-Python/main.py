from distutils.cmd import Command
import tkinter
import platform
from random import *
from time import *
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


conexao = criar_conexao_cloud()


arrayConsumoRAM = [0] * 10
arrayConsumoCPU = [0] * 10

dispositivo = psutil.disk_partitions()
cores = '#add8e6', '#00008b'
armzDisco = psutil.disk_usage(dispositivo[0][0])
armzDiscoUsado = armzDisco.used / 1024 / 1024 / 1024
armzDiscototal = armzDisco.total / 1024 / 1024 / 1024
armzDiscoDispobivel = armzDiscototal - armzDiscoUsado


def conversor(valor):
    return float(valor[0:4].replace(",", '.'))


def dadosCPU():
    consumoCPU = psutil.cpu_percent(interval=None)
    crawler = False
    temperaturaSimulada = consumoCPU * 1.3

    if platform.system() == 'Linux':
        temps = psutil.sensors_temperatures()
        for name, entries in temps.items():
            for entry in entries:
                if entry.label == 'CPU':
                    tempCPU = entry.current


        insert_cpu_temperatura(str(temperaturaSimulada))
        insert_cpu_consumo(str(consumoCPU))
        inserirTempCPUAws(str(temperaturaSimulada))
        inserirConsumoCPUAws(str(consumoCPU))

    elif platform.system() != 'Linux' and crawler:
        with PoolManager() as pool:

            response = pool.request('GET', 'http://localhost:8080/data.json')
            data = loads(response.data.decode('utf-8'))
            temp_value = data['Children'][0]['Children'][1]['Children'][1]['Children'][2]['Value']
            tempCPU = conversor(temp_value)

            insert_cpu_consumo(str(consumoCPU))
            insert_cpu_temperatura(str(tempCPU))
    else:
      
        insert_cpu_consumo(str(consumoCPU))
        insert_cpu_temperatura(str(temperaturaSimulada))

        inserirTempCPUAws(str(temperaturaSimulada))
        inserirConsumoCPUAws(str(consumoCPU))


def dadosDisco():
    armzTotalDisco = round((psutil.disk_usage('/')[0]) / (10**9), 2)
    consumoDisco = round((psutil.disk_usage('/')[3]), 2)
    insert_disco(str(consumoDisco))
    inserirConsumoDISCOAws(str(consumoDisco))


def exibir():
    dadosCPU()
    dadosDisco()
    

def transformarEmCsv():
    cursor = conexao.cursor()
    sql = "SELECT nome  FROM processo;"
    cursor.execute(sql)

    resultado = cursor.fetchall()
    nomeProcesso = []

    for nome in resultado:
        nomeProcesso.append(nome[0].replace(".exe", ""))
        
    
        
    dic = {" ": nomeProcesso}
    df = pd.DataFrame(dic)
    print(df)
    df = df.to_csv("DadosColetados"+str(dt.date.today())+".csv")

def ApertarBotao3():
    cursor = conexao.cursor()
    sql = "SELECT TOP 100 valor FROM Medida, Dispositivo where tipo = 'RAM' AND fk_dispositivo = id_dispositivo  AND fk_servidor_aws = 1 order by id_medida desc;"
    cursor.execute(sql)

    resultadoRam = cursor.fetchall()
    cursor.close()

    cursor = conexao.cursor()
    sql = "SELECT TOP 100 valor FROM Medida, Dispositivo where tipo = 'CPU' AND unid_medida = '%'  AND fk_dispositivo = id_dispositivo AND fk_servidor_aws = 1 order by id_medida desc;"
    cursor.execute(sql)

    resultadoCpu = cursor.fetchall()
    cursor.close()

    todaRam = []
    todaCpu = []

    for valorRam in resultadoRam:
        todaRam.append(valorRam)

    for valorCpu in resultadoCpu:
        todaCpu.append(valorCpu)

    janela3 = tkinter.Tk()
    janela3.title("Dados Coletados")
    janela3.resizable(False, False)

    janela3.configure(background='black')
    larguraScreen = janela3.winfo_screenwidth()
    alturaScreen = janela3.winfo_screenheight()
    posx = larguraScreen/2 - 250
    posy = alturaScreen/2 - 250
    janela3.geometry("600x500+%d+%d" % (posx, posy))

    botaoVoltar = tkinter.Button(
        janela3, text="Voltar", command= lambda:[janela3.destroy(), plt.close()])

    botaoVoltar.place(x=10, y=7)
    botaoVoltar.configure(background='white',
                          foreground='black', font=('arial', 15, 'bold'))

    graficoDestalhadoCPU = plt.figure(figsize=(3, 3))
    canva = FigureCanvasTkAgg(graficoDestalhadoCPU, master=janela3)
    canva.get_tk_widget().place(x=0, y=60)
    graficoDestalhadoCPU.suptitle("Consumo de CPU")
    graficoDestalhadoCPU.add_subplot(111).plot(todaCpu)

    graficoDestalhadoRAM = plt.figure(figsize=(3, 3))
    canva = FigureCanvasTkAgg(graficoDestalhadoRAM, master=janela3)
    canva.get_tk_widget().place(x=290, y=60)
    graficoDestalhadoRAM.suptitle("Consumo de RAM")
    graficoDestalhadoRAM.add_subplot(111).plot(todaRam)

    tkinter.mainloop()


def ApertarBotao2():
    plt.close()
    transformarEmCsv()

    leitura = pd.read_csv("DadosColetados"+str(dt.date.today())+".csv")
    leitura.drop('Unnamed: 0', axis=1, inplace=True)

    

    wc = WordCloud(background_color="white",
                   max_words=1000, width=800, height=400)
    #print(str(leitura))
    wc.generate(str(leitura))
    plt.imshow(wc)
    plt.axis("off")
    plt.show()

def ApertarBotao():
    janela2 = tkinter.Tk()
    janela2.title("Dashboard")
    janela2.resizable(False, False)
    larguraScreen = janela2.winfo_screenwidth()
    alturaScreen = janela2.winfo_screenheight()
    posx = larguraScreen/2 - 250
    posy = alturaScreen/2 - 250
    janela2.geometry("530x500"+"+%d+%d" % (posx, posy))

    textoDash = tkinter.Label(janela2, text="Dashboard")
    textoDash.config(font=("Arial", 15),
                     background="black", foreground="white")
    textoDash.place(x=200, y=0)

    labels = f'Usado - {round(armzDiscoUsado)} Gb', f'Disponível - {round(armzDiscoDispobivel)} Gb'
    sizes = [((armzDiscoUsado/armzDiscototal)*100),
             ((armzDiscoDispobivel/armzDiscototal)*100)]
    figura = plt.figure(figsize=(2, 3), dpi=100)
    canva = FigureCanvasTkAgg(figura, janela2)
    canva.get_tk_widget().place(x=310, y=30)

    graficosUnidArmz = figura.add_subplot(111)
    graficosUnidArmz.pie(sizes, autopct='%1.1f%%', startangle=0, colors=cores)
    graficosUnidArmz.title.set_text(f'Unidade - {dispositivo[0][0]}')
    graficosUnidArmz.legend(
        labels, loc="best", bbox_to_anchor=((0.6, -0.3, 0.5, 0.5)))
    graficosUnidArmz.axis('equal')

 
    while True:
            for proc in psutil.process_iter():
                cpu_percent = proc.cpu_percent(interval=1)
                exibir()
                horario = dt.datetime.fromtimestamp(
                    proc.create_time()).strftime("%d-%m-%Y %H:%M")
                info = proc.as_dict(
                    attrs=['pid', 'name', 'cpu_percent', 'create_time'])
                info['cpu_percent'] = round(cpu_percent / psutil.cpu_count(), 1)
                info['create_time'] = horario

                if (cpu_percent > 0):
                    dados = info['pid'], info['name'], info['cpu_percent']
                    insert_proc(dados)

                arrayConsumoRAM.append(psutil.virtual_memory()[2])
                arrayConsumoRAM.remove(arrayConsumoRAM[0])
                arrayConsumoCPU.append(psutil.cpu_percent(interval=None))
                arrayConsumoCPU.remove(arrayConsumoCPU[0])

                insert_ram(str(arrayConsumoRAM[-1]))
                inserirConsumoRAMAws(str(arrayConsumoRAM[-1]))

                figura = plt.figure(figsize=(3, 2), dpi=100)
                graficoRam = figura.add_subplot(111)
                canva2 = FigureCanvasTkAgg(figura, janela2)
                canva2.get_tk_widget().place(x=0, y=240)

                figura = plt.figure(figsize=(3, 2), dpi=100)
                graficoCPU = figura.add_subplot(111)
                canva = FigureCanvasTkAgg(figura, janela2)
                canva.get_tk_widget().place(x=0, y=30)

                graficoCPU.plot(arrayConsumoCPU, color='blue',
                                label='Consumo de RAM')
                graficoCPU.scatter(len(arrayConsumoCPU) - 1,
                                arrayConsumoCPU[-1], color='blue')
                graficoCPU.title.set_text(
                    f'Consumo de CPU - {arrayConsumoCPU[-1]}%')
                graficoCPU.set_ylim(0, 100)

                graficoRam.plot(arrayConsumoRAM, color='red',
                                label='Consumo de RAM')
                graficoRam.scatter(len(arrayConsumoRAM) - 1,
                                arrayConsumoRAM[-1], color='red')
                graficoRam.title.set_text(
                    f'Consumo de RAM - {arrayConsumoRAM[-1]}%')
                graficoRam.set_ylim(0, 100)

                janela2.configure(background="black")

                janela2.update()


 
janela = tkinter.Tk()
janela.title("HCS")
janela.configure(background="black")

janela.resizable(False, False)

larguraScreen = janela.winfo_screenwidth()
alturaScreen = janela.winfo_screenheight()
posx = larguraScreen/2 - 250
posy = alturaScreen/2 - 250


janela.geometry("500x500"+"+%d+%d" % (posx, posy))


janela.configure(background="black")

# imagemHcs = tkinter.PhotoImage(file="hcs2e.png")
imagelLabelHcs = tkinter.Label(janela, text="Hadware Control System")
imagelLabelHcs.config(font=("Arial", 20))
imagelLabelHcs.place(x=100, y=100)
imagelLabelHcs.configure(background="white")


# imagemBotao = tkinter.PhotoImage(file="button_dashboard.png")
botao = tkinter.Button(janela, text="Dashboard", command=ApertarBotao)
botao.config(font=("Arial", 20))
botao.place(x=270, y=250)
botao.config(bg="white", bd=0)


# imageBotao2 = tkinter.PhotoImage(file="button_wordcloud.png")
botao2 = tkinter.Button(janela, text="Wordcloud", command=ApertarBotao2)
botao2.config(font=("Arial", 20))
botao2.place(x=80, y=250)
botao2.config(bg="white", bd=0)

#imagemBotao3 = tkinter.PhotoImage(file="button_graficos.png")
botao3 = tkinter.Button(janela, text="Gráficos", command=ApertarBotao3)
botao3.config(font=("Arial", 20))
botao3.place(x=190, y=350)
botao3.config(bg="white", bd=0)


janela.mainloop()
