require 'rails_helper'

RSpec.describe NewsController, type: :controller do
    describe "GET #fetch_news" do
			it 'test fetch news with no paging' do
				get 'fetch_news'
				res = JSON.parse(response.body)
				res[0]['title'].should eq('Google Docs will now use canvas based rendering')
			end

			it 'test fetch news with paging' do
				params = {p: 2}
				get 'fetch_news', :params => params
				res = JSON.parse(response.body)
				res[0]['title'].should eq('Vue 3 drops IE11 support plan')
			end
    end
end