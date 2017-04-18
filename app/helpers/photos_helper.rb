module PhotosHelper

	def create_image_url(photo, year)

		img_tag = image_tag( photo.image.thumb.url, :id => ( 'gallery-item-' + photo.id.to_s ) )

		link_path = polymorphic_url( [ @parent, photo ] , :year=> ( year if year != nil))

		return link_to img_tag, link_path, class: 'photo-gallery-image-link'


	end
end
