Rails.application.routes.draw do
  root 'news#index'
	get 'news/crawler'
  resources :news, only: [:show]
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
