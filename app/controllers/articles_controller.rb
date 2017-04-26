class ArticlesController < ApplicationController

	layout "article"

	before_filter :authenticate_user, :only => [:new, :create, :destroy, :edit]
	before_filter :is_admin?, :only => [:destroy]

	def index
		@categories = Category.all
		
		if params[:category_id]		
			ids = get_children_categories_ids(params[:category_id])
			@articles = Article.select(index_params).where( :category_id => ids )
			render :layout => false if params[:layout] == 'false'
		else

			@articles = Article.select(index_params).where( :published => true ).paginate(:page => params[:page])

		end

	end

	def show
		@article = Article.find(params[:id])
		@categories = category_select('Article')
		@owner = User.select([:id, :username]).find( @article.user_id )
	end
	
	def new
		@article = Article.new
		@categories = Category.where( parent_category_type: 'Article')
		@users = User.select([:id, :username]).all
	end
	
	def edit
  		@article = Article.find(params[:id])
  		if can_manage? (@article)
  			@categories = category_select('Article')
  			@users = User.select([:id, :username]).all
  		else 
  			redirect_to articles_path
  		end		
	end
	
	def create
		@article = Article.new(article_params)
 
		if @article.save
			redirect_to @article
		else
			render 'new'
		end
	end
	
	def update
		@article = Article.find(params[:id])
		@categories = Category.where( parent: 1)

		if @article.update(article_params)
			flash[:success] = "запись обновлена"
			redirect_to @article
		else
			render 'edit'
		end
	end
	
	
	private

		def index_params
			index_params = [:id, :title, :intro, :image, :created_at, :era, :category_id, :user_id]
		end

		def article_params
			params.require(:article).permit(:title, :crop_x, :crop_y, :crop_w, :crop_h, :text, :category_id, :image, :user_id, :intro, :era )
		end
end
