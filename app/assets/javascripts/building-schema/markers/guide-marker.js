var Schema_guide_marker = function( params ) {

    Schema_marker.call(this); 

    this.class_= Object.getPrototypeOf(this);

    this.SuperClass= Object.getPrototypeOf(this.class_);

    this.model_name = 'guide_marker';

    this.init(params);


};

Schema_guide_marker.prototype = Object.create(Schema_marker.prototype);

Schema_guide_marker.prototype.constructor = Schema_guide_marker;

Schema_guide_marker.prototype.create_marker = function() {

	var schema_svg = hiddenHistory.schema.schema_svg

	var radius = Math.floor( this.params.radius * hiddenHistory.schema.settings.size_delta  )

	var marker = schema_svg.append('g')
						.attr('transform' , 'translate( ' + this.params.coord_x + ' ' + this.params.coord_y +  ')')
						.attr('class' , 'g-mrk')
						.style( "cursor", "pointer" );

	var main_g = marker.append('g');

	main_g.append("svg:circle" )	
			.attr( "fill" , this.params.color )
			.attr("stroke-width" , 2)
			.attr("stroke" , '#000')
			.attr( "r", radius );

	this.marker = marker;

}


Schema_guide_marker.prototype.return_ajax_params = function() {

	return {
		coord_x  : this.params.coord_x,
		coord_y  : this.params.coord_y,
		guide_id : this.params.guide_id

	}

} 


Schema_guide_marker.prototype.show_preview = function() { 

	console.log(this)
}

Schema_guide_marker.prototype.show_full_content = function() { 


	hiddenHistory.schema_item = new Schema_show_guide( this.params.guide_id  );


}; 