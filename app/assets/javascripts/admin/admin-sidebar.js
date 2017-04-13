function bind_admin_sidebar_functions() {

	var sidebar = $('#admin-sidebar');
	var top = $(window).scrollTop();

	if ( top >= 64 ) {

		$(sidebar).css({'position' : 'fixed' , 'top' : 0 });

	} else {

		$(sidebar).css({'position' : 'relative' , 'top' : 0 });

	}

};
		
