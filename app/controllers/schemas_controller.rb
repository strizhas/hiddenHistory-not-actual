class SchemasController < ApplicationController

	before_filter :authenticate_user, :only => [:new, :create, :destroy, :edit]
	before_filter :parent_object, :except => [ :load_schema_photos, :photo_position_update, :destroy ]

	layout "building"

	def index
		@schemas = @building.schemas

		if @schemas.length == 0
			render :partial => "schemas/partials/no_schemas"
			return
		end

		if params[:layout] == 'false'
			render :layout => false 
		end
	end

	def create

		new_params = schema_params
		new_params[:user_id] = current_user.id

		@schema = @building.schemas.new(new_params)

		if @schema.save
			redirect_to building_schema_path( @building, @schema )
		else
			flash[:error] = @schema.errors.full_messages
			render 'new'
		end

	end

	def show

		@schema = @building.schemas.find(params[:id])

		render :layout => "schema"

	end

	def edit

		@schema = @building.schemas.find(params[:id]) 

		if !can_manage? (@schema)
			redirect_to buildings_path
			return
		end

		render :layout => "building"

	end

	def update

		@schema = Schema.find(params[:id])

		if !can_manage? (@schema)
			redirect_to buildings_path
			return
		end

		new_params = Hash.new

		new_params[:title]		  = params[:schema][:title]
		new_params[:text]  		  = params[:schema][:text]

		if !params[:schema][:building_id].blank?
			new_params[:building_id]  = params[:schema][:building_id]
		end

		if params.key?('building_id') && !params[:building_id].blank?
			new_params[:building_id]  = params[:building_id]
		end

		if !params[:schema][:schema].blank?

		 	new_params[:schema] = params[:schema][:schema]

		end

		if @schema.update( new_params )
			flash[:success] = "запись обновлена"
			redirect_to building_schema_path( @building, @schema )
		else
			flash[:error] 	= "произошла ошибка"
			redirect_to edit_building_schema_path( @building, @schema )
		end

		

	end

	def upload_photo

		ids = Array.new

		if !params.has_key?(:post_photos)
			return
		end

		params[:post_photos].each do |a|

			new_params = { user_id: current_user.id , image: a, building_id: params[:building_id] }

			@photo = @building.photos.new( new_params )

			@photo.save!

			ids.push @photo.id

		end

		@photos = Photo.where( id: ids )
		
		render :json => @photos

	end


	def load_placed_photos 
		photos = Schema.find(params[:schema_id]).photos
		render :json => photos
	end

	def load_unplaced_photos 
		photos = @building.photos.where("schema_id is NULL")
		render :json => photos
	end

	def check_can_edit

		if can_manage?(@building)
			response = true
		else
			response = false
		end

		render :json => response

	end


	protected


		def schema_params
			params.require(:schema).permit( :title, :user_id, :text, :building_id, :schema )
		end

		def parent_object

			@building = Building.select([ :id, :title, :category_id, :image, :status, :user_id ]).find(params[:building_id])
			@category = category_select('Building').find_all { |category| category.id == @building.category_id}[0]
			
		end

end
