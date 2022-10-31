from dataclasses import dataclass
from lib2to3.pgen2 import driver
from sqlite3 import Cursor, Row
import pyodbc

driver = "ODBC Driver 13 for SQL Server"
server = "tcp:hcs-bd.database.windows.net,1433"
database = "hcs-bd"
username = "hcs-Grupo09"
password = "hardwareCSg9"

string_conexao = 'Driver={ODBC Driver 13 for SQL Server};Server=tcp:hcs-bd.database.windows.net;Database=hcs-bd;Uid=hcs-Grupo09;Pwd=hardwareCSg9;Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;'

conexao = pyodbc.connect(string_conexao)
cursor = conexao.cursor()
cursor.execute("SELECT * FROM Funcionario where id_funcionario = 1")
row = cursor.fetchone()

print(row)