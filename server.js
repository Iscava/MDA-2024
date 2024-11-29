const express = require('express');
const path = require('path');
const { Storage } = require('@google-cloud/storage');
const bodyParser = require('body-parser');
const fs = require('fs');
const rateLimit = require('express-rate-limit');

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Servir arquivos estáticos (HTML, CSS, JS) da pasta "public"

// Implementação de Rate Limiting usando a biblioteca express-rate-limit para limitar o número de requisições por ip em um tempo determinado
const limiter = rateLimit({
    windowMs: 15000, // 15 segundos
    max: 1,
    message: "Sem trapacear, espertin!!!. Espere 15 segundos após uma votação para votar novamente.",
  });
  app.use(limiter);  

// Iniciar o servidor
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });


// Rota de upload para integração com o Google Cloud
app.post('/uploadJsonFile', async (req, res) => {
  try {
    const { jsonString } = req.body;
    res.status(200).send(await salvaArquivo(jsonString));
  } catch (error) {
    res.status(500).send(error);
  }
});

// Função para guardar dados no Google Cloud
async function salvaArquivo(json) {
    return new Promise(async (resolve, reject) => {
        try {
            // Define o nome do arquivo
            jsonFileName = "voto_" + Date.now() + ".json";

            // The ID of your GCS bucket
            const bucketName = 'votos_mda_2024';

            // The contents that you want to upload
            const contents = json;

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

            resolve(`Upload do arquivo ${jsonFileName} para ${bucketName} realizado com sucesso.`);
        } catch (err) {
            reject("Erro no upload do arquivo:" + err);
        }
    });
}