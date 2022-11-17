import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Select, MenuItem, TextField, Button, Paper } from "@material-ui/core";
import Modal from "@material-ui/core/Modal";
import { parse } from "papaparse";

import api from "../../../services/api";

import "./style.css";

const File = () => {
	const [certificateInfo, setCertificateInfo] = useState({
		templateName: "",
		certificateTitle: "",
		errorStatus: "",
		errorMensagem: "",
		fileSelected: false,
	});
	const [rows, setRows] = useState([]);

	const handleTemplateName = (event) => {
		setCertificateInfo((existing) => {
			return {
				...existing,
				templateName: event.target.value,
			};
		});
	};

	const handleCertificateName = (event) => {
		setCertificateInfo((existing) => {
			return {
				...existing,
				certificateTitle: event.target.value,
			};
		});
	};

	const [highlighted, setHighlighted] = useState(false);
	const [data, setData] = useState([]);

	const handleData = (unParsedData) => {
		setData([]);

		Array.from(unParsedData)
			.filter(
				(file) =>
					file.type === "application/vnd.ms-excel" ||
					file.type === "text/csv"
			)
			.forEach(async (file) => {
				const text = await file.text();
				const result = parse(text, { header: true });
				setData((existing) => [...existing, ...result.data]);
			});
	};

	const handleData2 = (event) => {
		setData([]);
		const unParsedData = event.target.files;
		Array.from(unParsedData)
			.filter(
				(file) =>
					file.type === "application/vnd.ms-excel" ||
					file.type === "text/csv"
			)
			.forEach(async (file) => {
				const text = await file.text();
				const result = parse(text, { header: true });
				console.log(result)
				setData((existing) => [...existing, ...result.data]);
				setCertificateInfo((existing) => {
					return {
						...existing,
						fileSelected: true,
					};
				});
			});
	};

	const handleErro = () => {
		if (certificateInfo.templateName === "") {
			setCertificateInfo((existing) => {
				return {
					...existing,
					errorStatus: true,
					errorMensagem: "Selecione um template",
				};
			});
		} else if (certificateInfo.certificateTitle === "") {
			setCertificateInfo((existing) => {
				return {
					...existing,
					errorStatus: true,
					errorMensagem: "Todos os certificados devem ter um nome",
				};
			});
		} else if (certificateInfo.fileSelected === false) {
			setCertificateInfo((existing) => {
				return {
					...existing,
					errorStatus: true,
					errorMensagem: "Envie um arquivo de infomações",
				};
			});
		} else {
			setCertificateInfo((existing) => {
				return {
					...existing,
					errorStatus: false,
					errorMensagem: "",
				};
			});
		}
	};

	const upload = async () => {
		handleErro();
		if (!certificateInfo.errorStatus) {
			console.log(data)
			data.map((doc) => {
				try {
					const metaData = doc;
					console.log(metaData);

					const owner = doc.id;
					delete metaData.id;


					const id = localStorage.getItem("id");

					const dataUpload = {
						owner: owner,
						user_id: id,
						template_name: certificateInfo.templateName,
						title: certificateInfo.certificateTitle,
						metaData: metaData,
					};

					api.post("/certificates/new", { data: dataUpload })
						.then((resp) => {
							if (resp.status === 201) {
								return true;
							} else {
								return false;
							}
						})
						.catch((err) => {
							console.log(err);
						});
				} catch (error) {
					setCertificateInfo((existing) => {
						return {
							...existing,
							errorStatus: true,
							errorMensagem: "Error ao realizar upload",
						};
					});
				}
				handleOpen();
				return true;
			});
		}
	};

	function createData(name) {
		return { name };
	}

	useEffect(() => {
		try {
			const id = localStorage.getItem("id");
			api.get(`/certificates/${id}`).then((resp) => {
				resp.data.map((row) => {
					const { name } = row;
					const dataRow = createData(name);
					setRows((existing) => [...existing, dataRow]);
					return true;
				});
			});
		} catch (error) {
			console.log(error);
		}
	}, []);

	const [open, setOpen] = useState(false);

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	return (
		<>
			<Paper className="uploadBox">
				<div className="dropZone">
					<h1>Importar arquivo de informações</h1>

					<div
						className={`drop ${highlighted ? "dropOn" : "dropOff"}`}
						onDragEnter={() => {
							setHighlighted(true);
						}}
						onDragLeave={() => {
							setHighlighted(false);
						}}
						onDragOver={(e) => {
							e.preventDefault();
						}}
						onDrop={(e) => {
							e.preventDefault();
							handleData(e.dataTransfer.files);
							setHighlighted(false);
						}}
					>
						ARRASTE SEU ARQUIVO AQUI
					</div>
					<p>ou</p>
					<input
						onChange={handleData2}
						type="file"
						name="templateFile"
						id="templateFile"
					// accept="application/vnd.ms-excel, text/csv"
					/>
				</div>

				<TextField
					onChange={handleCertificateName}
					label="Nome do Certificado"
					type="text"
					name="templateName"
					id="templateName"
					variant="filled"
				/>
				<p>Selecione um template</p>
				<Select
					className="selectBox"
					labelId="demo-simple-select-label"
					id="demo-simple-select"
					variant="filled"
					value={certificateInfo.templateName}
					onChange={handleTemplateName}
				>
					{rows.map((row) => (
						<MenuItem key={row.name} value={row.name}>
							{row.name}
						</MenuItem>
					))}
				</Select>

				<Button onClick={upload} variant="contained" color="primary">
					Gerar Certificados
				</Button>

				<p>{certificateInfo.errorMensagem}</p>
			</Paper>

			<Modal
				className="modalBox"
				open={open}
				onClose={handleClose}
				aria-labelledby="simple-modal-title"
				aria-describedby="simple-modal-description"
			>
				<div className="modal">
					<h1>Upload realizado com sucesso!</h1>
					<p>Os certificados estão sendo gerados</p>
					<div>
						<Link to="/lista">
							<Button variant="contained" color="primary">
								Lista de Certificados
							</Button>
						</Link>
					</div>
				</div>
			</Modal>
		</>
	);
};

export default File;
