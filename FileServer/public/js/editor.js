$(document).ready(function(){
  
  var QueryString = function () {
    var query_string = {};
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=");
          // If first entry with this name
      if (typeof query_string[pair[0]] === "undefined") {
        query_string[pair[0]] = pair[1];
          // If second entry with this name
      } else if (typeof query_string[pair[0]] === "string") {
        var arr = [ query_string[pair[0]], pair[1] ];
        query_string[pair[0]] = arr;
          // If third or later entry with this name
      } else {
        query_string[pair[0]].push(pair[1]);
      }
    } 
      return query_string;
  } ();
  
  $('#file-name').text(QueryString.name);
  
  $.get(QueryString.url, function(data){
    if (data.status === "ok"){
      $('#text-editor').html(data.file_content);
    } else {
      
    }
  });
  
  $('#boton-guardar').click(function(){
    $.post(QueryString.url, {file_content:$('#text-editor').val()}, function(data){
      
    });
  });
  
});