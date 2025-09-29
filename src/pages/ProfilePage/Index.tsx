import {
    Box,
    Card,
    CardContent,
    CardHeader,
    Typography,
    Button,
    Divider,
    Stack,
} from "@mui/material";
import useApp from "./useApp";

export default function ProfilePage() {
    const { user, stats, navigate, handleLogout } = useApp();

    return (
        <Box
            sx={{
                minHeight: "100vh",
                p: { xs: 2, sm: 4 },
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "center",
                background:
                    "linear-gradient(to bottom right, #0f172a, #1e293b)",
            }}
        >
            <Card
                sx={{
                    width: "100%",
                    maxWidth: 640,
                    backgroundColor: "#1e293b",
                    borderRadius: 3,
                    boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                }}
            >
                <CardHeader
                    title={
                        <Typography
                            variant="h5"
                            sx={{ color: "#f1f5f9", fontWeight: 600 }}
                        >
                            Perfil
                        </Typography>
                    }
                    subheader={
                        <Typography sx={{ color: "#94a3b8" }}>
                            Informações da sua conta
                        </Typography>
                    }
                />
                <CardContent>
                    <Stack spacing={3}>
                        <Box>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    color: "#64748b",
                                    textTransform: "uppercase",
                                    fontSize: "0.75rem",
                                    letterSpacing: 1,
                                }}
                            >
                                Usuário
                            </Typography>
                            <Typography
                                sx={{
                                    color: "#f8fafc",
                                    fontSize: "1.05rem",
                                    mt: 0.5,
                                }}
                            >
                                {user?.email}
                            </Typography>
                        </Box>
                        <Divider sx={{ borderColor: "#334155" }} />
                        <Box>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                    color: "#64748b",
                                    textTransform: "uppercase",
                                    fontSize: "0.75rem",
                                    letterSpacing: 1,
                                }}
                            >
                                Estatísticas Locais
                            </Typography>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 2,
                                    mt: 1,
                                }}
                            >
                                <Stat
                                    label="Total"
                                    value={stats.total}
                                    color="#6366f1"
                                />
                                <Stat
                                    label="Concluídas"
                                    value={stats.done}
                                    color="#16a34a"
                                />
                                <Stat
                                    label="Pendentes"
                                    value={stats.pending}
                                    color="#f59e0b"
                                />
                                <Stat
                                    label="Não Sincron."
                                    value={stats.unsynced}
                                    color="#ef4444"
                                />
                            </Box>
                        </Box>
                        <Divider sx={{ borderColor: "#334155" }} />
                        <Stack
                            direction={{ xs: "column", sm: "row" }}
                            spacing={2}
                        >
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => navigate("/")}
                                sx={{
                                    borderColor: "#60a5fa",
                                    color: "#60a5fa",
                                    "&:hover": {
                                        borderColor: "#3b82f6",
                                        backgroundColor: "rgba(59,130,246,0.1)",
                                    },
                                }}
                            >
                                Voltar
                            </Button>
                            <Button
                                fullWidth
                                variant="outlined"
                                color="error"
                                onClick={handleLogout}
                                sx={{
                                    borderColor: "#ef4444",
                                    color: "#ef4444",
                                    "&:hover": {
                                        borderColor: "#dc2626",
                                        backgroundColor: "rgba(239,68,68,0.1)",
                                    },
                                }}
                            >
                                Sair
                            </Button>
                        </Stack>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
}

function Stat({
    label,
    value,
    color,
}: {
    label: string;
    value: number;
    color: string;
}) {
    return (
        <Box
            sx={{
                minWidth: 120,
                flex: 1,
                backgroundColor: "#273449",
                borderRadius: 2,
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
            }}
        >
            <Typography
                sx={{
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    color: "#64748b",
                }}
            >
                {label}
            </Typography>
            <Typography sx={{ fontSize: "1.4rem", fontWeight: 600, color }}>
                {value}
            </Typography>
        </Box>
    );
}
