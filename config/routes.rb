Rails.application.routes.draw do
  root 'news#index'
	get 'news/fetch_news'
	post 'news/fetch_meta'
	get 'news/fetch_detail'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
