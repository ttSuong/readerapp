require 'rubygems'
require 'nokogiri'
require 'open-uri'

class DetailController < ApplicationController
	skip_before_action  :verify_authenticity_token
	def fetch
		cached_key = "page_detail_#{params[:url]}"
		html_detail = Array.new
		if Rails.cache.exist?(cached_key)
			html_detail = Rails.cache.read(cached_key)
		else
			doc = Nokogiri::HTML(URI.open(params[:url]))
			html_detail = Rails.cache.fetch(cached_key, expires_in: 10.minutes) do
				doc.to_html
			end

		end
		file_name = "#{Rails.root}/public/detail.html"
		File.open(file_name,'wb') { |f| f.write(html_detail); f.close }
		render json: "detail.html"
	end
end
