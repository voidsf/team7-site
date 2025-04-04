#it updates the website	
def update(device_id,output_type):
	url = 'https://team7-site.vercel.app/api/increment'
	MyObj = {'device_id': device_id,'type': output_type}
	r = requests.post(url, json=MyObj)
