import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Checkbox,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ModalTask from "@/components/modalTask";
import useApp from "./useApp";

export default function HomePage() {
    
    const {
    tasks,
    modalVisible,
    setModalVisible,
    taskToEdit,
    navigate,
    handleCloseModal,
    handleAddTask,
    handleSaveEdit,
    handleOpenEdit,
    handleDelete,
    toggleTask,
    needRefresh,
    updateServiceWorker,
  } = useApp();


  return (
    <Box
      sx={{
        height: "100vh",
        background: "linear-gradient(to bottom right, #0f172a, #1e293b)",
        p: { xs: 1, sm: 4 },
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      {needRefresh && (
        <Box
          sx={{
            position: "fixed",
            top: 16,
            backgroundColor: "#2563eb",
            color: "#f9fafb",
            px: 2,
            py: 1,
            borderRadius: 2,
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
            zIndex: 1000,
            cursor: "pointer",
          }}
          onClick={() => updateServiceWorker(true)}
        >
          Atualização disponível! Clique aqui para atualizar.
        </Box>
      )}

      <Card
        sx={{
          width: "100%",
          maxWidth: 800,
          borderRadius: 3,
          backgroundColor: "#1e293b",
          boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
          p: { xs: 1, sm: 3 },
        }}
      >
        <CardHeader
          title={
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, flexWrap: "wrap", flexDirection: "column" }}>
              <Typography
                variant="h5"
                align="center"
                fontWeight={600}
                sx={{ color: "#f9fafb", fontSize: { xs: "1.5rem", sm: "2rem" } }}
              >
                Minhas Tarefas
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", justifyContent: "center" }}>
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outlined"
                size="small"
                startIcon={<DashboardIcon />}
                sx={{
                  borderColor: "#60a5fa",
                  color: "#60a5fa",
                  "&:hover": {
                    borderColor: "#3b82f6",
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                  },
                }}
              >
                Dashboard
              </Button>
              <Button
                onClick={() => navigate('/profile')}
                variant="outlined"
                size="small"
                sx={{
                  borderColor: "#64748b",
                  color: "#94a3b8",
                  "&:hover": {
                    borderColor: "#475569",
                    backgroundColor: "rgba(71,85,105,0.15)",
                  },
                }}
              >
                Perfil
              </Button>
            </Box>
            </Box>
          }
          subheader={
            <Typography
              variant="body2"
              align="center"
              sx={{ color: "#cbd5e1", mt: 1, fontSize: { xs: "0.85rem", sm: "1rem" } }}
            >
              Organize suas tarefas do dia
            </Typography>
          }
        />

        <CardContent
          sx={{
            maxHeight: { xs: "70vh", sm: 500 },
            overflowY: "auto",
            "&::-webkit-scrollbar": { display: "none" },
            p: { xs: 1, sm: 2 },
          }}
        >
          {tasks.length === 0 ? (
            <Typography align="center" color="#94a3b8">
              Nenhuma tarefa ainda. Clique no botão abaixo para criar!
            </Typography>
          ) : (
            tasks.map((task) => (
              <Box
                key={task.id}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: { xs: "flex-start", sm: "center" },
                  justifyContent: "space-between",
                  gap: 2,
                  p: 2,
                  mb: 2,
                  borderRadius: 2,
                  backgroundColor: "#273449",
                  "&:hover": { backgroundColor: "#334155" },
                  transition: "0.3s",
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    backgroundColor: "#1e40af",
                    color: "#f9fafb",
                    fontSize: "0.8rem",
                    px: 1.2,
                    py: 0.4,
                    borderTopRightRadius: 8,
                    borderBottomLeftRadius: 8,
                  }}
                >
                  Atualizada:{" "}
                  {task.lastUpdate
                    ? new Date(task.lastUpdate).toLocaleString("pt-BR")
                    : "Sem data"}
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
                  <Checkbox
                    checked={task.done}
                    onChange={() => toggleTask(task.id)}
                    sx={{
                      color: "#94a3b8",
                      "&.Mui-checked": { color: "#60a5fa" },
                    }}
                  />
                  <Box sx={{ wordBreak: "break-word", marginTop: 1 }} width="100%">
                    <Typography
                      sx={{
                        color: task.done ? "#94a3b8" : "#f9fafb",
                        textDecoration: task.done ? "line-through" : "none",
                      }}
                    >
                      {task.name}
                    </Typography>

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      flexWrap="wrap"
                    >
                      <Box>
                        <Typography variant="caption" color="#94a3b8" display="block">
                          Horário: {task.time}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                          <Box
                            sx={{
                              backgroundColor: task.done ? "#16a34a" : "#f59e0b",
                              color: "#f9fafb",
                              px: 1,
                              py: 0.2,
                              borderRadius: 1,
                              mt: 0.5,
                              fontSize: "0.9rem",
                            }}
                          >
                            {task.done ? "Concluída" : "Pendente"}
                          </Box>
                          {!task.synced && (
                            <Box
                              sx={{
                                backgroundColor: "#ef4444",
                                color: "#f9fafb",
                                px: 1,
                                py: 0.2,
                                borderRadius: 1,
                                mt: 0.5,
                                fontSize: "0.9rem",
                              }}
                            >
                              Não Sincronizada
                            </Box>
                          )}
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", gap: 1 }}>
                        <IconButton
                          onClick={() => handleOpenEdit(task)}
                          sx={{ color: "#60a5fa" }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(task.id)}
                          sx={{ color: "#ef4444" }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
            ))
          )}
        </CardContent>
      </Card>

      <Button
        onClick={() => setModalVisible(true)}
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          width: 56,
          height: 56,
          background: "#1e40af",
          color: "#f9fafb",
          boxShadow: "0 6px 20px rgba(30, 64, 175, 0.4)",
          "&:hover": { transform: "scale(1.1)" },
          transition: "all 0.3s ease",
        }}
      >
        <AddIcon />
      </Button>

      {modalVisible && (
        <ModalTask
          visible={modalVisible}
          onClose={handleCloseModal}
          onCreate={handleAddTask}
          onEdit={handleSaveEdit}
          data={taskToEdit}
        />
      )}
    </Box>
  );
}
