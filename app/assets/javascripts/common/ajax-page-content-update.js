function ajax_page_content_update(url) {
	
	if ( !url ) { return }

	var content = $('#content-main');

	$(content).children().fadeOut('fast');

	setTimeout( function() {

		$(this).empty()
		
		$.ajax({
			url: url,
			data: { layout : false }, // this parametr provides no layout rendering	
			method: 'GET',
			dataType: 'html',
			cache: false,
			beforeSend: function() 
			{

				// removing pop-up windows and hint messages
				$(window).trigger('close_popup promt-destroy'); 
	
				$('#content-main').simple_progress_bar();

			},
			success: function(data, textStatus, jqXHR) 
			{

				setTimeout( function() 
				{	

					// обновление урл в адресной строке
					//	replacing current url to link url

					var new_url = url.replace('&layout=false' , '');

					history.replaceState( 'data', '', new_url );

					$(content).html( data );
					
				}, 1000 )
			},
			error: function(data) {

				$('#content-main').simple_progress_bar('remove', { callback : function() {
					$(content).children().fadeIn('fast');
				}})


			} 

		})  

	} , 200 )

}	