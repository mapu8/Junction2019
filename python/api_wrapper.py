import requests
import json
import pandas as pd
import math
import datetime

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

def linked_events_api(start_time="2019-08-01", stop_time="2019-08-02", location=[None, None], radius=):
    '''
    Wrapper for Helsinki City Linked Events (http://api.hel.fi/linkedevents/v1/event/?location=tprek:28473).

    Returns list of event names in a specified location and time.
    '''
    url = "http://api.hel.fi/linkedevents/v1/event"
    url = url + "/?start=" + start_time + "&end=" + stop_time
    if location != None: 
        url = url + "?bbox=" + ','.join([str(s) for s in compute_bbox(location, radius)]) #TODO Debug
    response = requests.request("GET", url)
    return response


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

def print_json(json_file):
    '''
    Print a json file in pretty format.
    '''
    print(json.dumps(json_file, indent=4, sort_keys=True))

def compute_bbox(location = [None, None], box_size=100):
    '''
    Returns a bounding box around a location = [lon, lat]
    box_size in meters
    Reference: https://stackoverflow.com/questions/2839533/adding-distance-to-a-gps-coordinate
    Returns vertices of bounding box of size box_size
    west is the longitude of the rectangle's western boundary, south is the latitude of the rectangle's southern boundary, and so on.
    '''
    lon0=location[0]
    lat0=location[1]
    east = lat0 + (180/math.pi)*(box_size/6378137)
    north = lon0 + (180/math.pi)*(box_size/6378137)/math.cos(lat0)
    west = lat0 + (180/math.pi)*(-box_size/6378137)
    south = lon0 + (180/math.pi)*(-box_size/6378137)/math.cos(lat0)
    return [west,south,east,north]

def sample_10sec_per_hour_from_day(date="2019-08-01"):
    '''
    Sample one second every hour for a day to get more data.
    NOTE: Very sloppily made. Rewrite this.

    Returns dictionary with keys=hours_in_date and values=hypercell_api(time, time_plus_10sec)
    #TODO Return a data frame.
    '''
    hours_in_date = [date+"T"+str.zfill(str(hour), 2)+":00:00Z" for hour in range(24)]
    result = dict()
    for time in hours_in_date:
        time_plus_10sec = time.replace('00Z', '10Z')
        print("Calling hypercell_api for time="+time)
        result[time] = hypercell_api(time, time_plus_10sec)
    return result

def sample_day_and_previous_days(date="2019-05-27", n_previous=5):
    result = dict()
    date_obj = datetime.datetime.strptime(date, "%Y-%m-%d")
    previous_n_days = [(date_obj - datetime.timedelta(days=n_days)).strftime("%Y-%m-%d") for n_days in range(n_previous+1)]
    res = dict()
    for day in previous_n_days:
        res[day] = sample_10sec_per_hour_from_day(day)
    return res

# Draft
#august = sample_day_and_previous_days(date="2019-08-31", n_previous=31)
#write_json(august, 'data/august.json')



