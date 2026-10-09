import React, { useEffect, useState } from "react";
import {
	Box,
	Typography,
	Button,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Paper,
	CircularProgress,
	Modal,
	TextField,
	Snackbar,
	Alert,
	Pagination,
	Tooltip,
} from "@mui/material";
import { api } from "../services/api";
import {
	LaboratoryDTO,
	LaboratoryRequestDTO,
	PaginatedResponse,
} from "../types";

import CalculateIcon from "@mui/icons-material/Calculate";

const modalStyle = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: { xs: "90%", sm: 500 },
	bgcolor: "background.paper",
	boxShadow: 24,
	p: 4,
	borderRadius: 2,
};

const initialLab: LaboratoryRequestDTO = {
	name: "",
	registration: "",
	address: "",
	operationCost: 0,
	operationFee: 0,
};

export const LaboratoriesPage: React.FC = () => {
	const [labs, setLabs] = useState<LaboratoryDTO[]>([]);
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	// Paginação
	const [page, setPage] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const size = 10;

	// Estados dos Modais
	const [openModal, setOpenModal] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [formData, setFormData] = useState<LaboratoryRequestDTO>(initialLab);

	const [openCalcModal, setOpenCalcModal] = useState(false);
	const [calcValue, setCalcValue] = useState<number | null>(null);

	const [toast, setToast] = useState<{
		open: boolean;
		msg: string;
		severity: "success" | "error";
	}>({ open: false, msg: "", severity: "success" });

	const fetchLabs = async (pageNumber: number = 0) => {
		setLoading(true);
		try {
			const res = await api.get<PaginatedResponse<LaboratoryDTO>>(
				`/laboratories?page=${pageNumber}&size=${size}`,
			);
			setLabs(res.data.content);
			setTotalPages(res.data.totalPages);
			setPage(res.data.number);
		} catch (err) {
			setToast({
				open: true,
				msg: "Erro ao buscar laboratórios.",
				severity: "error",
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchLabs(page);
	}, [page]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			if (editingId) {
				await api.put(`/laboratories/${editingId}`, formData);
			} else {
				await api.post("/laboratories", formData);
			}
			setToast({
				open: true,
				msg: "Laboratório salvo com sucesso!",
				severity: "success",
			});
			setOpenModal(false);
			fetchLabs(page);
		} catch (err) {
			setToast({
				open: true,
				msg: "Erro ao salvar laboratório.",
				severity: "error",
			});
		} finally {
			setSubmitting(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!window.confirm("Excluir este laboratório?")) return;
		try {
			await api.delete(`/laboratories/${id}`);
			setToast({
				open: true,
				msg: "Excluído com sucesso.",
				severity: "success",
			});
			fetchLabs(page);
		} catch (err) {
			setToast({
				open: true,
				msg: "Erro ao excluir. Verifique se existem produtores vinculados.",
				severity: "error",
			});
		}
	};

	const handleEdit = (lab: LaboratoryDTO) => {
		setFormData({
			name: lab.name,
			registration: lab.registration,
			address: lab.address,
			operationCost: lab.operationCost || 0,
			operationFee: lab.operationFee || 0,
		});
		setEditingId(lab.id);
		setOpenModal(true);
	};

	const handleCalculate = (lab: LaboratoryDTO) => {
		// Usa o valor retornado do back-end. Se o back-end não tiver enviado, calcula no front de forma segura.
		const value =
			lab.calculatedValue ??
			Number(lab.operationCost) * Number(lab.operationFee);
		setCalcValue(value);
		setOpenCalcModal(true);
	};

	const openNewModal = () => {
		setFormData(initialLab);
		setEditingId(null);
		setOpenModal(true);
	};

	return (
		<Box>
			<Box display="flex" justifyContent="space-between" mb={3}>
				<Typography variant="h5" fontWeight="bold">
					Gestão de Laboratórios
				</Typography>
				<Button variant="contained" onClick={openNewModal}>
					Novo Laboratório
				</Button>
			</Box>

			{loading ? (
				<Box display="flex" justifyContent="center">
					<CircularProgress />
				</Box>
			) : (
				<Paper>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Nome</TableCell>
								<TableCell>CNPJ</TableCell>
								<TableCell align="center">Ações</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{labs.map((lab) => (
								<TableRow key={lab.id}>
									<TableCell>{lab.name}</TableCell>
									<TableCell>{lab.registration}</TableCell>
									<TableCell align="center">
										<Tooltip title="Cálculo Financeiro">
											<span>
												<Button
													color="secondary"
													onClick={() =>
														handleCalculate(lab)
													}
												>
													🧮
												</Button>
											</span>
										</Tooltip>

										<Tooltip title="Editar">
											<span>
												<Button
													onClick={() =>
														handleEdit(lab)
													}
												>
													✏️
												</Button>
											</span>
										</Tooltip>

										<Tooltip title="Excluir">
											<span>
												<Button
													color="error"
													onClick={() =>
														handleDelete(lab.id)
													}
												>
													🗑️
												</Button>
											</span>
										</Tooltip>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
					<Box display="flex" justifyContent="center" p={2}>
						<Pagination
							count={totalPages}
							page={page + 1}
							onChange={(e, v) => setPage(v - 1)}
						/>
					</Box>
				</Paper>
			)}

			{/* Modal CRUD */}
			<Modal
				open={openModal}
				onClose={() => !submitting && setOpenModal(false)}
			>
				<Box sx={modalStyle} component="form" onSubmit={handleSubmit}>
					<Typography variant="h6" mb={2}>
						{editingId ? "Editar Laboratório" : "Novo Laboratório"}
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
						label="CNPJ"
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
						label="Custo Operação"
						value={formData.operationCost}
						onChange={(e) =>
							setFormData({
								...formData,
								operationCost: Number(e.target.value),
							})
						}
					/>
					<TextField
						fullWidth
						required
						margin="normal"
						type="number"
						label="Taxa Operação"
						value={formData.operationFee}
						onChange={(e) =>
							setFormData({
								...formData,
								operationFee: Number(e.target.value),
							})
						}
					/>
					<Box
						mt={3}
						display="flex"
						justifyContent="flex-end"
						gap={2}
					>
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

			{/* Modal Cálculo */}
			<Modal open={openCalcModal} onClose={() => setOpenCalcModal(false)}>
				<Box sx={modalStyle} textAlign="center">
					<Typography variant="h6" color="primary" mb={2}>
						Resultado Financeiro
					</Typography>
					<Typography variant="h4" fontWeight="bold">
						R$ {calcValue?.toFixed(2)}
					</Typography>
					<Button
						sx={{ mt: 4 }}
						variant="contained"
						onClick={() => setOpenCalcModal(false)}
					>
						Fechar
					</Button>
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
