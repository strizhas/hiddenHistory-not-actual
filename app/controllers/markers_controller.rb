class MarkersController < ApplicationController

	before_action :authenticate_user, :only => [:create, :update ]
	before_action :is_admin?, :only => [:destroy ]
	before_action :parent_object, :only => [:create, :destroy, :show_markerable ]

	def index

		markers = Schema.find(params[:schema_id]).markers.where( markerable_type: params[:markerable_type] )
		render :json => markers
	end

	def create

		@schema = Schema.find(params[:schema_id])

		@marker = @schema.markers.new( marker_params )

		@marker.save!

		@markerable.update( :schema_id => params[:schema_id] )

		render :json => @marker

	end

	def update

		marker = Marker.find(params[:id])

		if marker.update(marker_params)
			render :json=>true
		else
			head 500
		end

	end

	def destroy

		marker = Marker.find(params[:id])
		marker.destroy

		@markerable.schema_id = nil
  		@markerable.save!

	end

	def show_markerable

		@owner = User.select([ :id, :username]).find( @markerable.user_id )
		@likes = @markerable.likes.count

		@likes = '' if @likes == 0

		render :layout => false, :locals => {:type => params[:markerable_type]}

	end

	private 

		def marker_params
	 		params.permit(:id, :coord_x, :coord_y, :schema_id, :markerable_id, :markerable_type )
		end

		def parent_object 
			if params[:markerable_type]  == 'Photo'
				@markerable = Photo.find(params[:markerable_id])
			elsif params[:markerable_type]  == 'Guide'
				@markerable = Guide.find(params[:markerable_id])
			end


		end

end
