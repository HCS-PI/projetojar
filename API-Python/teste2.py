import psutil

resultado = psutil.process_iter(['name'])

for proc in psutil.process_iter():
                cpu_percent = proc.cpu_percent()
                info = proc.as_dict(attrs=['name'])
     
                dados = info['name']
                print(dados)
                 