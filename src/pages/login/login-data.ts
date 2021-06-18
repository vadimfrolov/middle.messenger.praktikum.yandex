const data = {
  form: {
    title: "Вход",
    redirectUrl: "/chat.html",
    fields: [
      {
        name: "login",
        type: "text",
        placeholder: "Логин",
      },
      {
        name: "password",
        type: "password",
        placeholder: "Пароль",
      },
    ],
    submitButton: {
      text: "Авторизоваться",
    },
    altLink: {
      link: "/registration.html",
      text: "Нет аккаунта?",
    },
  },
};

export default data;
