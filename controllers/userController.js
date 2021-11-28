const DAOUser = require("../model/DAOUser");

const DAOUserr = new DAOUser();



module.exports = {
    login(request, response) {
        response.render("login", { error: null });
    },
    isUser(request, response, next) {
        DAOUserr.isUser(request.body.user, request.body.password, function(err, result) {
            if (err) {
                console.log(err);
                response.render("login", { error: "Error interno de acceso a la base de datos" });
            } else if (!result) {
                response.render("login", { error: "No existe el usuario" });
            } else {
                console.log(result);
                request.session.email = result[0].correo;
                request.session.password = request.body.password;
                console.log("sasasasa");
                response.redirect("/");
            }
        });
function cb_isUser(err, result) {
    if (err) {

    } else if (!result) {

    } else {
        request.session.email = result[0].email;
        request.session.password = request.body.password;

        response.redirect("/");
    }
}

module.exports = {
    login(request, response) {
        response.render("login");
    },
    isUser(request, response) {
        DAOUser.isUser(request.body.user, request.body.password, cb_isUser);
    }

};