require 'rails_helper'

RSpec.describe MetaController, type: :controller do
    describe "POST #fetch" do
			it 'test no data to fetch' do
				params = {:url => "https://p.haavard.me/407"}
				post 'fetch', :params => params, as: :json
				res = JSON.parse(response.body)
				expect_value = {"desc"=>"", 
												"src"=>""}
				res.should eq(expect_value)
			end
			
			it 'test fetch meta with url have data' do
				params = {:url => "https://workspaceupdates.googleblog.com/2021/05/Google-Docs-Canvas-Based-Rendering-Update.html"}
				post 'fetch', :params => params, as: :json
				res = JSON.parse(response.body)
				expect_value = {"desc"=>"What’s changing  We’re updating the way Google Docs renders documents. Over the course of the next several months, we’ll be migrating the un...", 
												"src"=>"https:////workspaceupdates.googleblog.com/favicon.ico"}
				res.should eq(expect_value)
			end
    end
end