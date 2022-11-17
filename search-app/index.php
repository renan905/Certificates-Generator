<?php
  include_once("database.php");
  $HOST = "localhost";
?>


<!doctype html>
<html lang="en">

<head>
	<!-- Required meta tags -->
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">

	<!-- JavaScript Bundle with Popper -->
	<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/js/bootstrap.bundle.min.js"
		integrity="sha384-OERcA2EqjJCMA+/3y+gxIOqMEjwtxJY7qPCqsdltbNJuaOe923+mo//f6V8Qbsw3"
		crossorigin="anonymous"></script>
	<!-- CSS only -->
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.2/dist/css/bootstrap.min.css" rel="stylesheet"
		integrity="sha384-Zenh87qX5JnK2Jl0vWa8Ck2rdkQ2Bzep5IDxbcnCeuOxjzrPF/et3URy9Bv1WTRi" crossorigin="anonymous">
	<title>Hello, world!</title>
</head>

<body>
	<form action="index.php" method="GET">
		<div class="mb-3">
			<label for="exampleInputEmail1" class="form-label">Buscar Certificados</label>
			<input type="text" name="key" class="form-control" id="key">
		</div>
		<button type="submit" class="btn btn-primary">Buscar</button>
	</form>

	<?php
    if (isset($_GET['key'])) {

	    $key = $mysqli->real_escape_string($_GET['key']);
	    $sql = "SELECT * FROM certificates c WHERE c.owner = $key";
	    $sql_query = $mysqli->query($sql) or die("ERRO ao consultar!" . $mysqli->error);

	    if ($sql_query->num_rows == 0) {
		    echo "<h1>Nenhum resultado encontrado...</h1>";
	    } else {

		    echo "
				<table class='table'>
				<thead>
					<tr>
						<th scope='col'>Propietario</th>
						<th scope='col'>Certificado</th>
						<th scope='col'>Download</th>
					</tr>
				</thead>
				<tbody>
			";

		    while ($dados = $sql_query->fetch_assoc()) {
			    echo '<tr>';
			    echo "<td>" . $dados['owner'] . "</td>";
			    echo "<td>" . $dados['title'] . "</td>";
			    echo "<td><a href='/simple-app/raw/" . $dados['url'] . ".pdf' download>Baixar</a> </td>";
			    echo "</tr>";
		    }

		    echo "</tbody></table>";
	    }
    }
    ?>
</body>

</html>