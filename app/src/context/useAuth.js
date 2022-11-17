import { useState, useEffect } from "react";

import api from "../services/api";
import history from "../history";

export default function useAuth() {
	const [authenticated, setAuthenticated] = useState(false);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const token = localStorage.getItem("token");

		if (token) {
			api.defaults.headers.Authorization = `Bearer ${JSON.parse(token)}`;
			setAuthenticated(true);
		}

		setLoading(false);
	}, []);

	async function handleLogin(credentials) {
		const { email, password } = credentials;

		api.post("/users/login", {
			username: email,
			password: password,
		})
			.then((resp) => {
				const {token, id, username} = resp.data;
				localStorage.setItem("token", JSON.stringify(token));
				localStorage.setItem("id", JSON.stringify(id));
				localStorage.setItem("username", JSON.stringify(username));
				api.defaults.headers.Authorization = `Bearer ${token}`;
				setAuthenticated(true);
				return true;
			})
			.catch(function (error) {
				console.log("acesso negado");
				return false;
			});
	}

	function handleLogout() {
		setAuthenticated(false);
		localStorage.removeItem("token");
		localStorage.removeItem("id");
		localStorage.removeItem("username");
		api.defaults.headers.Authorization = undefined;
		history.push("/login");
	}

	return { authenticated, loading, handleLogin, handleLogout };
}
