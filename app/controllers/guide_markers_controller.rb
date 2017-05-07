class GuideMarkersController < ApplicationController

	before_action :authenticate_user, :only => [:create, :update ]
	before_action :is_admin?, :only => [:destroy ]
	before_action :parent_guide, :only => [ :destroy, :show ]

	def index

		markers = Schema.find(params[:schema_id]).guide_markers
		render :json => markers

	end

	def show

		@owner = User.select([ :id, :username]).find( @guide.user_id )

		render :partial => 'markers/guide/show' , :layout => false

	end

	def create

		@schema = Schema.find(params[:schema_id])

		new_params = marker_params

		new_params[:user_id] = current_user.id

		@marker = @schema.guide_markers.new( new_params )

		@marker.save!

		render :json => @marker

	end

	def update

		marker = GuideMarker.find(params[:id])

		if marker.update(marker_params)
			render :json=>true
		else
			head 500
		end

	end

	def destroy

		marker = GuideMarker.find(params[:id])
		marker.destroy

	end

	private 

		def marker_params
	 		params.permit(:id, :coord_x, :coord_y, :schema_id, :guide_id )
		end

		def parent_guide
			@guide = Guide.find(params[:guide_id])
		end

end
