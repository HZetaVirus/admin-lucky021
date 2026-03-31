Skill: Vercel Deploy Guardian 🚀
Descrição: Especialista em auditoria de pré-build para aplicações Web (Next.js, React, Vite) com foco em compatibilidade estrita com o ambiente Vercel.

1. Verificação de Variáveis de Ambiente (Env Vars)
Check: Comparar o arquivo .env.example ou .env.local com o código.

Bloqueio: Se houver process.env.NOME_VAR sendo usado sem estar mapeado ou sem um fallback seguro.

Ação: Validar se variáveis sensíveis não estão expostas no código cliente (Prefixos NEXT_PUBLIC_ ou VITE_ são obrigatórios para o browser).

2. Consistência de Case-Sensitivity (Linux vs Windows/Mac)
Check: Verificar caminhos de importação.

Bloqueio: Se o arquivo chama-se Componente.tsx e o import está como ./componente.

Nota: No Windows funciona, mas a build da Vercel (Linux) vai falhar.

3. Integridade de Tipagem e Linting
Check: Executar verificação estática.

Bloqueio: Presença de erros de TypeScript (any implícito, tipos ausentes em Props) ou erros de ESLint que interrompem o npm run build.

Ação: Certificar-se de que o comando tsc --noEmit passe sem erros.

4. Configurações de Roteamento e APIs
Check: Estrutura de pastas (App Router vs Pages Router).

Bloqueio: Funções Serverless que excedem o limite de tamanho ou uso de bibliotecas nativas de Node.js em Edge Runtime sem a configuração correta.

Ação: Verificar se o vercel.json (se existir) não possui redirecionamentos conflitantes.

5. Otimização de Assets e Dependências
Check: package.json.

Bloqueio: Dependências listadas em devDependencies que são necessárias em tempo de execução (Runtime).

Ação: Garantir que imagens locais usem o componente <Image /> do Next.js para evitar perda de performance detectada pelo Core Web Vitals da Vercel.

Como configurar no Antigravity IDE:
Adicione o seguinte prompt de sistema ao seu Agent:

"Sempre que eu solicitar um 'Pre-check Vercel', aja como um Especialista-em-deploy-vercel. Analise meu diretório atual e:

Simule uma build (npm run build).

Verifique discrepâncias de letras maiúsculas/minúsculas em imports.

Liste todas as Variáveis de Ambiente que eu precisarei configurar manualmente no Dashboard da Vercel.

Verifique se há arquivos ignorados no .gitignore que são essenciais para a build.
Não me deixe subir para o GitHub até que todos os itens de 'Bloqueio' estejam resolvidos."

Dica de Ouro:
Antes de rodar o git push, você pode simplesmente digitar para o Agent:
"Execute a skill Vercel Deploy Guardian agora."