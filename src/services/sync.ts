import { getUnsyncedTasks, markTaskAsSynced, type Task } from "./db";
import { addTaskToFirebase, auth } from "./firebase";
import type { User } from "firebase/auth";

export async function syncTasks(user?: User | null) {
  try {
    const currentUser = user || auth.currentUser;
    if (!currentUser) {
      return { count: 0, ids: [] };
    }
    const unsynced = await getUnsyncedTasks(currentUser.uid);
    if (unsynced.length === 0) {
      return { count: 0, ids: [] };
    }

    const syncedIds: string[] = [];
    let syncedCount = 0;
    for (const task of unsynced) {
      try {
        const taskWithUser = { ...task, userId: currentUser.uid, userEmail: currentUser.email };
        await addTaskToFirebase(taskWithUser);
        await markTaskAsSynced(task.id);
        syncedIds.push(task.id);
        syncedCount++;
      } catch (err) {
        console.error(`❌ Erro ao sincronizar ${task.id}:`, err);
      }
    }
    return { count: syncedCount, ids: syncedIds };
  } catch (error) {
    console.error("❌ Erro na sincronização:", error);
    throw error;
  }
}

export async function registerBackgroundSync() {
  if ("serviceWorker" in navigator) {
    try {
      const reg = await navigator.serviceWorker.ready;
      if ('sync' in reg) {
        await (reg as any).sync.register("sync-tasks");
      }
    } catch (err) {
      console.error("❌ Erro no background sync:", err);
      await syncTasks();
    }
  } else {
    await syncTasks();
  }
}
