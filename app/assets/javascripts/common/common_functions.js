// SOME COMMON FUNCTIONS, USED IN THE ENTIRE APPLICATION
// searching by data attribute
(function ($) {

    $.fn.filterByData = function (prop, val) {
        var $self = this;
        if (typeof val === 'undefined') {
            return $self.filter(
                function () { return typeof $(this).data(prop) !== 'undefined'; }
            );
        }
        return $self.filter(
            function () { return $(this).data(prop) == val; }
        );
    };

})(window.jQuery);


// this function generates special event after removing selected element from DOM   
(function($){
  $.event.special.destroyed = {
    remove: function(o) {
      if (o.handler) {
        o.handler()
      }
    }
  }
})(jQuery);



function get_history_session_name () {
    session_name = 'history___' + escape(location.href);
    return session_name;
}


function create_background_black_tint () {

    if ( $('#background-popup-tint').length != 0 ) {
        return
    }

    var background_tint = document.createElement('div');
    var close_button    = document.createElement('button')

    $(background_tint).attr('id','background-popup-tint')
    $(background_tint).css('display','none')

    $(close_button).attr('id','background-popup-close')
    $(close_button).css('display','none')

    $('body').append(background_tint)
    $('body').append(close_button)

    var background_tint_close = function() {
        $(background_tint).fadeOut('fast')
        $(close_button).fadeOut('fast')
        $(window).off('close_popup',  background_tint_close )
        console.log('fade close_popup')
    }

    
    $(close_button).on('click', function() {
        $(window).trigger('close_popup')
    })

    $(window).on('popup_activate', function() {

        $(window).on('close_popup',  background_tint_close )

        $(background_tint).fadeIn('fast')
        $(close_button).fadeIn('fast')

    })
};

/**
 * отправляет запрос на получение id текущего пользователя
 */
function get_current_user_id () {

    $.get('/get_current_user_id', function(result){
        sessionStorage.setItem("user_id", result.id );
    });
};

function unset_current_user_id() {

    if ( sessionStorage ) {

        sessionStorage.setItem("user_id", null );

    }
};


/**
 * получает имя сессии для сохранения в sessionStorage
 * @return {string} имя сессии
 */
function get_history_session_name () {
    session_name = 'history___' + escape(location.href);
    return session_name;
}

