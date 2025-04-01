import requests
url = 'https://team7-site.vercel.app/api/increment'
MyObj = {'device_id':'Year 3 Classroom','type':'Glass'}
    r = requests.post(url, json = MyObj )
    print(r.status_code)


