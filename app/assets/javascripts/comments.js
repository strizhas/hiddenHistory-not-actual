bind_comment_form_ajax_response = function() {

	var ajax_response = function() {

		$(".comment-form").off( "ajax:success")

		$(".comment-form").on( "ajax:success", function(evt, data, status, xhr) {

			var response = $(xhr.responseText).hide()

			// Если комментарий является ответом на другой комментарий, то 
			// мы присоединяем его к списку ответов.
			// if this comment is a reply, we appending it to parent comment
			if ( $(this).parent().parent().is('li') ) {
				list = $(this).parent().parent().find('.comment-reply-list')
				list.first().append(response)

			} else {

				$('#comment-list').append(response)

			}
			
			response.show('fast')


			if ( $('#reply-form').length > 0 ) {

				console.log('remove reply form')
				$('#reply-form').remove()

			} else {

				$(this).find("input, textarea").not('.comment-submit').each(function() {
					$(this).val('')
				})
					
			}

			bind_comment_reply( )
		})

	};

	var validate_comment_form = function() {

		$(".comment-form").validate({
	        rules:{
	            'comment[commenter]':{
	                    required: true,
	                    rangelength: [3,50]
	                },

	            'comment[body]':{
	                    required: true,
	                }
	        },
	        messages:{
	            'comment[commenter]':{
	                required: "вы не указали имя",
	                rangelength: "Выберете имя в диапозоне от 3 до 50 символов"
	            },
	            'comment[body]': {
	                required: "вы не заполнили текст комментария",
	            }
	        }

	    });

	}

	
	var slide_away = function(el, callback) {
		$(el).slideToggle('fast' , function() {

			$(this).remove()

			if ( callback && typeof(callback) === 'function') {
				callback()
			}
		})				
	};

	// this function append the comment edit form
	var ajax_comment_update = function() {

		$(".comment-edit-link").off("ajax:success")

		$(".comment-edit-link").on("ajax:success", function(evt, data, status, xhr) {

			$(this).siblings().andSelf().hide()

			var parent = $(this).parent()
			var another_forms = $(this).parent().parent().find('form')

			if (another_forms.length > 0) {

				another_forms.parent().children().show()
				another_forms.remove()

			}

			$(parent).append(xhr.responseText)
			form = $(parent).find('.comment-update-form')[0]

			$(form).on("ajax:success", function(evt, data, status, xhr) {

				$(parent).children().remove()
				$(parent).append(xhr.responseText)

				var new_update_link = $(parent).find(".comment-edit-link")[0]
				ajax_comment_update($(new_update_link))

			})
				

		})

	};

	// ajax comment reply form loading
	var bind_comment_reply = function( ) {

		$(".comment-reply-link") .off( "ajax:success")

		$(".comment-reply-link") .on( "ajax:success", function(evt, data, status, xhr) {

				if ( $(this).hasClass('active-form') ) {
					console.log('$(this).hasClass active-form')

					f = $(this).parent().parent().find('form')
					$(this).removeClass('active-form')
					slide_away(f)
					return
				}	

				$(this).addClass('active-form')

				form = $(xhr.responseText)
				form.hide().insertAfter($(this).parent())

				if ( $('#reply-form').length > 0 ) {
					slide_away($('#reply-form'), function() {
						setTimeout( function() { form.attr('id','reply-form').show('fast') } , 200 )
					})
				} else {
					form.attr('id','reply-form').show('fast')
				}

				ajax_response();

		})

	};

	return function() {

		ajax_response();

		ajax_comment_update();

		bind_comment_reply();

		$('#new_comment').find('textarea').on('focus', function() {

			slide_away( $('#reply-form') );	

		});

		validate_comment_form();	
	
	}()


};

