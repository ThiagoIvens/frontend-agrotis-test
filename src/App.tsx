import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { FarmsteadsPage } from "./pages/FarmsteadsPage";
import { GrowersPage } from "./pages/GrowersPage";
import { LaboratoriesPage } from "./pages/LaboratoriesPage";
import { LaboratoryReportPage } from "./pages/LaboratoryReportPage";

const theme = createTheme({
	palette: {
		primary: {
			main: "#2e7d32", // Verde Agrícola
		},
		secondary: {
			main: "#f57c00",
		},
	},
});

function App() {
	return (
		<ThemeProvider theme={theme}>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<Layout />}>
						<Route index element={<GrowersPage />} />
						<Route
							path="laboratories"
							element={<LaboratoriesPage />}
						/>
						<Route path="farmsteads" element={<FarmsteadsPage />} />

						<Route
							path="report"
							element={<LaboratoryReportPage />}
						/>
					</Route>
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;

