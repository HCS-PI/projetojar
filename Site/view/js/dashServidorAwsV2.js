mostrarDadosCPU();


function mostrarDadosCPU() {
  div_info_RAM.style.display = "none";
  div_info_DISCO.style.display = "none";
  gerarGraficoCPU();
  div_info_CPU.style.display = "flex";
  setInterval(() => {
    gerarGraficoCPU();
  }, 1000);
}
function mostrarDadosRAM() {
  div_info_CPU.style.display = "none";
  div_info_DISCO.style.display = "none";
  gerarGraficoConsumoRAM();
  div_info_RAM.style.display = "flex";
  setInterval(() => {
    gerarGraficoConsumoRAM();
  }, 1000);
}
function mostrarDadosDISCO() {
  div_info_RAM.style.display = "none";
  div_info_CPU.style.display = "none";
  gerarGraficoConsumoDISCO();
  div_info_DISCO.style.display = "flex";
  setInterval(() => {
    gerarGraficoConsumoDISCO();
  }, 1000);
}

function gerarGraficoCPU() {
  vt_medidasConsumoCPU = [];
  vt_medidasTempCPU = [];
  vt_dataCPU = [];

  fetch("/dashServidorAws/obterInfoCPU", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(function (resposta) {
    if (resposta.ok) {
      resposta.json().then((json) => {
        for (let index = 0; index < json.length; index++) {
          console.log(json[index].ConsumoCpu);
          if (json[index].Dispositivo == 2) {
            vt_medidasTempCPU.push(json[index].Valores);
            var dataHorario = json[index].horario_registro.split("T");
            dataHorario = [
              dataHorario[0].replace(/-/g, "/"),
              dataHorario[1].slice(0, 8),
            ];
            vt_dataCPU.push(dataHorario);
          } else if (json[index].Dispositivo == 1) {
            
            vt_medidasConsumoCPU.push(json[index].Valores);
          }
          
        }

        document.getElementById("graficoCPU").remove();

        novoGraficoConsumoCPU = document.createElement("canvas");

        novoGraficoConsumoCPU.setAttribute("id", "graficoCPU");

        div_grafTemperaturaCPU.appendChild(novoGraficoConsumoCPU);

        spnTemperaturaCPU.innerHTML = vt_medidasTempCPU[0] + " °C";
        spnConsumoCPU.innerHTML = vt_medidasConsumoCPU[0] + " %";

        if (vt_medidasTempCPU[0] >= 90.0) {
          spnTemperaturaCPU.style.color= "#e81515"; 
          spnStatusTempCPU.innerHTML = "Temperatura Crítica!"; 
          spnStatusTempCPU.style.color= "#e81515"; 

        } else if (vt_medidasTempCPU[0] >= 75.0) {
          spnTemperaturaCPU.style.color= "#e86d15"; 
          spnStatusTempCPU.innerHTML = "Temperatura Muito Elevada!"; 
          spnStatusTempCPU.style.color= "#e86d15"; 
          
        } else if (vt_medidasTempCPU[0] >= 65.0) {
          spnTemperaturaCPU.style.color= "#ffeb33"; 
          spnStatusTempCPU.innerHTML = "Temperatura Elevada!"; 
          spnStatusTempCPU.style.color= "#ffeb33"; 

        } else {
          spnTemperaturaCPU.style.color= "#177834"; 
          spnStatusTempCPU.innerHTML = "Temperatura Segura (Normal)"; 
          spnStatusTempCPU.style.color= "#177834"; 
        }

        if (vt_medidasConsumoCPU[0] >= 90.0) {
          spnConsumoCPU.style.color= "#e81515"; 
          spnStatusConsumoCPU.innerHTML = "Consumo Crítico (PERIGO)!"; 
          spnStatusConsumoCPU.style.color= "#e81515"; 

        } else if (vt_medidasConsumoCPU[0] >= 75.0) {
          spnConsumoCPU.style.color= "#e86d15"; 
          spnStatusConsumoCPU.innerHTML = "Consumo Muito Elevado!"; 
          spnStatusConsumoCPU.style.color= "#e86d15"; 
          
        } else if (vt_medidasConsumoCPU[0] >= 65.0) {
          spnConsumoCPU.style.color= "#ffeb33"; 
          spnStatusConsumoCPU.innerHTML = "Consumo Elevado!"; 
          spnStatusConsumoCPU.style.color= "#ffeb33"; 

        } else {
          spnConsumoCPU.style.color= "#177834"; 
          spnStatusConsumoCPU.innerHTML = "Consumo Esperado (Normal)"; 
          spnStatusConsumoCPU.style.color= "#177834"; 
        }


        const dataConsumoCPU = [
          vt_dataCPU[4],
          vt_dataCPU[3],
          vt_dataCPU[2],
          vt_dataCPU[1],
          vt_dataCPU[0],
        ];

        const dados_consumoCPu = {
          labels: dataConsumoCPU,
          datasets: [
            {
              label: "Consumo CPU (%)",
              backgroundColor: "#00ffc8",
              borderColor: "#00ffc8",
              data: [
                vt_medidasConsumoCPU[4],
                vt_medidasConsumoCPU[3],
                vt_medidasConsumoCPU[2],
                vt_medidasConsumoCPU[1],
                vt_medidasConsumoCPU[0],
              ],
            },
            {
              label: "Temperatura CPU (°C)",
              backgroundColor: "#00ad88",
              borderColor: "#00ad88",
              data: [
                vt_medidasTempCPU[4],
                vt_medidasTempCPU[3],
                vt_medidasTempCPU[2],
                vt_medidasTempCPU[1],
                vt_medidasTempCPU[0],
              ],
            },
          ],
        };
        const config_consumoCpu = {
          type: "line",
          data: dados_consumoCPu,
          options: {
            animation: 0,
            responsive: false,
          },
        };

        const chart_temp = new Chart(
          document.getElementById("graficoCPU"),
          config_consumoCpu
        );
      });
    }
  });
}

function gerarGraficoConsumoRAM() {
  vt_medidasConsumoRAM = [];
  vt_dataConsumoRAM = [];

  fetch("/dashServidorAws/obterConsumoRAM", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(function (resposta) {
    if (resposta.ok) {
      resposta.json().then((json) => {
        for (let index = 0; index < json.length; index++) {
          console.log(json[index].ConsumoRam);
          vt_medidasConsumoRAM.push(json[index].ConsumoRam);

          var dataHorario = json[index].horario_registro.split("T");
          dataHorario = [
            dataHorario[0].replace(/-/g, "/"),
            dataHorario[1].slice(0, 8),
          ];

          vt_dataConsumoRAM.push(dataHorario);
        }

        document.getElementById("graficoConsumoRAM").remove();

        novoGraficoConsumoRAM = document.createElement("canvas");

        novoGraficoConsumoRAM.setAttribute("id", "graficoConsumoRAM");

        div_grafConsumoRAM.appendChild(novoGraficoConsumoRAM);

        spnConsumoRAM.innerHTML = vt_medidasConsumoRAM[0] + " %";

        totalRam = 8.0
        espacoUsadoRam = (totalRam * (vt_medidasConsumoRAM[0]/100)).toFixed(2)
        espacoDispRAM = (totalRam - espacoUsadoRam).toFixed(2)

        spnEspacoTotalRAM.innerHTML = `${totalRam.toFixed(2)} Gb`
        spnEspacoUsadoRAM.innerHTML = `${espacoUsadoRam} Gb`
        spnEspacoDisponivelRAM.innerHTML = `${espacoDispRAM} Gb`

        if (vt_medidasConsumoRAM[0] >= 90.0) {
          spnConsumoRAM.style.color= "#e81515"; 
          spnStatusConsumoRAM.innerHTML = "Consumo Crítico (PERIGO)!"; 
          spnStatusConsumoRAM.style.color= "#e81515"; 

        } else if (vt_medidasConsumoRAM[0] >= 75.0) {
          spnConsumoRAM.style.color= "#e86d15"; 
          spnStatusConsumoRAM.innerHTML = "Consumo Muito Elevado!"; 
          spnStatusConsumoRAM.style.color= "#e86d15"; 
          
        } else if (vt_medidasConsumoRAM[0] >= 65.0) {
          spnConsumoRAM.style.color= "#ffeb33"; 
          spnStatusConsumoRAM.innerHTML = "Consumo Elevado!"; 
          spnStatusConsumoRAM.style.color= "#ffeb33"; 

        } else {
          spnConsumoRAM.style.color= "#177834"; 
          spnStatusConsumoRAM.innerHTML = "Consumo Esperado (Normal)"; 
          spnStatusConsumoRAM.style.color= "#177834"; 
        }

        const dataConsumoRAM = [
          vt_dataConsumoRAM[4],
          vt_dataConsumoRAM[3],
          vt_dataConsumoRAM[2],
          vt_dataConsumoRAM[1],
          vt_dataConsumoRAM[0],
        ];

        const dados_consumoRAM = {
          labels: dataConsumoRAM,
          datasets: [
            {
              label: "Consumo RAM (%)",
              backgroundColor: "#b449de",
              borderColor: "#b449de",
              data: [
                vt_medidasConsumoRAM[4],
                vt_medidasConsumoRAM[3],
                vt_medidasConsumoRAM[2],
                vt_medidasConsumoRAM[1],
                vt_medidasConsumoRAM[0],
              ],
            },
          ],
        };
        const config_consumoRAM = {
          type: "line",
          data: dados_consumoRAM,
          options: {
            animation: 0,
            responsive: false,
          },
        };

        const chart_tempRAM = new Chart(
          document.getElementById("graficoConsumoRAM"),
          config_consumoRAM
        );
      });
    }
  });
}

function gerarGraficoConsumoDISCO() {
  fetch("/dashServidorAws/obterConsumoDISCO", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  }).then(function (resposta) {
    if (resposta.ok) {
      resposta.json().then((json) => {
        document.getElementById("graficoConsumoDISCO").remove();

        novoGraficoConsumoDISCO = document.createElement("canvas");

        novoGraficoConsumoDISCO.setAttribute("id", "graficoConsumoDISCO");

        div_grafConsumoDISCO.appendChild(novoGraficoConsumoDISCO);

        spnConsumoDISCO.innerHTML = `${json[0].ConsumoDisco} %`;

        totalDisco = 20.0
        espacoUsadoDisco = (totalDisco * (json[0].ConsumoDisco/100)).toFixed(2)
        espacoDispDisco = (totalDisco - espacoUsadoDisco).toFixed(2)

        spnEspacoTotalDISCO.innerHTML = `${totalDisco.toFixed(2)} Gb`
        spnEspacoUsadoDISCO.innerHTML = `${espacoUsadoDisco} Gb`
        spnEspacoDisponivelDISCO.innerHTML = `${espacoDispDisco} Gb`

        if (json[0].ConsumoDisco >= 90.0) {
          spnConsumoDISCO.style.color= "#e81515"; 
          spnStatusConsumoDISCO.innerHTML = "Armazenamento Cheio (PERIGO)!"; 
          spnStatusConsumoDISCO.style.color= "#e81515"; 

        } else if (json[0].ConsumoDisco >= 75.0) {
          spnConsumoDISCO.style.color= "#ffeb33"; 
          spnStatusConsumoDISCO.innerHTML = "Armazenamento Quase Cheio!"; 
          spnStatusConsumoDISCO.style.color= "#ffeb33"; 
          
        } else {
          spnConsumoDISCO.style.color= "#177834"; 
          spnStatusConsumoDISCO.innerHTML = "Armazenamento Esperado (Normal)"; 
          spnStatusConsumoDISCO.style.color= "#177834"; 
        }

        const graficoUsoDisco = ["Livre", "Utilizado"];

        const dados3 = {
          labels: graficoUsoDisco,
          datasets: [
            {
              label: "Uso de Disco (%)",
              backgroundColor: ["#a5a8a8", "#55cfed"],
              borderColor: "#000",
              data: [100 - json[0].ConsumoDisco, json[0].ConsumoDisco],
            },
          ],
        };

        const config3 = {
          type: "pie",
          data: dados3,
          options: {
            animation: 0,
            responsive: true,

            plugins: {
              legend: {
                position: "top",
              },
              title: {
                display: true,
                text: "Disco",
              },
            },
          },
        };

        const grafico3 = new Chart(
          document.getElementById("graficoConsumoDISCO"),
          config3
        );
      });
    }
  });
}
