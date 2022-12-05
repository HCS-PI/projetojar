import mysql.connector
from conexaoBanco import criar_conexao_local
import getmac


def select(query):
    conexao = criar_conexao_local()
    try:
        conexao.reconnect()
        cursor = conexao.cursor()
        cursor.execute(query)
        dados = cursor.fetchone()
    except mysql.connector.Error as error:
        print('Erro')
        dados = error
    finally:
        if conexao.is_connected():
            cursor.close()
            conexao.close()
            return dados


enderecoMac = getmac.get_mac_address()
enderecoMac = 'C2-F2-9F-2A-F9-7C'
idCarro = select("select id_carro from Carro where endereco_mac = '" +
                 enderecoMac + "' ;")


def insert_cpu(consumo, temperatura):
    con = criar_conexao_local()
    cursor = con.cursor()

    dispConsumo = select("select id_dispositivo from Dispositivo, Carro where fk_carro = id_carro and id_carro =" +
                         str(idCarro[0]) + " and tipo = 'CPU' and unid_medida = '%';")

    dispTemp = select("select id_dispositivo from Dispositivo, Carro where fk_carro = id_carro and id_carro =" +
                      str(idCarro[0]) + " and tipo = 'CPU' and unid_medida = '°C';")

    dConsumo = str(dispConsumo[0])
    dTemp = str(dispTemp[0])

    sql = f"INSERT INTO Medida (horario_registro, fk_dispositivo, valor) VALUES (now(), {dConsumo}, {consumo})"
    cursor.execute(sql)
    sql = f"INSERT INTO Medida (horario_registro, fk_dispositivo, valor) VALUES (now(), {dTemp}, {temperatura})"
    cursor.execute(sql)
    cursor.close()


def insert_ram(consumo):

    idDispositivo = select(
        "select id_dispositivo from Dispositivo, Carro where fk_carro = id_carro and id_carro =" + str(idCarro[0]) + " and tipo = 'RAM';")

    con = criar_conexao_local()
    cursor = con.cursor()
    sql = f"INSERT INTO Medida (horario_registro, fk_dispositivo, valor) VALUES (now(), {idDispositivo[0]}, {consumo})"
    cursor.execute(sql)
    cursor.close()


def insert_disco(consumo, total):
    idDisco1 = select("select id_dispositivo from Dispositivo, Carro where fk_carro = id_carro and id_carro =" +
                      str(idCarro[0]) + " and tipo = 'DISCO' and unid_medida = '%';")
    idDisco2 = select("select id_dispositivo from Dispositivo, Carro where fk_carro = id_carro and id_carro =" +
                      str(idCarro[0]) + " and tipo = 'DISCO' and unid_medida = 'T';")

    con = criar_conexao_local()
    cursor = con.cursor()

    sql = f"INSERT INTO Medida (horario_registro, fk_dispositivo, valor) VALUES (now(), {idDisco1[0]}, {consumo})"
    cursor.execute(sql)

    sql = f"INSERT INTO Medida (horario_registro, fk_dispositivo, valor) VALUES (now(), {idDisco2[0]}, {total})"
    cursor.execute(sql)
    cursor.close()


def insert_proc(dados):
    con = criar_conexao_local()
    cursor = con.cursor()

    procExiste = select(
        f"select id from Processo where pid = {dados[0]} and nome = '{dados[1]}' and fk_carro = {idCarro[0]};")
    idP = procExiste

    if procExiste:
        cpuPer = str(dados[2])
        sql = f"INSERT INTO MedidaProcesso (horario_registro, cpu_perc, fk_processo) VALUES (now(), {cpuPer}, {idP[0]})"
        cursor.execute(sql)
        cursor.close()

    else:
        pID = str(dados[0])
        cpuPer = str(dados[2])
        novoNome = str(dados[1])

        sql = f"INSERT INTO Processo (pid, nome, fk_carro) VALUES ({pID}, '{novoNome}', {idCarro[0]})"
        cursor.execute(sql)

        idP = select(
            f"select id from Processo where pid = {pID} and fk_carro = {idCarro[0]} ;")

        sql = f"INSERT INTO MedidaProcesso (horario_registro, cpu_perc, fk_processo) VALUES (now(), {cpuPer}, {idP[0]})"
        cursor.execute(sql)
        cursor.close()


def inserirConsumoCPUAws(consumoCPU):
    conexao = criar_conexao_local()
    cursor = conexao.cursor()
    query = 'insert into Medida values (null, now(),' + consumoCPU + ', 1);'
    cursor.execute(query)
    cursor.close()


def inserirTempCPUAws(tempCPU):
    conexao = criar_conexao_local()
    cursor = conexao.cursor()
    query = 'insert into Medida values (null, now(),' + tempCPU + ', 2);'
    cursor.execute(query)
    cursor.close()


def inserirConsumoRAMAws(consumoRAM):
    conexao = criar_conexao_local()
    cursor = conexao.cursor()
    query = 'insert into Medida values (null, now(),' + consumoRAM + ', 3);'
    cursor.execute(query)
    cursor.close()


def inserirConsumoDISCOAws(consumoDISCO):
    conexao = criar_conexao_local()
    cursor = conexao.cursor()
    query = 'insert into Medida values (null, now(),' + consumoDISCO + ', 4);'
    cursor.execute(query)
    cursor.close()
