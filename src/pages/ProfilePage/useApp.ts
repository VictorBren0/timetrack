import { useAuth } from "@/contexts/AuthContext";
import { getTasks } from "@/services/db";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useApp() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState<{
        total: number;
        done: number;
        pending: number;
        unsynced: number;
    }>({ total: 0, done: 0, pending: 0, unsynced: 0 });

    useEffect(() => {
        (async () => {
            const all = await getTasks();
            const filtered = user
                ? all.filter((t) => t.userId === user.uid || !t.userId)
                : [];
            const done = filtered.filter((t) => t.done).length;
            const unsynced = filtered.filter((t) => !t.synced).length;
            setStats({
                total: filtered.length,
                done,
                pending: filtered.length - done,
                unsynced,
            });
        })();
    }, [user]);

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return { user, stats, navigate, handleLogout };
}
