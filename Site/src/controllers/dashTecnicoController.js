var tecnicoModel = require("../models/dashTecnicoModel");

function carrosMonitorados(req, res) {
    var idEmpresa = req.body.idEmpresa;
    console.log(`Recuperando a quantidade de carros monitorados`);

    tecnicoModel.carrosMonitorados(idEmpresa).then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar os carros monitorados.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function buscarCarros(req, res) {
    var idEmpresa = req.body.idEmpresa;

    tecnicoModel.verCarrosProblema(idEmpresa).then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar as ultimas medidas.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function detalheCarro(req, res) {
    var idCarro = req.body.idCarro;

    tecnicoModel.verDetalhes(idCarro).then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar as ultimas medidas.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function dispositivos(req, res) {
    var idCarro = req.body.idCarro;

    tecnicoModel.dispositivos(idCarro).then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar as ultimas medidas.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}
function processos(req, res) {
    var idCarro = req.body.idCarro;

    tecnicoModel.processo(idCarro).then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar as ultimas medidas.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}
function pegarRam(req, res) {
    var idCarro = req.body.idCarro;

    tecnicoModel.pegarRam(idCarro).then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar as ultimas medidas.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}
function pegarCpu(req, res) {
    var idCarro = req.body.idCarro;

    tecnicoModel.pegarCpu(idCarro).then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar as ultimas medidas.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}
function pegarDisco(req, res) {
    var idCarro = req.body.idCarro;

    tecnicoModel.pegarDisco(idCarro).then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar as ultimas medidas.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {
    carrosMonitorados,
    buscarCarros,
    detalheCarro,
    dispositivos,
    processos,
    pegarRam,
    pegarCpu,
    pegarDisco
}