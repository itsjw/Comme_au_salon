var express = require("express");
var router = express.Router();
var url = require("url");

function dynRouter(app) {
    // automatisme
    router.use(manageAction);
    app.use(router);
}

function manageAction(req, res, next) {
    var path; //le pathname (après le 3000 dans l'url)
    var type; // la méthode (get post etc... methode http)
    var controler; //nom du controleur à charger
    path = url.parse(req.url).pathname;
    //il faut supprimer pour le routage le paramètre apres l'action
    if (path.split('/').length > 0) path = '/' + path.split('/')[1]
    type = req.method;
    if (typeof GLOBAL.dynRoutes[type + path] == 'undefined') {
        console.log("erreur pas d'action : " + path);
        next();
    } else {
        instanceModule = require('./routes/' + GLOBAL.dynRoutes[type + path].controler);
        router.use(path, instanceModule);
        next();
    }
}

module.exports = dynRouter;