import mysql.connector
from conexaoBanco import criar_conexao_cloud
import getmac
import pyodbc


def select(query):
    conexao = criar_conexao_cloud()
    cursor = conexao.cursor()
    cursor.execute(query)
    dados = cursor.fetchone()
    cursor.close()
    return dados


enderecoMac = getmac.get_mac_address()
enderecoMac = 'C2-F2-9F-2A-F9-7C'
idCarro = select(
    "select id_carro from Carro where endereco_mac = '" + str(enderecoMac) + "' ;")


def insert_cpu_consumo(consumo):
    conexao = criar_conexao_cloud()
    cursor = conexao.cursor()

    dispConsumo = select("select id_dispositivo from Dispositivo, Carro where fk_carro = id_carro and id_carro =" + str(idCarro[0]) + " and tipo = 'CPU' and unid_medida = '%';")
    dConsumo = str(dispConsumo[0])

    sql = "INSERT INTO Medida (horario_registro, fk_dispositivo, valor) VALUES (CURRENT_TIMESTAMP," + str(dConsumo) + "," + str(consumo) + ");"
    cursor.execute(sql)
    conexao.commit()
    cursor.close()


def insert_cpu_temperatura(temperatura):
    conexao = criar_conexao_cloud()
    cursor = conexao.cursor()

    dispTemp = select("select id_dispositivo from Dispositivo, Carro where fk_carro = id_carro and id_carro =" + str(idCarro[0]) + " and tipo = 'CPU' and unid_medida = '°C';")
    dTemp = str(dispTemp[0])

    sql = "INSERT INTO Medida (horario_registro, fk_dispositivo, valor) VALUES (CURRENT_TIMESTAMP," + str(dTemp) + "," + str(temperatura) + ");"
    
    cursor.execute(sql)
    conexao.commit()
    cursor.close()


def insert_ram(consumo):

    idDispositivo = select(
        "select id_dispositivo from Dispositivo, Carro where fk_carro = id_carro and id_carro =" + str(idCarro[0]) + " and tipo = 'RAM';")

    conexao = criar_conexao_cloud()
    cursor = conexao.cursor()

    sql = "INSERT INTO Medida (horario_registro, fk_dispositivo, valor) VALUES (CURRENT_TIMESTAMP," + \
        str(idDispositivo[0]) + "," + str(consumo) + ");"
    cursor.execute(sql)

    conexao.commit()
    cursor.close()


def insert_disco(consumo):
    idDisco1 = select("select id_dispositivo from Dispositivo, Carro where fk_carro = id_carro and id_carro =" + str(idCarro[0]) + " and tipo = 'DISCO' and unid_medida = '%';")

    conexao = criar_conexao_cloud()
    cursor = conexao.cursor()

    sql = "INSERT INTO Medida (horario_registro, fk_dispositivo, valor) VALUES (CURRENT_TIMESTAMP," + str(idDisco1[0]) + "," + str(consumo) + ");"
    cursor.execute(sql)

    conexao.commit()
    cursor.execute(sql)

    conexao.commit()
    cursor.close()


def insert_proc(dados):
    conexao = criar_conexao_cloud()
    cursor = conexao.cursor()
    print(dados)

    procExiste = select("select id from Processo where pid = " + str(dados[0]) + " and nome = '" + str(dados[1])+"' and fk_carro = "+str(idCarro[0])+";")
    idP = procExiste

    if procExiste:
        cpuPer = str(dados[2])
        sql = "INSERT INTO MedidaProcesso (horario_registro, cpu_perc, fk_processo) VALUES (CURRENT_TIMESTAMP," + str(cpuPer) + "," + str(idP[0])+");"
        cursor.execute(sql)

        conexao.commit()
        cursor.close()

    else:
        pID = str(dados[0])
        cpuPer = str(dados[2])
        novoNome = str(dados[1])

        sql = "INSERT INTO Processo (pid, nome, fk_carro) VALUES (" + str(pID) + ", '" + str(novoNome) + "'," + str(idCarro[0])+");"
        cursor.execute(sql)

        conexao.commit()

        idP = select("select id from Processo where pid =" + str(pID) + "and fk_carro = " + str(idCarro[0])+";")

        sql = "INSERT INTO MedidaProcesso (horario_registro, cpu_perc, fk_processo) VALUES (CURRENT_TIMESTAMP,"+str(cpuPer) + "," + str(idP[0]) + ");"
        cursor.execute(sql)

        conexao.commit()
        cursor.close()


def inserirConsumoCPUAws(consumoCPU):
    conexao = criar_conexao_cloud()
    cursor = conexao.cursor()
    query = 'insert into Medida (horario_registro, valor, fk_dispositivo) values (CURRENT_TIMESTAMP,' + consumoCPU + ', 1);'
    cursor.execute(query)

    conexao.commit()
    cursor.close()


def inserirTempCPUAws(tempCPU):
    conexao = criar_conexao_cloud()
    cursor = conexao.cursor()
    query = 'insert into Medida (horario_registro, valor, fk_dispositivo) values (CURRENT_TIMESTAMP,' + tempCPU + ', 2);'
    cursor.execute(query)

    conexao.commit()
    cursor.close()


def inserirConsumoRAMAws(consumoRAM):
    conexao = criar_conexao_cloud()
    cursor = conexao.cursor()
    query = 'insert into Medida (horario_registro, valor, fk_dispositivo) values (CURRENT_TIMESTAMP,' + consumoRAM + ', 3);'
    cursor.execute(query)

    conexao.commit()
    cursor.close()


def inserirConsumoDISCOAws(consumoDISCO):
    conexao = criar_conexao_cloud()
    cursor = conexao.cursor()
    query = 'insert into Medida (horario_registro, valor, fk_dispositivo) values (CURRENT_TIMESTAMP,' + consumoDISCO + ', 4);'
    cursor.execute(query)

    conexao.commit()
    cursor.close()
