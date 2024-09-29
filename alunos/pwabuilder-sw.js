const CACHE_NAME = 'onrange-cache-v3'; // Nome do cache
const ASSETS_TO_CACHE = [
  '/cardapio/alunos/', // Página inicial
  '/cardapio/alunos/index.html',
  '/cardapio/alunos/alunos.css', // Estilo CSS
  '/cardapio/alunos/alunos.js', // Arquivo JS
  '/cardapio/assets/icon-x512.png', // Exemplo de uma imagem
  '/cardapio/alunos/fallback.html' // Página de fallback para quando não houver conexão
];

// Evento de instalação: adiciona arquivos ao cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
  self.skipWaiting(); // Força o Service Worker a ativar após a instalação
});

// Evento de ativação: remove caches antigos, se houver
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim(); // Faz o SW controlar as páginas sem precisar recarregar
});

// Evento de fetch: intercepta solicitações de rede e serve do cache
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Se o arquivo estiver no cache, serve-o
        if (response) {
          return response;
        }
        
        // Se não estiver no cache, tenta buscar da rede
        return fetch(event.request).catch(() => {
          // Se a solicitação falhar e for uma navegação, serve uma página de fallback
          if (event.request.mode === 'navigate') {
            return caches.match('/cardapio/alunos/fallback.html');
          }
        });
      })
  );
});
