class Photo < ActiveRecord::Base

	has_many :comments, :as => :commentable,	:dependent => :destroy
	has_many :photo_markers, 					:dependent => :destroy

	has_many :likes, :as => :likeable, 			:dependent => :destroy

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
		:big   => [800, 600],
    	:thumb => [150, 150],
    	:icon  => [64, 64]
 	}

 	def self.photos_before(id,limit=10)
 		self.where("id < ?", id).order("id DESC").limit(limit)
 	end

 	def self.photos_after(id,limit=10)
 		self.where("id > ?", id).order("id ASC").limit(limit)
 	end

 	def self.search( params )

 		query_obj = self

 		# Добавляем поиск по году при необходимости
  		query_obj = query_obj.where("year = ?", params[:year] ) if params.key?('year')

		# Если задан ключ направления, то в зависимости от его значения выбираем
		# либо следующие, либо предшествующие фотографии. Если такого ключа нет, 
		# Но есть id, то просто выбираем по id
		if params.key?('direction')
			query_obj = query_obj.where("id > ?", params[:id]).order("id ASC") if params[:direction] == 'next'
			query_obj = query_obj.where("id < ?", params[:id]).order("id DESC") if params[:direction] == 'prev' 
		elsif params.key?('id') and params[:id] != ''
			query_obj = query_obj.where("id = ?", params[:id])
		end

		if params.key?('placed') and params[:placed] == 'false'
			query_obj = query_obj.where("schema_id is NULL")
		end

		# устанавливаем количество загружаемых фотографии
		# если количество не задано, то грузим 1 и выбираем первую из выборки
		if params.key?('count')
			query_obj = query_obj.limit( params[:count] )
		else
  			query_obj = query_obj.limit(1).first
  		end

  		# Выполняем запрос
  		query_obj
	end


 	def generate_thumbnails
   		image.recreate_versions! if image.present? && self.crop_x.present?
  	end

  	def resize_original
   		image.resize_original if image.present?
  	end

end
