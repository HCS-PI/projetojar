var express = require("express");
var router = express.Router();

var dashTecnicoController = require("../controllers/dashTecnicoController");

router.post("/carrosMonitorados", function (req, res) {
    console.log('Chegou na rota!')
    dashTecnicoController.carrosMonitorados(req, res);
});

router.post("/verCarros", function (req, res) {
    console.log('Cheguei na rota!')
    dashTecnicoController.buscarCarros(req, res);
});

router.post("/verDetalhes", function (req, res) {
    console.log('Cheguei na rota!')
    dashTecnicoController.detalheCarro(req, res);
});

router.post("/dispositivos", function (req, res) {
    console.log('Cheguei na rota!')
    dashTecnicoController.dispositivos(req, res);
});
router.post("/processos", function (req, res) {
    console.log('Cheguei na rota!')
    dashTecnicoController.processos(req, res);
});
router.post("/dadosRam", function (req, res) {
    console.log('Cheguei na rota!')
    dashTecnicoController.pegarRam(req, res);
});
router.post("/dadosCpu", function (req, res) {
    console.log('Cheguei na rota!')
    dashTecnicoController.pegarCpu(req, res);
});

router.post("/dadosDisco", function (req, res) {
    console.log('Cheguei na rota!')
    dashTecnicoController.pegarDisco(req, res);
});



module.exports = router;