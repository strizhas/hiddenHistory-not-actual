class GuideMarker < ApplicationRecord
	belongs_to :guide, 	:dependent => :destroy
	belongs_to :schema
	belongs_to :user, counter_cache: true

end
