const express = require('express');
const path = require('path');
const { Storage } = require('@google-cloud/storage');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Servir arquivos estáticos (HTML, CSS, JS) da pasta "public"

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });


// Rota de upload para integração com o Google Cloud
app.post('/uploadJsonFile', async (req, res) => {
  try {
    const { jsonString } = req.body;
    
    const fileName = "voto_" + Date.now() + ".json";

    await criaArquivoJson(jsonString, fileName)

    await salvaArquivo(fileName);

    //await deletaArquivoJson(fileName);

    res.status(200).send(`${fileName} salvo com sucesso.`);

  } catch (error) {
    console.error('Erro no upload do arquivo:', error);
    res.status(500).send('Erro no upload do arquivo');
  }
});

async function criaArquivoJson(jsonString, fileName) {
    return new Promise((resolve, reject) => {
        try {
            // Determina o caminho completo do arquivo
            const filePath = path.join(__dirname, fileName);

            // Criar o arquivo .json
            fs.writeFile(filePath, jsonString, (err) => {
                if (err) {
                    console.error("Erro ao criar o arquivo:", err);
                    reject(err); // Rejeita a Promise em caso de erro
                    return; // Sai da função após o erro
                }
                console.log(`Arquivo ${fileName} criado com sucesso!`);
                resolve(); // Resolve a Promise quando o arquivo é criado
            });
        } catch (err) {
            console.error("Erro inesperado ao criar o arquivo:", err);
            reject(err); // Rejeita a Promise em caso de exceção
        }
    });
}

async function deletaArquivoJson(fileName) {
    return new Promise(async (resolve, reject) => {
        try {
            // Exclui o arquivo usando fs.unlink
            await fs.unlink(fileName);
            console.log(`Arquivo ${fileName} deletado com sucesso.`);
            resolve();
        } catch (err) {
            console.error("Erro ao deletar o arquivo:", err);
            reject(err);
        }
    });
}

// Função para guardar dados no Google Cloud
async function salvaArquivo(jsonFileName) {
    return new Promise(async (resolve, reject) => {
        try {
            // The ID of your GCS bucket
            const bucketName = 'votos_mda_2024';

            // The contents that you want to upload
            const contents = './' + jsonFileName;

            // Creates a client
            const storage = new Storage();

            const file = storage.bucket(bucketName).file(jsonFileName);

            // Returns an authenticated endpoint to which you can make requests without credentials.
            const [location] = await file.createResumableUpload(); //auth required

            const options = {
                uri: location,
                resumable: true,
                validation: false,

                // Optional:
                // Set a generation-match precondition to avoid potential race conditions
                // and data corruptions. The request to upload is aborted if the object's
                // generation number does not match your precondition. For a destination
                // object that does not yet exist, set the ifGenerationMatch precondition to 0
                // If the destination object already exists in your bucket, set instead a
                // generation-match precondition using its generation number.
                preconditionOpts: {ifGenerationMatch: 0}//generationMatchPrecondition},
            };

            // Passes the location to file.save so you don't need to authenticate this call
            await file.save(contents, options);

            console.log(`${destFileName} uploaded to ${bucketName}`);
            resolve(`${fileName} uploaded to ${bucketName}`);
        } catch (err) {
            console.error("Error uploading file:", err);
            reject(err);
        }
    });
}