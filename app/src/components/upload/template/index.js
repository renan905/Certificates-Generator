import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { v4 as uuidv4 } from "uuid";
import api from "../../../services/api";

import {
	Modal,
	Paper,
	Button,
	TextField,
	TableContainer,
	TableCell,
	Table,
	TableRow,
	TableBody,
	TableHead,
	TableFooter,
	TablePagination,
} from "@material-ui/core";

import { withStyles, makeStyles } from "@material-ui/core/styles";

import GetApp from "@material-ui/icons/GetApp";
import Delete from "@material-ui/icons/Delete";

const Template = () => {
	const [rows, setRows] = useState([]);

	// Tempalte Upload
	const [templateInfo, setTemplateInfo] = useState({
		name: "",
		errorStatus: false,
		errorMensagem: "",
	});
	const [templateFile, setTemplateFile] = useState(null);
	const handleTemplateName = (event) => {
		if (event.target.value !== "") {
			setTemplateInfo((existing) => {
				return {
					...existing,
					name: event.target.value,
				};
			});
		}
	};

	const handleTemplateFile = (event) => {
		if (event.target.value !== "") {
			if (
				event.target.files[0].type ===
					"application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
				event.target.files[0].type ===
					"application/vnd.ms-fontobject" ||
				event.target.files[0].type === "application/msword"
			) {
				setTemplateInfo((existing) => {
					return {
						...existing,
						errorStatus: false,
						errorMensagem: "",
					};
				});
				setTemplateFile(event.target.files[0]);
			} else {
				setTemplateInfo((existing) => {
					return {
						...existing,
						errorStatus: true,
						errorMensagem:
							"Formato de arquivo invalido! Utilize preferencialmente arquivos no formato .docx",
					};
				});
			}
		}
	};

	const handleSubmit = (event) => {
		if (templateInfo.name === "") {
			setTemplateInfo((existing) => {
				return {
					...existing,
					errorStatus: true,
					errorMensagem: "O template precisa ter um nome valido",
				};
			});
		} else if (!templateFile) {
			setTemplateInfo((existing) => {
				return {
					...existing,
					errorStatus: true,
					errorMensagem:
						"Selecione um arquivo, preferencialmente no formato .docx",
				};
			});
		} else {
			let err = false;
			rows.map((row) => {
				if (row.name === templateInfo.name) {
					setTemplateInfo((existing) => {
						return {
							...existing,
							errorStatus: true,
							errorMensagem: `Cada template precisa possuir um nome unico, ${templateInfo.name} ja existe`,
						};
					});
					err = true;
				}

				return false;
			});

			if (!err) {
				setTemplateInfo((existing) => {
					return {
						...existing,
						errorStatus: false,
						errorMensagem: "",
					};
				});
				handleUploadTemplate();
			}
		}
		event.preventDefault();
	};

	const handleUploadTemplate = async () => {
		const formData = new FormData();
		formData.append("file", templateFile);
		const id = localStorage.getItem("id");

		try {
			const response = await api.post(
				`/certificates/upload/${id}/${templateInfo.name}`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);
			if (response.status === 201) {
				handleOpen();
			}
		} catch (error) {
			console.log(error);
		}
	};

	// Template Table

	const StyledTableCell = withStyles((theme) => ({
		head: {
			backgroundColor: theme.palette.common.black,
			color: theme.palette.common.white,
		},
		body: {
			fontSize: 14,
		},
	}))(TableCell);

	const StyledTableRow = withStyles((theme) => ({
		root: {
			"&:nth-of-type(odd)": {
				backgroundColor: theme.palette.action.hover,
			},
		},
	}))(TableRow);

	function createData(identificador, data, baixar) {
		const bits = data.split(/\D/);
		data = new Date(
			bits[0],
			--bits[1],
			bits[2],
			bits[3],
			bits[4]
		).toLocaleDateString();
		return { identificador, data, baixar };
	}

	useEffect(() => {
		try {
			const id = localStorage.getItem("id");
			api.get(`/certificates/${id}`).then((resp) => {
				resp.data.map((row) => {
					const { name, urlPath, created_at } = row;
					const dataRow = createData(name, created_at, urlPath);
					setRows((existing) => [...existing, dataRow]);
					return true;
				});
			});
		} catch (error) {
			setTemplateInfo((existing) => {
				return {
					...existing,
					errorStatus: true,
					errorMensagem: "Error ao enviar template, tente novamente",
				};
			});
			console.log(error);
		}
	}, []);

	const useStyles = makeStyles({
		table: {
			minWidth: 700,
		},
	});

	const classes = useStyles();

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	const emptyRows =
		rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const [open, setOpen] = useState(false);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		window.location.reload(false);
		setOpen(false);
	};

	return (
		<>
			<div>
				{/* <Grid container> */}
				{/* <Grid item lg={5} md={5} sm={6} xs={12}> */}
				<Paper>
					<form onSubmit={handleSubmit}>
						<h1>Upload Template</h1>

						<fieldset>
							<legend>
								<h2>Infomações sobre o template</h2>
							</legend>

							<div className="field">
								<TextField
									onChange={handleTemplateName}
									variant="filled"
									label="Nome do Template"
									type="text"
									name="templateName"
									id="templateName"
								/>
							</div>

							<legend>
								<h2>Arquivo</h2>
							</legend>

							<div className="Temaplatefield">
								<input
									onChange={handleTemplateFile}
									type="file"
									name="templateFile"
									id="templateFile"
									accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.ms-fontobject"
								/>
							</div>
						</fieldset>

						<Button type="submit">Enviar</Button>
						<p>{templateInfo.errorMensagem}</p>
					</form>
				</Paper>
				{/* </Grid> */}

				{/* <Grid item lg={5} md={5} sm={6} xs={12}> */}
				<TableContainer component={Paper}>
					<Table
						className={classes.table}
						aria-label="customized table"
					>
						<TableHead>
							<TableRow>
								<StyledTableCell>Nome</StyledTableCell>
								<StyledTableCell>Data</StyledTableCell>
								<StyledTableCell>Baixar</StyledTableCell>
								<StyledTableCell>Deletar</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows
								.slice(
									page * rowsPerPage,
									page * rowsPerPage + rowsPerPage
								)
								.map((row, index) => (
									<StyledTableRow key={row.identificador}>
										<TableCell
											key={uuidv4()}
											component="th"
											scope="row"
										>
											{row.identificador}
										</TableCell>
										<TableCell key={uuidv4()}>
											{row.data}
										</TableCell>
										<TableCell key={uuidv4()}>
											<Button
												key={uuidv4()}
												href={row.baixar}
												download={
													row.identificador +
													"-" +
													row.data
												}
											>
												<GetApp />
												Baixar
											</Button>
										</TableCell>
										<TableCell key={uuidv4()}>
											<Button
												disabled
												key={uuidv4()}
												href={row.baixar}
												download={
													row.identificador +
													"-" +
													row.data
												}
											>
												<Delete />
												Deletar
											</Button>
										</TableCell>
									</StyledTableRow>
								))}
							{emptyRows > 0 && (
								<TableRow
									key={uuidv4()}
									style={{ height: 53 * emptyRows }}
								>
									<TableCell key={uuidv4()} colSpan={6} />
								</TableRow>
							)}
						</TableBody>
						<TableFooter>
							<TableRow>
								<TablePagination
									rowsPerPageOptions={[10, 20, 50]}
									component="div"
									count={rows.length}
									rowsPerPage={rowsPerPage}
									page={page}
									onChangePage={handleChangePage}
									onChangeRowsPerPage={
										handleChangeRowsPerPage
									}
								/>
							</TableRow>
						</TableFooter>
					</Table>
				</TableContainer>
				{/* </Grid> */}
				{/* </Grid> */}
			</div>
			<Modal
				className="modalBox"
				open={open}
				onClose={handleClose}
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
			>
				<div className="modal">
					<h1>Template enviado realizado com sucesso!</h1>
					<p>Agora você pode utilizarlo para gerar certificados</p>
					<div>
						<Link to="/certificados">
							<Button variant="contained" color="primary">
								Gerar Certificados
							</Button>
						</Link>
						<Button
							onClick={handleClose}
							variant="contained"
							color="primary"
						>
							fechar
						</Button>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default Template;
