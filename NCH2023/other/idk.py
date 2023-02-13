query = input('coords')
list1 = query.split(' ')
lat = list1[0]
long = list1[1]
newLong = 0
newLat = 0
if long[-1] == 'W':
    idk1 = long.split('°')
    long = idk1[0]
    newLong = float(long) * -1
else:
    idk1 = long.split('°')
    long = idk1[0]
    newLong = float(long)

if lat[-1] == 'S':
    idk2 = lat.split('°')
    lat = idk2[0]
    newLat = float(lat) * -1
else:
    idk2 = lat.split('°')
    lat = idk2[0]
    newLat = float(lat)
print(newLat + 10)
print(newLong)
