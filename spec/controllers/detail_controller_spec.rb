require 'rails_helper'

RSpec.describe DetailController, type: :controller do
    describe "GET #fetch" do
			it 'test fetch detail with url have data' do
				params = {url: "https://workspaceupdates.googleblog.com/2021/05/Google-Docs-Canvas-Based-Rendering-Update.html"}
				get 'fetch', :params => params
				res = response.body
				res.should eq('detail.html')
			end
    end
end