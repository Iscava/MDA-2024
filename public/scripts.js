//const urlDom = "http://localhost:3000"; // Local
const urlDom = "https://mda.atleticaenigma.com.br"; // Produção

// Lista de perguntas e respostas
const cardsData = [
    { // CATEGORIA ESPECIAL
        pergunta: "ATLÉTICA COM OS PIORES BEIJOS DO ANO 🤢",
        respostas: [
            "Tagarela", "Sedentária", "Soberana", "Malcriada", "Magnata", "Kraken", "Predadora",
            "Devasta", "Banguela", "Unidos do Vale", "Sanguinária", "Malagueta", "Sulfurosa",
            "Desastrosa", "Pintada", "Mafiosa", "Enigma", "Chefia", "Faminta", "Mercenária",
            "Trepadeira", "Unificada", "Overdose", "Madrasta", "Gambiarra", "Quimera",
            "Problemática", "Neurótica", "Vira-Lata", "Agro", "Picareta", "Subversiva",
            "Analfabeta", "Improdutiva", "Simbiótica", "Berranteira", "Mecânica", "Hamiltoniana",
            "Venenosa", "Tectônica", "Arregaçada", "Dolorosa", "Dramática"
        ],
        escolha: ""
    },
    {
        pergunta: "MELHOR FESTA DO ANO",
        respostas: ["Sanguinária e o Enigma do Mé", "Funkjama", "Interpoc", "Blackout", "Primeira do ano", "Operação LavaJato", "ViraDevasta", "Computaria"]
    },
    {
        pergunta: "MELHOR CHOPPADA DO ANO",
        respostas: ["Baile das Agrárias", "Nutriodonto", "Chevet", "Choppalooza", "Furacão 2000", "Funkcina", "Choppada Mafiosa", "Swing", "Sedenta"]
    },
    {
        pergunta: "MELHOR FESTA TEMÁTICA DO ANO",
        respostas: ["Analoween", "Mamaela", "Caloucom", "Carna Anal", "Chapados e pelados", "Operação Natal", "Baile da Mamata", "Embrulha meu Peru 2023"]
    },
    {
        pergunta: "MELHOR SUNSET DO ANO",
        respostas: ["Fenda do Bikini", "Tardezinha Magnosa", "Terapinga", "Bixarada", "De volta para o passado", "SociéPagode", "Melatude", "Sunset dos Exquecidos", "Mamaela"]
    },
    {
        pergunta: "MELHOR EVENTO ESPORTIVO DO ANO",
        respostas: ["Adidas Sunset Party", "Bearcup", "Intercap", "Tiffu", "Mario And Luigi's World", "Menor Inter"]
    },
    {
        pergunta: "MELHOR DCE DO ANO",
        respostas: ["Prodose", "RelaMec", "Chuppadinha Sanguinária", "Baile du Nelsu", "Noite do Baguga", "DCE dos Campeões", "Melhor Sexta", "Tagafiosa"]
    },
    {
        pergunta: "MELHOR ETÍLICOS DO ANO",
        respostas: ["Colônia de Férias", "Menor Inter", "MecNutri", "Alcoolimpíadas", "Sunshark"]
    },
    {
        pergunta: "MELHOR ATRAÇÃO DO ANO",
        respostas: ["MC Saci (Sanguinária e o Enigma do Mé)", "Bonde das Maravilhas (Blackout)", "Rick + Jacaré (Funkjama)", "Henrique de Ferraz (Primeira do Ano)", "Rennan da Penha (Vira Devasta)", "MC GW + Ramemes (Embrulha meu Peru 2023)"]
    },
    {
        pergunta: "MELHOR PALCO DO ANO",
        respostas: ["Primeira do Ano", "Sanguinária e o Enigma do Mé", "Funkjama", "Computaria", "Analloween", "Operação LavaJato"]
    },
    {
        pergunta: "MELHOR <QUASE> CHOPPADA DO ANO",
        respostas: ["Salva Semestre", "Operação LavaJato (1° data)", "SunSalim", "Eclipse DJS", "Civil Minha Pic*", "FarmaFunk"]
    },
    {
        pergunta: "MELHOR BATERIA DO ANO",
        respostas: ["Venenosa", "Mafiosa", "Dramática", "Sanguinária", "Analfabeta", "Tagarela", "Canina", "Madrasta"]
    },
    {
        pergunta: "MELHOR DJ DO ANO",
        respostas: ["Niko", "Yong", "Berrix", "Walker", "Lousa", "Rodrigona", "Any Volazi", "Blenu", "Georgya", "Samuray"]
    },
    {
        pergunta: "MELHOR COLEÇÃO DO ANO",
        respostas: ["Magnata", "Enigma", "Gambiarra", "Chefia", "Pintada", "Tagarela", "Overdose", "Mafiosa", "Malagueta", "Vira-lata"]
    }
];

// Seleciona o container do grid
const gridContainer = document.getElementById("grid-container");

// Cria o honeypot
const honeypot = document.createElement("input");

function embaralharArray(array) {
    return array.sort(() => Math.random() - 0.5);
}
// Função para criar os cards dinamicamente
function criarCards(data) {
    data.forEach(item => {
        item.respostas = embaralharArray(item.respostas);
    });
    
    data.forEach((item, index) => {
        // Criação do card
        const card = document.createElement("div");
        card.className = "card";
       // card.classList.add('fadeIn'); // Aplica animação para transição suave

        // Adiciona o título da pergunta
        const titulo = document.createElement("h3");
        if (index == 0) {
            titulo.innerHTML = `<span class="primeira-palavra">${"ESPECIAL: "}</span>` + item.pergunta;
        } else {
            titulo.textContent = item.pergunta;
        }
        card.appendChild(titulo);

        // Criação do formulário com as opções
        const form = document.createElement("form");
        if (index > 0) {
            // Adiciona as opções de resposta como rádio
            item.respostas.forEach((resposta) => {
                const label = document.createElement("label");

                const radio = document.createElement("input");
                radio.type = "radio";
                radio.name = `pergunta${index}`; // Agrupa as opções por pergunta
                radio.value = resposta;

                // Evento onchange para capturar a escolha
                radio.addEventListener("change", () => {
                    item.escolha = resposta; // Atualiza o campo "escolha"
                    console.log(`Escolha na pergunta "${item.pergunta}": ${item.escolha}`);
                });

                label.appendChild(radio);
                label.appendChild(document.createTextNode(` ${resposta}`));

                form.appendChild(label);
            });
        } else {
            // Primeiro card: Adiciona um select com as opções
            const select = document.createElement("select");
            select.name = `pergunta${index}`;
            select.classList.add("custom-select");

            // Adiciona a opção inicial padrão
            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "Escolha uma atlética";
            defaultOption.selected = true;
            defaultOption.disabled = true; // Impede seleção futura
            select.appendChild(defaultOption);

            // Adiciona as opções reais
            item.respostas.forEach((resposta) => {
                const option = document.createElement("option");
                option.value = resposta;
                option.textContent = resposta;
                select.appendChild(option);
            });

            // Evento onchange para capturar a escolha
            select.addEventListener("change", () => {
                item.escolha = select.value; // Atualiza o campo "escolha"
                console.log(`Escolha na pergunta "${item.pergunta}": ${item.escolha}`);
            });

            form.appendChild(select);
        }

        // Adiciona o formulário ao card
        card.appendChild(form);
        gridContainer.appendChild(card);
    });

    // Implementação do HoneyPot para bot
    const form = document.createElement("form");
    honeypot.type = "text";
    honeypot.name = "honeypot"; // Nome do campo honeypot
    honeypot.style.display = "none"; // Torna o campo invisível
    form.appendChild(honeypot)
    gridContainer.appendChild(form)

    // Adiciona o scroll para o topo após a criação dos cards
    setTimeout(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }, 100); // Pequeno atraso para garantir que a página foi carregada
}

// Função para registrar a votação
async function registrarVotacao() {
    try {
        if (honeypot.value) {
            alert("Bot detectado! Você acha que eu sou trouxa ?");
            location.reload();
            return;
        }

        // Obter o IP do usuário
        const response = await fetch('https://api64.ipify.org?format=json');
        const data = await response.json();
        const ip = data.ip;

        // Obter o datetime atual
        const datetime = new Date().toISOString();

        // Criar o objeto de votação
        const votacao = cardsData.map(item => ({
            pergunta: item.pergunta,
            escolha: item.escolha || ""
        }));

        // Criar o JSON final
        const resultado = {
            data: datetime,
            ip: ip,
            votacao: JSON.stringify(votacao)
        };
        const resultadoString = JSON.stringify(resultado, null, 2);
        console.log(resultadoString);

        // Lógica para guardar os dados
        await uploadJsonFile(resultadoString).then((response) => {
            console.log(response);
            alert("Votação registrada com sucesso!");
            location.reload();
            return;
        });

    } catch (error) {
        alert(error);
    }
}

async function uploadJsonFile(jsonString) {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(urlDom + '/uploadJsonFile', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ jsonString }), // Passa os dados como JSON
            });

            if (!response.ok) {
                if (response.status === 429) {
                    reject(await response.text());
                } else {
                    reject("Erro ao registrar a votação. Tente novamente.");
                }
            }
                      
            resolve(await response.text());
        } catch (err) {
            reject(err);
        }
    });
}

// Chama a função para criar os cards
criarCards(cardsData);