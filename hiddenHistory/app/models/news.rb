class News < ActiveRecord::Base

	attr_accessor :crop_x, :crop_y, :crop_w, :crop_h
	
	mount_uploader :image, ThumbUploader

	IMAGE_SIZES = {

 	}

 	RU_NAME = 'новости' 

 	after_update :crop_image
	after_create :crop_image

	def crop_image
   		image.resize_and_crop if crop_x.present?
  	end

end
