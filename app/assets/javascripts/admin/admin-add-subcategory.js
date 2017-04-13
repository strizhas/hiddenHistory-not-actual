function bind_add_subcategory_form_ajax_load() {

	$('.add-subcategory-link').on('click', function(event) {

		event.preventDefault();

		var current_link = $(this);
		var form = current_link.parent().find('form');

		if ( form.length == 0 ) {

			url = $(current_link).attr('href');

			if ( !url ) {
				return;
			}

			$.ajax({
				url: url,
				method: 'GET',
				dataType: 'html',
				success: function(data, textStatus, jqXHR) {
					form = document.createElement('div');
					$(form).html(data);
					console.log($(this));
					current_link.parent().append(form);
				}
			})

		} else {

			$(form).toggle();

		}

	})

};