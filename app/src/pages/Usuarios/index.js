import React, { useState, useEffect } from "react";

import {
	Paper,
	Button,
	TextField,
	FormControlLabel,
	Checkbox,
	Modal,
} from "@material-ui/core";
import Navbar from "../../components/navbar";

import api from "../../services/api";

const Usuarios = () => {
	const [modalMensagem, setModalMensagem] = useState("");

	const [editar, setEditar] = useState({
		alterarEmail: false,
		email: "",
		novaSenha: "",
		erroStatus: false,
		errotMensagem: "",
	});

	const handleCertificateEmail = (event) => {
		setEditar((existing) => {
			return {
				...existing,
				email: event.target.value,
			};
		});
	};

	const handleCertificateSenhaNova = (event) => {
		setEditar((existing) => {
			return {
				...existing,
				novaSenha: event.target.value,
			};
		});
	};

	const handleEditarUser = () => {
		if (editar.novaSenha === "") {
			setEditar((existing) => {
				return {
					...existing,
					errorStatus: true,
					errotMensagem: "Os campos de senha devem ser preenchidos",
				};
			});
		} else if (editar.alterarEmail && editar.email === "") {
			setEditar((existing) => {
				return {
					...existing,
					errorStatus: true,
					errotMensagem:
						"Para alterar o email você deve fornecer um novo email",
				};
			});
		} else {
			setEditar((existing) => {
				return {
					...existing,
					errorStatus: false,
					errotMensagem: "",
				};
			});

			try {
				let username = localStorage.getItem("username");
				if (editar.alterarEmail) {
					username = editar.email;
				}

				const id = localStorage.getItem("id");

				api.put(`/users/${id}`, {
					username: username,
					password: editar.novaSenha,
				})
					.then((resp) => {
						console.log(resp);
						if (resp.status === 200) {
							setEditar((existing) => {
								return {
									...existing,
									email: "",
									novaSenha: "",
								};
							});
							setModalMensagem("Senha alterada com sucesso!");
							handleOpen();
							return true;
						} else {
							setEditar((existing) => {
								return {
									...existing,
									errorStatus: "true",
									errorMesagem:
										"Falha ao alterar informações",
								};
							});
							return false;
						}
					})
					.catch((err) => {
						console.log(err);
					});
			} catch (error) {
				console.log(error);
			}
		}
	};

	const [novo, setNovo] = useState({
		alterarEmail: false,
		email: "",
		novaSenha: "",
		erroStatus: false,
		errotMensagem: "",
	});

	const handleCertificateNovoEmail = (event) => {
		setNovo((existing) => {
			return {
				...existing,
				email: event.target.value,
			};
		});
	};

	const handleCertificateNovoSenha = (event) => {
		setNovo((existing) => {
			return {
				...existing,
				novaSenha: event.target.value,
			};
		});
	};

	const [open, setOpen] = useState(false);

	const handleOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
		window.location.reload(false);
	};

	const handleNewUser = () => {
		console.log(novo);
		if (novo.email === "") {
			setNovo((existing) => {
				return {
					...existing,
					errorStatus: true,
					errotMensagem: "Você deve infomar um email",
				};
			});
		} else if (novo.senha === "") {
			console.log("a");
			setNovo((existing) => {
				return {
					...existing,
					errorStatus: true,
					errotMensagem: "Você deve infomar uma senha",
				};
			});
		} else {
			setNovo((existing) => {
				return {
					...existing,
					errorStatus: false,
					errotMensagem: "",
				};
			});

			try {
				api.post(`/users`, {
					username: novo.email,
					password: novo.novaSenha,
					user_type: 1,
				})
					.then((resp) => {
						console.log(resp);
						if (resp.status === 201) {
							setNovo((existing) => {
								return {
									...existing,
									email: "",
									novaSenha: "",
								};
							});
							setModalMensagem("Usuario criado com sucesso!");
							handleOpen();
							return true;
						} else {
							setNovo((existing) => {
								return {
									...existing,
									errorStatus: "",
									errorMesagem: "Falha ao criar novo usuario",
								};
							});
							return false;
						}
					})
					.catch((err) => {
						console.log(err);
						setNovo((existing) => {
							return {
								...existing,
								errorStatus: true,
								errorMesagem: "Falha ao criar novo usuario",
							};
						});
					});
			} catch (error) {
				console.log(error);
			}
		}
	};

	return (
		<>
			<Navbar />
			<main>
				<Paper>
					<div>
						<h1>Editar seu usuario</h1>
						<FormControlLabel
							control={
								<Checkbox
									checked={!editar.alterarEmail}
									// onChange={handleChange}
									name="checkedA"
								/>
							}
							label="Alterar Email"
						/>
						<TextField
							onChange={handleCertificateEmail}
							defaultValue={editar.email}
							label="Email"
							type="text"
							name="emailField"
							id="emailField"
							disabled={!editar.alterarEmail}
							variant="filled"
						/>
						<TextField
							onChange={handleCertificateSenhaNova}
							label="Nova Senha"
							type="password"
							name="NovaSenha"
							id="NovaSenha"
							variant="filled"
						/>
						<Button
							variant="contained"
							color="primary"
							onClick={handleEditarUser}
						>
							Editar informações
						</Button>
						<p>{editar.errotMensagem}</p>
					</div>
				</Paper>
				<Paper>
					<div>
						<h1>Adicionar novo usuario</h1>
						<TextField
							onChange={handleCertificateNovoEmail}
							label="Email"
							type="email"
							name="NomedoCertificado"
							id="NomedoCertificado"
							variant="filled"
						/>
						<TextField
							onChange={handleCertificateNovoSenha}
							label="Senha"
							type="password"
							name="templateName"
							id="templateName"
							variant="filled"
						/>
						<Button
							onClick={handleNewUser}
							variant="contained"
							color="primary"
							// onClick={handleEditarUser}
						>
							Criar Novo
						</Button>
						<p>{novo.errotMensagem}</p>
					</div>
				</Paper>
			</main>
			<Modal
				className="modalBox"
				open={open}
				onClose={handleClose}
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
			>
				<div className="modal">
					<h1>{modalMensagem}</h1>
					{/* <p>Os certificados estão sendo gerados</p> */}

					<Button
						onClick={handleClose}
						variant="contained"
						color="primary"
					>
						Fechar
					</Button>
				</div>
			</Modal>
		</>
	);
};

export default Usuarios;
