import React from "react";
import {
	Box,
	Drawer,
	List,
	ListItem,
	ListItemText,
	AppBar,
	Toolbar,
	Typography,
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
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			<AppBar
				position="fixed"
				sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
			>
				<Toolbar>
					<Typography variant="h6" noWrap component="div">
						Agrotis Gestão
					</Typography>
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
					},
				}}
			>
				<Toolbar />
				<Box sx={{ overflow: "auto" }}>
					<List>
						{menuItems.map((item) => (
							<ListItem
								button
								key={item.text}
								onClick={() => navigate(item.path)}
								selected={location.pathname === item.path}
							>
								<ListItemText primary={item.text} />
							</ListItem>
						))}
					</List>
				</Box>
			</Drawer>
			<Box component="main" sx={{ flexGrow: 1, p: 3 }}>
				<Toolbar />
				<Outlet />
			</Box>
		</Box>
	);
};
