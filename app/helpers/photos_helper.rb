module PhotosHelper

	# this helper adds headers, containing the year of creation, to gallery
	def render_gallery
		if @photos.count > 0
			$html = ''
			cur_date = ''

			edit = can? :edit, Photo ? true : false

			@photos.each do |photo|

				next_figure = ( render partial: 'photos/partials/figure', :object => photo, as: 'photo', locals: { edit: edit })

				if ( photo.date != nil && photo.date != cur_date )
					$html += ( '<h2 class="light-gray-text">' + photo.date.to_s + '</h2><hr class="dark-gray-hr">' )
					cur_date = photo.date
				end

				$html += next_figure
								
			end
			$html += '<hr class="dark-gray-hr">'
		else
			$html = '<p class="light-gray-text">К сожалению для этого сооружения никто ещё не загрузил ни одной фотографии</p>'
		end
		return $html.html_safe
	end

	def create_image_url(photo, year)

		img_tag = image_tag( photo.image.thumb.url, :id => ( 'gallery-item-' + photo.id.to_s ) )

		link_path = polymorphic_url( [ @parent, photo ] , :year=> ( year if year != nil))

		return link_to img_tag, link_path, class: 'photo-gallery-image-link'


	end
end
