class NewsController < ApplicationController

	before_filter :authenticate_user, :only => [:new, :create, :destroy, :edit]
	before_filter :is_admin?, :only => [:destroy]

	layout "news"

	def index
		@categories = Category.all

		if params[:era]
			articles  = Article.select( index_params ).where( era: params[:era])
			buildings = Building.select( index_params ).where( era: params[:era])

			@content = articles + buildings

		else

			@content   = News.where( published: true )
			@buildings = Building.select([ :id, :title, :image, :intro, :category_id, :created_at, :era]).limit(5)
			@header    = true

		end
	end

	def show
		@news = News.find(params[:id])
		@owner = User.select([:id, :username]).find( @news.user_id )
	end

	def new
		@news = News.new
	end
	
	def edit
		@news = News.find(params[:id])	
		if !can_manage? (@news)
  			redirect_to root_path
  		end		
	end
	
	def create
		if can? :create, News
			@news = News.new(news_params.merge(:user_id => @current_user.id , :published => true ))
	 
			if @news.save
				redirect_to root_path
			else
				render 'new'
			end
		end	
	end

	def update
		@news = News.find(params[:id])

		if @news.update(news_params)
			flash[:success] = "запись обновлена"
			redirect_to root_path
		else
			render 'edit'
		end
	end

	private

	def index_params
		index_params = [:id, :title, :intro, :image, :created_at, :era, :category_id, :user_id]
	end

	def news_params
		params.require(:news).permit(:title, :text, :intro, :image, :era, :parent, :crop_x, :crop_y, :crop_w, :crop_h, :published )
	end

end
