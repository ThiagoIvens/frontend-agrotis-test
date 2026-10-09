import React, { useState } from "react";
import {
	Box,
	Typography,
	TextField,
	Button,
	Paper,
	CircularProgress,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Grid,
} from "@mui/material";
import { api } from "../services/api";
import { LaboratoryReportResponseDTO } from "../types";

export const LaboratoryReportPage: React.FC = () => {
	const [filters, setFilters] = useState({
		dataInicialInicio: "",
		dataInicialFim: "",
		dataFinalInicio: "",
		dataFinalFim: "",
		buscaTextual: "",
		qtdMinimaProdutores: 1,
	});

	const [reports, setReports] = useState<LaboratoryReportResponseDTO[]>([]);
	const [loading, setLoading] = useState(false);
	const [hasSearched, setHasSearched] = useState(false);

	const handleFilter = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		try {
			const params = new URLSearchParams();
			if (filters.dataInicialInicio)
				params.append("dataInicialInicio", filters.dataInicialInicio);
			if (filters.dataInicialFim)
				params.append("dataInicialFim", filters.dataInicialFim);
			if (filters.dataFinalInicio)
				params.append("dataFinalInicio", filters.dataFinalInicio);
			if (filters.dataFinalFim)
				params.append("dataFinalFim", filters.dataFinalFim);
			if (filters.buscaTextual)
				params.append("buscaTextual", filters.buscaTextual);
			params.append(
				"qtdMinimaProdutores",
				filters.qtdMinimaProdutores.toString(),
			);

			const res = await api.get<LaboratoryReportResponseDTO[]>(
				`/laboratories/reports?${params.toString()}`,
			);
			setReports(res.data);
			setHasSearched(true);
		} catch (err) {
			console.error(err);
			alert("Erro ao buscar relatórios");
		} finally {
			setLoading(false);
		}
	};

	const clearFilters = () => {
		setFilters({
			dataInicialInicio: "",
			dataInicialFim: "",
			dataFinalInicio: "",
			dataFinalFim: "",
			buscaTextual: "",
			qtdMinimaProdutores: 1,
		});
		setReports([]);
		setHasSearched(false);
	};

	return (
		<Box>
			<Typography variant="h5" mb={3}>
				Painel Analítico de Laboratórios
			</Typography>

			<Paper
				sx={{ p: 3, mb: 3 }}
				component="form"
				onSubmit={handleFilter}
			>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={3}>
						<TextField
							fullWidth
							type="date"
							label="Data Inicial (De)"
							InputLabelProps={{ shrink: true }}
							value={filters.dataInicialInicio}
							onChange={(e) =>
								setFilters({
									...filters,
									dataInicialInicio: e.target.value,
								})
							}
						/>
					</Grid>
					<Grid item xs={12} sm={3}>
						<TextField
							fullWidth
							type="date"
							label="Data Inicial (Até)"
							InputLabelProps={{ shrink: true }}
							value={filters.dataInicialFim}
							onChange={(e) =>
								setFilters({
									...filters,
									dataInicialFim: e.target.value,
								})
							}
						/>
					</Grid>
					<Grid item xs={12} sm={3}>
						<TextField
							fullWidth
							type="date"
							label="Data Final (De)"
							InputLabelProps={{ shrink: true }}
							value={filters.dataFinalInicio}
							onChange={(e) =>
								setFilters({
									...filters,
									dataFinalInicio: e.target.value,
								})
							}
						/>
					</Grid>
					<Grid item xs={12} sm={3}>
						<TextField
							fullWidth
							type="date"
							label="Data Final (Até)"
							InputLabelProps={{ shrink: true }}
							value={filters.dataFinalFim}
							onChange={(e) =>
								setFilters({
									...filters,
									dataFinalFim: e.target.value,
								})
							}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							label="Busca Textual (Observações)"
							value={filters.buscaTextual}
							onChange={(e) =>
								setFilters({
									...filters,
									buscaTextual: e.target.value,
								})
							}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							required
							type="number"
							label="Qtd. Mínima Produtores"
							value={filters.qtdMinimaProdutores}
							onChange={(e) =>
								setFilters({
									...filters,
									qtdMinimaProdutores: Number(e.target.value),
								})
							}
						/>
					</Grid>

					<Grid
						item
						xs={12}
						display="flex"
						justifyContent="flex-end"
						gap={2}
					>
						<Button onClick={clearFilters} disabled={loading}>
							Limpar
						</Button>
						<Button
							type="submit"
							variant="contained"
							disabled={loading}
						>
							{loading ? (
								<CircularProgress size={24} />
							) : (
								"Filtrar"
							)}
						</Button>
					</Grid>
				</Grid>
			</Paper>

			{hasSearched && !loading && (
				<Paper>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Cód. Laboratório</TableCell>
								<TableCell>Nome do Laboratório</TableCell>
								<TableCell align="right">
									Qtd. Produtores Vinculados
								</TableCell>
								<TableCell align="right">
									Valor Calculado (R$)
								</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{reports.length === 0 ? (
								<TableRow>
									<TableCell colSpan={4} align="center">
										Nenhum registro encontrado para os
										filtros informados.
									</TableCell>
								</TableRow>
							) : (
								reports.map((row, idx) => (
									<TableRow key={idx}>
										<TableCell>
											{row.laboratoryCode}
										</TableCell>
										<TableCell
											sx={{ textTransform: "uppercase" }}
										>
											{row.laboratoryName}
										</TableCell>
										<TableCell align="right">
											{row.totalLinkedGrowers}
										</TableCell>
										<TableCell align="right">
											{new Intl.NumberFormat("pt-BR", {
												style: "currency",
												currency: "BRL",
											}).format(
												row.financialValueCalculated,
											)}
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</Paper>
			)}
		</Box>
	);
};
