class Session < ActiveRecord::Base

  IMAGE_SIZES = {
      :default => [1100, 900],
      :thumb => [120, 120]
   }

  mount_uploader :image, ImageUploader
  
	

end