# Catálogo Digital — Documentação

Este documento explica como o catálogo funciona por dentro e, principalmente,
como adaptar tudo isso para **um cliente novo** — trocando só um arquivo,
sem precisar reescrever nada.

---

## 1. Os arquivos do projeto

| Arquivo | Para que serve | Muda de cliente pra cliente? |
|---|---|---|
| `config.js` | Marca do cliente: nome, logo, cores, WhatsApp, rodapé, senha do admin | **Sim — é o único que muda** |
| `produtos.js` | Base de dados dos produtos (código, descrição, categoria, ativo) | Sim, mas é gerado pelo `admin.html`, não editado à mão |
| `index.html` | O catálogo que o cliente final vê e usa | Não |
| `admin.html` | Painel pra você (ou o cliente) cadastrar/editar produtos | Não |
| `fotos-pendentes.html` | Ferramenta pra saber quais fotos ainda faltam subir no GitHub | Não |
| `img/` (pasta) | Fotos dos produtos, mais `capa.jpg` e `contracapa.jpg` (opcionais) | Sim, conteúdo próprio de cada cliente |

**Regra de ouro:** `index.html`, `admin.html` e `fotos-pendentes.html` são o
"motor" — funcionam iguais pra qualquer cliente. Tudo que muda de empresa
pra empresa mora dentro do `config.js`.

---

## 2. Como criar o catálogo de um cliente novo

### Passo 1 — Duplicar o projeto
Crie um repositório novo no GitHub (ou uma pasta nova) e copie os 5 arquivos
acima, mais uma pasta `img` vazia.

### Passo 2 — Preencher o `config.js`
Abra o arquivo e edite campo por campo:

```js
nome: "Nome da Empresa",
tituloAba: "Nome da Empresa - Catálogo de Produtos",
descricaoMeta: "Uma frase curta descrevendo o catálogo (aparece no Google).",
subtitulo: "Frase curta abaixo do logo (ex: Soldas · Abrasivos · Tintas)",
logoAlt: "Texto alternativo do logo, pra acessibilidade",
logoBase64: "cole aqui a logo convertida (veja o Passo 3)",
cores: {
  "gold": "#ffd035",       // cor de destaque
  "orange": "#ff801a",     // cor principal dos botões
  "navy-900": "#141b28",   // cor mais escura (cabeçalho, textos fortes)
  "navy-800": "#1f2a38",
  "navy-600": "#4a5467",
  "whatsapp": "#25d366",   // não precisa mudar, é a cor oficial do WhatsApp
  "whatsapp-dark": "#1ebe5b"
},
vendedores: [
  { nome: "Fulano", numero: "55DDDNUMERO" },
  { nome: "Sicrana", numero: "55DDDNUMERO" }
],
capaPdf: {
  imagemCapa: "img/capa.jpg",
  imagemContracapa: "img/contracapa.jpg"
},
rodape: {
  endereco: "Rua Exemplo, 123 - Cidade/UF",
  telefones: ["(34) 99999-9999"],
  instagram: "https://instagram.com/empresa",
  facebook: "",
  googleMaps: ""
},
creditos: "Catálogo desenvolvido por WSARAMAGO",
creditosLink: "",
senhaAdmin: ""
```

Dica: o número do WhatsApp deve estar só com dígitos, no formato
`55` + DDD + número (ex: `5534999998888`).

### Passo 3 — Converter a logo para "base64"
O `logoBase64` precisa da imagem convertida em um texto longo (é assim que
ela fica embutida direto no arquivo, sem precisar de uma imagem separada).

Forma mais fácil, sem instalar nada:
1. Acesse um site como **base64-image.de** ou **base64.guru/converter/encode/image**.
2. Envie o arquivo da logo (de preferência `.webp` ou `.png`, com fundo transparente).
3. Copie o texto gerado, que começa com `data:image/...;base64,`.
4. Cole esse texto completo entre as aspas do campo `logoBase64` no `config.js`.

Se preferir, me envie a logo do cliente numa próxima conversa que eu já
converto e te devolvo o `config.js` pronto.

### Passo 4 — Cadastrar os produtos
Abra o `admin.html` (localmente, dando duplo clique, ou já publicado) e:
- Use o botão **"📥 Importar planilha"** pra subir a lista de produtos do
  cliente de uma vez (veja a seção 4).
- Ou cadastre um por um com **"+ Adicionar produto"**.
- No fim, clique em **"⬇️ Baixar produtos.js atualizado"** e substitua o
  arquivo `produtos.js` do projeto por esse que foi baixado.

### Passo 5 — Colocar as fotos
Salve as fotos dentro da pasta `img`, nomeadas exatamente com o código do
produto: `1001.jpg`, `1002.jpg`, etc. Se quiser capa/contracapa personalizadas
no PDF, salve também `capa.jpg` e `contracapa.jpg` (formato retrato, tipo
A4, funciona melhor).

### Passo 6 — Publicar no GitHub Pages
1. Suba os arquivos (`index.html`, `admin.html`, `config.js`, `produtos.js`,
   `fotos-pendentes.html` e a pasta `img`) pro repositório do GitHub.
2. Nas configurações do repositório, vá em **Settings → Pages** e ative o
   GitHub Pages apontando pra branch principal (`main`).
3. Em alguns minutos, o site fica disponível num link como
   `https://usuario.github.io/nome-do-repositorio/`.
4. O catálogo fica em `.../index.html` e o painel em `.../admin.html`.

Pronto — catálogo novo no ar, sem tocar em nenhum outro arquivo.

---

## 3. O que o catálogo (`index.html`) já faz sozinho

- Lista os produtos ativos, com busca e paginação.
- Deixa o visitante montar um carrinho e enviar o pedido direto pelo
  WhatsApp de um dos vendedores cadastrados no `config.js`.
- Gera um catálogo em PDF (botão de download), com capa/contracapa em
  foto (se configuradas) ou uma capa de texto automática (se não).
- Mostra um rodapé com endereço, telefones e redes sociais — só aparece
  se algum desses campos estiver preenchido no `config.js`.

## 4. O que o painel (`admin.html`) já faz sozinho

- Editar código, descrição, categoria e status (ativo/inativo) de cada
  produto, com os inativos sempre indo pro final da lista.
- Buscar e filtrar por texto, categoria, status e presença de foto.
- Ordenar clicando nos cabeçalhos das colunas (como no Excel).
- Importar planilha (`.csv`, `.xlsx`, `.xls`): corrige produtos que já
  existem (por código) e cria os que são novos, sem duplicar.
- Verificar quantos produtos já têm foto publicada (`img/<código>.jpg`).
- Avisar sobre códigos repetidos, e desfazer a última ação (remoção,
  ativar/desativar, importação, mudança de categoria).
- Proteger o acesso com uma senha simples, se configurada.

## 5. A ferramenta `fotos-pendentes.html`

Serve pra descobrir quais fotos da sua pasta local ainda não foram
publicadas no site, e já baixa um ZIP pronto (até 100 fotos por vez,
respeitando o limite do GitHub) só com o que falta subir.

---

## 6. Perguntas rápidas

**Preciso saber programar pra trocar de cliente?**
Não. Só editar texto simples dentro do `config.js` (nomes, números,
cores em código hexadecimal, links).

**Dá pra ter mais de 2 vendedores no WhatsApp?**
Sim, é só adicionar mais linhas dentro de `vendedores` no `config.js`.

**E se eu não quiser usar capa/contracapa em foto?**
Deixe os campos `imagemCapa` e `imagemContracapa` como estão (apontando
pra arquivos que não existem) — o catálogo detecta sozinho e usa a capa
de texto automática no lugar.

**Onde fica guardada a senha do admin?**
Direto no `config.js`, em texto simples. Não é uma senha "de verdade"
(qualquer um que abrir o código-fonte consegue ver) — serve só pra evitar
acesso por acaso, não pra proteger dados sigilosos.
