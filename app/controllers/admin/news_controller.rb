class Admin::NewsController < ApplicationController

	before_filter :authenticate_user, :is_admin?

  layout 'admin'

  def index
  	@news = News.all
  end

  def edit
    @news = News.find(params[:id])
  end

  def update
		@news = News.find(params[:id])
 
		if @news.update(news_params)
			redirect_to action: 'index'
		else
			render 'edit'
		end
  end

  def destroy
    @news = News.find(params[:id])
    @news.destroy
 
    redirect_to action: 'index'
  end

  private
		def news_params
			params.require(:news).permit(:title, :text, :image, :era, :parent, :crop_x, :crop_y, :crop_w, :crop_h, :published )
		end

end
