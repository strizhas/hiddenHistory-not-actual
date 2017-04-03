class Schema < ActiveRecord::Base

	belongs_to :user
	belongs_to :building
	
	has_many   :markers, :dependent => :destroy

	has_many   :photos, through: :markers, :source => :markerable, :source_type => 'Photo'
	has_many   :guides, through: :markers, :source => :markerable, :source_type => 'Guide'

	validates :title, :presence => true

	mount_uploader :schema, SchemaUploader

end
