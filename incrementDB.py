import requests
import sys

device_id = sys.argv[0]
output_type = sys.argv[1]

url = 'https://team7-site.vercel.app/api/increment'
MyObj = {'device_id': device_id,'type': output_type}

r = requests.post(url, json=MyObj)
