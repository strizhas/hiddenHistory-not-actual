var Schema_guide_marker = function( params ) {

    Schema_marker.call(this); 

    this.class_= Object.getPrototypeOf(this);

    this.SuperClass= Object.getPrototypeOf(this.class_);

    this.model_name = 'guide_marker';

    this.init(params);


};

Schema_guide_marker.prototype = Object.create(Schema_marker.prototype);

Schema_guide_marker.prototype.constructor = Schema_guide_marker;



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


	schema_show_marker = new Schema_show_guide( this.params.guide_id  );


}; 