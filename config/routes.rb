Rails.application.routes.draw do

  root to: "static#show"

  get    '/login' => 'session#new'
  post   '/login' => 'session#create'
  delete '/login' => 'session#destroy'

  get    '/waypoints/:hike_id' => 'hikes#hike_waypoints'
  post   '/hikes/savepoints' => 'hikes#save_waypoints'
  post   '/hikes/updatepoints' => 'hikes#update_waypoints'

  get '/hikes/track_hike' => 'hikes#track_hike'

  resources :users
  resources :hikes
  resources :completions
  resources :waypoints
  resources :tips
  resources :comments
  resources :photos

end
