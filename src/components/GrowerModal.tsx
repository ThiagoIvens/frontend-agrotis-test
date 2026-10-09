import React from "react";
import {
	Box,
	Button,
	Checkbox,
	Chip,
	CircularProgress,
	FormControl,
	Grid,
	IconButton,
	InputLabel,
	ListItemText,
	MenuItem,
	Modal,
	OutlinedInput,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import { ArrowBack as ArrowBackIcon } from "@mui/icons-material";
import { FarmsteadDTO, GrowerRequestDTO, LaboratoryDTO } from "../types";
import { maskCpfCnpj } from "../utils/mask";

interface GrowerModalProps {
	open: boolean;
	editingId: string | null;
	submitting: boolean;
	formData: GrowerRequestDTO;
	labs: LaboratoryDTO[];
	farmsteads: FarmsteadDTO[];
	onClose: () => void;
	onSubmit: (e: React.FormEvent) => void;
	onChangeForm: (data: GrowerRequestDTO) => void;
}

const modalStyle = {
	position: "absolute" as "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "85%",
	maxWidth: 950,
	bgcolor: "background.paper",
	boxShadow: 24,
	borderRadius: 1,
	overflow: "hidden",
	maxHeight: "90vh",
	display: "flex",
	flexDirection: "column",
};

export const GrowerModal: React.FC<GrowerModalProps> = ({
	open,
	editingId,
	submitting,
	formData,
	labs,
	farmsteads,
	onClose,
	onSubmit,
	onChangeForm,
}) => {
	return (
		<Modal open={open} onClose={() => !submitting && onClose()}>
			<Box sx={modalStyle} component="form" onSubmit={onSubmit}>
				<Box
					sx={{
						bgcolor: "#00856f",
						color: "white",
						px: 3,
						py: 2,
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
					}}
				>
					<Box display="flex" alignItems="center" gap={1.5}>
						<IconButton
							color="inherit"
							onClick={onClose}
							sx={{ p: 0 }}
						>
							<ArrowBackIcon />
						</IconButton>
						<Typography
							variant="h6"
							sx={{ fontSize: "1.1rem", fontWeight: 400 }}
						>
							Teste Front-End /{" "}
							<Box component="span" sx={{ fontWeight: 600 }}>
								{editingId
									? "Editar Cadastro"
									: "Novo Cadastro"}
							</Box>
						</Typography>
					</Box>
					<Button
						type="submit"
						variant="contained"
						disabled={submitting}
						sx={{
							bgcolor: "#00a389",
							color: "white",
							fontWeight: "bold",
							px: 3,
							textTransform: "none",
							boxShadow: "none",
							"&:hover": {
								bgcolor: "#00856f",
								boxShadow: "none",
							},
						}}
					>
						{submitting ? (
							<CircularProgress size={22} color="inherit" />
						) : (
							"SALVAR"
						)}
					</Button>
				</Box>

				<Box sx={{ p: 4, overflowY: "auto", flexGrow: 1 }}>
					<Grid container spacing={3}>
						<Grid item xs={12} md={6}>
							<TextField
								fullWidth
								required
								variant="standard"
								label="Nome *"
								value={formData.name}
								onChange={(e) =>
									onChangeForm({
										...formData,
										name: e.target.value,
									})
								}
							/>
						</Grid>

						<Grid item xs={12} md={3}>
							<TextField
								fullWidth
								required
								variant="standard"
								type="date"
								label="Data Inicial *"
								InputLabelProps={{ shrink: true }}
								value={formData.operationInitialDate}
								onChange={(e) =>
									onChangeForm({
										...formData,
										operationInitialDate: e.target.value,
									})
								}
							/>
						</Grid>

						<Grid item xs={12} md={3}>
							<TextField
								fullWidth
								required
								variant="standard"
								type="date"
								label="Data Final *"
								InputLabelProps={{ shrink: true }}
								value={formData.operationFinalDate}
								onChange={(e) =>
									onChangeForm({
										...formData,
										operationFinalDate: e.target.value,
									})
								}
							/>
						</Grid>

						<Grid item xs={12} md={6}>
							<TextField
								fullWidth
								required
								variant="standard"
								label="CPF/CNPJ *"
								value={formData.registration}
								inputProps={{ maxLength: 18 }}
								onChange={(e) =>
									onChangeForm({
										...formData,
										registration: maskCpfCnpj(
											e.target.value,
										),
									})
								}
							/>
						</Grid>

						<Grid item xs={12} md={6}>
							<FormControl fullWidth variant="standard" required>
								<InputLabel>Laboratório *</InputLabel>
								<Select
									value={formData.laboratoryId}
									label="Laboratório *"
									onChange={(e) =>
										onChangeForm({
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
						</Grid>

						<Grid item xs={12}>
							<FormControl fullWidth variant="standard" required>
								<InputLabel>Propriedades *</InputLabel>
								<Select
									multiple
									value={formData.farmsteadIds}
									onChange={(e) =>
										onChangeForm({
											...formData,
											farmsteadIds:
												typeof e.target.value ===
												"string"
													? e.target.value.split(",")
													: e.target.value,
										})
									}
									input={
										<OutlinedInput label="Propriedades *" />
									}
									renderValue={(selected) => (
										<Box
											sx={{
												display: "flex",
												flexWrap: "wrap",
												gap: 0.5,
												pt: 1,
											}}
										>
											{selected.map((id) => {
												const farm = farmsteads.find(
													(f) => f.id === id,
												);
												return (
													<Chip
														key={id}
														label={
															farm
																? farm.name
																: id
														}
														sx={{
															bgcolor: "#00856f",
															color: "white",
															borderRadius:
																"16px",
															"& .MuiChip-deleteIcon":
																{
																	color: "white",
																},
														}}
														onDelete={() => {
															onChangeForm({
																...formData,
																farmsteadIds:
																	formData.farmsteadIds.filter(
																		(
																			item,
																		) =>
																			item !==
																			id,
																	),
															});
														}}
														onMouseDown={(e) =>
															e.stopPropagation()
														}
													/>
												);
											})}
										</Box>
									)}
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
							<Typography
								variant="caption"
								sx={{
									color: "#777",
									mt: 0.5,
									display: "block",
								}}
							>
								{formData.farmsteadIds.length} selecionadas
							</Typography>
						</Grid>

						<Grid item xs={12} md={6}>
							<TextField
								fullWidth
								required
								variant="standard"
								label="Endereço *"
								value={formData.address}
								onChange={(e) =>
									onChangeForm({
										...formData,
										address: e.target.value,
									})
								}
							/>
						</Grid>
						<Grid item xs={6} md={3}>
							<TextField
								fullWidth
								required
								variant="standard"
								type="number"
								label="Produção *"
								value={formData.production}
								onChange={(e) =>
									onChangeForm({
										...formData,
										production: Number(e.target.value),
									})
								}
							/>
						</Grid>
						<Grid item xs={6} md={3}>
							<TextField
								fullWidth
								required
								variant="standard"
								type="number"
								label="Comissão (%) *"
								value={formData.commissionRate}
								onChange={(e) =>
									onChangeForm({
										...formData,
										commissionRate: Number(e.target.value),
									})
								}
							/>
						</Grid>

						<Grid item xs={12}>
							<TextField
								fullWidth
								variant="standard"
								multiline
								rows={2}
								label="Observações"
								inputProps={{ maxLength: 100 }}
								value={formData.observations}
								onChange={(e) =>
									onChangeForm({
										...formData,
										observations: e.target.value,
									})
								}
							/>
							<Box display="flex" justifyContent="flex-end">
								<Typography
									variant="caption"
									sx={{ color: "#888", mt: 0.5 }}
								>
									{formData.observations?.length || 0}/100
								</Typography>
							</Box>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Modal>
	);
};
