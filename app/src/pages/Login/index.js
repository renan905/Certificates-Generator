import React, { useContext, useState } from "react";
import { Paper, Button, TextField } from "@material-ui/core";

import { Context } from "../../context/AuthContext";
import history from "../../history";

import "./style.css";

const Login = () => {
	const { authenticated, handleLogin } = useContext(Context);

	const [credentials, setCredentials] = useState({
		email: "",
		password: "",
		errorStatus: false,
		errorMensagem: "",
	});
	const handleCredentials = (event) => {
		if (event.target.value !== "") {
			if (event.target.name === "emailField") {
				setCredentials((existing) => {
					return {
						...existing,
						email: event.target.value,
					};
				});
			} else if (event.target.name === "senhaField") {
				setCredentials((existing) => {
					return {
						...existing,
						password: event.target.value,
					};
				});
			}
		}
	};

	const verifyCredintials = () => {
		const { email, password } = credentials;
		if (email === "" || password === "") {
			setCredentials((existing) => {
				return {
					...existing,
					errorStatus: true,
					errorMensagem: "Preencha todos os campos",
				};
			});
		} else {
			setCredentials((existing) => {
				return {
					...existing,
					errorStatus: false,
					errorMensagem: "",
				};
			});
			const sucess = handleLogin(credentials);
			if (sucess) {
				history.push("/lista");
			} else {
				setCredentials((existing) => {
					return {
						...existing,
						errorStatus: true,
						errorMensagem: "Acesso Negado",
					};
				});
			}
		}
	};

	return (
		<main className="mainArea">
			<Paper className="loginSection">
				<form className="formDiv" onSubmit={verifyCredintials}>
					<h1>Login</h1>
					<div className="field">
						<TextField
							className="fieldInput"
							onChange={handleCredentials}
							label="Email"
							type="email"
							name="emailField"
							id="emailField"
						/>
					</div>

					<div className="field">
						<TextField
							className="fieldInput"
							onChange={handleCredentials}
							label="Senha"
							type="password"
							name="senhaField"
							id="senhaField"
						/>
					</div>

					<Button variant="contained" onClick={verifyCredintials}>
						Entrar
					</Button>
					<p>{credentials.errorMensagem}</p>
				</form>
			</Paper>
		</main>
	);
};

export default Login;
