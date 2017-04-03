class Admin::DashboardController < ApplicationController

	before_filter :authenticate_user, :is_admin?

	layout 'admin'
	
	def index
		@comments = Comment.all
	end

	def articles
  		@articles = Article.all
	end

	def publish_comment
		comment = Comment.find(params[:id])
  		comment.published = true
  		comment.save
  		redirect_to action: 'index' 
	end
end
