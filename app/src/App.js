import React from "react";
import { Router } from "react-router-dom";
import Routes from "./routes";
import { AuthProvider } from "./context/AuthContext";
import history from "./history";
import "./app.css";

function App() {
	return (
		<AuthProvider>
			<Router history={history}>
				<Routes />
			</Router>
		</AuthProvider>
	);
}

export default App;
