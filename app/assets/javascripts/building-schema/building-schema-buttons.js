Schema_edit_button = function() {

		var that = this

		this.active = false 

		this.promt_created = false

		this.show = function() {

			$(that.button).hide()

		}

		this.hide = function() {

			$(that.button).show()

		}

		this.animateOut = function( ) {

			that.active = false

			var top = parseInt( $( that.button ).css('top') )

			$(that.button).animate( { 'top' : top + that.offset }, 100 , function() {
							
					$(that.button).hide();

			});

		};

		this.animateIn = function() {

			that.active = true

			$(that.button).show()

			var start_top  = $(that.button).offset().top
			var container_top = $('#schema-svg-section').offset().top

			var new_top = start_top - container_top - that.offset

			$(that.button).animate( { 'top' : new_top }, 100, function() {

				if ( that.promt_created == false ) {

					$(that.button).promt_builder(that.promt)
					
					that.promt_created = true

				}

			} );
		};

};


Add_photo_button = function() {

		Schema_edit_button.call(this); // отнаследовать

		var form   = $('#schema-add-photo-container');
		var button = $('#schema-add-photo-button');
		var input  = $('#add-schema-photo-input');

		var that = this;
		
		this.button = form
		this.form = form;
		this.offset = 50
		this.promt = 'добавить фотографии на схему'


		this.init = function( parent ) {

			var url = hiddenHistory.schema_URL + '/upload_photo'
			var container = parent.edit_area

			$(input).bind('change', function(event) {

				var files    = event.target.files
				var callback = parent.add_figures_to_edit_area

				if ( parent.others_hidden != true ) {

					$(parent.edit_area).find('figure').fadeOut('fast')

					parent.others_hidden = true

				}
				

				ajax_file_upload( files, url, container, callback )

			});

			that.activated = true

		}

		this.animateIn = function() {

			$(that.form).show()

			that.active = true

			var start_top 	  = $(that.form).offset().top
			var container_top = $('#schema-svg-section').offset().top

			var new_top = start_top - container_top - 50

			$(that.form).animate( { 'top' : new_top }, 100 , function() {
							$(this).promt_builder('добавить фотографии на схему')
						});


		};

	
};


Add_guide_button = function() {

		Schema_edit_button.call(this); // отнаследовать

		var marker, marker_params

		var that = this

		this.button = $('#schema-add-guide-button');
		this.offset = 50
		this.promt = 'добавить отметку'

		$(this.button).on('click', function( e ) {

			add_marker_to_schema(e);
			

		})

		var add_marker_to_schema = function(e) {

			marker_params = { 'coord_x' : 0, 'coord_y' : 0 }

			marker = hiddenHistory.schema.add_marker( 'Guide' , marker_params )

			marker.move( e.pageX , e.pageY )

			hiddenHistory.schema_promt.fadeIn('кликните на схеме чтобы добавить отметку');


			$(window).bind('mousemove' , function(e) {

				marker.move( e.pageX , e.pageY )

			});

			$(window).on('close_popup' , function() {

				setTimeout( function() {

					if ( marker.params.id == null ) {

						marker.destroy();

					}


				}, 300);
				
            	unbind_events();

            })

			setTimeout( function() {

				$('#schema-svg-section').on('click' , function() {

					hiddenHistory.schema_item = new Guide_edior()
					hiddenHistory.schema_item.create_new_guide(  { marker : marker } )

					unbind_events()

				});


			}, 300)

		}

		var unbind_events = function() {

			$('#schema-svg-section').off('click');

			$(window).unbind('mousemove');

			hiddenHistory.schema_promt.fadeOut();

		}

	


};


Delete_marker_button = function() {

		Schema_edit_button.call(this); // отнаследовать

		var that = this

		this.button = $('#schema-delete-marker-button')

		this.offset = 100
		this.promt  = 'удалить маркер'


		// removing previosly binded event functions
		$( that.button ).off('click' )

		// binding new functions
		$(that.button).on('click' , function() {

				var confirmation = confirm("Вы уверены что хотите удлить выделенные маркеры?");

				if ( confirmation == true ) {
					hiddenHistory.schema.delete_selected_markers()
				}
			

		});

};