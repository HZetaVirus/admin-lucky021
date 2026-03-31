const sdk = require('node-appwrite');

// ==========================================
// ⚠️ DADOS DO SEU USUÁRIO ADMIN
// ==========================================
const ADMIN_EMAIL = 'lucky021@lucky021.com'; // Digite aqui o e-mail desejado
const ADMIN_PASSWORD = 'lucky021@123';   // Digite aqui a senha (mínimo 8 caracteres)
const ADMIN_NOME = 'Administrador Chefe';

const API_KEY = 'standard_434c4a0a861f755cf97728c553a65386123afd1e082a95fdf26734f34022869db676759f344afd143023f32c0d1a145b254e4be50794317a74e286d26897ac0b8fef4a791c881639783f35ca8165bd26de0264b8e193655117d715fdde0ea5bb1759255794fc1dad558f2e6a8fea99da9f3a1a710261488d1439cccf2c01f181';
const ENDPOINT = 'https://nyc.cloud.appwrite.io/v1';
const PROJECT_ID = '69b1acbe003cf6c0aa3d';

const client = new sdk.Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const users = new sdk.Users(client);

async function createAdmin() {
  console.log('👑 Criando Credenciais do Administrador...');

  try {
    // 1. Cria o usuário no sistema de Auth do Appwrite (não na database)
    const user = await users.create(
      sdk.ID.unique(),
      ADMIN_EMAIL,
      undefined, // phone
      ADMIN_PASSWORD,
      ADMIN_NOME
    );

    // 2. Define o "Role" desse usuário como admin nas preferências
    await users.updatePrefs(user.$id, { role: 'admin' });

    console.log(`\n✅ Usuário Admin criado com SUCESSO!`);
    console.log(`Email de acesso: ${ADMIN_EMAIL}`);
    console.log(`Senha: [Oculta]`);
    console.log(`Ele já pode fazer login no painel Admin (localhost:4201).`);

  } catch (error) {
    if (error.code === 409) {
      console.log('⚠️ Já existe um usuário com este e-mail no sistema.');
    } else {
      console.error('❌ Erro ao criar admin:', error.message);
    }
  }
}

createAdmin();
