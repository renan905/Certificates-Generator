import React, { useContext } from "react";
import { Paper, Button } from "@material-ui/core";
import { Link } from "react-router-dom";

import { Context } from "../../context/AuthContext";

import "./style.css";

const Navbar = () => {
	const { handleLogout } = useContext(Context);

	return (
		<>
			<nav>
				<Paper className="navbar">
					<Link className="link" to="/certificados">
						<Button variant="contained" color="primary">
							Novo Certificado
						</Button>
					</Link>
					<Link className="link" to="/templates">
						<Button variant="contained" color="primary">
							Templates
						</Button>
					</Link>
					<Link className="link" to="/lista">
						<Button variant="contained" color="primary">
							Certificados
						</Button>
					</Link>
					<Link className="link" to="/usuarios">
						<Button variant="contained" color="primary">
							Usuarios
						</Button>
					</Link>
					<Button
						className="link"
						variant="contained"
						color="secondary"
						onClick={handleLogout}
					>
						Sair
					</Button>
				</Paper>
			</nav>
		</>
	);
};

export default Navbar;
