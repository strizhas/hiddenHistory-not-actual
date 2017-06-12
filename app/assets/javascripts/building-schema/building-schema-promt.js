var Promt = function() {

		this.box = document.createElement('div')
		this.box.className = 'schema-update-promt'
		this.box.style.display = 'none'
		this.active = false
		this.fadingOut = false

		document.getElementById('schema-svg-section').appendChild( this.box ) 

		var that = this

		this.flash = function( message ) {

			that.fadeIn(message)

			setTimeout( function() {

				that.fadeOut()				
				
			}, 1000);

		};

		this.fadeIn = function( message ) {

			that.box.innerHTML = message
			that.box.style.display = 'block'
			that.box.style.opacity = 1

			that.active = true

		};

		this.fadeOut = function() {

			if ( that.fadingOut == true ) {

				return;

			}

			that.fadingOut = true

			var op = 1; // initial opacity
			var n = 0 ; // counter

			var timer = setInterval( function() {

				n++;

				if ( op <= 0.1 || n >= 50 ) { 

					clearInterval(timer) 
					that.box.style.display = 'none'
					that.active 	= false
					that.fadingOut  = false

				}

				that.box.style.opacity = op
				op -= op * 0.2

			}, 50)

		};

	

};