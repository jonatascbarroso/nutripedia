from http.server import BaseHTTPRequestHandler, HTTPServer
from furl import furl
import urllib.request, json


hostName = ""
hostPort = 8080
datasourceUrl = 'https://spreadsheets.google.com/feeds/list/'
datasourceSufix = '/public/values?alt=json'
sheetId = '1_LbaCF_CkBsDkxS9KdWOv6JZKkY7nmyXRyorixGVMTs'
sheedPages = {
	'metadata': '1',
	'data': '2'
}

def get_datasource_url(collection):
	return datasourceUrl + sheetId + '/' + sheedPages[collection] + datasourceSufix

def get_url_content(url):
	try:
		with urllib.request.urlopen(url) as urlopen:
			return json.loads(urlopen.read().decode())
	except:
		return offline_data()

def offline_data() :
	data = {
		'feed': {
			'entry': {
				0: {
					'gsx$updated': { '$t': '13/11/2019 12:13:14' },
					'gsx$name': { '$t': 'food-0' },
					'gsx$image': { '$t': 'http://localhost:3000/logo512.png' },
					'gsx$properties': { '$t': 'properties' },
					'gsx$benefits': { '$t': 'benefits' },
					'gsx$composition': { '$t': 'composition' },
					'gsx$action': { '$t': 'action' },
					'gsx$nutrients': { '$t': 'nutrients' },
					'gsx$daily-portion': { '$t': 'daily-portion' }
				},
				1: {
					'gsx$updated': { '$t': '15/11/2019 12:13:14' },
					'gsx$name': { '$t': 'food-1' },
					'gsx$image': { '$t': 'http://localhost:3000/logo512.png' },
					'gsx$properties': { '$t': 'properties' },
					'gsx$benefits': { '$t': 'benefits' },
					'gsx$composition': { '$t': 'composition' },
					'gsx$action': { '$t': 'action' },
					'gsx$nutrients': { '$t': 'nutrients' },
					'gsx$daily-portion': { '$t': 'daily-portion' }
				},
				2: {
					'gsx$updated': { '$t': '15/11/2019 12:13:14' },
					'gsx$name': { '$t': 'food-2' },
					'gsx$image': { '$t': 'http://localhost:3000/logo512.png' },
					'gsx$properties': { '$t': 'properties' },
					'gsx$benefits': { '$t': 'benefits' },
					'gsx$composition': { '$t': 'composition' },
					'gsx$action': { '$t': 'action' },
					'gsx$nutrients': { '$t': 'nutrients' },
					'gsx$daily-portion': { '$t': 'daily-portion' }
				},
				3: {
					'gsx$updated': { '$t': '15/11/2019 12:13:14' },
					'gsx$name': { '$t': 'food-3' },
					'gsx$image': { '$t': 'http://localhost:3000/logo512.png' },
					'gsx$properties': { '$t': 'properties' },
					'gsx$benefits': { '$t': 'benefits' },
					'gsx$composition': { '$t': 'composition' },
					'gsx$action': { '$t': 'action' },
					'gsx$nutrients': { '$t': 'nutrients' },
					'gsx$daily-portion': { '$t': 'daily-portion' }
				}
			} 
		}
	}
	return data

def get_data(url):
	content = get_url_content(url)
	collection = content['feed']['entry']
	length = len(collection)
	response = {'data': {}}
	for index in range(length):
		item = collection[index]
		food = {
			'id':           index,
			'name': 		item['gsx$name']['$t'],
			'image': 		item['gsx$image']['$t'],
			'properties':   item['gsx$properties']['$t'],
			'benefits':     item['gsx$benefits']['$t'],
			'composition':  item['gsx$composition']['$t'],
			'action':       item['gsx$action']['$t'],
			'nutrients':    item['gsx$nutrients']['$t'],
			'dailyPortion': item['gsx$daily-portion']['$t']
		}
		response['data'].update({index: food})
	return response

def get_metadata(url):
	content = get_url_content(url)
	metadata = content['feed']['entry'][0]
	response = {
		'lastUpdate':   metadata['gsx$updated']['$t'],
		'properties':   metadata['gsx$properties']['$t'],
		'benefits':     metadata['gsx$benefits']['$t'],
		'composition':  metadata['gsx$composition']['$t'],
		'action':       metadata['gsx$action']['$t'],
		'nutrients':    metadata['gsx$nutrients']['$t'],
		'dailyPortion': metadata['gsx$daily-portion']['$t']
	}
	return response

class MyServer(BaseHTTPRequestHandler):
	def do_GET(self):
		
		f = furl(self.path)
		if 'data' in f.args:
			url = get_datasource_url('data')
			content = get_data(url)
		else:
			url = get_datasource_url('metadata')
			content = get_metadata(url)
		
		response = json.dumps(content)

		self.send_response(200)
		self.send_header('Content-type', 'application/json')
		self.send_header('Access-Control-Allow-Origin', '*')
		self.end_headers()

		self.wfile.write(response.encode())


def main():
	myServer = HTTPServer((hostName, hostPort), MyServer)
	print("Server running on port ", hostPort)
	try:
		myServer.serve_forever()
	except KeyboardInterrupt:
		print("Exiting...")
		myServer.server_close()

if __name__ == "__main__":
	main()
