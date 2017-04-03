class Guide < ApplicationRecord

	mount_uploader :image, GuideUploader

	has_many :comments, :as => :commentable,	:dependent => :destroy
	has_many :likes, :as => :likeable, 	:dependent => :destroy

	after_create :resize_original

	IMAGE_SIZES = {

 	}

 	def resize_original
   		image.resize_original if image.present?
  	end


end
