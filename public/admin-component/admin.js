const urlDom = "http://localhost:3000"; // Local
//const urlDom = "https://atleticaenigma.com.br"; // Produção

async function buscaVotos() {
    const url = urlDom + '/buscaVotos';
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log(response.text())

        // Verifica se a resposta é bem-sucedida
        if (!response.ok) {
            throw new Error(await response.text());
        }

        // Retorna o corpo da resposta como texto
        return await response.json();
    } catch (err) {
        // Trata e propaga o erro
        console.error(err.message);
        throw err;
    }
}



// Ao iniciar
buscaVotos();