/*
    Criação dos cards dinâmicamente:
*/

// Lista de perguntas e respostas
const cardsData = [
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
    },
    { // CATEGORIA ESPECIAL
        pergunta: "ESPECIAL: ATLÉTICA COM OS PIORES BEIJOS DO ANO 🤢",
        respostas: [
            "Tagarela", "Sedentária", "Soberana", "Malcriada", "Magnata", "Kraken", "Predadora",
            "Devasta", "Banguela", "Unidos do Vale", "Sanguinária", "Malagueta", "Sulfurosa",
            "Desastrosa", "Pintada", "Mafiosa", "Enigma", "Chefia", "Faminta", "Mercenária",
            "Trepadeira", "Unificada", "Overdose", "Madrasta", "Gambiarra", "Quimera",
            "Problemática", "Neurótica", "Vira-Lata", "Agro", "Picareta", "Subversiva",
            "Analfabeta", "Improdutiva", "Simbiótica", "Berranteira", "Mecânica", "Hamiltoniana",
            "Venenosa", "Tectônica", "Arregaçada", "Dolorosa", "Dramática"
        ]
    },
];

// Seleciona o container do grid
const gridContainer = document.getElementById("grid-container");

// Função para criar os cards dinamicamente
function criarCards(data) {
    data.forEach((item, index) => {
        // Criação do card
        const card = document.createElement("div");
        card.className = "card";

        // Adiciona o título da pergunta
        const titulo = document.createElement("h3");
        titulo.textContent = item.pergunta;
        card.appendChild(titulo);

        // Criação do formulário com as opções
        const form = document.createElement("form");
        if (index < data.length - 1) {
            // Adiciona as opções de resposta como rádio
            item.respostas.forEach((resposta) => {
                const label = document.createElement("label");

                const radio = document.createElement("input");
                radio.type = "radio";
                radio.name = `pergunta${index}`; // Agrupa as opções por pergunta
                radio.value = resposta;

                label.appendChild(radio);
                label.appendChild(document.createTextNode(` ${resposta}`));

                form.appendChild(label);
            });
        } else {
            // Último card: Adiciona um select com as opções
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

            form.appendChild(select);
        }

        // Adiciona o formulário ao card
        card.appendChild(form);
        gridContainer.appendChild(card);
    });
}

// Chama a função para criar os cards
criarCards(cardsData);
