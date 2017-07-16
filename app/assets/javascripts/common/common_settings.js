
$(window).on('popup_activate', function() {

	hiddenHistory.global_settings.popup = true;

});

$(window).on('close_popup', function() {

	setTimeout( function() { 

        hiddenHistory.global_settings.popup = false;

    } , 100 )

});

$(window).on('keydown', function(e) {
    if ( e.keyCode == 27 ) {    
      
        $(window).trigger('close_popup');
                 
	}
});


$(window).on( 'load', function() {
    $(window).trigger('change_content_area')
})

$('#content-main').on('change' , function() {
    $(window).trigger('change_content_area')
});