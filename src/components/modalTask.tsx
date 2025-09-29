import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    TextField,
    Typography,
} from "@mui/material";
import { use, useEffect, useState } from "react";
import { MobileTimePicker } from "@mui/x-date-pickers/MobileTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { v4 as uuidv4 } from "uuid";
import type { PickerValue } from "@mui/x-date-pickers/internals";

interface ModalTaskProps {
    visible: boolean;
    onClose: () => void;
    onCreate: (task: {
        id: string;
        name: string;
        time: string;
        done: boolean;
    }) => void;
    onEdit: (task: {
        id: string;
        name: string;
        time: string;
        done: boolean;
    }) => void;
    data: any;
}

export default function ModalTask({
    visible,
    onClose,
    data,
    onCreate,
    onEdit,
}: ModalTaskProps) {
    const [name, setName] = useState("");
    const [time, setTime] = useState<PickerValue>(null);
    const [done, setDone] = useState(false);
    const [errors, setErrors] = useState<{ name?: string; time?: string }>({});
    const handleCompleteForm = () => {
        if (data) {
            setName(data.name);
            const [hours, minutes] = data.time.split(":").map(Number);
            setTime(dayjs().hour(hours).minute(minutes).second(0));
            setDone(data.done);
        }
        setErrors({});
    };

    useEffect(() => {
        handleCompleteForm();
    }, [data]);

    const handleConfirm = () => {
        const newErrors: { name?: string; time?: string } = {};

        if (!name.trim()) {
            newErrors.name = "O nome é obrigatório";
        }
        if (!time) {
            newErrors.time = "O horário é obrigatório";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (data) {
            onEdit({
                id: data.id,
                name,
                time: time ? time.format("HH:mm") : "",
                done,
            });
        } else {
            onCreate({
                id: uuidv4(),
                name,
                time: time ? time.format("HH:mm") : "",
                done,
            });
        }
        setErrors({});
        onClose();
    };

    return (
        <Dialog
            open={visible}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            slotProps={{
                paper: {
                    sx: {
                        backgroundColor: "#1e293b",
                        borderRadius: 2,
                    },
                },
            }}
        >
            <DialogTitle sx={{ color: "#f9fafb" }}>
                {data ? "Editar Tarefa" : "Criar Tarefa"}
            </DialogTitle>

            <DialogContent
                sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
            >
                <TextField
                    label="Nome da tarefa"
                    variant="outlined"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    fullWidth
                    error={!!errors.name}
                    helperText={errors.name}
                    slotProps={{
                        htmlInput: {
                            maxLength: 50,
                        },
                    }}
                    sx={{
                        borderRadius: 2,
                        mt: 1,
                        backgroundColor: "#1e293b",
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#334155",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#475569",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: "#60a5fa",
                        },
                        "& .MuiInputLabel-root": { color: "#cbd5e1" },
                        "& .MuiInputLabel-root.Mui-focused": {
                            color: "#60a5fa",
                        },
                        "& .MuiInputBase-input": { color: "#f9fafb" },
                        "& input::placeholder": { color: "#94a3b8" },
                    }}
                />

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <MobileTimePicker
                        label="Horário"
                        value={time}
                        onChange={(newValue) => setTime(newValue)}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                variant: "outlined",
                                error: !!errors.time,
                                helperText: errors.time,
                                sx: {
                                    mt: 1,
                                    borderRadius: 2,
                                    "& .MuiPickersInputBase-root": {
                                        color: "#FFF",
                                    },
                                    "& .MuiInputLabel-root": {
                                        color: "#cbd5e1",
                                    },
                                    "& .MuiButtonBase-root": {
                                        color: "#cbd5e1",
                                    },
                                    "& .MuiPickersOutlinedInput-notchedOutline":
                                        {
                                            borderColor: "#334155",
                                        },
                                    "&:hover .MuiPickersOutlinedInput-notchedOutline":
                                        {
                                            borderColor: "#475569",
                                        },
                                    "& .Mui-focused .MuiPickersOutlinedInput-notchedOutline":
                                        {
                                            borderColor: "#60a5fa",
                                        },
                                },
                            },
                        }}
                    />
                </LocalizationProvider>

                <FormControlLabel
                    control={
                        <Checkbox
                            checked={done}
                            onChange={(e) => setDone(e.target.checked)}
                            sx={{
                                color: "#94a3b8",
                                "&.Mui-checked": { color: "#60a5fa" },
                            }}
                        />
                    }
                    label={<Typography color="#cbd5e1">Concluída</Typography>}
                />
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} sx={{ color: "#cbd5e1" }}>
                    Cancelar
                </Button>
                <Button
                    onClick={handleConfirm}
                    sx={{
                        backgroundColor: "#1e40af",
                        color: "#f9fafb",
                        "&:hover": { backgroundColor: "#1e3a8a" },
                    }}
                >
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    );
}
