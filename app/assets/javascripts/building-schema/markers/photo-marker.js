Schema_photo_marker = function( params ) {

    Schema_marker.call(this); // отнаследовать

    this.class_= Object.getPrototypeOf(this);

    this.SuperClass= Object.getPrototypeOf(this.class_);

    this.model_name = 'photo_marker';

    this.init(params);

};

Schema_photo_marker.prototype = Object.create(Schema_marker.prototype);

Schema_photo_marker.prototype.constructor = Schema_photo_marker;


Schema_photo_marker.prototype.create_marker = function() {

	this.params['rotating'] = false 

	if ( this.params.angle == null ) {

		this.params.angle = 0;

	}


	var schema_svg = document.building_schema.schema_svg

	var radius = Math.floor( this.params.radius  )

	var marker = schema_svg.append('g')
						.attr('transform' , 'translate( ' + this.params.coord_x + ' ' + this.params.coord_y +  ') rotate(' + this.params.angle + ')')
						.style( "cursor", "pointer" );

	marker.append('svg:path' )	
			.style("fill", this.params.color)
			.attr("opacity", 0.3)
			.attr('d' , 'M-50,-50, 0-0,50,-50')

	marker.append("svg:circle" )	
			.attr( "fill" , this.params.color )
			.attr("stroke-width" , 2)
			.attr( "r", radius )

	
			


	this.marker = marker;
	

}


Schema_photo_marker.prototype.rotate = function( ) {

	if ( this.params['rotating'] == true || 
		 document.building_schema.settings.edit_mode != true) {

		return

	}

	var that = this

	that.params['rotating'] = true


	var currentMousePos = { x: -1, y: -1 };

	var node = that.marker.node();

	var node_position = node.getBoundingClientRect();

	$(document).on('mousemove' , function(event) {

		var x,y,transform

		currentMousePos.x = event.pageX;
		currentMousePos.y = event.pageY;

		x = currentMousePos.x - node_position.left
		y = currentMousePos.y - node_position.top


		that.params['angle'] = Math.floor( 180 + ( 180 / Math.PI ) * Math.atan2( y, x ) - 90 );

		transform = 'translate( ' + that.params.coord_x + ' ' + that.params.coord_y +  ')';
		transform += ' rotate(' + that.params['angle'] + ')';

		that.marker.attr('transform', transform );


	});



};


Schema_photo_marker.prototype.select = function(  ) {

	if ( this.active == false ) {
		return;
	}

	var that = this

	this.marker.selectAll("circle")
					.attr( "fill" , "#302d2a")

	this.params['selected'] = true;

	if ( document.building_schema.settings.edit_mode == true ) {
			
			schema_promt.fadeIn('удерживайте клавишу R для вращения');

	}
	

	$(document).on( 'keydown' , function (e){


		if ( document.building_schema.settings.edit_mode != true && 
			that.params['selected'] != true && 
			that.params['rotating'] != false 
			) {

			return;

		}

		if (e.keyCode == 82) {

			that.rotate();
			

		}

	})

	$(document).on( 'keyup', function() {

		if ( document.building_schema.settings.edit_mode != true ) {

			return

		}

		$(document).off('mousemove');

		that.params['rotating'] = false;

		that.update( 'update' );

	})

};


Schema_photo_marker.prototype.return_ajax_params = function() {

	return {
		coord_x  : this.params.coord_x,
		coord_y  : this.params.coord_y,
		angle	 : this.params.angle,
		photo_id : this.params.photo_id,
		year	 : this.params.year
	}

}

Schema_photo_marker.prototype.show_preview = function() {


	var t = 0;
	var that = this;
	var node;

	that.timer = setInterval( function() {

		clearInterval( that.timer )

		node = that.marker.node()

		if ( document.building_schema.settings.img_dragging == true  ) { 
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

