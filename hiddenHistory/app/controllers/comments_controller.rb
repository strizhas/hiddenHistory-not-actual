class CommentsController < ApplicationController

	before_filter :authenticate_user, :only => [:destroy, :edit]
	before_action :find_commentable

    def index
    	@user = User.find( params[:user_id])
    	@comments = @user.comments
    end

    def new 
    	@comment = Comment.new
    end

	def create
		if current_user.nil?

			layout = 'comment_unpublished'
			@comment = @commentable.comments.new comment_params

    	else
    		layout = false

    		new_params = comment_params.merge({ commenter: current_user.username,
    							  user_id: current_user.id,
    							  published: true })

    		@comment = @commentable.comments.new( comment_params.merge({ commenter: current_user.username,
    							  										 user_id: current_user.id,
    							  										 published: true }) )
		end

		if @comment.save
			render :partial => "comments/comment", :locals => { :comment => @comment }, :layout => layout, :status => :created
		else
			render :partial => "comments/error", :layout => false
			flash[:error] = "комментарий не был добавлен"
      	end	
	end

	def update
		@comment = Comment.find(params[:id])

		if @comment.update(comment_params)
			flash[:success] = "комментарий обновлён"
			render :partial => "comments/edit/comment", :locals => { :comment => @comment }, :layout => false
		else
			render 'edit'
		end
	end

	def comment_edit
		@comment = Comment.find_by_id(params[:comment_id])
    	render :partial => "comments/edit/comment_edit", :locals => { :comment => @comment }, :layout => false, :status => :created
    end

	def destroy
		@comment = @commentable.comments.find(params[:id])
		@comment.destroy
		redirect_to :back
	end

	def comment_reply
    	render :partial => "comments/comment_reply", :locals => { :comment => @commentable }, :layout => false, :status => :created
    end
 
	private
		def comment_params
			params.require(:comment).permit(:commenter, :body, :user_id, :published, :building_id, :article_id, :photo_id  )
    	end

    	def find_commentable
     		@commentable = Comment.find_by_id(params[:comment_id]) if params[:comment_id]
      		@commentable = Article.find_by_id(params[:article_id]) if params[:article_id]
      		@commentable = Building.find_by_id(params[:building_id]) if params[:building_id]
      		@commentable = Photo.find_by_id(params[:photo_id]) if params[:photo_id]
      		@commentable = Guide.find_by_id(params[:guide_id]) if params[:guide_id]
    	end
end
