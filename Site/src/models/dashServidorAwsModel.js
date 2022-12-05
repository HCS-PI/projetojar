var database = require("../database/config");

function getConsumoCPU() {
    instrucaoSql = `select * from vwServerAWSInfoCPU;`
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getConsumoRAM() {
    instrucaoSql = `select * from vwDashAwsConsumoRAM;`
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function getConsumoDISCO() {
    instrucaoSql = `select * from vwDashAwsConsumoDISCO;`
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {getConsumoCPU,
                 getConsumoRAM,
                 getConsumoDISCO};