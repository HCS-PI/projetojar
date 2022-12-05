var obterTempCPUModel = require("../models/dashServidorAwsModel");

function obterConsumoCPUController(req, res) {

    console.log(`Recuperando a temperatura da CPU da EC2`);

    obterTempCPUModel.getConsumoCPU().then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar a temperatura da CPU da EC2.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function obterConsumoRAMController(req, res) {

    console.log(`Recuperando o consumo da RAM da EC2`);

    obterTempCPUModel.getConsumoRAM().then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar o consumo da RAM da EC2.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

function obterConsumoDISCOController(req, res) {

    console.log(`Recuperando o consumo do DISCO da EC2`);

    obterTempCPUModel.getConsumoDISCO().then(function (resultado) {
        if (resultado.length > 0) {
            res.status(200).json(resultado);
        } else {
            res.status(204).send("Nenhum resultado encontrado!")
        }
    }).catch(function (erro) {
        console.log(erro);
        console.log("Houve um erro ao buscar o consumo do DISCO da EC2.", erro.sqlMessage);
        res.status(500).json(erro.sqlMessage);
    });
}

module.exports = {  obterConsumoCPUController,
                    obterConsumoRAMController,
                    obterConsumoDISCOController
                    };