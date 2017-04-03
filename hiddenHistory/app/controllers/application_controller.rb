class ApplicationController < ActionController::Base
	# Prevent CSRF attacks by raising an exception.
	# For APIs, you may want to use :null_session instead.
	protect_from_forgery with: :exception
	
	before_filter :current_user

	def current_user
        @current_user ||= User.find(session[:user_id]) if session[:user_id]
    end

    # check permission to use admin panel and delete posts
    def is_admin?
	    if not current_user.is? :admin
	        redirect_to root_path
	    end 
	end

	# check permission to edit posts
	def can_manage?(post)

		if  ( @current_user && ( @current_user.id == post.user_id || ( @current_user.is? :admin  ))) || 
			( can? :manage, post.class ) 
				return true
		else
				return false
		end			
	end

	# Метод используется для рекусрсивного поиска опеределенных подкатегорий
	# В качестве аргумента передаётся название модели
	# Функция получает массив со всеми категориями, имеющими 
	# parent_category_type = model, а затем каждая из этих категорий перебирвется
	# на предмет подкатегорий

	# на данный момент не испольуется, однако пока убирать не буду
	def category_select(model)
		@cats = []
		@categories = Category.where( parent_category_type: model )

		def category_loop(categories)
			categories.each do |category| 
				@cats.push( category )
				category_loop(category.categories) if category.categories.count != 0
			end
		end
		category_loop(@categories)
		return @cats
	end

	def get_children_categories_ids(parent_category_id)
		parent_category = Category.find(parent_category_id)
		if parent_category.categories.count > 0

			@category_ids = [parent_category_id]

			def category_loop_ids(categories)
				categories.each do |category| 
				@category_ids.push( category.id )
				category_loop(category.categories) if category.categories.count != 0
				end
			end

			category_loop_ids(parent_category.categories)
			return @category_ids
			
		else
			return parent_category.id
		end
	end

	# current model name
	def current_model
		controller_path.classify
	end

	helper_method :current_user, :can_manage?, :is_admin?, :current_model

	protected 



	def authenticate_user
	  if session[:user_id]
		# set current user object to @current_user object variable
		@current_user = User.find session[:user_id] 
		return true	
	  else
		redirect_to :back
		return false
	  end
	  
  
	  
	end
	
	def save_login_state
	  if session[:user_id]
		redirect_to(:controller => 'sessions', :action => 'profile')
		return false
	  else
		return true
	  end
	end  
end
