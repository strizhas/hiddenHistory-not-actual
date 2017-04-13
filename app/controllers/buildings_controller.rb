class BuildingsController < ApplicationController

	before_filter :authenticate_user, :only => [:new, :create, :destroy, :edit, :update]
	before_filter :is_admin?, :only => [:destroy]

	layout "building_index"

	def index
		
		@categories = Category.all
		@title = 'здания и сооружения'

		if params[:category_id]		
			ids = get_children_categories_ids(params[:category_id])
			@buildings = Building.select(index_params).where( :category_id => ids ).where( 'building_id is NULL' )
			if params[:layout] == 'false'
				render :layout => false 
			end
		else
			@buildings = Building.select(index_params).where( 'building_id is NULL' )
		end

	end

	def show

		@building = Building.includes('buildings').find(params[:id])

		if @building.building_id != nil 

			@parent = Building.select([:id, :title]).find( @building.building_id )

		end

		@title = @building.title

		@category = category_select('Building').find_all { |category| category.id == @building.category_id}[0]

		@owner = User.select([:id, :username]).find( @building.user_id )

		render :layout => 'building'
	end

	def new

		if params.has_key?(:id) 
			@parent_building = Building.find(params[:id])
			@building = @parent_building.buildings.new
		else 
			@building = Building.new
		end

		@categories = Category.all
		
		@users = User.select([:id, :username]).all

	end

	def create
		@building = Building.new(building_params)
 
		if @building.save
			redirect_to @building
		else
			render action: 'new'
		end
	end

	def edit
  		@building = Building.find(params[:id])
  		if can_manage? (@building)

  			@category = category_select('Building').find_all { |category| category.id == @building.category_id}[0]

  			@users = User.select([:id, :username]).all

  		else 
  			redirect_to buildings_path
  		end		
	end

	def update

		@building = Building.find(params[:id])
		@categories = category_select('Building')
		
		if @building.update(building_params)
			flash[:success] = "запись обновлена"
			redirect_to @building
		else
			render 'edit'
		end
	end

	private

		def index_params
			index_params = [:id, :title, :intro, :image, :created_at, :era, :category_id, :user_id]
		end

		def building_params
			params.require(:building).permit(:title, :crop_x, :crop_y, :crop_w, :crop_h, :intro, :text, :category_id, :building_id, :image, :latitude, :longitude, :status, :user_id, :era )
		end
end
