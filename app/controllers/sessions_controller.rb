class SessionsController < ApplicationController
 
	before_filter :authenticate_user, :except => [:index, :login, :login_attempt, :logout]
	before_filter :save_login_state, :only => [:index, :login, :login_attempt]
	before_filter :is_admin?, :only => [:destroy]


	def home
		#Home Page
	end

	def profile
		#profile Page
	end

	def setting
		#Setting Page
		@user = User.find( session[:user_id])
	end

	def login
		#Login Form
	end

	def login_attempt
		authorized_user = User.authenticate(params[:username_or_email],params[:login_password])
		if authorized_user
		
			session[:user_id] = authorized_user.id

			authenticate_user

			redirect_to user_path( authorized_user, :set_js_user_id => true )

		else
			flash[:error] = "Invalid Username or Password"
			render "login"	
		end
	end

	def logout
		session[:user_id] = nil
		redirect_to :action => 'login', :unset_user_id => true
	end

end