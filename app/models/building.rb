class Building < ActiveRecord::Base

	belongs_to :category
	belongs_to :user

	has_many   :comments, as: :commentable, dependent: :destroy
	has_many   :photos,  dependent: :destroy
	has_many   :schemas, dependent: :destroy
	has_many   :buildings

	mount_uploader :image, ThumbUploader

	validates :title, :presence => true, :length => { :in => 3..100 }



	attr_accessor :crop_x, :crop_y, :crop_w, :crop_h 

 	after_update :generate_thumbnails

	IMAGE_SIZES = {
    	:thumb => [300,  300]
 	}

 	STATUSES = {
 		'ru' => [ 'используется', 'заброшен', 'уничтожен','приспособлен','музей' ]
 	}

	RU_NAME = 'здания и сооружения'


	self.per_page = 10

	def generate_thumbnails
   		image.recreate_versions! if image.present? && self.crop_x.present?
  	end
end
