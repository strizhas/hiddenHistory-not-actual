// Превью фотографий, отмеченных на схеме
// эта функция отвечает за создание маленьких превью фотографий
// при наведении на отметки курсором

Schema_thumbnail = function( marker, thumb_url ) {

	if ( typeof(marker) == 'undefined' || typeof(thumb_url) == 'undefined' ) {
		return false;
	}

	var offset = $(marker).offset()

	console.log( 'show schema photo thumbnail')

	var pos_x = offset.left + 10
	var pos_y = offset.top - 85

	var img = new Image()
		img.src = thumb_url

	this.container = document.createElement('div')

	$(this.container).addClass('schema-image-small-preview')
					.css({'top' : pos_y , 'left' : pos_x })
					.appendTo('body')
					.append(img)
					.hide()
					.fadeIn('fast')
			

	return this					
}

Schema_thumbnail.prototype.destroy = function() {

		this.container.remove()
		delete schema_thumb

}