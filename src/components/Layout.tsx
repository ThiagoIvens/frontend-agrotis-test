import React from "react";
import {
	Box,
	Drawer,
	List,
	ListItem,
	ListItemText,
	AppBar,
	Toolbar,
	CssBaseline,
} from "@mui/material";
import { useNavigate, Outlet, useLocation } from "react-router-dom";

const drawerWidth = 240;

export const Layout: React.FC = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const menuItems = [
		{ text: "Produtores", path: "/" },
		{ text: "Laboratórios", path: "/laboratories" },
		{ text: "Propriedades Rurais", path: "/farmsteads" },
		{ text: "Painel de Laboratórios", path: "/report" },
	];

	return (
		<Box sx={{ display: "flex", bgcolor: "#f5f5f5", minHeight: "100vh" }}>
			<CssBaseline />
			<AppBar
				position="fixed"
				elevation={0}
				sx={{
					zIndex: (theme) => theme.zIndex.drawer + 1,
					bgcolor: "#00856f",
				}}
			>
				<Toolbar sx={{ minHeight: "56px !important", px: 3 }}>
					<Box
						component="img"
						src="/agrotis_logo_white.svg"
						alt="Agrotis Logo"
						sx={{ height: 28, width: "auto", color: "#fff" }}
					/>
				</Toolbar>
			</AppBar>
			<Drawer
				variant="permanent"
				sx={{
					width: drawerWidth,
					flexShrink: 0,
					"& .MuiDrawer-paper": {
						width: drawerWidth,
						boxSizing: "border-box",
						bgcolor: "#f8f9fa",
						borderRight: "1px solid #e0e0e0",
					},
				}}
			>
				<Toolbar />
				<Box sx={{ overflow: "auto", mt: 2 }}>
					<List>
						{menuItems.map((item) => (
							<ListItem
								button
								key={item.text}
								onClick={() => navigate(item.path)}
								selected={location.pathname === item.path}
								sx={{
									py: 1.5,
									px: 3,
									"&.Mui-selected": {
										bgcolor: "#e2edec",
										color: "#00856f",
										fontWeight: "bold",
										borderRight: "4px solid #00856f",
									},
									"&:hover": {
										bgcolor: "#edf2f1",
									},
								}}
							>
								<ListItemText
									primary={item.text}
									primaryTypographyProps={{
										fontSize: "0.95rem",
										fontWeight:
											location.pathname === item.path
												? 600
												: 400,
									}}
								/>
							</ListItem>
						))}
					</List>
				</Box>
			</Drawer>
			<Box
				component="main"
				sx={{
					flexGrow: 1,
					p: 1,
					bgcolor: "#f4f6f8",
					minHeight: "100vh",
				}}
			>
				<Toolbar />
				<Outlet />
			</Box>
		</Box>
	);
};
