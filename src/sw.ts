/// <reference lib="webworker" />
import { precacheAndRoute, cleanupOutdatedCaches } from "workbox-precaching";
import { clientsClaim } from "workbox-core";
import { registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";
import { openDB } from "idb";

declare let self: ServiceWorkerGlobalScope;

interface Task {
  id: string;
  name: string;
  done: boolean;
  time: string;
  lastUpdate: string;
  synced: boolean;
}

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

self.skipWaiting();
clientsClaim();

// Cache para imagens
registerRoute(
  ({ request }) => request.destination === "image",
  new CacheFirst({ cacheName: "images-cache", matchOptions: { ignoreSearch: true } })
);

// Função de sync no service worker
async function syncTasksSW() {
  try {
    
    const db = await openDB("tasksDB", 2, {
      upgrade(db) {
  // Atualização de versão do banco (Service Worker)
        
        let store;
        
        // Cria o store se não existir
        if (!db.objectStoreNames.contains("tasks")) {
          store = db.createObjectStore("tasks", { keyPath: "id" });
          // Store criado
        } else {
          // Para store existente, precisamos recriar para garantir índices
          db.deleteObjectStore("tasks");
          store = db.createObjectStore("tasks", { keyPath: "id" });
          // Store recriado
        }
        
        // Cria índices necessários
        store.createIndex("synced", "synced", { unique: false });
        store.createIndex("lastUpdate", "lastUpdate", { unique: false });
        // Índices criados
      },
    });

    // Busca tarefas não sincronizadas
    const tx = db.transaction("tasks", "readonly");
    const store = tx.store;
    
    let unsynced: Task[] = [];
    
    // Tenta usar índice se disponível, senão usa fallback
    if (store.indexNames.contains("synced")) {
      try {
        const index = store.index("synced");
        const allFromIndex = await index.getAll();
        unsynced = allFromIndex.filter(task => task.synced === false);
      } catch (indexError) {
        console.warn("SW: Erro ao usar índice, usando fallback:", indexError);
        const allTasks = await store.getAll();
        unsynced = allTasks.filter(task => !task.synced);
      }
    } else {
      const allTasks = await store.getAll();
      unsynced = allTasks.filter(task => !task.synced);
    }

    if (unsynced.length === 0) {
      return;
    }

    let syncedCount = 0;
    const now = new Date().toISOString();

    for (const task of unsynced) {
      try {
        // Simula envio para Firebase (no SW real, você precisaria implementar a lógica de Firebase)
        // Por enquanto, apenas marca como sincronizada
        const updatedTask: Task = {
          ...task,
          synced: true,
          lastUpdate: now,
        };
        
        const tx2 = db.transaction("tasks", "readwrite");
        await tx2.store.put(updatedTask);
        await tx2.done;
        syncedCount++;
        
        // Tarefa marcada como sincronizada
      } catch (error) {
        console.error(`❌ Erro ao sincronizar tarefa ${task.id} no SW:`, error);
      }
    }

    // Notificação se sincronizou algo
    if (syncedCount > 0 && Notification.permission === "granted") {
      await self.registration.showNotification("Sincronização de tarefas", {
        body: `${syncedCount} tarefa(s) sincronizada(s) em segundo plano!`,
        icon: "/logo.svg",
        badge: "/logo.svg",
        tag: "sync-notification"
      });
    }

    // Notifica clientes sobre sincronização
    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({ 
        type: "sync-tasks", 
        count: syncedCount,
        timestamp: now 
      });
    });

  } catch (error) {
    console.error("❌ Erro geral na sincronização do SW:", error);
  }
}

// Background sync
self.addEventListener("sync", (event: any) => {
  if (event.tag === "sync-tasks") {
    event.waitUntil(syncTasksSW());
  }
});

// Listener para notificações clicadas
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  // Abre ou foca na aba da aplicação
  event.waitUntil(
    self.clients.matchAll().then((clients) => {
      if (clients.length > 0) {
        return (clients[0] as any).focus();
      }
      return self.clients.openWindow("/");
    })
  );
});
