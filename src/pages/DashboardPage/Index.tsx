import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Paper,
  Divider,
  Button,
} from "@mui/material";
import {
  CheckCircle,
  Schedule,
  Sync,
  SyncProblem,
  TrendingUp,
  Assignment,
  ArrowBack,
} from "@mui/icons-material";
import useApp from "./useApp";

export default function Dashboard() {

    const {
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
    } = useApp();

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Carregando dashboard...</Typography>
        <LinearProgress sx={{ mt: 2 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, backgroundColor: "#0f172a", minHeight: "100vh" }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
          <Button
            onClick={() => navigate("/")}
            startIcon={<ArrowBack />}
            sx={{
              color: "#60a5fa",
              "&:hover": {
                backgroundColor: "rgba(59, 130, 246, 0.1)",
              },
            }}
          >
            Voltar às Tarefas
          </Button>
        </Box>
        <Typography variant="h4" sx={{ color: "#f8fafc", mb: 1, fontWeight: "bold" }}>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" sx={{ color: "#cbd5e1" }}>
          Olá, {user?.email || "Usuário"}! Aqui está um resumo das suas tarefas.
        </Typography>
      </Box>

      {/* Cards de Estatísticas */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 3, mb: 4 }}>
        {/* Total de Tarefas */}
        <Card sx={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Assignment sx={{ color: "#60a5fa", fontSize: 40 }} />
              <Box>
                <Typography variant="h4" sx={{ color: "#f8fafc", fontWeight: "bold" }}>
                  {tasks.length}
                </Typography>
                <Typography variant="body2" sx={{ color: "#cbd5e1" }}>
                  Total de Tarefas
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Tarefas Concluídas */}
        <Card sx={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <CheckCircle sx={{ color: "#10b981", fontSize: 40 }} />
              <Box>
                <Typography variant="h4" sx={{ color: "#f8fafc", fontWeight: "bold" }}>
                  {completedTasks.length}
                </Typography>
                <Typography variant="body2" sx={{ color: "#cbd5e1" }}>
                  Concluídas
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Tarefas Pendentes */}
        <Card sx={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Schedule sx={{ color: "#f59e0b", fontSize: 40 }} />
              <Box>
                <Typography variant="h4" sx={{ color: "#f8fafc", fontWeight: "bold" }}>
                  {pendingTasks.length}
                </Typography>
                <Typography variant="body2" sx={{ color: "#cbd5e1" }}>
                  Pendentes
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Status de Sincronização */}
        <Card sx={{ backgroundColor: "#1e293b", border: "1px solid #334155" }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {unsyncedTasks.length > 0 ? (
                <SyncProblem sx={{ color: "#ef4444", fontSize: 40 }} />
              ) : (
                <Sync sx={{ color: "#10b981", fontSize: 40 }} />
              )}
              <Box>
                <Typography variant="h4" sx={{ color: "#f8fafc", fontWeight: "bold" }}>
                  {unsyncedTasks.length}
                </Typography>
                <Typography variant="body2" sx={{ color: "#cbd5e1" }}>
                  Não Sincronizadas
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Gráficos de Progresso */}
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" }, gap: 3, mb: 4 }}>
        {/* Taxa de Conclusão */}
        <Paper sx={{ p: 3, backgroundColor: "#1e293b", border: "1px solid #334155" }}>
          <Typography variant="h6" sx={{ color: "#f8fafc", mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <TrendingUp sx={{ color: "#60a5fa" }} />
            Taxa de Conclusão
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: "#cbd5e1", mb: 1 }}>
              {completionRate.toFixed(1)}% das tarefas concluídas
            </Typography>
            <LinearProgress
              variant="determinate"
              value={completionRate}
              sx={{
                height: 8,
                borderRadius: 4,
                "& .MuiLinearProgress-bar": {
                  backgroundColor: completionRate >= 80 ? "#10b981" : completionRate >= 50 ? "#f59e0b" : "#ef4444",
                },
              }}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Chip
              label={`${completedTasks.length} Concluídas`}
              size="small"
              sx={{ backgroundColor: "#10b981", color: "white" }}
            />
            <Chip
              label={`${pendingTasks.length} Pendentes`}
              size="small"
              sx={{ backgroundColor: "#f59e0b", color: "white" }}
            />
          </Box>
        </Paper>

        {/* Taxa de Sincronização */}
        <Paper sx={{ p: 3, backgroundColor: "#1e293b", border: "1px solid #334155" }}>
          <Typography variant="h6" sx={{ color: "#f8fafc", mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
            <Sync sx={{ color: "#60a5fa" }} />
            Taxa de Sincronização
          </Typography>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ color: "#cbd5e1", mb: 1 }}>
              {syncRate.toFixed(1)}% das tarefas sincronizadas
            </Typography>
            <LinearProgress
              variant="determinate"
              value={syncRate}
              sx={{
                height: 8,
                borderRadius: 4,
                "& .MuiLinearProgress-bar": {
                  backgroundColor: syncRate >= 90 ? "#10b981" : syncRate >= 70 ? "#f59e0b" : "#ef4444",
                },
              }}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Chip
              label={`${syncedTasks.length} Sincronizadas`}
              size="small"
              sx={{ backgroundColor: "#10b981", color: "white" }}
            />
            <Chip
              label={`${unsyncedTasks.length} Pendentes`}
              size="small"
              sx={{ backgroundColor: "#ef4444", color: "white" }}
            />
          </Box>
        </Paper>
      </Box>

      {/* Lista de Tarefas Recentes */}
      <Paper sx={{ p: 3, backgroundColor: "#1e293b", border: "1px solid #334155" }}>
        <Typography variant="h6" sx={{ color: "#f8fafc", mb: 2 }}>
          📝 Atividades Recentes
        </Typography>
        <Divider sx={{ backgroundColor: "#334155", mb: 2 }} />
        
        {recentTasks.length > 0 ? (
          <List>
            {recentTasks.map((task) => (
              <ListItem key={task.id} sx={{ py: 1 }}>
                <ListItemIcon>
                  {task.done ? (
                    <CheckCircle sx={{ color: "#10b981" }} />
                  ) : (
                    <Schedule sx={{ color: "#f59e0b" }} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography sx={{ color: "#f8fafc", fontWeight: task.done ? "normal" : "bold" }}>
                      {task.name}
                    </Typography>
                  }
                  secondary={
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                      <Typography variant="body2" sx={{ color: "#94a3b8" }}>
                        ⏰ {task.time}
                      </Typography>
                      <Chip
                        label={task.synced ? "Sincronizada" : "Não Sincronizada"}
                        size="small"
                        sx={{
                          backgroundColor: task.synced ? "#10b981" : "#ef4444",
                          color: "white",
                          fontSize: "0.7rem",
                        }}
                      />
                      <Chip
                        label={task.done ? "Concluída" : "Pendente"}
                        size="small"
                        sx={{
                          backgroundColor: task.done ? "#10b981" : "#f59e0b",
                          color: "white",
                          fontSize: "0.7rem",
                        }}
                      />
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography sx={{ color: "#94a3b8", textAlign: "center", py: 4 }}>
            Nenhuma tarefa encontrada. Que tal criar a primeira?
          </Typography>
        )}
      </Paper>
    </Box>
  );
}