import React, { useState, useEffect } from 'react';
import Formulario from './components/Formulario';
import ListadoImagenes from './components/ListadoImagenes';

function App() {
	const [busqueda, guardarBusqueda] = useState('');
	const [imagenes, guardarImagenes] = useState([]);
	const [paginaactual, guardarPaginaActual] = useState(1);
	const [totalpaginas, guardarTotalPaginas] = useState(1);

	useEffect(() => {
		if (busqueda === '') return;

		const consultarAPI = async () => {
			const imagenesPorPagina = 10;
			const key = '20063757-6f71ef882d9bfecfa7c33f251';
			const url = `https://pixabay.com/api/?key=${key}&q=${busqueda}&per_page=${imagenesPorPagina}&page=${paginaactual}`;

			const respuesta = await fetch(url);
			const resultado = await respuesta.json();

			guardarImagenes(resultado.hits);

			// Calcular el total de paginas
			const calcularTotalPaginas = Math.ceil(
				resultado.totalHits / imagenesPorPagina
			);
			guardarTotalPaginas(calcularTotalPaginas);

			// Ir arriba cuando se de siguiente o anterior
			const jumbotron = document.querySelector(
				'.jumbotron'
			);
			jumbotron.scrollIntoView({ behavior: 'smooth' });
		};

		consultarAPI();
	}, [busqueda, paginaactual]);

	const paginaAnterior = () => {
		const nuevaPaginaActual = paginaactual - 1;
		if (nuevaPaginaActual === 0) return;
		guardarPaginaActual(nuevaPaginaActual);
	};

	const paginaSiguiente = () => {
		const nuevaPaginaActual = paginaactual + 1;
		if (nuevaPaginaActual > totalpaginas) return;
		guardarPaginaActual(nuevaPaginaActual);
	};

	return (
		<div className='container'>
			<div className='jumbotron'>
				<p className='lead text-center'>
					Buscador de Imágenes
				</p>
				<Formulario guardarBusqueda={guardarBusqueda} />
			</div>
			<div className='row justify-content-center'>
				<ListadoImagenes imagenes={imagenes} />
				{paginaactual > 1 ? (
					<button
						type='button'
						className='bbtn btn-info mr-1'
						onClick={paginaAnterior}
					>
						&laquo; Anterior
					</button>
				) : null}

				{paginaactual !== totalpaginas ? (
					<button
						type='button'
						className='bbtn btn-info'
						onClick={paginaSiguiente}
					>
						Siguiente &raquo;
					</button>
				) : null}
			</div>
		</div>
	);
}

export default App;
