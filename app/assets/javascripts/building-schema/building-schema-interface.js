
Building_schema_interface = function() {

	var interface = this

	var elements = {}

	interface.menus = {}

	this.init = function() {

		initialize();
	}

	// по умолчанию при нажатии на кнопку edit сразу загружаются
	// неотмеченные на схемы фотографии
	var Edit_button = function() {

		this.button = $('#schema-edit-button');

		this.bind_click = function() {


			$( this.button ).off('click' )

			$( this.button ).on('click' , function() {

				var that = this

				for ( var menu in interface.menus ) {

					interface.menus[menu].turn_on_edit_mode()
				}

				$(that).replaceWith( elements.ready_button.button )

				elements.delete_marker_button.animateIn();
				elements.ready_button.bind_click()


				hiddenHistory.schema.edit_mode(true)
					

			});

			$(this.button).promt_builder('редактировать схему')
		
		}
		

	};


	var Ready_button = function() {

		this.button = document.createElement('div')
		
		$(this.button).attr('id' , 'schema-ready-button' )

		this.bind_click = function() {

			// removing previosly binded event functions
			$( this.button ).off('click' )

			// binding new functions
			$(this.button).on('click' , function() {


				for ( var menu in interface.menus ) {

					interface.menus[menu].turn_off_edit_mode();
				}

				hiddenHistory.schema_promt.fadeOut();

				$(this).replaceWith( elements.edit_button.button );

				hiddenHistory.schema.edit_mode(false);

				elements.edit_button.bind_click();
					
				interface.menus.guides.add_content_button.animateOut();

				elements.delete_marker_button.animateOut();
					



			})

			$(this.button).promt_builder('вернуться к просмотру')

		}

	};


	var Content_menu = function() {

		var that = this

		this.wrapper	 = $('#schema-menu-main-conteiner')
		this.active 	 = false
		this.edit_mode 	 = false
		this.edit_menu_loaded = false

		this.fadeIn = function(callback) {

			that.active = true

			$('#schema-menu-titles').children().removeClass('active');

			for ( var menu in interface.menus ) {

				if ( interface.menus[menu] != that ) {
					interface.menus[menu].fadeOut()
				}

			}

		
			setTimeout( function() {

				$(that.container).fadeIn('fast')

				if (typeof(callback) === 'function') {
					callback()
				}

			}, 150 )


			hiddenHistory.schema.show_marker_by_type( that.type )

			$(that.button).addClass('active')

			if ( that.edit_mode == true ) {

				that.show_button()

			}

		};

		this.fadeOut = function() {

			$( that.container ).fadeOut('fast')

			console.log( $( that.add_content_button ) )
			$( that.add_content_button.button ).hide()

			that.active = false

		};

		this.show_button = function() {

			if ( that.edit_mode == false ) {
				return;
			}


			for ( var menu in interface.menus ) {

				if ( interface.menus[menu].active == true ) {

					if ( that.add_content_button.active == false ) {

						that.add_content_button.animateIn();

					} else {

						$(that.add_content_button.button).show()
					}

					continue

				}

				var button = interface.menus[menu].add_content_button.button

				$(button).hide()


			}

		}

		this.turn_on_edit_mode = function() {

			that.edit_mode = true

			that.show_button()

			// creating gallery if it wasn't been created earlier
			if ( that.edit_menu_loaded == false ) {

				// создает галлерею с неотмеченными фотографиями
				that.load_edit_menu()

				return

			}

			that.toggle_view()



		};

		this.turn_off_edit_mode = function() {

			that.edit_mode = false

			that.add_content_button.animateOut();

			that.toggle_view()
	
		};



	};



	var Photos_menu = function() {

		Content_menu.call(this); // отнаследовать

		this.container = $('#schema-photos-conteiner')

		this.button = $('#schema-photos-title')

		this.type = 'Photo'

		this.active = true

		this.add_content_button = new Add_photo_button()

		this.others_hidden = false;

		var that = this

		this.init = function() {


			$(that.button).on('click' , function() {

				that.fadeIn();

			})

			that.show_area = $('<div>').addClass('schema_photos_list')

			$(that.container).append( that.show_area )

			var url = hiddenHistory.schema_URL + '/load_placed_photos'

			load_schema_photos( url, that.show_area, that.add_figures_to_show_area )

			return 

			

		};


		this.load_edit_menu = function() {


			that.show_area.fadeOut( 'fast', function() {

				var url = hiddenHistory.schema_URL + '/load_unplaced_photos'

				that.edit_area = $('<div>').addClass('schema_photos_list').appendTo(that.container)

				load_schema_photos( url, that.show_area, that.add_figures_to_edit_area )

				that.add_content_button.init( that )

				that.edit_menu_loaded = true

			})


		};

		this.add_figures_to_show_area = function( data ) {

			var container = that.show_area

			var callback = get_event_callbacks()

			convert_json_in_figures(data, container, callback )

			

		};


		this.add_figures_to_edit_area = function(data) {

			var container = that.edit_area

			var callback = { 'mousedown' : schema_photo_drag_and_drop }

			convert_json_in_figures( data, container, callback )

		};



		this.toggle_view = function() {


			if (  that.edit_mode == false ) {

				fadeIn_show_area();

				return

			}

			fadeIn_edit_area()


		};

		// удаление элемента из области просмотра по его id
		this.remove_figure_by_id = function(id) {

			var element_id = '#icon-figure-' + id;

			$(this.show_area).find( element_id ).remove();

		}

		var fadeIn_show_area = function() {


			$(that.edit_area).fadeOut('fast', function() {
				$(that.show_area).fadeIn('fast')
			})
		}

		var fadeIn_edit_area = function() {

			$(that.show_area).fadeOut('fast', function() {

				$(that.edit_area).fadeIn('fast');


				// когда пользователь загружает новые фотографии
				// все имеющиеся в edit-разделе скрываются
				// Если пользователь переключает в режим просмотра,
				// а потом опять в режим редактирования, то все 
				// фотографии появляются
				if ( that.others_hidden == true ) {

					$(that.edit_area).find('figure').fadeIn('fast');

					that.others_hidden = false;

				}

			})

		}

		var load_schema_photos = function( url, container, callback ) {

			$.ajax({

				url: url,
				method: 'POST',
				dataType: 'json',
				cache: false,
				beforeSend:  function() {		

					$(container).simple_progress_bar('create', {progress_bar_type : 'gray-circle-bar'})

				},
				success: function(data, textStatus, jqXHR) 
				{	

					$(container).simple_progress_bar('remove')

					if ( typeof(callback) === 'function') {
						callback(data)
					}

					
				},
				error: function() {
					$(container).simple_progress_bar('remove')
				}

			});

		}

		var get_event_callbacks = function() {

			var callback = {

				'click' : function( e ) {

					var id = $(this).data('id');

					elements.schema_lightbox.fullsize_image_loading( id );

					return;

				},
				'mouseenter' : function( e ) {

					hiddenHistory.schema.select_marker( 'Photo' , $(this).data('id') );

					return;
				},
				'mouseout' : function( e ) {

					hiddenHistory.schema.drop_marker( 'Photo', $(this).data('id') );

					return;

				}
			}

			return callback

		}


		var schema_photo_drag_and_drop = function( e) {

			e.preventDefault();
			
			var img  	= this;
			var img_id  = $(img).data('id');
			var figure 	= $(img).parent().parent();


			return (function() {

				$(img).addClass('schema-thumb-selected')
				$(img).on('dragstart', function(event) { event.preventDefault(); });


				var ready_to_drop  = false
				var marker_created = false


				var marker = ''

				var container_top_offset  = $('#schema-svg-section').offset().top 
				var container_left_offset = $('#schema-svg-section').offset().left


				

				$(window).bind('mousemove' , function(e) {


					if ( e.pageX > container_left_offset && e.pageY > container_top_offset ) {

						ready_to_drop = true;


						if ( marker_created == false ) {

							var marker_params = { 
													'photo_id'	: img_id,
													'year'		: $(img).data('year')
												}; 


							marker = hiddenHistory.schema.add_marker( 'Photo' , marker_params )

							marker.scale();
							marker.select();
							marker.move( e.pageX  , e.pageY );

							marker_created = true;

						} else {

							marker.move( e.pageX  , e.pageY );

						}


					} else {

						ready_to_drop = false;

					}

				});

				$(window).on('mouseup' , function(e) {

					$(window).off('mouseup')
					$(window).unbind('mousemove')

					if ( ready_to_drop == true ) {


						marker.update( 'create' )
						
						marker.marker_drop()

						$(figure).toggle('scale' , function() {

							$(figure).appendTo(that.show_area).toggle('scale');

							var callback = get_event_callbacks()

							$(img).off('mousedown')
							$(img).on(callback)


						})


						hiddenHistory.schema.year_menu.add_year( $(img).data('year') )
						
					} else {

						if ( marker_created == true ) {

							marker.destroy()
							
						}

					}

					$(img).removeClass('schema-thumb-selected')

				});

			})(jQuery)

		};



	}; 


	var Guides_menu = function() {

		Content_menu.call(this); // отнаследовать

		var that = this

		this.container  = $('#schema-guides-container')
		this.button 	= $('#schema-guides-title')
		this.type 		= 'Guide'

		this.add_content_button = new Add_guide_button()

		var loaded = false
		var markers_loaded = false

		this.init = function() {

			$(that.button).on('click' , function() {

				if ( markers_loaded == false ) {

					hiddenHistory.schema.load_guide_markers();

					markers_loaded = true;
				
				}

				that.fadeIn( function() {

					if ( that.edit_mode == true ) {

						that.load_edit_menu();

						return;
					}

					if ( loaded == false ) {

						load_guides();
					
					}


				})

			})

		};

		this.toggle_view = function() {

			return;
		}

		this.load_edit_menu = function() {

			if ( loaded == false ) {

				load_guides( );

				return;

			}


		};

		this.remove_figure_by_id = function(id) {

			var element_id = '#guide-link-' + id;

			$(element_id).parent().remove();

		};

		this.add_guide = function(params) {

			var li  = $('<li>');
			var a 	= $('<a>');

			$(a).attr('href', params.url )
				.attr('id', 'guide-link-' + params.id )
				.text( params.title )
				.data('id' , params.id);

			if ( params.number != null ) {

				var num = $('<span>').addClass('schema-guide-number')
									 .text( params.number )
									 .appendTo(li)

			}
			

			$(li).append( a);
			
			$(that.guide_list).append(li);

			bind_mouse_events_in_item(li);

		};


		var load_guides = function( callback ) {

			loaded = true

			var url = hiddenHistory.schema_URL + '/load_guides'

			$.ajax({

				url: url,
				method: 'POST',
				dataType: 'json',
				cache: false,
				beforeSend:  function() {

					that.show_area = $('<div>').addClass('schema_guides_list')

					$(that.container).append( that.show_area )

					$(that.show_area).simple_progress_bar('create', {progress_bar_type : 'gray-circle-bar'})

				},
				success: function(data, textStatus, jqXHR) 
				{	

					$(that.show_area).simple_progress_bar('remove');
					
					create_guides_list( data  );


				},
				error: function() {

					$(that.show_area).simple_progress_bar('remove');

				}

			});

		};

		var create_guides_list = function(data) {

			that.guide_list = $('<ul>').appendTo(that.show_area);

			for ( var elem in data ) {

				that.add_guide(data[elem]);

			}

		};

		var schema_remote_file_upload = function() {

		    var input = $('#image-input-field');
		    var gallery = $('#photo-load-section');
		    var url = $(input).closest('form').attr('action')

		    $(input).off('change');

		    $(input).on('change', function(event) {

		        ajax_file_upload(event.target.files, url, gallery, add_images_to_gallery )

		    });

		    var add_images_to_gallery = function( data ) {

		        $( that.params.gallery ).append( data )
		             
		    }; 

		};

		var bind_mouse_events_in_item = function(li) {

			var a = $(li).find('a').eq(0);

			$(li).on('mouseenter' , function() {

				hiddenHistory.schema.select_marker( 'Guide' , $(a).data('id') );

			})

			$(li).on('mouseleave' , function() {

				hiddenHistory.schema.drop_marker( 'Guide' , $(a).data('id') );

			})

			$(li).on('click' , function(e) {

				e.preventDefault();

				if ( that.edit_mode == true ) {

					hiddenHistory.schema_item = new Guide_edior();
					
					hiddenHistory.schema_item.edit_guide( $(a).data('id') );

					return	
				}
					
				hiddenHistory.schema_item = new Schema_show_guide(  $(a).data('id')  );


			})

		}


	};

	/*  функция преобразовыввает GET-параметры
	в объект и в зависимости от его значений может
	загрузить окно с фотографией или отметкой
	*/
	var parse_url = function() {

		var start_url  = window.location.href;
		var get_params = start_url.substr(start_url.indexOf("?") + 1).split('&');
		var params_obj = {};


		hiddenHistory.schema_URL = start_url.split('?')[0]


		for ( i in get_params ) {

			var param = get_params[i].split('=');

			params_obj[ param[0] ] = param[1];
			
		}

		if ( params_obj.hasOwnProperty('guide')) {

			hiddenHistory.schema_item = new Schema_show_guide( params_obj['guide']  );
			return;

		}

		if ( params_obj.hasOwnProperty('photo')) {
			
			hiddenHistory.schema_item = new Schema_show_photo( params_obj['photo'] );
			return;
		}



	};



	
	var initialize = function() {

		// Проверяем URL на наличие GET-параметров
		parse_url();

		// creating new lighbox, in which fullsize images will be showen
		elements.schema_lightbox = new Schema_lightbox();
		elements.schema_lightbox.init();


		// we use timeout function, because schema didn't appears emmideatly, so if we'll
		// try to call promt_builder, message will be placed in the document left top corner
		setTimeout( function() {
			
			$('#schema-settings-button').promt_builder('параметры схемы')
			
		} ,300)


		// Инициализируем кнопки "редактировать", "готово"
		// и кнопку "удалить маркер"
		elements.edit_button  = new Edit_button();
			
		elements.edit_button.bind_click();

		elements.ready_button  = new Ready_button();

		elements.delete_marker_button = new Delete_marker_button();


		// инициализируем меню фотографий и отметок
		interface.menus.photos = new Photos_menu();

		interface.menus.photos.init();

		interface.menus.guides = new Guides_menu();

		interface.menus.guides.init();


		
		


	}




};