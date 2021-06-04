document.querySelectorAll('.login-input').forEach(item => {
  item.addEventListener("input", function () {
    console.log(Array.from(document.querySelectorAll('.login-input')).reduce((acc, {name, value}) => {acc[name] = value; return acc}, {}));
  })
})

