// Превью фотографий, отмеченных на схеме
// эта функция отвечает за создание маленьких превью фотографий
// при наведении на отметки курсором

Schema_thumbnail = function( marker, thumb_url ) {

	if ( typeof(marker) == 'undefined' || typeof(thumb_url) == 'undefined' ) {
		return false;
	}

	$('#schema-image-small-preview').remove();

	var offset = $(marker).offset();

	var pos_x = offset.left + 18;
	var pos_y = offset.top - 128;

	var img = new Image();
		img.src = thumb_url;

	this.container = document.createElement('div');

	$(this.container).addClass('schema-image-small-preview')
					.attr('id' , 'schema-image-small-preview')
					.css({'top' : pos_y , 'left' : pos_x })
					.appendTo('body')
					.append(img)
					.hide()
					.fadeIn('fast');
			

	return this					
}

Schema_thumbnail.prototype.destroy = function() {

		$(this.container).remove();
		delete schema_thumb;

}