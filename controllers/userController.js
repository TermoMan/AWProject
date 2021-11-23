const { getPool } = require("../../Collectio-GPS/database");
const DAOUser = require("../model/DAOUser");

const DAOUser = new DAOUser(getPool);

function cb_isUser(err, result){
  if(err){

  } else if(!result){

  } else {
    request.session.email =result[0].email;
    request.session.password = request.body.password;

    response.redirect("/"); 
  }
}

module.exports = {
login(request, response) {
    response.render("login");
  },
isUser(request,response){
  DAOUser.isUser(request.body.user, request.body.password, cb_isUser);
}

};