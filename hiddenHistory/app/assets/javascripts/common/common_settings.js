
// here would be different statements variables, such as pop-up active state and etc
window.global_settings = {}


// popup activate global statement

$(window).on('popup_activate', function() {
	console.log('popup_activate')
	window.global_settings.popup = true
});

$(window).on('close_popup', function() {
	setTimeout( function() { 
        window.global_settings.popup = false
    } , 100 )
});

$(window).on('keydown', function(e) {
    if ( e.keyCode == 27 ) {    
        console.log('trigger keydown')        
        $(window).trigger('close_popup')
                 
	}
});







$(window).on( 'load', function() {
    $(window).trigger('change_content_area')
})

$('#content-main').on('change' , function() {
    $(window).trigger('change_content_area')
});