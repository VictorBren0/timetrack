import { register } from "@/services/firebase";
import { useState } from "react";

export default function useApp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            if (password !== confirmPassword) {
                setError("Senhas não coincidem");
                setLoading(false);
                return;
            }
            if (password.length < 6) {
                setError("A senha deve ter pelo menos 6 caracteres");
                setLoading(false);
                return;
            }
            await register(email, password);
            window.location.href = "/";
        } catch (err) {
            setError(err instanceof Error ? err.message : "Falha ao registrar");
        } finally {
            setLoading(false);
        }
    };

    const textFieldSx = {
        borderRadius: 1,
        backgroundColor: "#273449",
        "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#334155",
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#475569",
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#60a5fa",
        },
        "& .MuiInputLabel-root": { color: "#f9fafb" },
        "& .MuiInputLabel-root.Mui-focused": { color: "#60a5fa" },
        "& .MuiInputBase-input": { color: "#f9fafb" },
        "& input::placeholder": { color: "#94a3b8" },
    };
    return {
        email,
        setEmail,
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        showPassword,
        setShowPassword,
        showConfirmPassword,
        setShowConfirmPassword,
        loading,
        error,
        handleRegister,
        textFieldSx,
    };
}