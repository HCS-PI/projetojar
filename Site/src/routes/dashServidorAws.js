var express = require("express");
var router = express.Router();

var dashServidorAwsController = require("../controllers/dashServidorAwsController");

router.post("/obterInfoCPU", function (req, res) {
    console.log('Chegou na rota!')
    dashServidorAwsController.obterConsumoCPUController(req, res);
});

router.post("/obterConsumoRAM", function (req, res) {
    console.log('Chegou na rota!')
    dashServidorAwsController.obterConsumoRAMController(req, res);
});

router.post("/obterConsumoDISCO", function (req, res) {
    console.log('Chegou na rota!')
    dashServidorAwsController.obterConsumoDISCOController(req, res);
});

module.exports = router;