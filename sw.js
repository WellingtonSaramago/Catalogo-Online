// Service worker do catálogo. Duas responsabilidades:
// 1) Deixar o site "instalável" (junto com o manifest.json gerado pelo config.js).
// 2) Guardar uma cópia do catálogo em cache, pra ele continuar abrindo mesmo
//    com internet ruim ou momentaneamente offline.
//
// Estratégia: sempre tenta buscar a versão mais nova na internet primeiro
// (assim o cliente nunca vê preço/produto desatualizado por engano). Só usa
// a cópia guardada em cache se a internet falhar de verdade.

var CACHE_NAME = "catalogo-cache-v1";
var ARQUIVOS_ESSENCIAIS = [
  "./",
  "./index.html",
  "./config.js",
  "./produtos.js"
];

self.addEventListener("install", function (evento) {
  evento.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(ARQUIVOS_ESSENCIAIS).catch(function () {
        // se algum arquivo não existir ainda, não trava a instalação por causa disso
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (evento) {
  evento.waitUntil(
    caches.keys().then(function (nomes) {
      return Promise.all(
        nomes
          .filter(function (nome) { return nome !== CACHE_NAME; })
          .map(function (nome) { return caches.delete(nome); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (evento) {
  if (evento.request.method !== "GET") return;

  evento.respondWith(
    fetch(evento.request)
      .then(function (resposta) {
        var copia = resposta.clone();
        caches.open(CACHE_NAME).then(function (cache) { cache.put(evento.request, copia); });
        return resposta;
      })
      .catch(function () {
        return caches.match(evento.request);
      })
  );
});
