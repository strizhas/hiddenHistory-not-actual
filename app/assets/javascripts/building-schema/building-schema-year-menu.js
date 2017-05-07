Schema_year_menu = function(years , callback) {

	console.log( 'Schema_year_menu' )
	console.log( years )

	var container = document.createElement('div');
	var ul =  document.createElement('ul');

	this.container = container

 	$(container )
 		.attr('id','schema-year-menu' )
 		.addClass('schema-year-menu')
 		.append(ul)


 	var create_link = function( year) {

 		if ( year == 'null') { 
			var text = 'не указан'
		} else {
			var text = year
		}


		var li 	 = document.createElement('li');
		var link = document.createElement('div');

		$(li)
			.attr('id','year-selector-' + year )
			.data('year' , year)
			.css('color', marker_colors[year] )

		$(link)
			.addClass('schema-year-select')
			.html(text)
			.appendTo(li);

		$(ul).append(li)

	};

	for ( var index in years ) {
		create_link(years[index])
	}


	var bind_li_callback = function(active_item ) {

		var all_li_elems = $(container).find('li')

		$(all_li_elems).off( 'click' )

		$(all_li_elems).on( 'click' , function() {

			var active_item = this

			$(all_li_elems).each( function(index) {

				if ( this != active_item) {
						$(this).css('opacity' , '0.2')
				} else {
						$(this).css('opacity' , '1')
				}
					
			});

			$(active_item ).on( 'click', function() {

				$(all_li_elems).css('opacity' , '1')

				// вызов метода show_markers_by_year без аргумента 
				// делает все фотографии видимыми
				callback(  )

				// поскольку мы изменили значение on click,
				// то заново назначаем реакцию на это событие
				bind_li_callback()

			});

			// вызов метода show_markers_by_year с указанием года
			// скрывает все фотографии с другим значением года
			callback( $(active_item).data('year') )

		})

	}

	

	bind_li_callback();
			
	

	

	this.add_year = function( new_year ) {
		
		if ( new_year == null ) { new_year = 'null' }

		console.log('add_year')
		console.log(years)

		if(years.indexOf( new_year ) === -1) {
			create_link(new_year)
			bind_li_callback() 
		}

	}



}