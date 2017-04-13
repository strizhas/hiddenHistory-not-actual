var Building_schema = function() {

	this.settings = {
		viewBox_itit_params   : [ -100, 0, 800, 354 ],
		viewBox_actual_params : [],
		scale_delta		      : 150,
		zoom_level 			  : 0,
		zoom_level_max 		  : 3,
		img_dragging 		  : false, // img marker dragging status
		token 				  : '',    // authenticity token
		edit_mode 			  : false,
		current_type		  : 'Photo',
		current_year		  : null
	};

	var schema = this

	schema.schema_svg = d3.select('#schema-main-container').select('svg');

	if ( !schema.schema_svg ) { return; }


	var scale_up   = d3.select('#scale-up-button');
	var scale_down = d3.select('#scale-down-button');

	var photo_marker_collection = {}
	var guide_marker_collection = {}

	var show_markers_by_year = function(year) {

		var collection = select_collection( schema.settings.current_type );


		if ( schema.settings.current_year == year ) {

			for ( var index in collection ) {

				collection[index].show();

			}

			schema.settings.current_year = null;

			return;

		}


		schema.settings.current_year = year;


		for ( var index in collection ) {

			if ( collection[index].params['year'] == year ) {

				collection[index].show();

			} else {

				collection[index].hide();
			}

		}

	};

	var select_collection = function(type) {

		var collection;

		switch ( type ) {
			case 'Photo':
				collection = photo_marker_collection;
				break;
			case 'Guide':
				collection = guide_marker_collection;
				break;

		}

		return collection;		


	};

	var hide_collection = function( collection ) {

		for ( var index in collection ) {

			collection[index].hide()

		}

	};

	var show_collection = function( collection ) {

		for ( var index in collection ) {

			collection[index].show()

		}


	};


	// Функция добавляет в массив маркеры, выделенные пользователем
	var get_selected_markers = function() {

		var collection = select_collection( schema.settings.current_type )

		var selected = []

			for ( var index in collection ) {

				if ( 'selected' in collection[index].params && 
					collection[index].params['selected'] == true ) 
				{
						
					selected.push( collection[index] );

				}

					
			}

		return selected

	};

	var find_marker_and_action = function( type , id, action ) {

		var collection, selected_marker;

		switch ( type ) {
			case 'Photo':
				collection 	 = photo_marker_collection;
				parent_param = 'photo_id';
				break;
			case 'Guide':
				collection = guide_marker_collection;
				parent_param = 'guide_id'
				break;

		}

		for ( var index in collection ) {

			if ( collection[index].params[ parent_param ] == id ) {

				collection[index][action]();
				return true;

			}

		}

		return false;

	};

	var add_photo_markers_to_schema = function(data) {

		// объект, в котором будут уникальные года. Он необходим
		// для построения меню сортировки по году
		var marker_dates = [];	
		var null_year_added = false;

		for ( var i=0 ; i < data.length ; i++ ) {

			// если задан год, то проверяем, есть ли он уже в объекте marker_dates
			if (  data[i]['year']  != null ) {
													
			// если нет, то добавляем и генерируем для него цвет
			if (   marker_dates.indexOf(data[i]['year']) === -1 )
				{	
					marker_dates.push( data[i]['year'] ); 
				}

			} else {

				data[i]['year'] = 'null'

				// Добавляем в массив null ( соотвествует фотографиям без даты)
				if ( null_year_added == false )
					{	
											
						marker_dates.push( 'null' ) 
						null_year_added = true
											
					}

				}


			data[i]['parent'] = schema.schema_svg;

			var new_marker = new Schema_photo_marker( data[i] );

			photo_marker_collection[ data[i]['id'] ] = new_marker;

		}

						
		schema.year_menu = new Schema_year_menu( marker_dates, show_markers_by_year )

		schema.svg_container.node().appendChild( schema.year_menu.container )

	};

	var add_guide_markers_to_schema = function(data) {

		for ( var i=0 ; i < data.length ; i++ ) {

			data[i]['parent'] = schema.schema_svg;

			var new_marker = new Schema_guide_marker(data[i]);

			guide_marker_collection[ data[i]['id'] ] = new_marker;

		}

	};


	var load_markers_by_ajax = function( type , callback ) {

		switch( type ) {

	    	case 'Photo':
	    		var url = window.location.href + '/load_photo_markers'
	    		break;
	    	case 'Guide':
	    		var url = window.location.href + '/load_guide_markers'
	    		break;
	    	default:
	    		return;
	    }

		

		$.ajax({

			url: url,
			method: 'POST',
			dataType: 'json',
			cache: false,
			success: function(data, textStatus, jqXHR) 
			{

				if ( typeof(callback) === 'function') {
					callback(data);
				}
				

			}

		});

	};



		this.init = function( ) {
			console.log('schema init')
			console.log( schema.schema_svg)

			var container = document.getElementById('schema-main-container')
			var container_width = container.offsetWidth
			var container_height = container.offsetHeight

			console.log( container_width  )

			schema.schema_svg.node().style.width = container_width + 'px'
			schema.schema_svg.node().style.height = container_height + 'px'


					schema.settings.viewBox_actual_params = schema.settings.viewBox_itit_params 

					schema.schema_svg
						.attr( 'width',   740 )
						.attr( 'height',  524 )
						.attr( 'viewBox' , schema.settings.viewBox_itit_params.join(' ') )
						.attr( 'enable-background' , 'new ' + schema.settings.viewBox_itit_params.join(' ') )

					var defs = schema.schema_svg.insert("defs",":first-child")

					var pattern = defs.append("pattern")
						.attr( "id", "gridpattern" )
						.attr("width" , 140 )
						.attr("height" , 140 )
						.attr( "fill-opacity" , 0 )
						.attr("patternUnits", "userSpaceOnUse")

					var cell_group = pattern.append("g")

					// creating main grid rectangle
					cell_group.append("rect")
						.attr("width" , 140 )
						.attr("height" , 140 )
						.attr( "stroke", "#d1d1d1" )
						.attr( "stroke-width", 2 )

					// creating small grid cells	
					for ( var row=0; row<10; row++ ) {
						for ( var col=0; col<10; col++ ) {
							cell_group.append("rect")
								.attr( "height" , 14 )
								.attr( "width" , 14 )
								.attr( "stroke-width", 1 )
								.attr( "stroke", "#d1d1d1" )
								.attr( "transform" , "translate( " + col*14 + ", " + row*14 + ")")
						}		
					}


					schema.schema_svg
						.insert('rect',":first-child")
						.attr( "x", "-3000")
						.attr( "y", "-3000" )
						.attr( "width",  "9999" )
						.attr( "height", "9999" )
						.attr( "fill" , "url(#gridpattern)" )

					




					schema.svg_container = d3.select('#schema-main-container')

					console.log(schema.svg_container)


					schema.svg_container.on('mousedown', function(event) {

						if ( schema.settings.img_dragging == true ) {
							return false;
						}


						var start_offset_x = d3.event.pageX
						var start_offset_y = d3.event.pageY

						var start_dx = schema.settings.viewBox_actual_params[0]
						var start_dy = schema.settings.viewBox_actual_params[1]

						schema.svg_container.on('mousemove' , function(event) { 


							schema.settings.viewBox_actual_params[0] = start_dx + start_offset_x - d3.event.pageX // delta x
							schema.settings.viewBox_actual_params[1] = start_dy + start_offset_y - d3.event.pageY // delta y

							schema.schema_svg.attr('viewBox' , schema.settings.viewBox_actual_params.join(' '))

						})

						schema.svg_container.on('mouseup', function() {
							schema.svg_container.on('mousemove mouseup' , null )
						})

					});


					scale_up.on('click', function() {

						if ( schema.settings.zoom_level + 1 >= schema.settings.zoom_level_max ) { return; }

						var viewBox_new_params = []

						console.log(schema.settings.viewBox_actual_params)

						viewBox_new_params[0] = schema.settings.viewBox_actual_params[0] + schema.settings.scale_delta / 2
						viewBox_new_params[1] = schema.settings.viewBox_actual_params[1] + schema.settings.scale_delta / 2
						viewBox_new_params[2] = schema.settings.viewBox_actual_params[2] - schema.settings.scale_delta
						viewBox_new_params[3] = schema.settings.viewBox_actual_params[3] - schema.settings.scale_delta

						console.log(viewBox_new_params)

						schema.schema_svg
							.attr( 'viewBox', schema.settings.viewBox_actual_params.join(' ') )
							.transition()
							.duration(1000)
							.attr( 'viewBox', viewBox_new_params.join(' ') )

						schema.settings.viewBox_actual_params = viewBox_new_params
						schema.settings.zoom_level++

					});

					scale_down.on('click', function() {


						var viewBox_new_params = []

						viewBox_new_params[0] = schema.settings.viewBox_actual_params[0] - schema.settings.scale_delta / 2
						viewBox_new_params[1] = schema.settings.viewBox_actual_params[1] - schema.settings.scale_delta / 2
						viewBox_new_params[2] = schema.settings.viewBox_actual_params[2] + schema.settings.scale_delta
						viewBox_new_params[3] = schema.settings.viewBox_actual_params[3] + schema.settings.scale_delta

						schema.schema_svg
							.attr( 'viewBox', schema.settings.viewBox_actual_params.join(' ') )
							.transition()
							.duration(1000)
							.attr( 'viewBox', viewBox_new_params.join(' ') )

						schema.settings.viewBox_actual_params = viewBox_new_params
						schema.settings.zoom_level--
						
					});


					load_markers_by_ajax( 'Photo' , function(data) { add_photo_markers_to_schema(data) })


		

			};

			this.load_guide_markers = function() {

				load_markers_by_ajax( 'Guide' , function(data) { add_guide_markers_to_schema(data) })

			}



			this.add_marker = function( type, params ) {

				if ( !params || !type ) { return; }

				var new_marker, collection; 

				params['parent'] = schema.schema_svg

				switch ( type ) {
					case 'Photo':
						new_marker = new Schema_photo_marker( params );
						break;
					case 'Guide':
						new_marker = new Schema_guide_marker( params );
						break
					default:
						break;

				}

				collection = select_collection(type);

				collection[ params['id'] ] = new_marker;

				return new_marker	

			};

			this.delete_selected_markers = function( id ) {

				var selected_markers = get_selected_markers()

				console.log(selected_markers)

				for ( var index in selected_markers ) {

					selected_markers[index].destroy()
				}

			};

			this.select_marker = function( type, id ) {


				find_marker_and_action(type, id, 'select');
				

			};

			this.drop_marker = function( type, id ) {

				find_marker_and_action(type, id, 'marker_drop');
				
			};

			this.show_marker_by_type = function( type ) {

				switch ( type ) {
					case 'Photo':
						hide_collection( guide_marker_collection );
						show_collection( photo_marker_collection );
						break;
					case 'Guide':
						hide_collection( photo_marker_collection );
						show_collection( guide_marker_collection );
						break
					default:
						return;
						break;

				}

				schema.settings.current_type = type


			};


			this.edit_mode = function( status ) {

				switch ( status ) {

					case true:

						var token = document.getElementsByName('authenticity_token')[0]
	
						if ( typeof(token) != 'undefined' ) {
							schema.settings.token = token.value
							schema.settings.edit_mode = true
						}

						break;

					case false:

						schema.settings.edit_mode = false
						break;

					default:
						break;

				}

			}


	


};