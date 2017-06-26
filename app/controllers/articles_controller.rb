class ArticlesController < ApplicationController

	layout "article"

	before_filter :authenticate_user, :only => [:new, :create, :destroy, :edit]
	before_filter :is_admin?, :only => [:destroy]

	load_and_authorize_resource :only => [:create, :destroy, :edit, :update]

	def index

		@categories = Category.all
		
		if params[:category_id]		

			ids = get_children_categories_ids(params[:category_id])

			@articles = Article.select(index_params)
								.where( :category_id => ids )
								.paginate(:page => params[:page])

		else

			@articles = Article.select(index_params)
								.where(:published => true )
								.order(id: :desc)
								.paginate(:page => params[:page])

		end

			render :layout => false if params[:layout] == 'false'

	end

	def show
		@article = Article.find(params[:id])
		@categories = category_select('Article')
		@owner = User.select([:id, :username]).find( @article.user_id )
	end
	
	def new
		@article = Article.new
		@categories = category_select('Article')
	end
	
	def edit
		@categories = category_select('Article')
	end
	
	def create

		new_params = article_params
		new_params[:user_id] = current_user.id

		if current_user.role != 'member' && current_user.role != 'guest'
			new_params[:published] = true
		end

		@article = Article.new(new_params)
 
		if @article.save
			flash[:success] = "запись успешно добавлена"
			redirect_to @article
		else
			render 'new'
		end
	end
	
	def update

		@categories = Category.where( parent: 1)

		if @article.update(article_params)
			flash[:success] = "запись обновлена"
			redirect_to @article
		else
			flash[:error] = "запись не обновлена"
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
