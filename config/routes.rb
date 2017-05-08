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
  	

  	post 'load_fullsize_image/:id',  :to => 'photos#load_fullsize_image'

	resources :buildings do
		resources :comments
		resources :categories
		resources :photos do 

			collection do
				
				match 'load_photos_menu', 		 :to => 'photos#load_photos_menu',   :via => [:post]
				match 'load_slider_photos',  	 :to => 'photos#load_slider_photos', :via => [:post]
				match 'new/load_slider_photos',  :to => 'photos#load_slider_photos', :via => [:post]	
			end

		end

		resources :schemas do

			patch "photo_marker_update/:id", 	:to => 'photo_markers#update'
			post  "photo_marker_create", 		:to => 'photo_markers#create'
			post  "photo_marker_destroy/:id", 	:to => 'photo_markers#destroy'

			patch "guide_marker_update/:id", 	:to => 'guide_markers#update'
			post  "guide_marker_create", 		:to => 'guide_markers#create'
			post  "guide_marker_destroy/:id", 	:to => 'guide_markers#destroy'

			post  'show_guide_marker',		:to => 'guide_markers#show'
			post  'show_photo_marker',		:to => 'photo_markers#show'

			post  'upload_photo',		 	:to => 'schemas#upload_photo'

			post 'check_can_edit',			:to => 'schemas#check_can_edit'

			
			match "load_photo_markers" => 'photo_markers#index',  :via => [:post]

			match "load_guide_markers" => 'guide_markers#index',  :via => [:post]

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
  		resources :photos, :controller => "user_photos" do
  			collection do
  				match 'load_photos_menu', :to => 'photos#load_photos_menu',    :via => [:post]
  				match 'load_slider_photos', :to => 'photos#load_slider_photos', :via => [:post] 
  			end
  		end

  		resources :comments, :controller => "user_comments"

  		
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
