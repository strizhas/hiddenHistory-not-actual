
function bind_add_subcategory_event() {

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

}

Admin_sidebar = function() {

	var sidebar = $('#admin-sidebar');
	var top = $(window).scrollTop();

	if ( top >= 64 ) {

		$(sidebar).css({'position' : 'fixed' , 'top' : 0 });

	} else {

		$(sidebar).css({'position' : 'relative' , 'top' : 0 });

	}

}
		
