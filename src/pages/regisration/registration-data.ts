const data = {
    form: {
        title: 'Регистрация',
        redirectUrl: '/change-chat.html',
        fields: [
            {
                name: 'email',
                type: 'text',
                placeholder: 'Почта',
            },
            {
                name: 'login',
                type: 'text',
                placeholder: 'Логин',
            },
            {
                name: 'firstName',
                type: 'text',
                placeholder: 'Имя',
            },
            {
                name: 'lastName',
                type: 'text',
                placeholder: 'Фамилия',
            },
            {
                name: 'phone',
                type: 'text',
                placeholder: 'Телефон',
            },
            {
                name: 'password',
                type: 'password',
                placeholder: 'Пароль',
            },
            {
                name: 'confirmPassword',
                type: 'password',
                placeholder: 'Введите ещё раз',
            },
        ],
        submitButton: {
            text: 'Зарегистрироваться',
        },
        altLink: {
            link: '/chat.html',
            text: 'Войти',
        },
    },
}

export default data
