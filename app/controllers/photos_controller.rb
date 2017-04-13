class PhotosController < ApplicationController

	before_filter :authenticate_user, :only => [:new, :create, :edit]
	before_filter :parent_object, :only => [ :index, :show, :create, :load_slider_photos, :load_photos_menu  ]
	before_filter :get_category,  :only => [ :index, :show  ]

	before_filter :ajax_image_load_params, :only => [:load_slider_photos ]
	before_filter :is_admin?, :only => [:destroy ]
	

	layout "building"

	def index

		if params.key?( 'year')
			if params[:year] == 'undefined'
				@photos = @parent.photos.where( year: nil )
			else
				@photos = @parent.photos.where( year: params[:year] )
				@current_year = params[:year]
			end
		else
			@photos = @parent.photos
		end


		@edit = can? :edit, Photo
		
		render :layout => false if params[:layout] == 'false'

	end

	def show

		puts 'loading fullsize image'
		@photo = Photo.select([ :id, :image, :user_id, :author, :likes ]).find(params[:id])
		@owner = User.select([ :id, :username ]).find( @photo.user_id )
		@likes = @photo.likes.count

		@likes = '' if @likes == 0

		if params[:layout] == 'false'
			render :layout => false
		end
	end

	def create
		ids = Array.new

		params[:post_photos].each do |a|

			@photo = @parent.photos.new( user_id: current_user.id , image: a )

			@photo.save!

			ids.push @photo.id
		end

		
		if params[:render_nothing] == 'true' 

			@photos = Photo.where( id: ids )
			render :json => @photos.to_json
			
		else 
			
			flash[:success] = "фотографии успешно добавлены"    
			redirect_to action: 'index'    
		end	

	end

	def photo_editor

		@photo = Photo.find(params[:id])

		if can_manage?(@photo)
			render :layout => false
		else
			head 200 
		end
	end

	def load_photos_menu

		@years  = @parent.photos.pluck( :year ).uniq.rotate(1)
		render :partial => "photos/partials/sidebar_menu", :locals => { :years => @years, :parent => @parent }, 
														   :layout => false, :status => :created
	end


	def load_fullsize_image

		puts params

		@photo = Photo.search( params )

		puts @photo

		head :ok if @photo == nil

		owner = User.select([ :id, :username ]).find( @photo.user_id )

		likes = @photo.likes.count
		likes = '' if likes == 0

		render :partial => "photos/partials/slider_item_fullsize", :locals => { :photo => @photo, :owner => owner, :likes => likes }, 
														  :layout => false, 
														  :status => :created

	end

	def load_thumbnail_image 
		
		@photo = Photo.select([ :id, :image ]).find(params[:id])

		render :json => @photo.to_json

	end

	def load_slider_photos

		@photos = @parent.photos.search( params )

		render :json => @photos.to_json

	end


	def update
		@photo = Photo.find(params[:id])

		if @photo.update(photos_params)
			output = {'text_message' => 'фотография успешно обновлена!'}.to_json
		else
			output = {'text_message' => 'произошла какая-то ошибка. Пожалуйста обратитесь к администрации'}.to_json 	
		end

		if params[:photo].key?('year')

			markers = @photo.photo_markers
			
			markers.each do |m|
			  m.update_attribute(:year, params[:photo][:year])
			end
		end

		render :json => output

	end

	def destroy
		@photo = Photo.find(params[:id])
		@photo.destroy
		output = {'text_message' => 'фотография удалена', 'removed' => 'true' }.to_json
		render :json => output
	end

	private

		def ajax_image_load_params

			@id    = params[:id]
			@count = params[:count] || 10
			@edit  = can? :edit, Photo

		end 

		def parent_object

			if params[:building_id]
				@building = Building.select([ :id, :title, :category_id, :image, :status ]).includes('photos').find(params[:building_id])
				@parent = @building 
			elsif params[:user_id]
				@user = User.includes('photos').find(params[:user_id])
				@parent = @user
			end
		end


		def get_category
			if params[:building_id]	
				@category = category_select('Building').find_all { |category| category.id == @building.category_id}[0]
			end
		end

		def photos_params
	 		params.require(:photo).permit(:title, :image, {images: []}, :user_id, :text, :year, :author, :published, :crop_x, :crop_y, :crop_w, :crop_h ) # allow nested params as array
		end

end




