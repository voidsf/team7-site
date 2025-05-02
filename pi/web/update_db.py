# it updates the website
def update_db(item_type, device_id):
    import requests
    url = 'https://team7-site.vercel.app/api/increment'
    MyObj = {'device_id': device_id, 'type': item_type}
    r = requests.post(url, json=MyObj)
