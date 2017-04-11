Schema_photo_marker = function( params ) {

    Schema_marker.call(this); // отнаследовать

    this.class_= Object.getPrototypeOf(this);

    this.SuperClass= Object.getPrototypeOf(this.class_);

    this.model_name = 'photo_marker';

    this.init(params);

};

Schema_photo_marker.prototype = Object.create(Schema_marker.prototype);

Schema_photo_marker.prototype.constructor = Schema_photo_marker;



Schema_photo_marker.prototype.return_ajax_params = function() {

	return {
		coord_x  : this.params.coord_x,
		coord_y  : this.params.coord_y,
		photo_id : this.params.photo_id

	}

}

Schema_photo_marker.prototype.show_preview = function() {


	var t = 0;
	var that = this;
	var node;

	that.timer = setInterval( function() {

		clearInterval( that.timer )

		node = that.marker.node()

		if ( building_schema.settings.img_dragging == true  ) { 
			return; 
		}
 				
 		if ( typeof( that.params.image ) === 'object' ) {

 			schema_thumb = new Schema_thumbnail( node, that.params.image.thumb.url  );

 		} else {

			schema_load_thumbnail_image(  that.params['photo_id'] , function( loaded_data ) {

					that.params.image = loaded_data.image;
					schema_thumb = new Schema_thumbnail( node, that.params.image.thumb.url );

			});

		}


	}, 500 )
};

Schema_photo_marker.prototype.show_full_content = function() { 


	schema_show_marker = new Schema_show_photo( this.params.photo_id );

}; 

