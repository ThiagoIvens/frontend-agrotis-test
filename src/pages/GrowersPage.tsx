import React, { useEffect, useState } from "react";
import {
	Alert,
	Box,
	Button,
	CircularProgress,
	IconButton,
	Menu,
	MenuItem,
	Modal,
	Snackbar,
	TextField,
	Typography,
} from "@mui/material";
import {
	Add as AddIcon,
	ArrowBack as ArrowBackIcon,
	Search as SearchIcon,
} from "@mui/icons-material";
import { api } from "../services/api";
import {
	FarmsteadDTO,
	GrowerDTO,
	GrowerRequestDTO,
	LaboratoryDTO,
	PaginatedResponse,
} from "../types";
import { formatCurrency, maskCpfCnpj } from "../utils/mask";
import { GrowersTable } from "../components/GrowersTable";
import { GrowerModal } from "../components/GrowerModal";

const alertModalStyle = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 500,
	bgcolor: "background.paper",
	boxShadow: 24,
	p: 0,
	borderRadius: 1,
	overflow: "hidden",
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
	const [searchTerm, setSearchTerm] = useState("");
	const [searchOpen, setSearchOpen] = useState(false);

	const [labs, setLabs] = useState<LaboratoryDTO[]>([]);
	const [farmsteads, setFarmsteads] = useState<FarmsteadDTO[]>([]);

	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);

	const [openModal, setOpenModal] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);
	const [formData, setFormData] = useState<GrowerRequestDTO>(initialForm);

	const [obsModalText, setObsModalText] = useState<string | null>(null);
	const [farmsteadsModalList, setFarmsteadsModalList] = useState<
		FarmsteadDTO[] | null
	>(null);
	const [financialModalValue, setFinancialModalValue] = useState<
		number | null
	>(null);

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const [selectedGrower, setSelectedGrower] = useState<GrowerDTO | null>(
		null,
	);

	const [toast, setToast] = useState<{
		open: boolean;
		msg: string;
		severity: "success" | "error";
	}>({ open: false, msg: "", severity: "success" });

	const fetchData = async (query = "") => {
		setLoading(true);
		try {
			const [growersRes, labsRes, farmsteadsRes] = await Promise.all([
				api.get<PaginatedResponse<GrowerDTO>>(
					`/growers?page=0&size=100${query ? `&search=${encodeURIComponent(query)}` : ""}`,
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

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value;
		setSearchTerm(val);
		fetchData(val);
	};

	const handleMenuOpen = (
		event: React.MouseEvent<HTMLElement>,
		grower: GrowerDTO,
	) => {
		setAnchorEl(event.currentTarget);
		setSelectedGrower(grower);
	};

	const handleMenuClose = () => {
		setAnchorEl(null);
		setSelectedGrower(null);
	};

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
		handleMenuClose();
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
		handleMenuClose();
		const extractedFarmsteadIds = grower.farmsteads
			? grower.farmsteads.map((f: any) => f.id)
			: [];

		setFormData({
			name: grower.name || "",
			registration: maskCpfCnpj(grower.registration || ""),
			address: grower.address || "",
			production: grower.production || 0,
			commissionRate: grower.commissionRate || 0,
			operationInitialDate: grower.operationInitialDate || "",
			operationFinalDate: grower.operationFinalDate || "",
			observations: grower.observations || "",
			laboratoryId: grower.laboratoryId || "",
			farmsteadIds: extractedFarmsteadIds,
		});
		setEditingId(grower.id);
		setOpenModal(true);
	};

	const handleOpenFinancial = (grower: GrowerDTO) => {
		handleMenuClose();
		setFinancialModalValue(grower.calculatedValue ?? 0);
	};

	const openNewModal = () => {
		setFormData(initialForm);
		setEditingId(null);
		setOpenModal(true);
	};

	const handleOpenFarmsteadsModal = (
		growerFarmsteads: { id: string; name: string }[],
	) => {
		if (!growerFarmsteads || growerFarmsteads.length === 0) return;
		const linked = growerFarmsteads.map((f) => ({
			id: f.id,
			name: f.name,
			totalAreaInHectares: 0,
			taxPerHectare: 0,
			calculatedValue: 0,
		})) as FarmsteadDTO[];
		setFarmsteadsModalList(linked);
	};

	return (
		<Box>
			<Box
				sx={{
					bgcolor: "#00856f",
					color: "white",
					py: 2.5,
					px: 4,
					display: "flex",
					alignItems: "center",
					boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
				}}
			>
				<IconButton color="inherit" sx={{ mr: 2, p: 0 }}>
					<ArrowBackIcon />
				</IconButton>
				<Typography
					variant="h6"
					sx={{ fontWeight: 500, fontSize: "1.25rem" }}
				>
					Teste Front-End
				</Typography>
			</Box>

			<Box
				sx={{
					bgcolor: "white",
					px: 4,
					py: 2,
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					borderBottom: "1px solid #e0e0e0",
				}}
			>
				<Box display="flex" alignItems="center" gap={4}>
					<Typography
						variant="body1"
						sx={{ color: "#333", fontWeight: 500 }}
					>
						Registros ({growers.length})
					</Typography>
					<Button
						variant="text"
						startIcon={<AddIcon />}
						onClick={openNewModal}
						sx={{
							color: "#00856f",
							fontWeight: "bold",
							textTransform: "none",
							"&:hover": { bgcolor: "rgba(0, 133, 111, 0.04)" },
						}}
					>
						ADICIONAR
					</Button>
				</Box>
				<Box display="flex" alignItems="center" gap={1}>
					<TextField
						size="small"
						placeholder="Pesquisar por nome ou CPF..."
						value={searchTerm}
						onChange={handleSearchChange}
						variant="outlined"
						sx={{ width: 250 }}
					/>
					<IconButton
						sx={{ color: "#666" }}
						onClick={() => fetchData(searchTerm)}
					>
						<SearchIcon />
					</IconButton>
				</Box>
			</Box>

			<Box sx={{ p: 4 }}>
				{loading ? (
					<Box display="flex" justifyContent="center" mt={4}>
						<CircularProgress sx={{ color: "#00856f" }} />
					</Box>
				) : (
					<GrowersTable
						growers={growers}
						onOpenFarmsteads={handleOpenFarmsteadsModal}
						onOpenObservations={(obs: string) =>
							setObsModalText(obs)
						}
						onOpenMenu={handleMenuOpen}
					/>
				)}
			</Box>

			<Menu
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleMenuClose}
				PaperProps={{
					elevation: 2,
					sx: { minWidth: 150, borderRadius: 1 },
				}}
			>
				<MenuItem
					onClick={() => selectedGrower && handleEdit(selectedGrower)}
				>
					Editar
				</MenuItem>
				<MenuItem
					onClick={() =>
						selectedGrower && handleOpenFinancial(selectedGrower)
					}
				>
					Cálculo Financeiro
				</MenuItem>
				<MenuItem
					onClick={() =>
						selectedGrower && handleDelete(selectedGrower.id)
					}
					sx={{ color: "#d32f2f" }}
				>
					Excluir
				</MenuItem>
			</Menu>

			{/* Modal de Observações */}
			<Modal
				open={Boolean(obsModalText)}
				onClose={() => setObsModalText(null)}
			>
				<Box sx={alertModalStyle}>
					<Box
						sx={{
							bgcolor: "#00856f",
							color: "white",
							px: 3,
							py: 2,
						}}
					>
						<Typography
							variant="h6"
							sx={{ fontSize: "1.1rem", fontWeight: 500 }}
						>
							Observações
						</Typography>
					</Box>
					<Box sx={{ p: 3, minHeight: 100 }}>
						<Typography variant="body1" sx={{ color: "#333" }}>
							{obsModalText}
						</Typography>
					</Box>
					<Box
						sx={{
							p: 2,
							display: "flex",
							justifyContent: "flex-end",
							bgcolor: "#f8f9fa",
						}}
					>
						<Button
							variant="contained"
							onClick={() => setObsModalText(null)}
							sx={{
								bgcolor: "#00856f",
								textTransform: "none",
								"&:hover": { bgcolor: "#006b58" },
							}}
						>
							FECHAR
						</Button>
					</Box>
				</Box>
			</Modal>

			{/* Modal de Cálculo Financeiro */}
			<Modal
				open={financialModalValue !== null}
				onClose={() => setFinancialModalValue(null)}
			>
				<Box sx={alertModalStyle}>
					<Box
						sx={{
							bgcolor: "#00856f",
							color: "white",
							px: 3,
							py: 2,
						}}
					>
						<Typography
							variant="h6"
							sx={{ fontSize: "1.1rem", fontWeight: 500 }}
						>
							Cálculo Financeiro
						</Typography>
					</Box>
					<Box sx={{ p: 4, textAlign: "center" }}>
						<Typography
							variant="body2"
							sx={{ color: "#666", mb: 1 }}
						>
							Valor Calculado (Produção × Comissão):
						</Typography>
						<Typography
							variant="h4"
							sx={{ color: "#00856f", fontWeight: "bold" }}
						>
							{financialModalValue !== null
								? formatCurrency(financialModalValue)
								: "R$ 0,00"}
						</Typography>
					</Box>
					<Box
						sx={{
							p: 2,
							display: "flex",
							justifyContent: "flex-end",
							bgcolor: "#f8f9fa",
						}}
					>
						<Button
							variant="contained"
							onClick={() => setFinancialModalValue(null)}
							sx={{
								bgcolor: "#00856f",
								textTransform: "none",
								"&:hover": { bgcolor: "#006b58" },
							}}
						>
							FECHAR
						</Button>
					</Box>
				</Box>
			</Modal>

			{/* Modal de Propriedades */}
			<Modal
				open={Boolean(farmsteadsModalList)}
				onClose={() => setFarmsteadsModalList(null)}
			>
				<Box sx={alertModalStyle}>
					<Box
						sx={{
							bgcolor: "#00856f",
							color: "white",
							px: 3,
							py: 2,
						}}
					>
						<Typography
							variant="h6"
							sx={{ fontSize: "1.1rem", fontWeight: 500 }}
						>
							Propriedades ({farmsteadsModalList?.length || 0})
						</Typography>
					</Box>
					<Box sx={{ p: 3, maxHeight: 300, overflowY: "auto" }}>
						{farmsteadsModalList?.map((f, i) => (
							<Box
								key={f.id}
								sx={{
									py: 1.5,
									borderBottom:
										i < farmsteadsModalList.length - 1
											? "1px solid #eee"
											: "none",
								}}
							>
								<Typography
									variant="body1"
									sx={{ color: "#333", fontWeight: 500 }}
								>
									{f.name}
								</Typography>
							</Box>
						))}
					</Box>
					<Box
						sx={{
							p: 2,
							display: "flex",
							justifyContent: "flex-end",
							bgcolor: "#f8f9fa",
						}}
					>
						<Button
							variant="contained"
							onClick={() => setFarmsteadsModalList(null)}
							sx={{
								bgcolor: "#00856f",
								textTransform: "none",
								"&:hover": { bgcolor: "#006b58" },
							}}
						>
							FECHAR
						</Button>
					</Box>
				</Box>
			</Modal>

			{/* Modal de Cadastro/Edição isolado */}
			<GrowerModal
				open={openModal}
				editingId={editingId}
				submitting={submitting}
				formData={formData}
				labs={labs}
				farmsteads={farmsteads}
				onClose={() => setOpenModal(false)}
				onSubmit={handleSubmit}
				onChangeForm={(updated) => setFormData(updated)}
			/>

			<Snackbar
				open={toast.open}
				autoHideDuration={4000}
				onClose={() => setToast({ ...toast, open: false })}
			>
				<Alert severity={toast.severity} variant="filled">
					{toast.msg}
				</Alert>
			</Snackbar>
		</Box>
	);
};
