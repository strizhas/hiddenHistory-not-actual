class Category < ActiveRecord::Base
	has_many :articles
	belongs_to :parent_category, polymorphic: true
	has_many :categories, as: :parent_category, dependent: :destroy
end
