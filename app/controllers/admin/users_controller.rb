class Admin::UsersController < ApplicationController

	# before_filter :authenticate_user, :is_admin?

  layout 'admin'

  def is_admin?
    if not current_user.is? :admin
        redirect_to root_path
    end 
  end

  def index
  	@users = User.all
  end

  def show
  	@article = Article.find(params[:id])
  end

  def edit
  	@user = User.find(params[:id])
  end

  def update
		@user = User.find(params[:id])
 
		if @user.update(user_params)
			redirect_to action: 'index'
		else
			render 'edit'
		end
  end

  private
		def user_params
			params.require(:user).permit(:username, :email, :birthdate, :role, :image, :id)
		end

end
