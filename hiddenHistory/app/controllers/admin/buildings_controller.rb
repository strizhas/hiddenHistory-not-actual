class Admin::BuildingsController < ApplicationController

	before_filter :authenticate_user, :is_admin?

  layout 'admin'
    
  def is_admin?
    if not current_user.is? :admin
        redirect_to root_path
    end 
  end

  def index
  	@buildings= Building.all
  end

  def show
    @building = Building.find(params[:id])
  end

  def update
		@building = Building.find(params[:id])
 
		if @building.update(building_params)
			redirect_to action: 'index'
		else
			render 'edit'
		end
  end

  def destroy
    @building = Building.find(params[:id])
    @building.destroy
 
    redirect_to action: 'index'
  end

  private
		def building_params
			params.require(:building).permit(:title, :text)
		end

end
