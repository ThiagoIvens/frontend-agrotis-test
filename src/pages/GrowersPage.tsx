import {
	Alert,
	Box,
	Button,
	Checkbox,
	CircularProgress,
	FormControl,
	InputLabel,
	ListItemText,
	MenuItem,
	Modal,
	OutlinedInput,
	Paper,
	Select,
	Snackbar,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import {
	FarmsteadDTO,
	GrowerDTO,
	GrowerRequestDTO,
	LaboratoryDTO,
	PaginatedResponse,
} from "../types";

const modalStyle = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 600,
	bgcolor: "background.paper",
	boxShadow: 24,
	p: 4,
	maxHeight: "90vh",
	overflowY: "auto",
};

const initialForm: GrowerRequestDTO = {
	name: "",
	registration: "",
	address: "",
	production: 0,
	commissionRate: 0,
	operationInitialDate: "",
	operationFinalDate: "",
	observations: "",
	laboratoryId: "",
	farmsteadIds: [],
};

export const GrowersPage: React.FC = () => {
	const [growers, setGrowers] = useState<GrowerDTO[]>([]);
	const [labs, setLabs] = useState<LaboratoryDTO[]>([]);
	const [farmsteads, setFarmsteads] = useState<FarmsteadDTO[]>([]);

	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	const [openModal, setOpenModal] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [formData, setFormData] = useState<GrowerRequestDTO>(initialForm);

	const [toast, setToast] = useState<{
		open: boolean;
		msg: string;
		severity: "success" | "error";
	}>({ open: false, msg: "", severity: "success" });

	const fetchData = async () => {
		setLoading(true);
		try {
			const [growersRes, labsRes, farmsteadsRes] = await Promise.all([
				api.get<PaginatedResponse<GrowerDTO>>(
					"/growers?page=0&size=100",
				),
				api.get<PaginatedResponse<LaboratoryDTO>>(
					"/laboratories?page=0&size=100",
				),
				api.get<PaginatedResponse<FarmsteadDTO>>(
					"/farmsteads?page=0&size=100",
				),
			]);
			setGrowers(growersRes.data.content);
			setLabs(labsRes.data.content);
			setFarmsteads(farmsteadsRes.data.content);
		} catch (err) {
			setToast({
				open: true,
				msg: "Erro ao buscar dados.",
				severity: "error",
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			if (editingId) {
				await api.put(`/growers/${editingId}`, formData);
			} else {
				await api.post("/growers", formData);
			}
			setToast({
				open: true,
				msg: "Salvo com sucesso!",
				severity: "success",
			});
			setOpenModal(false);
			fetchData();
		} catch (err) {
			setToast({ open: true, msg: "Erro ao salvar.", severity: "error" });
		} finally {
			setSubmitting(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!window.confirm("Excluir este produtor?")) return;
		try {
			await api.delete(`/growers/${id}`);
			setToast({
				open: true,
				msg: "Excluído com sucesso.",
				severity: "success",
			});
			fetchData();
		} catch (err) {
			setToast({
				open: true,
				msg: "Erro ao excluir.",
				severity: "error",
			});
		}
	};

	const handleEdit = (grower: GrowerDTO) => {
		setFormData({
			name: grower.name || "",
			registration: grower.registration || "",
			address: grower.address || "",
			production: grower.production || 0,
			commissionRate: grower.commissionRate || 0,
			operationInitialDate: grower.operationInitialDate || "",
			operationFinalDate: grower.operationFinalDate || "",
			observations: grower.observations || "",
			laboratoryId: grower.laboratoryId || "",
			farmsteadIds: grower.farmsteadIds || [],
		});
		setEditingId(grower.id);
		setOpenModal(true);
	};

	const openNewModal = () => {
		setFormData(initialForm);
		setEditingId(null);
		setOpenModal(true);
	};

	return (
		<Box>
			<Box display="flex" justifyContent="space-between" mb={2}>
				<Typography variant="h5">Produtores</Typography>
				<Button variant="contained" onClick={openNewModal}>
					Novo Produtor
				</Button>
			</Box>

			{loading ? (
				<CircularProgress />
			) : (
				<Paper>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Nome</TableCell>
								<TableCell>CPF/CNPJ</TableCell>
								<TableCell>Laboratório</TableCell>
								<TableCell>Ações</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{growers.length === 0 && (
								<TableRow>
									<TableCell colSpan={4} align="center">
										Nenhum produtor encontrado.
									</TableCell>
								</TableRow>
							)}
							{growers.map((g) => (
								<TableRow key={g.id}>
									<TableCell>{g.name}</TableCell>
									<TableCell>{g.registration}</TableCell>
									<TableCell>{g.laboratoryName}</TableCell>
									<TableCell>
										<Button onClick={() => handleEdit(g)}>
											Editar
										</Button>
										<Button
											color="error"
											onClick={() => handleDelete(g.id)}
										>
											Excluir
										</Button>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Paper>
			)}

			<Modal
				open={openModal}
				onClose={() => !submitting && setOpenModal(false)}
			>
				<Box sx={modalStyle} component="form" onSubmit={handleSubmit}>
					<Typography variant="h6" mb={2}>
						{editingId ? "Editar" : "Novo"} Produtor
					</Typography>

					<TextField
						fullWidth
						required
						margin="normal"
						label="Nome"
						value={formData.name}
						onChange={(e) =>
							setFormData({ ...formData, name: e.target.value })
						}
					/>
					<TextField
						fullWidth
						required
						margin="normal"
						label="CPF/CNPJ"
						value={formData.registration}
						onChange={(e) =>
							setFormData({
								...formData,
								registration: e.target.value,
							})
						}
					/>
					<TextField
						fullWidth
						required
						margin="normal"
						label="Endereço"
						value={formData.address}
						onChange={(e) =>
							setFormData({
								...formData,
								address: e.target.value,
							})
						}
					/>
					<TextField
						fullWidth
						required
						margin="normal"
						type="number"
						label="Produção"
						value={formData.production}
						onChange={(e) =>
							setFormData({
								...formData,
								production: Number(e.target.value),
							})
						}
					/>
					<TextField
						fullWidth
						required
						margin="normal"
						type="number"
						label="Comissão (%)"
						value={formData.commissionRate}
						onChange={(e) =>
							setFormData({
								...formData,
								commissionRate: Number(e.target.value),
							})
						}
					/>
					<TextField
						fullWidth
						required
						margin="normal"
						type="date"
						label="Data Inicial"
						InputLabelProps={{ shrink: true }}
						value={formData.operationInitialDate}
						onChange={(e) =>
							setFormData({
								...formData,
								operationInitialDate: e.target.value,
							})
						}
					/>
					<TextField
						fullWidth
						required
						margin="normal"
						type="date"
						label="Data Final"
						InputLabelProps={{ shrink: true }}
						value={formData.operationFinalDate}
						onChange={(e) =>
							setFormData({
								...formData,
								operationFinalDate: e.target.value,
							})
						}
					/>

					<FormControl fullWidth margin="normal" required>
						<InputLabel>Laboratório</InputLabel>
						<Select
							value={formData.laboratoryId}
							label="Laboratório"
							onChange={(e) =>
								setFormData({
									...formData,
									laboratoryId: e.target.value,
								})
							}
						>
							{labs.map((lab) => (
								<MenuItem key={lab.id} value={lab.id}>
									{lab.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<FormControl fullWidth margin="normal" required>
						<InputLabel>Propriedades</InputLabel>
						<Select
							multiple
							value={formData.farmsteadIds}
							onChange={(e) =>
								setFormData({
									...formData,
									farmsteadIds:
										typeof e.target.value === "string"
											? e.target.value.split(",")
											: e.target.value,
								})
							}
							input={<OutlinedInput label="Propriedades" />}
							renderValue={(selected) =>
								farmsteads
									.filter((f) => selected.includes(f.id))
									.map((f) => f.name)
									.join(", ")
							}
						>
							{farmsteads.map((f) => (
								<MenuItem key={f.id} value={f.id}>
									<Checkbox
										checked={
											formData.farmsteadIds.indexOf(
												f.id,
											) > -1
										}
									/>
									<ListItemText primary={f.name} />
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<TextField
						fullWidth
						margin="normal"
						multiline
						rows={3}
						label="Observações"
						value={formData.observations}
						onChange={(e) =>
							setFormData({
								...formData,
								observations: e.target.value,
							})
						}
					/>

					<Box mt={3} display="flex" justifyContent="flex-end">
						<Button
							onClick={() => setOpenModal(false)}
							disabled={submitting}
						>
							Cancelar
						</Button>
						<Button
							type="submit"
							variant="contained"
							disabled={submitting}
							sx={{ ml: 2 }}
						>
							{submitting ? (
								<CircularProgress size={24} />
							) : (
								"Salvar"
							)}
						</Button>
					</Box>
				</Box>
			</Modal>

			<Snackbar
				open={toast.open}
				autoHideDuration={4000}
				onClose={() => setToast({ ...toast, open: false })}
			>
				<Alert severity={toast.severity}>{toast.msg}</Alert>
			</Snackbar>
		</Box>
	);
};
