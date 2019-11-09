from http.server import BaseHTTPRequestHandler, HTTPServer
from furl import furl
import urllib.request, json


hostName = ""
hostPort = 8080
datasourceUrl = 'https://spreadsheets.google.com/feeds/list/'
datasourceSufix = '/public/full?alt=json'
sheetId = '1_LbaCF_CkBsDkxS9KdWOv6JZKkY7nmyXRyorixGVMTs'
sheedPages = {
	'labels': '1',
	'data': '2'
}

def get_datasource_url(collection):
	return datasourceUrl + sheetId + '/' + sheedPages[collection] + datasourceSufix

def get_url_content(url):
	with urllib.request.urlopen(url) as urlopen:
		return json.loads(urlopen.read().decode())

def get_data(url):
	content = get_url_content(url)
	with content['feed']['entry'] as food:
		# dont
	return content

def get_labels(url):
	content = get_url_content(url)
	lastUpdate = content['feed']['updated']['$t']
	labels = content['feed']['entry'][0]
	response = {
		'lastUpdate':   lastUpdate,
		'properties':   labels['gsx$properties']['$t'],
		'benefits':     labels['gsx$benefits']['$t'],
		'composition':  labels['gsx$composition']['$t'],
		'action':       labels['gsx$action']['$t'],
		'nutrients':    labels['gsx$nutrients']['$t'],
		'dailyPortion': labels['gsx$daily-portion']['$t']
	}
	return response

class MyServer(BaseHTTPRequestHandler):
	def do_GET(self):
		
		f = furl(self.path)
		if 'data' in f.args:
			url = get_datasource_url('data')
			content = get_data(url)
		else:
			url = get_datasource_url('labels')
			content = get_labels(url)
		
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
