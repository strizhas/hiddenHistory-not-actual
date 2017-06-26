class BuildingsController < ApplicationController

	layout "building_index"

	before_filter :authenticate_user, :only => [:new, :create, :destroy, :edit, :update]
	before_filter :is_admin?, :only => [:destroy]

	load_and_authorize_resource :only => [:create, :destroy, :edit, :update]

	def index
		
		@categories = Category.all

		if params[:category_id]

			ids = get_children_categories_ids(params[:category_id])

			@buildings = Building.select(index_params)
									.where( :category_id => ids )
									.where( 'building_id is NULL' )
									.where(:published => true )
									.order(id: :desc)
									.paginate(:page => params[:page])
			
			if params[:layout] == 'false' && !params.key?('page')
				render :layout => false 
			end

		else
			@buildings = Building.select(index_params)
								.where( 'building_id is NULL' )
								.where(:published => true )
								.order(id: :desc)
								.paginate(:page => params[:page])
		end

	end

	def show

		@building = Building.includes('buildings').find(params[:id])

		if @building.building_id != nil 

			@parent = Building.select([:id, :title]).find( @building.building_id )

		end

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

		@categories = category_select('Building')

	end

	def create

		new_params = building_params

		if current_user.role != 'member' && current_user.role != 'guest'
			new_params[:published] = true
		end

		@building = current_user.buildings.new(new_params)
 
		if @building.save

			flash[:success] = 'изменения успешно сохранены'

			redirect_to @building
		else
			flash[:error] = @building.errors.full_messages

			@categories = Category.all

			render action: 'new'
		end
	end

	def edit

		@categories = category_select('Building')

	end

	def update
		
		if @building.update(building_params)
			flash[:success] = "запись обновлена"
			redirect_to @building
		else
			flash[:error] = "запись не обновлена"
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
