import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, collection, setDoc, doc, getDocs, query, where, deleteDoc } from 'firebase/firestore'
import { getAnalytics, logEvent } from "firebase/analytics";

const TASKS_COLLECTION = 'tasks'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

export function login(email: string, password: string) {
  logEvent(analytics, "login");
  return signInWithEmailAndPassword(auth, email, password);
}

export function register(email: string, password: string) {
    logEvent(analytics, "register");
    return createUserWithEmailAndPassword(auth, email, password);
}

export async function addTaskToFirebase(task: any) {
    logEvent(analytics, 'add_task', { task_name: task.name });
    const ref = doc(db, TASKS_COLLECTION, task.id);
    await setDoc(ref, task);
}

export async function getTasksFromFirebase() {
    try {
        const user = auth.currentUser;
        if (!user) {
            console.warn("Usuário não autenticado para buscar tarefas");
            return [];
        }

        const ref = collection(db, TASKS_COLLECTION);
        const q = query(ref, where("userId", "==", user.uid));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    } catch (error) {
        console.error("Erro ao buscar tarefas do Firebase:", error);
        return [];
    }
}

export async function deleteTaskFromFirebase(taskId: string) {
  logEvent(analytics, "delete_task", { task_id: taskId });
    try {
        const taskRef = doc(db, TASKS_COLLECTION, taskId);
        await deleteDoc(taskRef);
    } catch (error) {
        console.error(`Erro ao deletar tarefa ${taskId} do Firebase:`, error);
        throw error;
    }
}