function validate_registration_form() {

    console.log('start')

    $('#registration-form').validate({
        rules:{
            'user[username]':{
                    required: true,
                    rangelength: [3,30]
                },

            'user[email]':{
                    required: true,
                    email: true
                },
            'user[password]':{
                    required: true,
                    rangelength: [6,30]
                },
            'user[password_confirmation]':{
                    equalTo: "#user_password"
            }    
        },
        messages:{
            'user[username]':{
                required: "вы не указали имя пользователя",
                rangelength: "Выберете имя в диапозоне от 3 до 30 символов"
            },
            'user[email]': {
                required: "вы не указали адрем электронной почты",
                email: "вы ввели некорректный адрес"
            },
            'user[password]': {
                required: "вы не указали пароль",
                rangelength: "Выберете пароль в диапозоне от 6 до 30 символов"
            },
            'user[password_confirmation]':{
                equalTo: "Введенные пароли не совпадают"
            }
        }

    });
}