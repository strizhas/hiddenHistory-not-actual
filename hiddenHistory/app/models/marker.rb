class Marker < ApplicationRecord
	belongs_to :markerable, polymorphic: true
	belongs_to :schema

end
