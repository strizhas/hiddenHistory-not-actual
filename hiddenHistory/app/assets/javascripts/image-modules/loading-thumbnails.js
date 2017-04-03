/*  Небольшой класс для создания иконок загрузки
    В период загрузки изображений (или ещё чего-нибудь)
    Принимает две переменных - count и container

    count - количество иконок, которые будут созданы
    container - собственно контейнер, в котором они 
    будут размещены. 

    P.S. наверняка это можно было сделать и без класса, 
    но мне с моими умениями так оказалось проще
*/

;var Loading_thumbnails = function() {

    this.thumbnails = [];

    var that = this

    this.initialize = function( count, container ) {

        for ( var i=0; i < count; i++ ) {
                
            var new_thumbnail = document.createElement('figure');
            $(new_thumbnail)
                        .hide()
                        .addClass('loading-image-thumbnail')
                        .simple_progress_bar('create', {progress_bar_type : 'gray-circle-bar'})
                        .appendTo(container)
                        .fadeIn('fast')

            that.thumbnails.push( new_thumbnail ); 

            };

        };

    this.destroy = function() {

        for ( var i=0; i < this.thumbnails.length; i++ ) {

            $(this.thumbnails[i]).remove();

        }

        delete that.thumbnails;

    };

 };
