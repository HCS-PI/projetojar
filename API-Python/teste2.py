
import psutil
while True:
    temps = psutil.sensors_temperatures()
    print(temps)
