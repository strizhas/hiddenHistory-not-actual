class Comment < ActiveRecord::Base

 	belongs_to :user, counter_cache: true
 	belongs_to :commentable, polymorphic: true
 	
 	has_many :comments, as: :commentable, dependent: :destroy
 	has_many :likes, as: :likeable, dependent: :destroy

 	attr_accessor :building_id

 	validates :commenter, :presence => true
 	validates :body, :presence => true
 	validates_length_of :commenter, :in => 3..20, :on => :create
end
