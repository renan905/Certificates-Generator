import React, { useState } from "react";
import api from "../../services/api";

import {
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

import "./style.css";

const Home = () => {
	const [rows, setRows] = useState([]);
	const [search, setSearch] = useState({ loading: false, hide: false });
	const [searchValue, setSearchValue] = useState("");

	const handleHideTable = () => {
		setSearch((existing) => {
			return {
				...existing,
				loading: false,
				hide: (search.hide) ? false : true,
			};
		});
		
	};

	const handleSearch = () => {
		setSearch((existing) => {
			return {
				...existing,
				loading: true,
			};
		});
		handleSeachInput();
	};

	const handleSearchValue = (event) => {
		if (event.target.value !== "") {
			setSearchValue(event.target.value);
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

	function createData(identificador, data, baixar, title) {
		const bits = data.split(/\D/);
		data = new Date(
			bits[0],
			--bits[1],
			bits[2],
			bits[3],
			bits[4]
		).toLocaleDateString();
		return { identificador, data, baixar, title };
	}

	const handleSeachInput = () => {
		try {
			const searchData = { owner: searchValue };
			api.post("/certificates/owner", { data: searchData }).then(
				(resp) => {
					resp.data.map((row) => {
						const { owner, urlPath, created_at, title } = row;
						const dataRow = createData(
							owner,
							created_at,
							urlPath,
							title
						);
						setRows((existing) => [...existing, dataRow]);
						return true;
					});

					setSearch((existing) => {
						return {
							...existing,
							loading: false,
							hide: true,
						};
					});
				}
			);
		} catch (error) {
			console.log(error);
		}
	};

	const useStyles = makeStyles({
		table: {
			minWidth: 300,
			// height: 400
		},
	});

	const classes = useStyles();

	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(7);

	const emptyRows =
		rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	return (
		<main className="main">
			<h1 className="title">Encontre seus certficados</h1>
			<div
				className="searchBox"
				style={{
					display: search.hide ? "none" : "flex",
				}}
			>
				<TextField
					className="fieldInput"
					onChange={handleSearchValue}
					variant="filled"
					label="Termo de Busca"
					type="busca"
					name="buscaField"
					id="buscaField"
				/>
				<Button
					onClick={handleSearch}
					variant="contained"
					color="primary"
				>
					Buscar Certificado
				</Button>
			</div>
			<div
				className="table"
				style={{
					display: !search.hide ? "none" : "flex",
				}}
			>
				<Button onClick={handleHideTable}>Nova Busca</Button>
				<TableContainer component={Paper}>
					<Table
						className={classes.table}
						aria-label="customized table"
					>
						<TableHead>
							<TableRow>
								<StyledTableCell>Nome</StyledTableCell>
								<StyledTableCell>Certificado</StyledTableCell>
								<StyledTableCell>Data</StyledTableCell>
								<StyledTableCell>Baixar</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{rows
								.slice(
									page * rowsPerPage,
									page * rowsPerPage + rowsPerPage
								)
								.map((row, index) => (
									<StyledTableRow key={row.name}>
										<TableCell component="th" scope="row">
											{row.identificador}
										</TableCell>
										<TableCell component="th" scope="row">
											{row.title}
										</TableCell>
										<TableCell>{row.data}</TableCell>
										<TableCell>
											<Button
												href={row.baixar}
												download={
													row.identificador +
													"-" +
													row.data
												}
												rel="noopener noreferrer"
												target="_blank"
											>
												<GetApp />
												Baixar
											</Button>
										</TableCell>
									</StyledTableRow>
								))}
							{emptyRows > 0 && (
								<TableRow style={{ height: 53 * emptyRows }}>
									<TableCell colSpan={6} />
								</TableRow>
							)}
						</TableBody>
						<TableFooter>
							<TableRow>
								<TablePagination
									rowsPerPageOptions={[7, 14]}
									component="th"
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
			</div>
		</main>
	);
};

export default Home;
