class LikesController < ApplicationController

	before_filter :authenticate_user, :find_likeable

	def addLike

		

		redirect_to :back  if !@likeble.present?

		@existing_like = @likeble.likes.where( user_id: current_user.id )

		if @existing_like.present?
			@existing_like.destroy_all( user_id: current_user.id )
			status = 'deleted'
		else
			new_like = @likeble.likes.new( user_id: current_user.id  )
			if new_like.save!
				status = 'created'
			end
		end

		if params[:remote] == 'true' || params[:remote] == true
			render :json => { 'status' => status }.to_json 
		else
			redirect_to :back
		end
		

	end

	private

		def find_likeable
			@likeble = Photo.find( params[:id] ) if params[:type] == 'Photo'
			@likeble = Comment.find( params[:id] ) if params[:type] == 'Comment'
			@likeble = Guide.find( params[:id] ) if params[:type] == 'Guide'
		end
	
end
