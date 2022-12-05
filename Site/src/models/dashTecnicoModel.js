var database = require("../database/config");

function carrosMonitorados(idEmpresa) {
  instrucaoSql = `
    SELECT fk_empresa, COUNT(id_carro) AS 'qtdCarro' FROM Carro WHERE fk_empresa = ${idEmpresa} group by fk_empresa;`;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}
function verCarrosProblema(idEmpresa) {
/*   instrucaoSql = `
    SELECT * from vwDashTec WHERE CodEmpresa = ${idEmpresa} and Componente != 'DISCO'  
    ORDER BY Valor desc limit 1000;`; */
  instrucaoSql = `
    SELECT TOP 600 * from vwDashTec WHERE CodEmpresa = ${idEmpresa} and Componente != 'DISCO'  
    ORDER BY Valor desc ;`;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function verDetalhes(idCarro) {
  instrucaoSql = `
    SELECT endereco_mac, placa_carro, modelo from carro where id_carro = ${idCarro} ;`;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function dispositivos(idCarro) {
  instrucaoSql = `select TOP 10 * from vwDispositivos where fk_carro =  ${idCarro}
  order by id_medida desc ;  `;
/*   instrucaoSql = `select * from vwDispositivos where fk_carro =  ${idCarro}
  order by id_medida desc limit 10;  `; */
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function processo(idCarro) {
  instrucaoSql = `
    
    select * from vwProcessos where fk_carro = ${idCarro}  order by cpu_perc desc;`;

  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function pegarRam(idCarro) {
  instrucaoSql = `
    select TOP 5 * from vwPegarRam where fk_carro = ${idCarro} order by id_medida desc;`;
/*   instrucaoSql = `
    select * from vwPegarRam where fk_carro = ${idCarro} order by id_medida desc limit 5;`; */
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function pegarCpu(idCarro) {
  instrucaoSql = `
  select  TOP 10 * from vwPegarCpu where fk_carro = ${idCarro}  order by id_medida desc;`;
  /* instrucaoSql = `
  select * from vwPegarCpu where fk_carro = ${idCarro}  order by id_medida desc limit 10;`; */
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

function pegarDisco(idCarro) {
  instrucaoSql = `
  select * from vwPegarDisco where fk_carro = ${idCarro} order by id_medida desc limit 10;`;
  console.log("Executando a instrução SQL: \n" + instrucaoSql);
  return database.executar(instrucaoSql);
}

module.exports = {
  carrosMonitorados,
  verCarrosProblema,
  verDetalhes,
  dispositivos,
  processo,
  pegarCpu,
  pegarRam,
  pegarDisco,
};
