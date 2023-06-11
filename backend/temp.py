import time

i = 0
while i < 100000:
    print(i, end='\r')
    i += 1
    time.sleep(1)
