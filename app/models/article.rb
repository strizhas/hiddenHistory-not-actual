class Article < ActiveRecord::Base

	mount_uploader :image, ThumbUploader

	attr_accessor :crop_x, :crop_y, :crop_w, :crop_h 

 	after_update :generate_thumbnails

	IMAGE_SIZES = {
    	:thumb => [300, 300]
 	}

 	RU_NAME = 'статьи' 

	belongs_to :category
	has_many :comments, as: :commentable, dependent: :destroy
  	has_many :likes, as: :likeable, dependent: :destroy

	validates :title, presence: true,
                    length: { minimum: 5 }
             

  self.per_page = 10

  def generate_thumbnails
      image.recreate_versions! if image.present? && self.crop_x.present?
  end
  
end
