const express = require('express');
const path = require('path');
const { Storage } = require('@google-cloud/storage');
const bodyParser = require('body-parser');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Servir arquivos estáticos (HTML, CSS, JS) da pasta "public"

// Implementação de Rate Limiting usando a biblioteca express-rate-limit para limitar o número de requisições por ip em um tempo determinado
/*const limiter = rateLimit({
    windowMs: 3000, // 3 segundos
    max: 1,
    message: "Sem trapacear, espertin!!!. Espere 3 segundos para votar.",
  });
  app.use(limiter);  */

// Rota para /admin
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin-component', 'admin.html'));
});

// Iniciar o servidor
const port = process.env.PORT || 3000;
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

// Rota que retorna a lista com todos os votos
app.get('/buscaVotos', async (req, res) => {
  try {
    res.status(200).send(await processaVotos());
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

// Requisição para buscar todos os votos do bucket
async function buscaVotos() {
    return new Promise(async (resolve, reject) => {
        try {
            // Creates a client
            const storage = new Storage();
            
            // resolve(await storage.bucket('votos_mda_2024').getFiles());

            const votosPromises = [];

            storage.bucket('votos_mda_2024').getFilesStream()
            .on('error', (err) => {
              console.error('Erro ao listar arquivos:', err);
              reject(err);
            })
            .on('data', (file) => {
              // Adiciona a promessa de leitura do arquivo na lista
              votosPromises.push(
                new Promise((resolveFile, rejectFile) => {
                  const stream = file.createReadStream();
                  let fileContent = '';
    
                  stream
                    .on('data', (chunk) => {
                      fileContent += chunk; // Acumula os dados do stream
                    })
                    .on('end', () => {
                      try {
                        const jsonContent = JSON.parse(fileContent); // Parse do JSON
                        if (jsonContent.votacao) {
                          resolveFile(JSON.parse(jsonContent.votacao)); // Retorna apenas o campo 'votacao' como um array
                        } else {
                          resolveFile(null); // Caso não exista o campo 'votacao'
                        }
                      } catch (err) {
                        console.error(`Erro ao processar o arquivo ${file.name}:`, err);
                        rejectFile(err); // Rejeita a promessa se houver erro
                      }
                    })
                    .on('error', (err) => {
                      console.error(`Erro ao ler o arquivo ${file.name}:`, err);
                      rejectFile(err); // Rejeita a promessa em caso de erro no stream
                    });
                })
              );
            })
            .on('end', async () => {
              try {
                // Processa todas as promessas em paralelo
                const resultados = await Promise.all(votosPromises);
    
                // Filtra nulos e resolve com a lista de votações
                resolve(resultados.filter((votacao) => votacao !== null));
              } catch (err) {
                console.error('Erro ao processar os arquivos:', err);
                reject(err);
              }
            });

        } catch (err) {
            reject("Erro ao buscar os votos:" + err);
        }
    });
}

// Função que processa os votos
async function processaVotos() {
  return new Promise(async (resolve, reject) => {
    try {
      // Obtém os votos
      const listaDeVotos = await buscaVotos();
      // Objeto para armazenar contagens
      const resultados = {};
      console.log(listaDeVotos.length)
      // Processa cada conjunto de votos
      listaDeVotos.forEach((votos, index) => {
        if (!Array.isArray(votos)) {
          console.warn(`Elemento ${index} não é um array de votos, ignorado.`);
          return;
        }

        votos.forEach(({ pergunta, escolha }) => {
          // Inicializa se necessário
          if (!resultados[pergunta]) {
            resultados[pergunta] = {};
          }
          if (!resultados[pergunta][escolha]) {
            resultados[pergunta][escolha] = 0;
          }

          resultados[pergunta][escolha]++;
        });
      });

      // Formata os resultados para o gráfico
      const dadosParaGrafico = Object.entries(resultados).map(([pergunta, escolhas]) => {
        return {
          pergunta,
          escolhas: Object.entries(escolhas).map(([escolha, votos]) => ({
            escolha,
            votos
        }))
        .sort((a, b) => b.votos - a.votos)
      };
    });

      resolve(dadosParaGrafico);
    } catch (err) {
        reject("Erro no processamento dos votos:" + err);
    }
  });
}