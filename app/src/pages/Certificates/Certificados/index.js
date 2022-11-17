import React from "react";

import Navbar from "../../../components/navbar";
import File from "../../../components/upload/file";

import "./style.css";

const CertificadosPage = () => {
	return (
		<>
			<Navbar />
			<main className="upload">
				<File />
			</main>
		</>
	);
};

export default CertificadosPage;
