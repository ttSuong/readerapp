require 'rubygems'
require 'nokogiri'
require 'open-uri'
require 'readability'
require 'uri'


News = Struct.new(:id, :number, :title, :href, :sitestr, :points, :user, :age, :comments)

class NewsController < ApplicationController
	skip_before_action  :verify_authenticity_token
	def index
	end

	def fetch_news
		page = (params[:p] || '1').to_i
		cached_key = "data_page_#{page}"
		news = []

		if Rails.cache.exist?(cached_key)
			news = Rails.cache.read(cached_key)
		else
			news = Rails.cache.fetch(cached_key, expires_in: 10.minutes) do
				parse_news(page)
			end
		end
		
		render json: news
	end

	def fetch_meta
		render json: meta_content(body_params)
  end

	def fetch_detail
		cached_key = "page_detail_#{params[:url]}"
		html_detail = ''
		if Rails.cache.exist?(cached_key)
			html_detail = Rails.cache.read(cached_key)
		else
			doc = Nokogiri::HTML(URI.open(params[:url]))
			html_detail = Rails.cache.fetch(cached_key, expires_in: 10.minutes) do
				doc.at('body').content
			end

		end

		render json: html_detail
	end


	private
	def body_params
		body = JSON.parse(request.body.read)['url']
	end

	def meta_content(url)
		begin
			cached_key = "meta_#{url}"
			page_cached_key = "page_detail_#{url}"

			content = {desc: '', src: ''}
			if Rails.cache.exist?(cached_key)
				content = Rails.cache.read(cached_key) 
			else
				doc = Nokogiri::HTML(URI.open(url))
				content = Rails.cache.fetch(cached_key, expires_in: 10.minutes) do
					{
						desc: meta(doc),
						src: image_url(url, doc)
					}	
				end
				page = Rails.cache.fetch(page_cached_key, expires_in: 10.minutes) do
					doc.at('body').to_s
				end
			end
		rescue
			content = {desc: '', src: ''}
		end
		return content.to_json
	end

	def meta(doc)
		meta = doc.search("meta[name='description'], meta[property='og:description']")
		if meta.present? && meta.first.present?
			meta.first['content']
		else
			''
		end
	end
	def image_url(main_url, doc)
		image_urls = doc.search("link[rel='icon'], link[rel='shortcut icon']")
		image_url = ''
		if image_urls.present? && image_urls.first.present?
			image_url = image_urls.first['href']
		end
		if image_url.include?('//') || image_url.include?('http')
			return image_url
		end
		return URI.parse(main_url).host + image_url
	end

	def parse_news(page)
		data = []
		page = (params[:p] || '1').to_i
		url = 'https://news.ycombinator.com/best' + (page <= 1 ? '' : '?p=' + page.to_s)
		begin
			doc = Nokogiri::HTML(URI.open(url))
			doc.css("table.itemlist").map do |table|
				table.css("tr.athing").map do |row|
					news = News.new
					news.id = row['id']
					news.number = row.css('span.rank')[0].text.delete_suffix('.')
					news.title = row.css('a.storylink')[0].text
					news.href = row.css('a.storylink')[0]['href']
					news.sitestr = row.css('span.sitestr')[0].text rescue ''
					row2 = row.next_element
					news.points = row2.css('span.score')[0].text.delete_suffix(' point').delete_suffix(' points')
					news.user = row2.css('a.hnuser')[0].text
					news.age = row2.css('span.age')[0].text
					news.comments = row2.css('a[href="item?id=' + news.id + '"]')[1].text.delete_suffix(' comment').delete_suffix(' comments') rescue ''
					data.append(news)
				end
			end
		rescue
			data = []
		end
		return data.to_json
	end
end
