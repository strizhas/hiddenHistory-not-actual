class User::Photo < Photo

	has_many :comments, as: :commentable, dependent: :destroy
	has_many :likes, as: :likeable, dependent: :destroy

	NUMS_REGEX = /[0-9]/

	# validates :coord_x, :format => NUMS_REGEX
	# validates :coord_y, :format => NUMS_REGEX

	belongs_to :user 
	belongs_to :building

	mount_uploader :image, ImageUploader
	attr_accessor :crop_x, :crop_y, :crop_w, :crop_h

	after_create :generate_thumbnails, :resize_original
 	after_update :generate_thumbnails

	IMAGE_SIZES = {
    	:thumb => [150, 150]
 	}

 	def self.photos_before(id,limit=10)
 		self.where("id < ?", id).order("id DESC").limit(limit)
 	end

 	def self.photos_after(id,limit=10)
 		self.where("id > ?", id).order("id ASC").limit(limit)
 	end


 	def generate_thumbnails
   		image.recreate_versions! if image.present? && self.crop_x.present?
  	end

  	def resize_original
   		image.resize_original if image.present?
  	end

end

class User::Photos < Photo

	belongs_to :user 

end
