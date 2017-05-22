class UsersController < ApplicationController

	before_filter :save_login_state, :only => [:new, :create]
	before_filter :authenticate_user, :only => [:profile, :setting, :update, :comments ]


	layout "profile"

	def new

		@user = User.new
		render layout: 'application'   
	end
	
	def show
		@categories = Category.all
		@user = User.includes('buildings' , 'articles').find(params[:id])
	end
  
	def index
		@users = User.all
	end

	def profile
		@user = User.find( session[:user_id] )
	end

	def setting
		@user = User.find( session[:user_id])
	end

	def update
		@user = User.find( session[:user_id] )
 
		if @user.update(user_params)
			flash[:success] = "изменения сохранены"  
			redirect_to user_url(@user)
		else
			render 'setting'
		end
 	end

    def create

    	new_params = user_params
    	new_params[:role] = 'user'

    	@user = User.new(new_params)

    	if @user.save
    		
    		flash[:notice] = "Вы успешно зарегестрированы!"

    		session[:user_id] = @user.id

    		redirect_to user_path( @user, :set_js_user_id => true )

		else
      		render action: 'new', layout: 'application' 
		end
      
    end

    def comments
		#current user comments page
		@comments = Comment.where( user_id: session[:user_id])
		@comments.each do |comment|
			find_commentable(comment.commentable_type, comment.commentable_id)
			comment.commentable_type = @result
		end
	end

	def get_current_user_id
		if session[:user_id].present?
			render json: { id: session[:user_id]}
		else
			render json: { id: 'None' }
		end
	end

    private
		def user_params
			params.require(:user).permit(:username, :crop_x, :crop_y, :crop_w, :crop_h, :email, :password, :birthdate, :role, :image, :remove_image)
		end

		def find_commentable(resource_type, resource_id)
			case resource_type
			when 'Article'
				@commentable = Article.where( id: resource_id ).select( :title, :id).first
				@path = article_path(@commentable)
				@result	= 'комментарий к записи ' + view_context.link_to(@commentable.title, article_path(@commentable))
			when 'Comment'
				@commentable = Comment.where( id: resource_id ).select( :body, :title).first
				@result = 'ответ на комментарий <span class="quote">"' + @commentable.body[0, 20] + '"</span>'
			else
				@result = ''
			end

    	end

end