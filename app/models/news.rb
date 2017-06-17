class News < ActiveRecord::Base

	attr_accessor :crop_x, :crop_y, :crop_w, :crop_h
	
	mount_uploader :image, ThumbUploader

	after_update :generate_thumbnails
	
	IMAGE_SIZES = {
		:thumb => [300,  300]
 	}

 	RU_NAME = 'новости' 

 	def generate_thumbnails
   		image.recreate_versions! if image.present? && self.crop_x.present?
  	end

end
