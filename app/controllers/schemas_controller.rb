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

		@schema = @building.schemas.new(schema_params)

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
		render :layout => "building"
	end

	def update

		@schema = Schema.find(params[:id])

		new_params = Hash.new

		new_params[:title] = params[:schema][:title]
		new_params[:text] = params[:schema][:text]

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


	def load_placed_photos 
		photos = Schema.find(params[:schema_id]).photos
		render :json => photos
	end

	def load_unplaced_photos 
		photos = @building.photos.where("schema_id is NULL")
		render :json => photos
	end


	protected


		def schema_params
			params.require(:schema).permit( :title, :user_id, :text, :schema )
		end

		def parent_object

			@building = Building.select([ :id, :title, :category_id, :image, :status, :user_id ]).find(params[:building_id])
			@category = category_select('Building').find_all { |category| category.id == @building.category_id}[0]
			
		end

end
