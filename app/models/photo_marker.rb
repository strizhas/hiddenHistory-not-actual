class PhotoMarker < ApplicationRecord
	belongs_to :photo
	belongs_to :schema

end
