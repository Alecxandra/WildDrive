$(document).ready(function(){

	var serverURL = "http://green-box-37-202764.use1.nitrousbox.com/";
  var actualFolderID = 0;

	// Boton Cancelar Crear Carpeta
	$('#boton-cancelar-crear-carpeta').click(function(){
		$('#new-folder-wrapper').fadeOut();
		setTimeout(function(){
			$('#nombre-carpeta').val("");
		}, 400);
	});

	// Boton crear nueva carpeta
	$('.boton-nueva-carpeta').click(function(){
		$('#new-folder-wrapper').fadeIn();
    setTimeout(function(){
			$('#nombre-carpeta').focus();
		}, 400);
	});

	// Boton aceptar crear nueva carpeta
	$('#boton-crear-carpeta').click(function(){
		var nombreCarpeta = $('#nombre-carpeta').val();
    $('#loader-wrapper').fadeIn();
    $.post(serverURL + "mkdir/" + actualFolderID, {folder_name:nombreCarpeta}, function(data){
      console.log(data);
      $.get(serverURL + "get_tree/" + actualFolderID, function(data){
        fillExplorer(data);
        $('#new-folder-wrapper').fadeOut();
        $('#loader-wrapper').fadeOut();
      });
    });
		setTimeout(function(){
			$('#nombre-carpeta').val("");
		}, 400);
	});


	// Poblar explorador
	var fillExplorer = function(structure){	
		$('#file-explorer-wrapper').empty();

		if (structure.length === undefined || structure.length === 0){
			$( '<div class="empty-Folder">Carpeta Vacía</div>' ).appendTo( "#file-explorer-wrapper" );
		}

		for(i = 0; i < structure.length; i++){

			if (structure[i].type == "folder"){
				// Crear el elemento HTML
				var folder = "<div class='archivo' id='F" + i + "'><img class='icono-archivo' src='resources/folder.png'><h5 class='nombre-archivo'>" + 
				prepareName(structure[i].name) + "</h5></div>";
				$( folder ).appendTo( "#file-explorer-wrapper" );

				// Añadir evento click al elemento
				var name = prepareName(structure[i].name);
				$('#F' + i).dblclick({id:structure[i].id, name:name}, function(event){
					$('#loader-wrapper').fadeIn();
					$.get(serverURL + "get_tree/" + event.data.id, function(data){
						actualFolderID = event.data.id;
            fillExplorer(data);
						renderNavigationBar(data, event.data.name, event.data.id);
						$('#loader-wrapper').fadeOut();
					});
				});
			} else {	// Si es un archivo
				// Crear el elemento HTML
				var file = "<div class='archivo' id='A" + i + "'><img class='icono-archivo' src='resources/file.png'><h5 class='nombre-archivo'>" + 
				prepareName(structure[i].name) + "</h5></div>";
				$( file ).appendTo( "#file-explorer-wrapper" );

				// Añadir evento click al elemento
				file = structure[i];
				$('#A' + i).dblclick(function(){
					console.log(file.url);
				});
			}
		}
	};


	var renderNavigationBar = function(structure, folderName, folderID){
		var id = new Date().getTime();
		$( "<div class='btn btn-Nav' id='nb" + id + "'><button type='button' class='btn btn-link'>" + folderName + "</button>></div>" ).appendTo("#route-wrapper");

		$('#nb' + id).click(function(){
			$('#loader-wrapper').fadeIn();
      actualFolderID = folderID;
			fillExplorer(structure);
			$('#loader-wrapper').fadeOut();
			$.each( $('#nb' + id).nextAll(), function( key, element ) {
				element.remove();
			});
		});
	}

	var prepareName = function(name){
		if (name.length > 10){
			name = name.slice(10);
		}
		return name;
	}
  
  $('.boton-subir-archivo').click(function(){
    $('#upload-file-wrapper').fadeIn();
  });
  
  $('#boton-cancelar-subir-archivo').click(function(){
    $('#upload-file-wrapper').fadeOut();
  });
  
  $('#upload_file_form').on("submit", function(evt){
    evt.preventDefault();
    
    $.post(serverURL + "files/upload/" + actualFolderID, {}, function(data){
      
    });
    
    return false;
  });
  
	$('#loader-wrapper').fadeIn();
	$.get(serverURL + "get_tree/0", function(data){
		fillExplorer(data);
		renderNavigationBar(data, "Mi Unidad", 0);
		$('#loader-wrapper').fadeOut();
	});

});