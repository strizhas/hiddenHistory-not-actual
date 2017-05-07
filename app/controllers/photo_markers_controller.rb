class PhotoMarkersController < ApplicationController

	before_action :authenticate_user, :only => [:create, :update ]
	before_action :is_admin?, :only => [:destroy ]
	before_action :parent_photo, :only => [ :show, :create, :destroy ]

	def index

		markers = Schema.find(params[:schema_id]).photo_markers
		render :json => markers
	end

	def show

		@owner = User.select([ :id, :username]).find( @photo.user_id )

		@likes = @photo.likes.count

		@likes = '' if @likes == 0

		render :partial => 'markers/photo/show' , :layout => false, :locals => {:type => 'Photo'}

	end

	def create

		@schema = Schema.find(params[:schema_id])

		new_params = marker_params

		new_params[:user_id] = current_user.id

		@marker = @schema.photo_markers.new( new_params )

		@marker.save!

		@photo.update( :schema_id => params[:schema_id] )

		render :json => @marker

	end

	def update

		marker = PhotoMarker.find(params[:id])

		if marker.update(marker_params)
			render :json=>true
		else
			head 500
		end

	end

	def destroy

		marker = PhotoMarker.find(params[:id])
		marker.destroy

		@photo.schema_id = nil
  		@photo.save!

	end


	private 

		def marker_params
	 		params.permit(:id, :coord_x, :coord_y, :angle, :schema_id, :photo_id )
		end

		def parent_photo 
			@photo = Photo.find(params[:photo_id])
		end

end
