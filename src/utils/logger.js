// document.getElementById("searcbar").addEventListener("input", function () {
//     console.log(this.value);
// });

// document.getElementsByTagName("input").addEventListener("input", function () {
//   console.log(this.value);
// });


document.querySelectorAll('.login-input').forEach(item => {
  item.addEventListener("input", function () {
    console.log(this.value);
  })
})