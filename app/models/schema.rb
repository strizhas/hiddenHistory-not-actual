class Schema < ActiveRecord::Base

	belongs_to :user
	belongs_to :building
	
	has_many   :photo_markers, :dependent => :destroy
	has_many   :guide_markers, :dependent => :destroy

	has_many   :photos, through: :photo_markers
	has_many   :guides, through: :guide_markers

	validates :title, :presence => true

	mount_uploader :schema, SchemaUploader

end
