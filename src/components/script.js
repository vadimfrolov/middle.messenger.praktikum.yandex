window.onload = function() {
  //Grab the inline template
  var template = document.getElementById('template').innerHTML;

  //Compile the template
  var compiled_template = Handlebars.compile(template);

  //Render the data into the template
  var rendered = compiled_template({name: "Luke", power: "force"});

  //Overwrite the contents of #target with the renderer HTML
  document.getElementById('target').innerHTML = rendered;
}
