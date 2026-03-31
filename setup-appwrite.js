const sdk = require('node-appwrite');

// ==========================================
// ⚠️ INSIRA SUA API KEY AQUI
// ==========================================
const API_KEY = 'standard_434c4a0a861f755cf97728c553a65386123afd1e082a95fdf26734f34022869db676759f344afd143023f32c0d1a145b254e4be50794317a74e286d26897ac0b8fef4a791c881639783f35ca8165bd26de0264b8e193655117d715fdde0ea5bb1759255794fc1dad558f2e6a8fea99da9f3a1a710261488d1439cccf2c01f181'; // <- Cole a chave gerada no painel do Appwrite aqui

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

// Helper para aguardar a criação dos atributos
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function setupAppwrite() {
  console.log('🎰 Iniciando configuração do Banco de Dados Lucky 021...');

  try {
    // 1. Criar Database
    console.log(`\nBanco de Dados [${DATABASE_ID}] já deve existir...`);
    // try {
    //   await databases.create(DATABASE_ID, 'Banco Lucky 021');
    //   console.log('✅ Banco de dados criado.');
    // } catch (e) {
    //   if (e.code === 409) console.log('⚠️ Banco já existe. Pulando...');
    //   else throw e;
    // }

    // 2. Criar Collection 'produtos'
    console.log(`\nCriando Collection [produtos]...`);
    try {
      await databases.createCollection(DATABASE_ID, 'produtos', 'Produtos');
      console.log('✅ Collection criada. Criando colunas (isso pode demorar uns segundos)...');
      
      await databases.createStringAttribute(DATABASE_ID, 'produtos', 'nome', 100, true);
      await databases.createStringAttribute(DATABASE_ID, 'produtos', 'descricao', 1000, true);
      await databases.createFloatAttribute(DATABASE_ID, 'produtos', 'preco', true);
      await databases.createIntegerAttribute(DATABASE_ID, 'produtos', 'estoque', true);
      await databases.createStringAttribute(DATABASE_ID, 'produtos', 'categoriaId', 50, true);
      await databases.createStringAttribute(DATABASE_ID, 'produtos', 'imagens', 255, false, null, true); // array
      await databases.createBooleanAttribute(DATABASE_ID, 'produtos', 'destaque', false, false);
      
      console.log('✅ Colunas de [produtos] solicitadas.');
    } catch (e) {
      if (e.code === 409) console.log('⚠️ Collection produtos já existe.');
      else throw e;
    }

    // 3. Criar Collection 'categorias'
    console.log(`\nCriando Collection [categorias]...`);
    try {
      await databases.createCollection(DATABASE_ID, 'categorias', 'Categorias');
      console.log('✅ Collection criada. Criando colunas...');
      
      await databases.createStringAttribute(DATABASE_ID, 'categorias', 'nome', 50, true);
      await databases.createStringAttribute(DATABASE_ID, 'categorias', 'icone', 20, false, 'diamond');
      
      console.log('✅ Colunas de [categorias] solicitadas.');
    } catch (e) {
      if (e.code === 409) console.log('⚠️ Collection categorias já existe.');
      else throw e;
    }

    // 4. Criar Collection 'pedidos'
    console.log(`\nCriando Collection [pedidos]...`);
    try {
      await databases.createCollection(DATABASE_ID, 'pedidos', 'Pedidos');
      console.log('✅ Collection criada. Criando colunas...');
      
      await databases.createStringAttribute(DATABASE_ID, 'pedidos', 'clienteId', 50, true);
      await databases.createStringAttribute(DATABASE_ID, 'pedidos', 'clienteNome', 100, true);
      await databases.createFloatAttribute(DATABASE_ID, 'pedidos', 'valorTotal', true);
      await databases.createStringAttribute(DATABASE_ID, 'pedidos', 'status', 20, true); // Removed default value since it's required
      await databases.createStringAttribute(DATABASE_ID, 'pedidos', 'itens', 5000, true); // JSON mix 
      await databases.createStringAttribute(DATABASE_ID, 'pedidos', 'endereco', 1000, true); // JSON mix
      
      console.log('✅ Colunas de [pedidos] solicitadas.');
    } catch (e) {
      if (e.code === 409) console.log('⚠️ Collection pedidos já existe.');
      else throw e;
    }

    // 5. Criar Bucket de Storage
    console.log(`\nCriando Bucket para fotos [${BUCKET_ID}]...`);
    try {
      await storage.createBucket(
        BUCKET_ID, 
        'Fotos dos Produtos', 
        ['any'], // Permissões (quem pode ver)
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

    console.log('\n🎉 SUCESSO! Banco de dados estruturado.');
    console.log('Acesse o painel do Appwrite para conferir. Agora você deve dar permissões de Leitura(read) e Escrita(write) nas Collections para "Any" ou "Users" se quiser testes livres, pois os atributos ainda estarão carregando lá.');

  } catch (error) {
    console.error('\n❌ Erro crítico:', error.message);
  }
}

setupAppwrite();
