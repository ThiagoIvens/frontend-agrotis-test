import React from "react";
import {
	IconButton,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from "@mui/material";
import {
	ChatBubbleOutline as ChatIcon,
	MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { GrowerDTO } from "../types";
import { maskCpfCnpj, formatDate } from "../utils/mask";

interface GrowersTableProps {
	growers: GrowerDTO[];
	onOpenFarmsteads: (farmsteads: { id: string; name: string }[]) => void;
	onOpenObservations: (obs: string) => void;
	onOpenMenu: (
		event: React.MouseEvent<HTMLElement>,
		grower: GrowerDTO,
	) => void;
}

export const GrowersTable: React.FC<GrowersTableProps> = ({
	growers,
	onOpenFarmsteads,
	onOpenObservations,
	onOpenMenu,
}) => {
	return (
		<Paper
			elevation={0}
			sx={{
				borderRadius: 1,
				border: "1px solid #e0e0e0",
				overflow: "hidden",
			}}
		>
			<Table>
				<TableHead sx={{ bgcolor: "#f8f9fa" }}>
					<TableRow>
						<TableCell sx={{ fontWeight: "bold", color: "#444" }}>
							Nome
						</TableCell>
						<TableCell sx={{ fontWeight: "bold", color: "#444" }}>
							CPF/CNPJ
						</TableCell>
						<TableCell sx={{ fontWeight: "bold", color: "#444" }}>
							Data Inicial
						</TableCell>
						<TableCell sx={{ fontWeight: "bold", color: "#444" }}>
							Data Final
						</TableCell>
						<TableCell sx={{ fontWeight: "bold", color: "#444" }}>
							Propriedade(s)
						</TableCell>
						<TableCell sx={{ fontWeight: "bold", color: "#444" }}>
							Laboratório
						</TableCell>
						<TableCell
							align="center"
							sx={{
								fontWeight: "bold",
								color: "#444",
								width: 80,
							}}
						>
							Obs.
						</TableCell>
						<TableCell
							align="center"
							sx={{
								fontWeight: "bold",
								color: "#444",
								width: 80,
							}}
						>
							Ações
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{growers.length === 0 && (
						<TableRow>
							<TableCell
								colSpan={8}
								align="center"
								sx={{ py: 4, color: "#777" }}
							>
								Nenhum produtor encontrado.
							</TableCell>
						</TableRow>
					)}
					{growers.map((g) => {
						const count = g.farmsteads?.length || 0;
						return (
							<TableRow
								key={g.id}
								sx={{
									"&:nth-of-type(even)": {
										bgcolor: "#fafafa",
									},
									"&:hover": { bgcolor: "#f1f5f4" },
								}}
							>
								<TableCell>{g.name}</TableCell>
								<TableCell>
									{maskCpfCnpj(g.registration || "")}
								</TableCell>
								<TableCell>
									{formatDate(g.operationInitialDate)}
								</TableCell>
								<TableCell>
									{formatDate(g.operationFinalDate)}
								</TableCell>
								<TableCell>
									{count > 0 ? (
										<Typography
											component="span"
											onClick={() =>
												onOpenFarmsteads(g.farmsteads!)
											}
											sx={{
												color: "#00856f",
												cursor: "pointer",
												textDecoration: "underline",
												fontSize: "0.875rem",
											}}
										>
											({count}) propriedades
										</Typography>
									) : (
										<Typography
											component="span"
											sx={{
												color: "#888",
												fontSize: "0.875rem",
											}}
										>
											Nenhuma
										</Typography>
									)}
								</TableCell>
								<TableCell>{g.laboratoryName || "-"}</TableCell>
								<TableCell align="center">
									<IconButton
										size="small"
										onClick={() =>
											onOpenObservations(
												g.observations ||
													"Nenhuma observação registrada.",
											)
										}
										sx={{ color: "#666" }}
									>
										<ChatIcon fontSize="small" />
									</IconButton>
								</TableCell>
								<TableCell align="center">
									<IconButton
										size="small"
										onClick={(e) => onOpenMenu(e, g)}
										sx={{ color: "#666" }}
									>
										<MoreVertIcon fontSize="small" />
									</IconButton>
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</Paper>
	);
};
