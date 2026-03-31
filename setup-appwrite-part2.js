const sdk = require('node-appwrite');

const API_KEY = 'standard_434c4a0a861f755cf97728c553a65386123afd1e082a95fdf26734f34022869db676759f344afd143023f32c0d1a145b254e4be50794317a74e286d26897ac0b8fef4a791c881639783f35ca8165bd26de0264b8e193655117d715fdde0ea5bb1759255794fc1dad558f2e6a8fea99da9f3a1a710261488d1439cccf2c01f181';
const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = '69b1acbe003cf6c0aa3d';
const DATABASE_ID = 'lucky021_db';
const BUCKET_ID = 'produtos_bucket';

const client = new sdk.Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const databases = new sdk.Databases(client);
const storage = new sdk.Storage(client);

async function setupAppwritePart2() {
  console.log('🎰 Retomando configuração: Atributos de Pedidos e Bucket...');

  try {
    console.log(`\nAdicionando colunas de [pedidos]...`);
    try { await databases.createStringAttribute(DATABASE_ID, 'pedidos', 'clienteId', 50, true); } catch(e) { if(e.code !== 409) throw e; }
    try { await databases.createStringAttribute(DATABASE_ID, 'pedidos', 'clienteNome', 100, true); } catch(e) { if(e.code !== 409) throw e; }
    try { await databases.createFloatAttribute(DATABASE_ID, 'pedidos', 'valorTotal', true); } catch(e) { if(e.code !== 409) throw e; }
    try { await databases.createStringAttribute(DATABASE_ID, 'pedidos', 'status', 20, true); } catch(e) { if(e.code !== 409) throw e; }
    try { await databases.createStringAttribute(DATABASE_ID, 'pedidos', 'itens', 5000, true); } catch(e) { if(e.code !== 409) throw e; }
    try { await databases.createStringAttribute(DATABASE_ID, 'pedidos', 'endereco', 1000, true); } catch(e) { if(e.code !== 409) throw e; }
    console.log('✅ Colunas de [pedidos] garantidas.');

    console.log(`\nCriando Bucket para fotos [${BUCKET_ID}]...`);
    try {
      await storage.createBucket(
        BUCKET_ID, 
        'Fotos dos Produtos', 
        [sdk.Permission.read(sdk.Role.any())], 
        false, 
        true, 
        undefined, 
        ['jpg', 'png', 'jpeg', 'webp']
      );
      console.log('✅ Bucket criado.');
    } catch (e) {
      if (e.code === 409) console.log('⚠️ Bucket já existe.');
      else throw e;
    }

    console.log('\n🎉 SUCESSO! Banco de dados e Storage totalmente estruturados.');

  } catch (error) {
    console.error('\n❌ Erro crítico:', error.message);
  }
}

setupAppwritePart2();
