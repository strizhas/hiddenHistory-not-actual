var Schema_marker = function( ) {

		// default params
		this.params = {
			radius   : 4,
			coord_x  : 0,
			coord_y  : 0
		};


};

Schema_marker.prototype.move = function( page_x, page_y ) {

	var svg = this.params['parent'].node()

					function svgPoint(element, x, y) {
  
					  var pt = svg.createSVGPoint();
					  pt.x = x;
					  pt.y = y;
					  return pt.matrixTransform(element.getScreenCTM().inverse());
					  
					}


		svgP = svgPoint( svg , page_x, page_y - $(window).scrollTop() ),


	// обновляем параметры маркера
	this.params.coord_x = svgP['x']
	this.params.coord_y = svgP['y']

	// выполняем перемещение с помощью transform translate
	this.marker.attr('transform' , 'translate( ' + svgP['x'] + ' ' + svgP['y'] +  ')')

};

Schema_marker.prototype.destroy = function(  ) {

	// удаляем маркер из DOM
	this.marker.remove()

	if ( typeof( this.params.id ) !== 'undefined' ) {

		this.update('destroy'); 
	}
	
	// удаляем объект
	delete this

};

Schema_marker.prototype.hide = function(  ) {

	this.marker.selectAll("circle")
				.style("opacity", 0)

};

Schema_marker.prototype.show = function(  ) {

	this.marker.selectAll("circle")
				.style("opacity", 1)


};

Schema_marker.prototype.select = function(  ) {

	this.marker.selectAll("circle")
					.attr( "fill" , "#302d2a")

	this.params['selected'] = true

};

Schema_marker.prototype.marker_drop = function(  ) {

	this.marker.selectAll("circle")
					.attr( "fill" , this.params.color)

	this.params['selected'] = false

	console.log('marker drop')

};

Schema_marker.prototype.update = function( action) {

	if ( typeof(action) == 'undefined' ) {
		action = 'update'
	}

	var marker_id = this.params.id
	var token = building_schema.settings.token

    if ( typeof( token ) == 'undefined' || token == '' ) 
    { 
    	return; 
    }



    switch( action ) {

    	case 'update':
    		var method = 'PATCH'
    		var url = window.location.href + '/' + this.model_name + '_' + action + '/' +  marker_id
    		break;
    	case 'create':
    		var method = 'POST'
    		var url = window.location.href + '/' + this.model_name + '_' + action + '/'
    		break;
    	case 'destroy':
    		var method = 'POST'
    		var url = window.location.href + '/' + this.model_name + '_' + action + '/' +  marker_id
    		break;
    	default:
    		return;
    }

    var that = this

    console.log('ajax request start')


	$.ajax({
                url: url,
                method: method,
                dataType: 'json',
                cache: false,
                data: that.return_ajax_params(),
                beforeSend: function(xhr) 
                {
                    xhr.setRequestHeader( 'X-CSRF-Token' , token )
                    console.log('before send')

                },
                success: function(data, textStatus, jqXHR) 
                {

                    schema_promt.flash('схема обновлена');

                    // если маркер был создан, то мы должны узнать его id
                    // для этого сервер отправляет ответ в виде актуального id
                    if ( action == 'create' ) {

                    	that.params.id = data.id

                    }

                                    
                },
                error: function(data) {
                	console.log('ajax  error')
                	console.log(data)

                } 

        });

};

Schema_marker.prototype.init = function( params	) {


	for (var attrname in params ) { 

			this.params[attrname] = params[attrname];

	}

		

		var that = this

		var schema_svg = d3.select('#schema-main-container').select('svg')

		// цвет маркера выбирается в зависимости от параметра года
		// Выбирается из массива marker_colors ( marker_colors.js )
		if ( this.params.year in marker_colors )
			{
				this.params.color = marker_colors[ this.params.year ]
			}
		else
			{
				this.params.color = '#949494'
			}

		var marker = schema_svg.append('g')
						.attr('transform' , 'translate( ' + this.params.coord_x + ' ' + this.params.coord_y +  ')')
						.style( "cursor", "pointer" )

			marker.append("svg:circle" )
						
						.attr( "fill" , this.params.color )
						.attr("stroke-width" , 2)
						.attr( "r", this.params.radius + 1 )

	
				
		this.marker = marker

							
		marker.on('mousedown' , function(event) {

			if ( building_schema.settings.edit_mode == false ) { return; }

				
				if ( typeof(active_marker) != 'undefined' ) {

					active_marker.marker_drop();

					if ( active_marker.params.id == that.params.id ) {

						delete active_marker;
						return;

					}

				}; 

				active_marker = that;
				active_marker.select();

				building_schema.settings.img_dragging = true;
			
				var start_dx = that.params.coord_x;
				var start_dy = that.params.coord_y;

				
				schema_svg.on('mousemove' , function(event) {

					that.move( d3.event.pageX , d3.event.pageY )

				});

				schema_svg.on('mouseup' , function() {

					building_schema.settings.img_dragging = false

					// unbind all avent functions
					schema_svg.on('mousemove mouseup' , ''  );

					// if marker position doesn't changed do nothing. In other
					// case sending ajax request to update image coordinates
					if ( that.params.coord_x != start_dx && that.params.coord_y != start_dy ) {

						that.update( 'update' );

					}

				});

		});

		// открытие окна с фотографией и формой комментариев при нажатии 
		// на маркер. Используется класс schema_show_marker, расположенный 
		// в файле schema-ajax-functions. 
		marker.on('click' , function(event) {

			if ( building_schema.settings.edit_mode == true ) { return; }

			// Если пользователь ткнул на активный маркер,
			// то загрываем окно и снимаем выделение с маркера
			if ( typeof(active_marker) != 'undefined' ) {

				active_marker.marker_drop();

				if ( active_marker.params.id == that.params.id &&  typeof(schema_show_marker) != 'undefined' ) {

					schema_show_marker.destroy();

					delete active_marker;
					return;

				}

			}; 


			active_marker = that;

			// the timeout of 'mouseover' event
			clearInterval( that.timer );

			// Если окно с просмотром фотографии еще не открыто, то
			// создаём новое. 
			// if there is no photo section, creating new one
			if ( typeof( schema_show_marker ) == 'undefined' ) {

				$(window).on('close_popup' , function() {

					if ( typeof(active_marker) != 'undefined') {

						active_marker.marker_drop();

					}

            	})
			};

			// Удаление маленького превью фотографии, если оно есть
			// removing thumbnail object if it exist
			if (typeof(schema_thumb) != 'undefined') {
                schema_thumb.destroy()
            }; 

			that.show_full_content();

			active_marker.select(); 


		});

		// при наведении курсора на маркер стартутет таймер, по истечению
		// которого открывается маленькое окошко с превью
		marker.on('mouseover' , function( e ) {

			that.show_preview();

		});

		// Очистка таймера и удаление окна с превью после того,
		// как курсор покинул маркер
		marker.on('mouseout' , function(event) {

			clearInterval( that.timer );

			if ( typeof(schema_thumb) != 'undefined' ) {

				schema_thumb.destroy();
			}

			delete that.timer;

			

		});			

};