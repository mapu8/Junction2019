import requests
import json
import pandas as pd

def write_json(D, filename):
    '''
    Writes a dictionary D as a json file.
    '''
    with open(filename, 'w') as json_file:
        json.dump(D, json_file, indent = 4, sort_keys=True)

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
    
    Example:
        data_json = hypercell_api("2019-08-01T12:00:00Z", "2019-08-01T12:00:10Z")
        write_json(data_json, 'data/example_data_from_hypercell_api.json')
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
    output = response.json()
    return output
    
    

def linked_events_api(start_time, stop_time, location):
    '''
    Wrapper for Helsinki City Linked Events (http://api.hel.fi/linkedevents/v1/event/?location=tprek:28473).

    Returns list of event names in a specified location and time.
    '''
    #TODO Write this
    return None


def azureml_main(dataframe1 = None, dataframe2 = None):
    '''
    Connecting function required by Azure.
    Has to take two inputs dataframe1 and datafram2 and return a pd.DataFrame.
    '''
    data_json = hypercell_api("2019-08-01T12:00:00Z", "2019-08-01T12:00:10Z")
    data = pd.DataFrame(data_json['raw'])
    return data

def get_some_data(time_start="2019-08-01T12:00:00Z", time_stop="2019-08-01T12:00:10Z", filename='data/data.json'):
    '''
    Convenience function to quickly access the API and save a file data/data.json
    '''
    data_json = hypercell_api(time_start, time_stop)
    write_json(data_json, filename)

#get_some_data(time_start="2019-08-01T12:00:00Z", time_stop="2019-08-01T12:05:00Z", filename='data/data.json')

def hypercell_api_parallel(time_start, time_stop):
    '''
    Make parallel requests to API. The request times out if you try to get more than 1 minute of data. 
    See example here: https://skipperkongen.dk/2016/09/09/easy-parallel-http-requests-with-python-and-asyncio/
    '''
    #TODO write this
    return None

