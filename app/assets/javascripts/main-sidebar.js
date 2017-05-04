;Sidebar_menu = function() {

	var sidebar 	 = $('#main-sidebar')
	var toggleButton = $('#sidebar-menu-toggle')

	var settings = {
					sidebar_fix_on_scroll : true,
					hidden	: false
					}


	var sidebar_obj = this

	var init_sidebar = function() {

		$(window).on('photo-gallery-start' , function() {
			create_photos_menu();
			 add_active_class_to_sidebar( $('#sidebar-photo-content') )
		});

		$(sidebar).mouseenter(function(event) {
                        $('body').css('overflow', 'hidden');
        }).mouseleave(function(event) {
                        $('body').css('overflow', '');
        });


		$(window).on('change_content_area', function() {
			calculate_heights()
		})

		$(window).on('scroll' , function() {
			fixSidebar()
		})


		$(window).on('shema-block-start' , function() {
		    add_active_class_to_sidebar( $('#sidebar-schema-content') )
		});
		

	};

	var update_sidebar = function() {

		sidebar 		 = $('#main-sidebar')
		links_collection = $('#sidebar-main-navigation').find('.remote-link')
		toggleButton 	 = $('#sidebar-menu-toggle')

		calculate_heights();


		$(links_collection).off('click')

		$(links_collection).on( 'click' , function(event) {

			event.preventDefault()

			bind_click_on_links(this)

		})

		$(toggleButton).off('click');

		$(toggleButton).on('click', function() {
			sidebarFade()
		});


		if (window.sessionStorage ) {
			
			var hidden = sessionStorage.getItem('sidebar_hidden' );

			if ( hidden == 'true') {

				hide_sidebar()

			}

		}

		// загрузка вложенного меню с содержанием статьи
		if ( $('#article-main').length > 0 )  { 

			apply_content_menu_to_sidebar()

		    add_active_class_to_sidebar( $('#sidebar-article-content') )
 

		}

		if ( $('#building-photo-main').length > 0 )  { 

			create_photos_menu();

		}

		

	};


	var load_and_append_photos_menu = function() {

		var url = window.location.href;

		url = url.split("?")[0];

		url += '/load_photos_menu';

		$.ajax({
					
			url: url,
			method: 'POST',
			dataType: 'HTML',
			cache: false,
			success: function(data, textStatus, jqXHR) 
			{
				var schema_menu_list = $('#sidebar-photo-content')

				if ( typeof(schema_menu_list) === 'undefined' ) { return; }

				$(schema_menu_list).append(data)

				var new_menu = $(schema_menu_list).find('ul')[0]

				if ( $(new_menu).is(':hidden') ) {
					$(new_menu).toggle('fast')
				}

				$(new_menu).attr('id' , 'photo-years-submenu')

				update_sidebar()

			},
			error: function(data) {

			} 

		})  			

	};

	function add_active_class_to_sidebar ( content_link ) {

	    $(content_link)
	        .addClass('active-tree')
	        .find('a')
	            .eq(0).addClass('active-link'); 

	};


	var calculate_heights = function() {


			// calculate heights of the main blocks

			settings.article_height = $('#article-main').outerHeight(true);	
			settings.content_height = $('#content-main').outerHeight(true);
			settings.sidebar_height = $(sidebar).outerHeight(true);
			settings.window_height  = $(window).outerHeight(true);


	};

	var fade_in_sidebar = function() {

		$('#sidebar-content').children().fadeIn();

		$('#main-wrapper').animate({'margin-left' : '300'}, 300, 'swing');
		
		$(sidebar).animate({width: 300}, 300, 'swing');

		$('#sidebar-content').animate({width: '300px'});

		$('#sidebar-title').show();

		settings.hidden = false;

	};

	var fade_out_sidebar = function() {

		console.log('fade_out_sidebar');

		$('#sidebar-content').children().hide();

		$('#sidebar-content').animate({width: 0});

		$(sidebar).animate({width: '60px'});

		$('#sidebar-title').hide();

		$('#main-wrapper').animate({'margin-left' : '60px' }, 300, 'swing');

		settings.hidden = true;

	}

	var hide_sidebar = function() {

		$('#sidebar-content').children().hide();
		$('#sidebar-content').css('width' , 0);
		$('#sidebar-title').hide();
		$('#main-wrapper').css('margin-left' , '60px' );

		$(sidebar).css('width' , '60px');
		settings.hidden = true;

	}

	var sidebarFade = function() {


		if ( settings.hidden == false ) {

			fade_out_sidebar();

			if (window.sessionStorage ) {
				sessionStorage.setItem('sidebar_hidden' , 'true' );
			}


		} else {

			fade_in_sidebar();

			if (window.sessionStorage ) {
				sessionStorage.setItem('sidebar_hidden' , 'false' );
			}

		}

	}; 

	var bind_click_on_links = function( selected_link ) {

			var selected_link = $(selected_link);
				 	
			var parent_li = selected_link.parent(); 

			if ( !$(this).hasClass('active-link') ) 
				{
					$(sidebar).find('.active-link').removeClass('active-link');
					$(selected_link).addClass('active-link');

				} 

			var active_tree = $(sidebar).find('.active-tree');

			if ( $(active_tree).find('.active-link').length == 0 ) 
				{
					active_list = $(active_tree).find('ul')[0];
					$(active_tree).removeClass('active-tree');
					$(active_list).slideToggle('fast');
				}

			$(parent_li).addClass('active-tree');

			var list = $(parent_li).find('ul');
			
			if ( !$(list).is(':visible') ) {
					$(list).slideToggle('fast');
			}


			url = selected_link.attr('href');
				
			ajax_page_content_update( url );


	};

	apply_content_menu_to_sidebar = function() {

		var pageScroll = function( id ) {

			var  $target = $(id);

			$('html, body').stop().animate({ 'scrollTop': $target.offset().top}, 500, 'swing', function() {
				window.location.hash = id;
			});

		};



		return ( function() { 

			var n=0

			var article = $('#article-main');
			var h3 = $(article).find('h2,h3');
			var parent_li = $('#sidebar-article-content');

			console.log('work');
			if ( h3.length == 0 || parent_li.length <= 0 ) { return; }

			console.log(h3.length);

			$(parent_li).find('ul').remove();

			var content_ul = document.createElement('ul');

			$( parent_li ).append( content_ul );


			for ( var n=0; n<h3.length; n++ ) {

					var header = $(h3)[n];
						header = $(header)[0]; 

			  		target = $(article).find( $(header) );
			  		$(target).attr('id','article-header-' + n);

			  		var li_el = document.createElement('li');
			  		var lnk   = document.createElement('a');

			  		$(lnk)
			  			.attr('id','self-scroll-link-' + n )
			  			.attr('href','#article-header-' + n)
			  			.text( $(header).text() );

			  		if ( $(header).is('h3') ) {

			  			// add special style for subheaders
			  			$(lnk).addClass('subheader');

			  		}

			  		$(li_el).append(lnk);	
			  		$(content_ul).append(li_el);
			  		

			}

			// function for smooth page scrolling	
			$('a[href^="#"]').on( 'click.smoothscroll', function(event) {

				    event.preventDefault();

				    var target_id = $(this).attr('href');
				    
				    pageScroll(target_id);

			  });	

			$(content_ul).slideToggle('fast');


		})( jQuery );

	};


	var create_photos_menu = function() {


			// if this menu hasn't been created yet, 
			// creating new one
			if ( $('#photo-years-submenu').length == 0 ) {

				load_and_append_photos_menu();

				return

			}

			console.log(' ckip loading')
			// if it existing, just make it visible
			if ( $('#photo-years-submenu').is(':hidden') ) {

				$('#photo-years-submenu').toggle('fast');

			}

	};

	var fixSidebar = function() {

		if ( settings.sidebar_fix_on_scroll == false ) { return }

		var top = $(window).scrollTop();

			

			  	
			if ( top >= 60 ) {

			  	$(sidebar).css({'position' : 'fixed' , 'top' : 0 });

			} else {

			  	$(sidebar).css({'position' : 'relative' , 'top' : 0 });

			}
	}


	return {


		init : function() {

			init_sidebar();
			update_sidebar();


		},

		update : function() {

			update_sidebar();

		}


	};

};