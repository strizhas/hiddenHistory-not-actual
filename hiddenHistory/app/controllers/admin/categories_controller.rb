class Admin::CategoriesController < ApplicationController
		
		before_filter :authenticate_user, :is_admin?

		layout 'admin'
		
		def is_admin?
			if not current_user.is? :admin
  				redirect_to root_path
  			end	
		end

		# parent_resourse - paramentr, passed by link. It called category, specified for certain resourse type
		# 0 - buildings, 1 - articles 

		def index
			@categories = Category.where( parent_category_type: params[:parent_resourse])
		end

		def show
			@category = Category.find(params[:id])
		end

		def new
			@category = Category.new
		end

		def edit
  			@category = Category.find(params[:id])
 		end

 		def update
			@category = Category.find(params[:id])
	 
			if @category.update(category_params)
				flash[:success] = 'категория обновлена'
				redirect_to action: 'index' , parent_resourse: @category.parent_category_type
			else
				render 'edit'
			end
  		end

		def create 
			if ( params[:category_id] != nil )
				@parent_category = Category.find_by_id(params[:category_id])
				@category = @parent_category.categories.new category_params
			else
				@category = Category.new(category_params)
			end
 
			if @category.save
				redirect_to action: 'index', parent_resourse: @category.parent_category_type
			else
				render 'new'
			end
		end

		def add_subcategory
			@parent_category = Category.find_by_id(params[:category_id])
			render :partial => "admin/categories/form_subcategory", :locals => { :category => @parent_category }, :layout => false, :status => :created
		end

		def destroy
			@category = Category.find(params[:id])
			@category.destroy
	 
			redirect_to action: 'index'
		end

		private
		def category_params
			params.require(:category).permit(:id, :title, :description, :parent_category_type, :category_id )
		end
end
