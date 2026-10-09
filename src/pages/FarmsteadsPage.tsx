import {
	Alert,
	Box,
	Button,
	CircularProgress,
	Modal,
	Pagination,
	Paper,
	Snackbar,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	Tooltip,
	Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { api } from "../services/api";
import { FarmsteadDTO, FarmsteadRequestDTO, PaginatedResponse } from "../types";

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

const initialFarm: FarmsteadRequestDTO = {
	name: "",
	registration: "",
	address: "",
	totalAreaInHectares: 0,
	taxPerHectare: 0,
};

export const FarmsteadsPage: React.FC = () => {
	const [farms, setFarms] = useState<FarmsteadDTO[]>([]);
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	const [page, setPage] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const size = 10;

	const [openModal, setOpenModal] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [formData, setFormData] = useState<FarmsteadRequestDTO>(initialFarm);

	const [openCalcModal, setOpenCalcModal] = useState(false);
	const [calcValue, setCalcValue] = useState<number | null>(null);

	const [toast, setToast] = useState<{
		open: boolean;
		msg: string;
		severity: "success" | "error";
	}>({ open: false, msg: "", severity: "success" });

	const fetchFarms = async (pageNumber: number = 0) => {
		setLoading(true);
		try {
			const res = await api.get<PaginatedResponse<FarmsteadDTO>>(
				`/farmsteads?page=${pageNumber}&size=${size}`,
			);
			setFarms(res.data.content);
			setTotalPages(res.data.totalPages);
			setPage(res.data.number);
		} catch (err) {
			setToast({
				open: true,
				msg: "Erro ao buscar propriedades.",
				severity: "error",
			});
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchFarms(page);
	}, [page]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			if (editingId) await api.put(`/farmsteads/${editingId}`, formData);
			else await api.post("/farmsteads", formData);

			setToast({
				open: true,
				msg: "Propriedade salva com sucesso!",
				severity: "success",
			});
			setOpenModal(false);
			fetchFarms(page);
		} catch (err) {
			setToast({
				open: true,
				msg: "Erro ao salvar propriedade.",
				severity: "error",
			});
		} finally {
			setSubmitting(false);
		}
	};

	const handleDelete = async (id: string) => {
		if (!window.confirm("Excluir esta propriedade?")) return;
		try {
			await api.delete(`/farmsteads/${id}`);
			setToast({
				open: true,
				msg: "Excluída com sucesso.",
				severity: "success",
			});
			fetchFarms(page);
		} catch (err) {
			setToast({
				open: true,
				msg: "Erro ao excluir. Verifique se está vinculada a um produtor.",
				severity: "error",
			});
		}
	};

	const handleEdit = (farm: FarmsteadDTO) => {
		setFormData({
			name: farm.name,
			registration: farm.registration,
			address: farm.address,
			totalAreaInHectares: farm.totalAreaInHectares || 0,
			taxPerHectare: farm.taxPerHectare || 0,
		});
		setEditingId(farm.id);
		setOpenModal(true);
	};

	const handleCalculate = (farm: FarmsteadDTO) => {
		const value =
			farm.calculatedValue ??
			Number(farm.totalAreaInHectares) * Number(farm.taxPerHectare);
		setCalcValue(value);
		setOpenCalcModal(true);
	};

	const openNewModal = () => {
		setFormData(initialFarm);
		setEditingId(null);
		setOpenModal(true);
	};

	return (
		<Box>
			<Box display="flex" justifyContent="space-between" mb={3}>
				<Typography variant="h5" fontWeight="bold">
					Gestão de Propriedades
				</Typography>
				<Button variant="contained" onClick={openNewModal}>
					Nova Propriedade
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
								<TableCell>Registro</TableCell>
								<TableCell>Área (ha)</TableCell>
								<TableCell align="center">Ações</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{farms.map((farm) => (
								<TableRow key={farm.id}>
									<TableCell>{farm.name}</TableCell>
									<TableCell>{farm.registration}</TableCell>
									<TableCell>
										{farm.totalAreaInHectares}
									</TableCell>
									<TableCell align="center">
										<Tooltip title="Cálculo Financeiro">
											<span>
												<Button
													color="secondary"
													onClick={() =>
														handleCalculate(farm)
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
														handleEdit(farm)
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
														handleDelete(farm.id)
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
						{editingId ? "Editar Propriedade" : "Nova Propriedade"}
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
						label="Registro"
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
						label="Área Total (ha)"
						value={formData.totalAreaInHectares}
						onChange={(e) =>
							setFormData({
								...formData,
								totalAreaInHectares: Number(e.target.value),
							})
						}
					/>
					<TextField
						fullWidth
						required
						margin="normal"
						type="number"
						label="Taxa por Hectare"
						value={formData.taxPerHectare}
						onChange={(e) =>
							setFormData({
								...formData,
								taxPerHectare: Number(e.target.value),
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
