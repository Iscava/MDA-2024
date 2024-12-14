//const urlDom = "http://localhost:3000"; // Local
const urlDom = "https://atleticaenigma.com.br"; // Produção

async function buscaVotos() {
    spinner(true);
    const url = urlDom + '/buscaVotos';
    try {
        const response = await fetch(url, {
            timeout: 600000,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(await response.text());
        }

        spinner(false, false);

        return await response.json();
    } catch (err) {
        spinner(false, true);
        console.error(err.message);
        throw err;
    }
}

function spinner(show, err) {
    const spinnerContainer = document.getElementById("spinner-overlay");
    const spinner = document.querySelector('#spinner-overlay .spinner');
    const spinnerText = document.querySelector('#spinner-overlay p');
    if (show) {
        spinnerContainer.style.display = "flex";
    } else {
        if (err) {
            spinner.outerHTML = '<i class="fa-solid fa-circle-xmark" style="color: darkred; font-size: 3rem;"></i>';
            spinnerText.textContent = 'ERRO!';
            spinnerText.style.color = 'darkred';
        } else {
            spinner.outerHTML = '<i class="fa-solid fa-circle-check" style="color: green; font-size: 3rem;"></i>';
            spinnerText.textContent = 'Tudo certo!';
            spinnerText.style.color = 'green';
        }
        setTimeout(() => {
            spinnerContainer.style.display = "none";
        }, 1000);
    }
}

// Função para criar gráficos dinamicamente
function criaGrafico(pergunta, labels, data, containerId, chartId) {
    const container = document.getElementById(containerId);
  
    // Cria o canvas para o gráfico
    const canvas = document.createElement('canvas');
    canvas.id = `chart-${containerId}-${chartId}`;
    canvas.style.maxWidth = "800px"; // Largura do gráfico maior do que o contêiner (para ativar o scroll)
    // canvas.style.height = "400px"; // Defina uma altura fixa ou dinâmica

    container.appendChild(canvas);
  
    // Criar o gráfico
    new Chart(canvas, {
      type: 'bar',
      data: {
        labels:  labels,
        datasets: [
          {
            label: pergunta,
            data: data,
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
          }
        ]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        scales: {
          x: {
            beginAtZero: true
          }
        }
      }
    });
  }
  
// Filtrar dados e gerar gráficos
function processaResposta(jsonResposta) {
    try {
        const containerId = "grid-container";

        jsonResposta.forEach((item, index) => {
            const { pergunta, escolhas } = item;
            const filteredEscolhas = escolhas.filter(escolha => escolha.escolha !== "");
        
            const labels = filteredEscolhas.map(escolha => escolha.escolha);
            const data = filteredEscolhas.map(escolha => escolha.votos);

            criaGrafico(pergunta, labels, data, containerId, index);
            if (index ==2){
                return;
            }
        });
    } catch (error) {
        throw new Error(error);
    }
}

async function atualizaResultados() {
    const response = await buscaVotos();
    console.log(response);
    processaResposta(response);
}

async function iniciar() {
    try {
        await atualizaResultados();
    } catch (err) {
        console.error(err);
    }
}

// Chama a função ao iniciar
iniciar();