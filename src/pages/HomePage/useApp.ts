import { useAuth } from "@/contexts/AuthContext";
import { addTask, deleteTask, getTasks, updateTask, type Task } from "@/services/db";
import { registerBackgroundSync, syncTasks } from "@/services/sync";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterSW } from "virtual:pwa-register/react";

export default function useApp() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    // 🧭 Atualiza badge (ícone PWA)
    function updateAppBadge(pendingCount: number) {
        if ("setAppBadge" in navigator) {
            if (pendingCount > 0) navigator.setAppBadge(pendingCount);
            else navigator.clearAppBadge();
        } else if ("setExperimentalAppBadge" in navigator) {
            const nav = navigator as any;
            if (pendingCount > 0) nav.setExperimentalAppBadge(pendingCount);
            else nav.clearExperimentalAppBadge?.();
        }
    }

    // 🔄 Carrega tarefas locais
    async function loadTasks() {
        const allTasks = await getTasks();
        const filtered = user
            ? allTasks.filter((t) => !t.userId || t.userId === user.uid)
            : [];
        filtered.sort((a, b) => {
            const timestampA = a.lastUpdate ?? 0;
            const timestampB = b.lastUpdate ?? 0;
            return timestampB - timestampA;
        });
        setTasks(filtered);
    }

    // 🔁 Sincroniza e recarrega
    async function syncAndReload() {
        if (!navigator.onLine) {
            return;
        }
        if (!user) {
            return;
        }
        try {
            const result = await syncTasks(user);
            if (result && result.ids && result.ids.length > 0) {
                setTasks((prev) =>
                    prev.map((t) =>
                        result.ids.includes(t.id) ? { ...t, synced: true } : t
                    )
                );
            }
            await loadTasks();
        } catch (error) {
            console.error("❌ Erro na sincronização:", error);
        }
    }

    useEffect(() => {
        loadTasks();
        if (navigator.onLine && user) {
            syncAndReload();
        }

        const handleOnline = () => {
            syncAndReload();
        };

        const handleOffline = () => {};

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, [user]);

    useEffect(() => {
        const pendingCount = tasks.filter((t) => !t.done).length;
        updateAppBadge(pendingCount);
    }, [tasks]);

    const {
        needRefresh: [needRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered() {},
        onRegisterError(error: any) {
            console.error("❌ Erro no SW:", error);
        },
    });

    // ➕ Criar nova tarefa com sincronização melhorada
    const handleAddTask = async (taskData: {
        id: string;
        name: string;
        time: string;
        done: boolean;
    }) => {
        if (!taskData.name.trim() || !taskData.time) return;

        // Normaliza time para formato HH:MM
        const normalizeTime = (value: string) => {
            const match = value.match(/^(\d{1,2}):(\d{2})/);
            if (!match) return value;
            const h = Math.min(23, parseInt(match[1], 10))
                .toString()
                .padStart(2, "0");
            const m = Math.min(59, parseInt(match[2], 10))
                .toString()
                .padStart(2, "0");
            return `${h}:${m}`;
        };

        const now = Date.now();
        const newTask: Task = {
            id: taskData.id,
            name: taskData.name.trim(),
            done: taskData.done,
            lastUpdate: now,
            time: normalizeTime(taskData.time),
            synced: false,
            userId: user?.uid,
        };

        await addTask(newTask);
        await loadTasks();
        handleCloseModal();

        // Sincronização otimizada com reload forçado
        if (user) {
            setTimeout(async () => {
                await syncAndReload();
                setTimeout(() => {
                    loadTasks();
                }, 800);
            }, 1200);
        }

        // Notificação
        if ("Notification" in window && Notification.permission === "granted") {
            new Notification("Nova tarefa criada", {
                body: `Tarefa: ${taskData.name.trim()}`,
                icon: "/logo.svg",
            });
        }

        await registerBackgroundSync();
    };

    // 🔁 Atualização automática via SW
    useEffect(() => {
        const handler = (event: MessageEvent) => {
            if (event.data?.type === "SKIP_WAITING") {
                updateServiceWorker(true);
            }
        };
        navigator.serviceWorker?.addEventListener("message", handler);
        return () => {
            navigator.serviceWorker?.removeEventListener("message", handler);
        };
    }, [updateServiceWorker]);

    // 🔄 Alternar status da tarefa com sincronização melhorada
    const toggleTask = async (id: string) => {
        const now = Date.now();
        const updated = tasks.map((t) =>
            t.id === id
                ? { ...t, done: !t.done, lastUpdate: now, synced: false }
                : t
        );
        setTasks(updated);

        const changed = updated.find((t) => t.id === id);
        if (changed) await updateTask(changed);

        await registerBackgroundSync();

        // Sincronização otimizada com reload forçado
        if (user) {
            setTimeout(async () => {
                await syncAndReload();
                setTimeout(() => {
                    loadTasks();
                }, 800);
            }, 800);
        }
    };

    // ❌ Deletar tarefa
    const handleDelete = async (id: string) => {
        setTasks((prev) => prev.filter((t) => t.id !== id));
        await deleteTask(id);
    };

    // ✏️ Abrir modal para editar
    const handleOpenEdit = (task: Task) => {
        setTaskToEdit(task);
        setModalVisible(true);
    };

    // 💾 Salvar edição com sincronização melhorada
    const handleSaveEdit = async (editedTaskData: {
        id: string;
        name: string;
        time: string;
        done: boolean;
    }) => {
        if (!editedTaskData) return;
        const normalizeTime = (value: string, previous?: string) => {
            if (!value && previous) return previous; // mantém se vazio
            const match = value.match(/^(\d{1,2}):(\d{2})/);
            if (!match) return previous || value;
            const h = Math.min(23, parseInt(match[1], 10))
                .toString()
                .padStart(2, "0");
            const m = Math.min(59, parseInt(match[2], 10))
                .toString()
                .padStart(2, "0");
            return `${h}:${m}`;
        };
        const now = Date.now();
        const current = tasks.find((t) => t.id === editedTaskData.id);
        const taskToUpdate: Task = {
            id: editedTaskData.id,
            name: editedTaskData.name.trim(),
            done: editedTaskData.done,
            time: normalizeTime(editedTaskData.time, current?.time),
            lastUpdate: now,
            synced: false,
            userId: user?.uid,
        };
        const updated = tasks.map((t) =>
            t.id === editedTaskData.id ? taskToUpdate : t
        );
        setTasks(updated);
        await updateTask(taskToUpdate);
        handleCloseModal();
        await registerBackgroundSync();

        // Sincronização otimizada com reload forçado
        if (user) {
            setTimeout(async () => {
                await syncAndReload();
                setTimeout(() => {
                    loadTasks();
                }, 800);
            }, 1200);
        }
    };

    const handleCloseModal = () => {
        setModalVisible(false);
        setTaskToEdit(null);
    };
    return {
        tasks,
        modalVisible,
        taskToEdit,
        handleOpenEdit,
        handleCloseModal,
        handleSaveEdit,
        handleDelete,
        toggleTask,
        handleAddTask,
        needRefresh,
        updateServiceWorker,
        user,
        navigate,
        updateAppBadge,
        loadTasks,
        syncAndReload,
        setModalVisible,
        setTaskToEdit,
    };
}
