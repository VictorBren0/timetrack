import { useState } from "react";
import { login } from "../../services/firebase";
import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Typography,
    TextField,
    Button,
    Alert,
    Link,
    IconButton,
    InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import useApp from "./useApp";

export default function LoginPage() {
    const {
        email,
        setEmail,
        password,
        setPassword,
        showPassword,
        setShowPassword,
        loading,
        error,
        handleLogin,
    } = useApp();

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 3,
                backgroundColor: "#0f172a",
            }}
        >
            <Card
                sx={{
                    width: "100%",
                    maxWidth: 400,
                    borderRadius: 2,
                    backgroundColor: "#1e293b",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
                    p: 4,
                }}
            >
                <CardHeader
                    title={
                        <Typography
                            variant="h5"
                            align="center"
                            fontWeight={600}
                            sx={{ color: "#f9fafb" }}
                        >
                            Bem-vindo
                        </Typography>
                    }
                    subheader={
                        <Typography
                            variant="body2"
                            align="center"
                            sx={{ color: "#cbd5e1", mt: 1 }}
                        >
                            Entre com suas credenciais para continuar
                        </Typography>
                    }
                />

                <CardContent>
                    <Box
                        component="form"
                        onSubmit={handleLogin}
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 3,
                            mt: 2,
                        }}
                    >
                        <TextField
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Digite seu email"
                            variant="outlined"
                            fullWidth
                            sx={{
                                borderRadius: 1,
                                backgroundColor: "#273449",
                                "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#334155",
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#475569",
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
                                        borderColor: "#60a5fa",
                                    },
                                "& .MuiInputLabel-root": {
                                    color: "#f9fafb",
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                    color: "#60a5fa",
                                },
                                "& .MuiInputBase-input": {
                                    color: "#f9fafb",
                                },
                                "& input::placeholder": {
                                    color: "#94a3b8",
                                },
                            }}
                        />

                        <TextField
                            label="Senha"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="********"
                            variant="outlined"
                            fullWidth
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            edge="end"
                                            sx={{ color: "#f9fafb" }}
                                        >
                                            {showPassword ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                borderRadius: 1,
                                backgroundColor: "#273449",
                                "& .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#334155",
                                },
                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                    borderColor: "#475569",
                                },
                                "&.Mui-focused .MuiOutlinedInput-notchedOutline":
                                    {
                                        borderColor: "#60a5fa",
                                    },
                                "& .MuiInputLabel-root": {
                                    color: "#f9fafb",
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                    color: "#60a5fa",
                                },
                                "& .MuiInputBase-input": {
                                    color: "#f9fafb",
                                },
                                "& input::placeholder": {
                                    color: "#94a3b8",
                                },
                            }}
                        />

                        {error && <Alert severity="error">{error}</Alert>}

                        <Button
                            type="submit"
                            variant="contained"
                            sx={{
                                backgroundColor: "#1e40af",
                                color: "#f9fafb",
                                fontWeight: 600,
                                py: 1.5,
                                borderRadius: 1,
                                textTransform: "none",
                                fontSize: "1rem",
                                "&:hover": {
                                    backgroundColor: "#1e3a8a",
                                },
                            }}
                            disabled={!email || password.length < 6 || loading}
                        >
                            {loading ? "Entrando..." : "Entrar"}
                        </Button>

                        <Typography
                            variant="body2"
                            sx={{
                                color: "#cbd5e1",
                                textAlign: "center",
                                mt: 1,
                            }}
                        >
                            Não tem conta?{" "}
                            <Link
                                href="/register"
                                sx={{
                                    color: "#60a5fa",
                                    fontWeight: 500,
                                    textDecoration: "none",
                                    "&:hover": { textDecoration: "underline" },
                                }}
                            >
                                Criar conta
                            </Link>
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
