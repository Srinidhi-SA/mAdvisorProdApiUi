import re
import sys
import common_utils
import requests
from bs4 import BeautifulSoup
import generic_crawler

def sanitize(content,remove_tags=[]):
	for html_tag in remove_tags:
		tag_regex='(?is)<'+html_tag+'[^>]*?>.*?</'+html_tag+'>' #(?is) is important to add,as it ignores case and new lines in text
		content=re.sub(tag_regex,'',content)
	text=''
	text=re.sub('<.*?>',' ',content)
	if text:
		text=text.replace("\n","").replace("&nbsp;","").replace("\t"," ").replace("\u"," ").replace("\r"," ").strip()
	text =text.encode('utf-8')
	return text

def process_data(url,content,regex_dict={},remove_tags=[]):
	all_data=[]
	if not regex_dict:
		#This is when we want all the page data in form of single text info
		text=sanitize(content,remove_tags=remove_tags)
		all_data.append(text)
		return all_data
	all_blocks=[content]
	if "block" in regex_dict:
		block_regex=regex_dict.get('block')
		if not block_regex:
			print "block regex is not present so exit"
			sys.exit(0)
		else:
			block_regex="(?is)"+block_regex
		all_blocks=re.findall(block_regex,content)
	print "total block on this page is : ",len(all_blocks)
	for block in all_blocks:
		json_data={"blocks":len(all_blocks),"seed_url":url}
		for key in regex_dict.keys():
			if key in ['block','blocks','source']:
				continue
			value=''
			obj=re.search("(?is)"+regex_dict[key],block)
			if obj:
				value=obj.group(1)
				value=sanitize(value)
			if key in ['close', 'low', 'high', 'open', "volume"]:
				value = value.strip()
				if value == "":
					continue
				value = value.replace(',', '')
				json_data[key] = value.strip()
			else:
				json_data[key]=value.strip()
		if not json_data.get("url"):
			json_data["url"]=url
		if not json_data.get("source"):
			json_data["source"]=regex_dict.get("source","source-not-added-in-regex")

		json_data_keys_set = set(json_data.keys())
		required_keys_set = set(['close', 'low', 'high', 'open', "volume"])
		if required_keys_set.issubset(json_data_keys_set):
			all_data.append(json_data)
	return all_data

def process_json_data(url,content,regex_dict={},remove_tags=[]):
	all_data=[]
	json_content=content.split("google.finance.data = ")[-1].split(";\ngoogle.finance.data")[0]
	raw_json_obj=common_utils.get_json_obj(json_content)
	raw_json_list=raw_json_obj.get("company",{}).get("news",{}).get("clusters",[])
	for raw_json in raw_json_list:
		tmp_list=raw_json.get("a",[])
		for tmp_json in tmp_list:
			json_obj={}
			json_obj["stock"]=url.split("%3A")[-1]
			json_obj["title"]=tmp_json.get("t","")
			json_obj["final_url"]=tmp_json.get("u")
			json_obj["source"]=tmp_json.get("s")
			json_obj["time"]=tmp_json.get("d")
			all_data.append(json_obj)
	return all_data


def process_nasdaq_news_article(url, content, stock):
	soup = BeautifulSoup(content, 'html.parser')
	new_headlines = soup.find_all('div', class_="news-headlines")
	all_articles_data = []
	print new_headlines
	try:
		for i, tag in enumerate(new_headlines[0]):
			try:
				article_data = {}
				if i % 10 == 3 and 'class' not in tag.attrs:
					print "collected {0}".format(tag.span.a['href'])
					article_data['title'] = sanitize(tag.span.a.text)
					article_data['final_url'] = tag.span.a['href']
					article_data['google_url'] = url
					article_data['url'] = url
					date_and_author = tag.small.text
					date_and_time = sanitize(date_and_author.split('-')[0])
					article_data['time'] = date_and_time
					article_data['date'] = date_and_time
					article_data['source'] = sanitize(date_and_author.split('-')[1])
					article_data['stock'] = stock
					article_data['short_desc'] = process_nasdaq_news_paragraph(tag.span.a['href'])
					all_articles_data.append(article_data)
			except Exception as err:
				print err
				print "No ArTicle Extracted" * 7
	except:
		pass
	return all_articles_data

def fetch_stock_news_from_newsapi(cur_stock):
    from newsapi import NewsApiClient

    API_KEY = "61b9fb7eac124c678dc2d6d8a0a9e9af"
    # cur_stock = "goog"
    # "https://newsapi.org/v2/everything?q=bitcoin&apiKey=API_KEY"
    URL = "https://newsapi.org/v2/everything?q={}&apiKey={}".format(cur_stock, API_KEY)

    # Init
    newsapi = NewsApiClient(api_key=API_KEY)

    # /v2/everything
    top_headlines = newsapi.get_everything(q=str(cur_stock),
                                           language='en',
                                           page_size=100,
                                           domains='fool.com,bloomberg.com,nasdaq.com',
                                           sort_by='publishedAt',
                                              )


    for item in top_headlines['articles']:
        item['time']="".join(item['publishedAt'].split("T")[0].split("-"))
        item['date'] = item['time']
        item['source'] = item['source']['name']
        item['short_desc'] = item['description']
        item['google_url'] = item['url']
        item['final_url'] = item['url']
        item['stock'] = cur_stock
    articles = top_headlines["articles"][:]

    histogram = {}

    for item in articles:

        cur_key = item['time']
        if cur_key in histogram.keys():
            things_to_append = ["description", "title" , "short_desc"]
            for key_to_append in things_to_append:
                histogram[cur_key][key_to_append] = str(histogram[cur_key][key_to_append]) + " " + str(item[key_to_append])
        else:
            histogram[cur_key] = item
    return [v for k,v in histogram.items()]

def less_then_six_months(date_and_time, str=True):
	pass


def process_marketwatch_news_article(content):
	soup = BeautifulSoup(content)
	article__content = soup.find_all('div', class_="article__content")
	from bs4.element import Tag
	all_data = []
	for article in article__content:
		json_data = {}
		json_data['title'] = article.h3.a.text
		json_data['final_url'] = article.h3.a['href']
		for l in article.ul.children:

			if type(l) == Tag:
				print l['class'][0]
				if l['class'][0] == 'article__timestamp':
					json_data['time'] = l.text
				if l['class'][0] == 'article__author':
					json_data['author'] = l.text.split(" ")[-1]
		all_data.append(json_data)

	return all_data

def process_nasdaq_news_paragraph(url):
	crawl_obj = generic_crawler.GenericCrawler()
	content = crawl_obj.fetch_content(url, use_cache=True)
	from bs4 import BeautifulSoup
	try:
		soup = BeautifulSoup(content, 'html.parser')
		all_para = soup.find_all('p')
		article_text = ""
		for para in all_para[2:]:
			article_text += sanitize(para.text)

		return article_text
	except Exception as err:
		print err
		print "Article can't be fetched."
		return ""

import json

def fetch_historical_data_from_alphavintage(stock):
	apikey = "NZ4C53A0LJJU6MKM"
	function = "TIME_SERIES_DAILY"
	symbol = stock
	url = "https://www.alphavantage.co/query?function={0}&symbol={1}&apikey={2}".format(
		function,
		symbol,
		apikey
	)
	resp = requests.get(url)
	historical_data = json.loads(resp.text)

	def reformat_date(date_string):
		from datetime import datetime
		return datetime.strptime(date_string, "%Y-%m-%d").date().strftime('%Y%m%d')

	def sanitize_name(name):
		return name[3:]

	print "Using Aplha Vintage API for historic stock data for {0}".format(stock)
	raw_data = historical_data['Time Series (Daily)']
	all_data = []
	for date_name in raw_data:
		data = raw_data[date_name]
		json_data = {
			'date': reformat_date(date_name)
		}

		for d in data:
			json_data[sanitize_name(d)] = data[d]
		json_data['url'] = url
		json_data['source'] = 'alphavinatge'
		json_data['seed_url'] = url
		all_data.append(json_data)

	return all_data