require 'rubygems'
require 'nokogiri'
require 'open-uri'

News = Struct.new(:id, :number, :title, :href, :sitestr, :points, :user, :age, :comments)

class NewsController < ApplicationController
	def index
		
	end

	def crawler
		page = (params[:p] || '1').to_i
		cached_key = "data_page_#{page}_json"
		data = []
		if Rails.cache.exist?(cached_key)
			puts 'cached'
			data = Rails.cache.read(cached_key)
		else
			puts 'loaded'
			data = Rails.cache.fetch(cached_key, expires_in: 10.minutes) do
				parse_html(page)
			end
		end
		
		render json: data
	end

	def show
		
  end

	private
	def parse_html(page)
		data = []
		page = (params[:p] || '1').to_i
		url = 'https://news.ycombinator.com/best' + (page <= 1 ? '' : '?p=' + page.to_s)
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
		data.to_json
	end

end
