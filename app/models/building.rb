class Building < ActiveRecord::Base

	belongs_to :category
	belongs_to :user

	has_many   :comments, as: :commentable, dependent: :destroy
	has_many   :photos,  dependent: :destroy
	has_many   :schemas, dependent: :destroy
	has_many   :buildings

	mount_uploader :image, ThumbUploader

	attr_accessor :crop_x, :crop_y, :crop_w, :crop_h 

 	after_update :generate_thumbnails

	IMAGE_SIZES = {
    	:thumb => [300,  300]
 	}

 	STATUSES = {
 		'ru' => [ 'используется', 'заброшен', 'уничтожен','приспособлен','музей' ]
 	}

	RU_NAME = 'здания и сооружения'


	def generate_thumbnails
   		image.recreate_versions! if image.present?
  	end
end
