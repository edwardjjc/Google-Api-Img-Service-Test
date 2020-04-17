module.exports = function(app) {
    var imgManager = require("../controllers/imgController.js");

    app.route("/imgManager").post(imgManager.evaluateImages);
    app.route("/imgManager-Path").post(imgManager.evaluatePath);
}