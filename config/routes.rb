Rails.application.routes.draw do

	resources :articles do
		resources :comments
	end

	resources :comments do
    	resources :comments
  	end

  	resources :categories do
    	resources :categories
  	end

  	resources :photos do
  		resources :comments
  	end

  	

	resources :buildings do
		resources :comments
		resources :categories
		resources :photos do 

			collection do
				post 'load_fullsize_image/:id',  :to => 'photos#load_fullsize_image'
				match 'load_photos_menu', :to => 'photos#load_photos_menu',    :via => [:post]
				match 'load_slider_photos',  :to => 'photos#load_slider_photos', :via => [:post]	
			end

		end

		resources :schemas do

			patch "marker_update/:id", 	:to => 'markers#update'
			post  "marker_create", 	:to => 'markers#create'
			post  "marker_destroy/:id", :to => 'markers#destroy'

			post  'load_fullsize_image/:id', :to => 'photos#load_fullsize_image'

			post  'show_markerable', :to => 'markers#show_markerable'

			match "load_markers" => 'markers#index',  :via => [:post]

			match "load_guides" => 'guides#index',  :via => [:post]

			match 'load_placed_photos',  :to => 'schemas#load_placed_photos', :via => [:post]

			match 'load_unplaced_photos',  :to => 'schemas#load_unplaced_photos', :via => [:post]	

			match 'new_guide', :to => 'guides#new', :via => [:post]	

			match 'edit_guide/:id', :to => 'guides#edit', :via => [:post]	

		end

		post 'buildings/:id/photos', :to => 'photos#create'
 
		match 'photos/load_photos_menu', :to => 'photos#load_photos_menu',    :via => [:post]	

		match 'load_schema_photos', :to => 'photos#load_thumbnail_slider', :via => [:post]

	end


	resources :schemas, :only => :index do
  		resources :guides
	end

	resources :guides, :only => :index do
		resources :comments
	end



	post "load_thumbnail_image/:id", :to => "photos#load_thumbnail_image"
	

	get "/add_like/:id", :to => "likes#addLike", as: 'add_like', constraints: { id: /[0-9]{0,5}/}

  	get "/comment_reply" => 'comments#comment_reply', as: 'comment_reply'
  	get "/comment_edit" => 'comments#comment_edit', as: 'comment_edit'

  	resources :users do
  		resources :photos do
  			collection do
  				post 'load_fullsize_image/:id',  :to => 'photos#load_fullsize_image'
  				match 'load_photos_menu', :to => 'photos#load_photos_menu',    :via => [:post]
  				match 'load_slider_photos', :to => 'photos#load_slider_photos', :via => [:post] 
  			end
  		end

  		resources :comments

  		
  	end

	get "user/setting", :to => "users#setting"


	get "/photo_editor" => 'photos#photo_editor', as: 'photo_editor'
	
	resources :news
	
	root 'news#index'

	get "news/create", :to => "news#create"
	
	get "session/signup", :to => "users#new"
	get "session/login", :to => "sessions#login"
	get "session/logout", :to => "sessions#logout"
	get "home", :to => "sessions#home"

	get 'get_current_user_id' => "users#get_current_user_id"

	patch "user/update", :to => "users#update"

	# routes for static pages
	get "/pages/:page" => "pages#show"

	namespace :admin do

		resources :articles, :comments, :users, :news, :buildings

		resources :categories do
    		resources :categories
  		end


		get '', to: 'dashboard#index', as: '/'

		get "add_subcategory" => "categories#add_subcategory"
		patch "categories" => "categories#update", :as => "admin/categories/update"
		patch "user/update" => "users#update", :as => "admin/users"


		get "dashboard/publish_comment" => "dashboard#publish_comment", :as => "admin/publish_comment"
		
	end	

	post ':controller(/:action(/:id))(.:format)'
	
end
