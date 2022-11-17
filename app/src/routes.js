import React, { useContext } from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import { Context } from "./context/AuthContext";

import Login from "./pages/Login";
import Home from "./pages/Home";

import List from "./pages/Certificates/Lista";
import CertificadosPage from "./pages/Certificates/Certificados";
import TemplatePage from "./pages/Certificates/Templates";
import Usuarios from "./pages/Usuarios";

function PrivateRoute({ isPrivate, ...rest }) {
	const { loading, authenticated } = useContext(Context);

	if (loading) {
		return <h1>Loading...</h1>;
	}

	if (isPrivate && !authenticated) {
		return <Redirect to="/login" />;
	}

	return <Route {...rest} />;
}

const Routes = () => {
	return (
		<Switch>
			<Route component={Home} path="/" exact />
			<PrivateRoute
				isPrivate
				component={CertificadosPage}
				path="/certificados"
			/>
			<PrivateRoute
				isPrivate
				component={TemplatePage}
				path="/templates"
			/>
			<PrivateRoute isPrivate component={Usuarios} path="/usuarios" />
			<PrivateRoute isPrivate component={List} path="/lista" />
			<PrivateRoute component={Login} path="/login" />
		</Switch>
	);
};

export default Routes;
