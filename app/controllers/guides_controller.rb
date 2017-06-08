class GuidesController < ApplicationController

	def index 
		guides = Schema.find(params[:schema_id]).guides
		render :json => guides
	end

	def new

		@schema = Schema.find(params[:schema_id])
		@guide  = @schema.guides.new

		render :partial => "guides/guide_editor", :layout => false
	end

	def edit

		@schema = Schema.find(params[:schema_id])
		@guide  = Guide.find(params[:id])

		render :partial => "guides/edit_guide", :layout => false
	end

	def create

		@schema = Schema.find(params[:schema_id])
		@guide  = @schema.guides.new( guide_params.merge(user_id: current_user.id) )

		@guide.save!

		render :json => @guide.id

	end

	def update

		@guide  = Guide.find(params[:id])

		if @guide.update(guide_params)
			output = {'text_message' => 'отметка успешно обновлена!'}.to_json
		else
			output = {'text_message' => 'произошла какая-то ошибка. Пожалуйста обратитесь к администрации'}.to_json 	
		end

		render :json => output
	end

	private

		def guide_params
			params.require(:guide).permit(:id, :title, :url, :image, :number, :user_id, :schema_id)
		end
	
end
