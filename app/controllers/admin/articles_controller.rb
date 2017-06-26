class Admin::ArticlesController < ApplicationController

	before_filter :authenticate_user, :is_admin?

  layout 'admin'
    
  def is_admin?
    if not current_user.is? :admin
        redirect_to root_path
    end 
  end

  def index
  	@articles = Article.where(:published => false)
  end

  def show
  	@article = Article.find(params[:id])
  end

  def update
		@article = Article.find(params[:id])
 
		if @article.update(article_params)
			redirect_to action: 'index'
		else
			render 'edit'
		end
  end

  def destroy
    @article = Article.find(params[:id])
    @article.destroy
 
    redirect_to action: 'index'
  end

  def publish
    @article = Article.find(params[:id])
    @article.published = true
    @article.save
    redirect_to action: 'index' 
  end

  private
		def article_params
			params.require(:article).permit(:title, :text)
		end

end
