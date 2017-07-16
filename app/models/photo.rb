class Photo < ActiveRecord::Base

	has_many :comments, :as => :commentable,	:dependent => :destroy
	has_many :photo_markers, 					:dependent => :destroy

	has_many :likes, :as => :likeable, 			:dependent => :destroy

	NUMS_REGEX = /[0-9]/

	# validates :coord_x, :format => NUMS_REGEX
	# validates :coord_y, :format => NUMS_REGEX

	belongs_to :user, counter_cache: true
	belongs_to :building, counter_cache: true

	mount_uploader :image, ImageUploader
	attr_accessor :crop_x, :crop_y, :crop_w, :crop_h

	after_create :generate_thumbnails, :resize_original
 	after_update :generate_thumbnails

	IMAGE_SIZES = {
		:big   => [800, 600],
    	:thumb => [128, 128],
    	:icon  => [64, 64]
 	}

 	self.per_page = 20


 	def self.search( params )

 		query_obj = self

 		# Добавляем поиск по году при необходимости
 		if params.key?('year')
 			if params[:year] != 'undefined'
  				query_obj = query_obj.where("year = ?", params[:year] )
  			else
  				query_obj = query_obj.where("year IS ?", nil )
  			end
  		end 

		# Если задан ключ направления, то в зависимости от его значения выбираем
		# либо следующие, либо предшествующие фотографии. Если такого ключа нет, 
		# Но есть id, то просто выбираем по id
		if params.key?('direction')
			query_obj = query_obj.where("id > ?", params[:id]).order("id ASC") if params[:direction] == 'next'
			query_obj = query_obj.where("id < ?", params[:id]).order("id DESC") if params[:direction] == 'prev' 
		elsif params.key?('id') and params[:id] != ''
			query_obj = query_obj.where("id = ?", params[:id])
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
