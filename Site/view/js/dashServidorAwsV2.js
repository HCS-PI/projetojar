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
