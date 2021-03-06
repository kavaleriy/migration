Rails.application.routes.draw do
  resources :newspapers

  resources :professions

  resources :adverts
  resources :advert_works

  resources :housings


  resources :news_items

  devise_for :users

  resources :trud_govs

  get "home_newspapers" => 'home#newspapers'

  get "static/download1"
  get "static/download2"
  get "static/download3"
  get "static/download4"
  get "static/download5"
  get "static/download6"
  get "static/download7"
  get "static/download10"
  get "static/download9"
  get "static/download8"
  get 'home/map'

  get 'report/amount_places'

  get 'report/amount_by_type'

  get 'report/amount_of_job'

  get 'static/zd'

  get 'static/dms'

  get 'static/centers'

  get 'static/documents'

  get 'static/rs'

  get 'static/sz'

  resources :houses

  get 'home/search'

  get 'api/get_koatuu'
  get 'api/get_areas'

  get 'api/get_regions'

  get 'api/get_koatuu_geo'

  get 'api/get_professions'

  get 'centers/index'

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  root to: 'home#index'

  match "*path", :to => "application#render_404", via: [:get]
  #get match '/go/(*url)', to: redirect('/404')

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
