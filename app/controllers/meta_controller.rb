require 'nokogiri'
require 'open-uri'

class MetaController < ApplicationController
	skip_before_action  :verify_authenticity_token

	def fetch
		render json: meta_content(body_params)
	end

	private
	def body_params
		JSON.parse(request.body.read)['url']
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
					doc.to_html 
				end
			end
		rescue StandardError, LoadError => e
			puts e
			content = {desc: '', src: ''}
		end
		return content.to_json
	end

	def meta(doc)
		meta = doc.search("meta[name='twitter:description'] meta[name='description'], meta[property='og:description']")
		if meta.present? && meta.first.present?
			meta.first['content']
		else
			''
		end
	end

	def image_url(main_url, doc)
		image_urls = doc.search("link[rel='icon'], link[rel='shortcut icon']")
		if image_urls.blank?
			data = doc.search("meta[property='og:image']")
			data.first['content'] if data.present? && data.first.present?
		end
		image_url = ''
		if image_urls.present? && image_urls.first.present?
			image_url = image_urls.first['href']
		end
		return '' if image_url.blank?
		return URI.parse(main_url).scheme + '://' + image_url if image_url.present? && image_url.exclude?(URI.parse(main_url).scheme)
		image_url.delete_prefix('//')
		if(image_url.first == '/')
			image_url.delete_prefix('/')
		end
		return image_url if URI.parse(image_url).host.present?
		return domain.host + image_url
	end

end