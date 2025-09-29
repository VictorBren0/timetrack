import { useAuth } from "@/contexts/AuthContext";
import { getTasks, type Task } from "@/services/db";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useApp() {
      const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      const allTasks = await getTasks();
      setTasks(allTasks);
    } catch (error) {
      console.error("Erro ao carregar dados do dashboard:", error);
    } finally {
      setLoading(false);
    }
  }

  const completedTasks = tasks.filter(t => t.done);
  const pendingTasks = tasks.filter(t => !t.done);
  const syncedTasks = tasks.filter(t => t.synced);
  const unsyncedTasks = tasks.filter(t => !t.synced);
  
  const completionRate = tasks.length > 0 ? (completedTasks.length / tasks.length) * 100 : 0;
  const syncRate = tasks.length > 0 ? (syncedTasks.length / tasks.length) * 100 : 0;

  const recentTasks = [...tasks]
    .sort((a, b) => (b.lastUpdate || 0) - (a.lastUpdate || 0))
    .slice(0, 5);

    return {
      tasks,
      loading,
      user,
      navigate,
      completedTasks,
      pendingTasks,
      syncedTasks,
      unsyncedTasks,
      completionRate,
      syncRate,
      recentTasks,
    };
}