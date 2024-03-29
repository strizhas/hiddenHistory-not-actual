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

			var url = $(input).closest('form').attr('action')
			var container = parent.edit_area

			$(input).bind('change', function(event) {

				var files    = event.target.files
				var callback = parent.add_figures_to_edit_area

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


			marker_params = { 'coord_x' : 0, 'coord_y' : 0, 'markerable_type' : 'Guide'}

			marker = building_schema.add_marker( marker_params )
			marker.move( e.pageX , e.pageY )

			schema_promt.fadeIn('кликните на схеме чтобы добавить отметку');


			$(window).bind('mousemove' , function(e) {

				marker.move( e.pageX , e.pageY )

			});

			setTimeout( function() {

				$('#schema-svg-section').on('click' , function() {

					$('#schema-svg-section').off('click')


					var guide_editor = new Guide_edior()
						guide_editor.create_new_guide( guide_editor_callback )

					

					$(window).unbind('mousemove')
					schema_promt.fadeOut('кликните на схеме чтобы добавить отметку');

				});


			}, 300)
			

		})


		var guide_editor_callback = function(guide_editor) {

			var form = $(guide_editor.container).find('form').eq(0);

	        var uploader_options = { 'gallery' : $('#photo-load-section')}

	        $('#image-input-field').add_uploaded_files_listener(uploader_options)

            var callback = { }
            			
            callback['success'] = function( data ) {
				marker.params['markerable_id'] = data  
				marker.update('create')
			};

            callback['error'] = function() {
	            $(window).trigger('close_popup')
            };


            $(window).on('popup_closed' , function() {

            	if ( typeof( marker.params['markerable_id'] ) == 'undefined') {
            		marker.destroy()
            	}

            })

            $(form).bind_form_ajax_sucess( callback );


		};


};


Delete_marker_button = function() {

		Schema_edit_button.call(this); // отнаследовать

		var that = this

		this.button = $('#schema-delete-marker-button')

		this.offset = 100
		this.promt = 'удалить маркер'


		// removing previosly binded event functions
		$( that.button ).off('click' )

		// binding new functions
		$(that.button).on('click' , function() {

				var confirmation = confirm("Вы уверены что хотите удлить выделенные маркеры?");

				if ( confirmation == true ) {
					console.log('delete')
					building_schema.delete_selected_markers()
				}
			

		});

};