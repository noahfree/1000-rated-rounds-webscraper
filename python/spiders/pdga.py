import scrapy
import re
from pymongo import MongoClient

class PdgaSpider(scrapy.Spider):
	name = 'pdga'

	def __init__(self, number):
		self.start_urls = ['http://pdga.com/player/' + number + '/details']
		

	def parse(self, response):
		client = MongoClient('mongodb+srv://newuser:NewUserPassword2021!!@cs4830.ie08b.mongodb.net/CS4830?retryWrites=true&w=majority')
		database = client.CS4830
		collection = database.challenge5
		records = response.css("tr.evaluated") + response.css("tr.not-evaluated")
		name = response.css("div.pane-content h1::text")[0].get()
		output = [{'name': name.split(' #')[0]}]
		for record in records:
			if (int(record.css('td.round-rating::text')[0].get()) >= 1000):
				output.append({
					'event': re.sub('[^A-Za-z0-9 ]+', '', record.css('td.tournament a::text')[0].get()),
					'date': record.css('td.date::text')[0].get(),
					'rating': record.css('td.round-rating::text')[0].get()
				})
		data = {'id': response.url.split('player/')[-1].split('/')[0], 'data': output}
		collection.insert_one(data)
		print(data)
