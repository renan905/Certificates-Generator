import React, { useState, useEffect } from "react";
import api from "../../../services/api";

import { TableFooter, TablePagination, Button } from "@material-ui/core";

import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import GetApp from "@material-ui/icons/GetApp";

import Navbar from "../../../components/navbar";

import "./list.css";

const List = () => {
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

	function createData(identificador, certificado, data, baixar) {
		// const formatDate = data;
		const bits = data.split(/\D/);
		data = new Date(
			bits[0],
			--bits[1],
			bits[2],
			bits[3],
			bits[4]
		).toLocaleDateString();
		return { identificador, certificado, data, baixar };
	}

	const [rows, setRows] = useState([]);

	useEffect(() => {
		try {
			const id = localStorage.getItem("id");
			api.get(`/certificates?id=${id}`).then((resp) => {
				resp.data.map((row) => {
					const { owner, title, urlPath, created_at } = row;
					const dataRow = createData(
						owner,
						title,
						created_at,
						urlPath
					);
					setRows((existing) => [...existing, dataRow]);
					return true;
				});
			});
		} catch (error) {
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

	return (
		<>
			<Navbar />
			<main>
				<TableContainer component={Paper}>
					<Table
						className={classes.table}
						aria-label="customized table"
					>
						<TableHead>
							<TableRow>
								<StyledTableCell>Identificador</StyledTableCell>
								<StyledTableCell>Certficado</StyledTableCell>
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
									<StyledTableRow key={row.identificador}>
										<TableCell component="th" scope="row">
											{row.identificador}
										</TableCell>
										<TableCell>{row.certificado}</TableCell>
										<TableCell>{row.data}</TableCell>
										<TableCell>
											<Button
												href={row.baixar}
												download={
													row.identificador +
													"-" +
													row.certificado +
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
									rowsPerPageOptions={[10, 20, 50]}
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
			</main>
		</>
	);
};

export default List;
