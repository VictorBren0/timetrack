import { useState } from "react";
import { register } from "../../services/firebase";
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    CardHeader,
    Link,
    TextField,
    Typography,
    IconButton,
    InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import useApp from "./useApp";

export default function RegisterPage() {
    
    const {
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
                            Registro
                        </Typography>
                    }
                    subheader={
                        <Typography
                            variant="body2"
                            align="center"
                            sx={{ color: "#cbd5e1", mt: 1 }}
                        >
                            Crie sua conta para continuar
                        </Typography>
                    }
                />

                <CardContent>
                    <Box
                        component="form"
                        onSubmit={handleRegister}
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
                            sx={textFieldSx}
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
                            sx={textFieldSx}
                        />

                        <TextField
                            label="Confirmar Senha"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="********"
                            variant="outlined"
                            fullWidth
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword
                                                )
                                            }
                                            edge="end"
                                            sx={{ color: "#f9fafb" }}
                                        >
                                            {showConfirmPassword ? (
                                                <VisibilityOff />
                                            ) : (
                                                <Visibility />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            sx={textFieldSx}
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
                                "&:hover": { backgroundColor: "#1e3a8a" },
                            }}
                            disabled={
                                !email ||
                                password.length < 6 ||
                                confirmPassword.length < 6 ||
                                loading
                            }
                        >
                            {loading ? "Entrando..." : "Registrar"}
                        </Button>

                        <Typography
                            variant="body2"
                            sx={{
                                color: "#cbd5e1",
                                textAlign: "center",
                                mt: 1,
                            }}
                        >
                            Já tem uma conta?{" "}
                            <Link
                                href="/login"
                                sx={{
                                    color: "#60a5fa",
                                    fontWeight: 500,
                                    textDecoration: "none",
                                    "&:hover": { textDecoration: "underline" },
                                }}
                            >
                                Fazer login
                            </Link>
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
}
