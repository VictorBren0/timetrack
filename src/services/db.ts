import { openDB } from "idb";

export interface Task {
  lastUpdate: number;
  id: string;
  name: string;
  done: boolean;
  time: string;
  synced: boolean;
  userId?: string; // novo campo
}

const DB_NAME = "tasksDB";
const STORE_NAME = "tasks";
const DB_VERSION = 3; // atualizado para incluir userId

// 🔹 Inicializa o banco de forma segura
export async function ensureDB() {
  try {
    return await initDB();
  } catch (error) {
    console.warn("⚠️ Erro na inicialização, tentando recriar banco:", error);
    return await recreateDatabase();
  }
}

// 🔹 Inicializa o banco
export async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db, oldVersion) {
      if (oldVersion && oldVersion < 3 && db.objectStoreNames.contains(STORE_NAME)) {
        try {
          db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME);
          // Não dá para ler sincrono aqui, migração plena exigiria externa
        } catch (e) {
          console.warn('⚠️ Não foi possível ler tasks antigas na migração');
        }
      }
      let store;
      if (db.objectStoreNames.contains(STORE_NAME)) {
        db.deleteObjectStore(STORE_NAME);
      }
      store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      store.createIndex('synced', 'synced', { unique: false });
      store.createIndex('lastUpdate', 'lastUpdate', { unique: false });
      store.createIndex('userId', 'userId', { unique: false });
    },
  });
}

// 🔹 Adiciona nova tarefa (ou atualiza se já existir)
export async function addTask(task: Task) {
  const db = await ensureDB();
  await db.put(STORE_NAME, task); // put = add ou atualiza
}

// 🔹 Atualiza tarefa existente
export async function updateTask(task: Task) {
  const db = await ensureDB();
  await db.put(STORE_NAME, task);
}

// 🔹 Busca todas as tarefas
export async function getTasks(): Promise<Task[]> {
  const db = await ensureDB();
  return db.getAll(STORE_NAME);
}

// 🔹 Remove tarefa
export async function deleteTask(id: string) {
  const db = await ensureDB();
  await db.delete(STORE_NAME, id);
}

// 🔹 Marca tarefa como sincronizada
export async function markTaskAsSynced(id: string) {
  const db = await ensureDB();
  const task = await db.get(STORE_NAME, id);
  if (task) {
    task.synced = true;
    await db.put(STORE_NAME, task);
  } else {
    console.warn(`⚠️ markTaskAsSynced: tarefa não encontrada id=${id}`);
  }
}

// �🗑️ Força recriação do banco (use apenas em caso de problemas)
export async function recreateDatabase() {
  try {
    // Fecha todas as conexões existentes
    const dbs = await indexedDB.databases();
    for (const dbInfo of dbs) {
      if (dbInfo.name === DB_NAME) {
        const deleteRequest = indexedDB.deleteDatabase(DB_NAME);
        await new Promise((resolve, reject) => {
          deleteRequest.onsuccess = () => resolve(undefined);
          deleteRequest.onerror = () => reject(deleteRequest.error);
        });
        break;
      }
    }
    
    // Recria o banco com a nova estrutura
    return await initDB();
  } catch (error) {
    console.error("Erro ao recriar banco:", error);
    throw error;
  }
}

export async function getUnsyncedTasks(userId?: string): Promise<Task[]> {
  try {
    const db = await ensureDB();
    const tx = db.transaction(STORE_NAME, "readonly");
    const store = tx.store;
    let result: Task[] = [];
    if (store.indexNames.contains("synced")) {
      try {
        const index = store.index("synced");
        const allFromIndex = await index.getAll();
        result = allFromIndex.filter(task => task.synced === false && (!userId || task.userId === userId));
      } catch (indexError) {
        console.warn("⚠️ getUnsyncedTasks: erro índice, fallback", indexError);
      }
    }
    if (result.length === 0) {
      const allTasks = await store.getAll();
      result = allTasks.filter(task => !task.synced && (!userId || task.userId === userId));
    }
    return result;
  } catch (error) {
    console.error("Erro ao buscar tarefas não sincronizadas:", error);
    
    // Se o erro for de índice não encontrado, tenta recriar o banco
    if (error instanceof DOMException && error.name === "NotFoundError") {
      try {
        await recreateDatabase();
        // Tenta novamente após recriar com fallback seguro
        const allTasks = await getTasks();
        return allTasks.filter(task => !task.synced);
      } catch (recreateError) {
        console.error("Erro ao recriar banco:", recreateError);
      }
    }
    
    // Último fallback
    try {
      const allTasks = await getTasks();
      return allTasks.filter(task => !task.synced);
    } catch (fallbackError) {
      console.error("Erro no fallback final:", fallbackError);
      return [];
    }
  }
}
