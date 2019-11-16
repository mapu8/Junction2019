import requests
import json

def hypercell_api(time_start, time_stop):
    '''
    Wrapper for Business Finland Hypercell API (people flow)
    Args:
        time_start: str
        time_stop: str

    Returns:
        dictionary D where:
        D['raw'] = [
            {
            "distance": 17.4,
            "hash": "144afc51fc2443c7031a2912566eff2ce60226a49d6d2bd7c2923700",
            "latitude": 60.16544,
            "longitude": 24.95398,
            "serial": "0000000038d83d41",
            "time": "2019-08-01T12:00:00Z"
            }, 
            {
            ...
            }
            ] 
    '''
    url = "https://api.hypr.cl/raw/"
    headers = {
    'x-api-key': "iQ0WKQlv3a7VqVSKG6BlE9IQ88bUYQws6UZLRs1B",
    'time_start': time_start,
    'time_stop': time_stop,
    'Accept': "*/*",
    'Cache-Control': "no-cache",
    'Host': "api.hypr.cl",
    'Accept-Encoding': "gzip, deflate",
    'Content-Length': "0",
    'Connection': "keep-alive",
    'cache-control': "no-cache"
    }
    response = requests.request("POST", url, headers=headers)
    return response.json()

def write_json(D, filename):
    '''
    Writes a dictionary D as a json file.
    '''
    with open(filename, 'w') as json_file:
        json.dump(D, json_file, indent = 4, sort_keys=True)


# Example: 
#data_json = hypercell_api("2019-08-01T12:00:00Z", "2019-08-01T12:00:10Z")
#write_json(data_json, 'data/example_data_from_hypercell_api.json')
