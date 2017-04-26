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

	var radius = Math.floor( this.params.radius * document.building_schema.settings.size_delta  )

	var marker = schema_svg.append('g')
						.attr('transform' , 'translate( ' + this.params.coord_x + ' ' + this.params.coord_y +  ')')
						.style( "cursor", "pointer" );

	var coords = [ {x: 80, y: 50},{x: 110, y: 80},{x: 140, y: 90} ]

	marker.append("svg:circle" )	
			.attr( "fill" , this.params.color )
			.attr("stroke-width" , 2)
			.attr( "r", radius );

	marker.append('svg:path' )	
			.style("stroke", this.params.color)
			.attr("stroke-width" , this.params.radius / 2 )
			.attr('d' , 'M-50,-50, 0-0,50,-50')
			.attr('transform', 'rotate(' + this.params.angle + ')')


	this.marker = marker;
	

}

Schema_photo_marker.prototype.select = function(  ) {

	var that = this

	this.marker.selectAll("circle")
					.attr( "fill" , "#302d2a")

	this.params['selected'] = true


	$(document).on( 'keydown' , function (e){

		

		if ( document.building_schema.settings.edit_mode != true && 
			that.params['selected'] != true && 
			that.params['rotating'] != false 
			) {

			return;

		}

		if (e.keyCode == 82) {

			var currentMousePos = { x: -1, y: -1 };

			$(document).on('mousemove' , function(event) {

		        currentMousePos.x = event.pageX;
		        currentMousePos.y = event.pageY;

		        console.log( currentMousePos.x );

		    });

			that.params['rotating'] = true
			

		}

	})

	$(document).on( 'keyup', function() {

		$(document).off('mousemove')

		console.log('stop');

		that.params['rotating'] = false

	})

};


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

