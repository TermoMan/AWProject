
//aniadir si es una pregunta o no y cambiar puntuacion en base a ello
function sendUp(idUp, pressed, negative){
  if(pressed){
    $(idUp).css("background-image", "url(http://localhost:3000/images/upvote-verde.png)");
    $(idUp).data("pressed", true);
  }
  $.ajax({
    type: "POST",
    url: "/index/upVote",
    contentType: "application/json",
    data: JSON.stringify({ id: $(idUp).data("idOg"), pressed: pressed, negative: negative, question: $(idUp).data("question") }),

    // En caso de éxito, mostrar el resultado en el documento HTML
    success: function (data, textStatus, jqXHR) {
    $("#pregPuntos").text("Votos: " + data.resultado);
    },
    // En caso de error, mostrar el error producido
    error: function (jqXHR, textStatus, errorThrown) {
    alert("Se ha producido un error: " + errorThrown);
    }
    });
}
// aniadir si es una pregunta o no y cambiar puntuacion en base a ello
function sendDown(idDown, pressed, positive){
  if(pressed){
    $(idDown).css("background-image", "url(http://localhost:3000/images/downvote-rojo.png)");
    $(idDown).data("pressed", true);
  }
  $.ajax({
    type: "POST",
    url: "/index/downVote",
    contentType: "application/json",
    data: JSON.stringify({id: $(idDown).data("idOg"), pressed: pressed, positive: positive, question: $(idDown).data("question")}),
    // En caso de éxito, mostrar el resultado en el documento HTML
    success: function (data, textStatus, jqXHR) {
    $("#pregPuntos").text("Votos: " + data.resultado);
    },
    // En caso de error, mostrar el error producido
    error: function (jqXHR, textStatus, errorThrown) {
    alert("Se ha producido un error: " + errorThrown);
    }
    });
}

function unPressUp(idUp){
  $(idUp).css("background-image", "url(http://localhost:3000/images/upvote-blanco.png)");
  $(idUp).data("pressed", false);
}

function unPressDown(idDown){
  $(idDown).css("background-image", "url(http://localhost:3000/images/downvote-blanco.png)");
  $(idDown).data("pressed", false);
}

function botonUpvote(idUp, idDown) {

  if($(idUp).data("pressed")){
    unPressUp(idUp);
    sendUp(idUp, false, false)
  } 
  else if($(idDown).data("pressed")){
    unPressDown(idDown);
    sendUp(idUp, true, true);
    
  } 
  else{
    sendUp(idUp, true, false);
  } 
   
}

function botonDownvote(idDown, idUp) {

  if($(idDown).data("pressed")){
    unPressDown(idDown);
    sendDown(idDown, false, false)
  } 
  else if($(idUp).data("pressed")){
   unPressUp(idUp);
   sendDown(idDown, true, true)
  } 
  else{
    sendDown(idDown, true, false);
  } 
}


  

$(function () {
  //gestion de botones upvote
  $(".button-upvote").each(function(index){

    //Almacenamos el id de la pregunta
    let id = $(this).prop("id");
    $(this).data("idOg", id);

    //guardamos si es una pregunta o no
    if(index === 0) $(this).data("question", true);
    else $(this).data("question", false);

    //generamos un id para el upvote en concreto y el metodo onclick para modificarlo
    $(this).prop("id", "buttonUpvote-" + index);
    $(this).on("click", e=>{botonUpvote("#buttonUpvote-" + index, "#buttonDownvote-" + index)});

    if($(this).data("valor") == 1){
      $(this).data("pressed", true);
      $(this).css("background-image", "url(http://localhost:3000/images/upvote-verde.png)");
    }
    else $(this).data("pressed", false);

  });
  //gestion de botones downvote
  $(".button-downvote").each(function(index){

    let id = $(this).prop("id");
    $(this).data("idOg", id);

    if(index === 0) $(this).data("question", true);
    else $(this).data("question", false);

    $(this).prop("id", "buttonDownvote-" + index);
    $(this).on("click", e=>{botonDownvote("#buttonDownvote-" + index, "#buttonUpvote-" + index)});

    if($(this).data("valor") == -1){
      $(this).css("background-image", "url(http://localhost:3000/images/downvote-rojo.png)");
      $(this).data("pressed", true);
    } else $(this).data("pressed", false);


  });
});