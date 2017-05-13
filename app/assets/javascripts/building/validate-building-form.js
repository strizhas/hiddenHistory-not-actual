function validate_building_form() {

    var form = $('#building-form').find('form').eq(0);

    $(form).validate({
        rules:{
            'building[title]':{
                    required: true,
                    rangelength: [5,100]
                },

            'building[intro]':{
                    required: true,
                },
            'building[building_id]':{
                    rangelength: [1,10],
                    digits: true
                },
        },
        messages:{
            'building[title]':{
                required: "вы не указали название сооружения",
                rangelength: "Выберете имя в диапозоне от 5 до 100 символов"
            },
            'building[intro]': {
                required: "пожалуйста заполните краткое описание",
            },
            'building[building_id]': {
                rangelength: "id не может быть длиннее десяти символов",
                digits: "id может состоять только из цифр"
            }
        }

    });
}