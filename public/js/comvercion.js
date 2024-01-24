window.onload = function () {
	// Función para convertir dólares a pesos mexicanos (tasa de cambio ficticia)
	function convertirAPesos(montoDolares) {
		const tasaCambio = 20; // Tasa de cambio ficticia
		return montoDolares * tasaCambio;
	}

	// Función para realizar la transacción y actualizar la información en el HTML
	function realizarTransaccion(transaccionId, nombre, montoDolares) {
		const transaccion = document.getElementById(transaccionId);
		const estadoElement = transaccion.querySelector(`#estado${transaccionId}`);
		const montoPesosElement = transaccion.querySelector(
			`#montoPesos${transaccionId}`
		);

		// Simulación de transacción exitosa para las primeras dos transacciones
		const transaccionExitosa = transaccionId !== "transaccion3";

		if (transaccionExitosa) {
			estadoElement.textContent = "Transacción exitosa";

			// Realizar la conversión a pesos mexicanos
			const montoPesos = convertirAPesos(montoDolares);
			montoPesosElement.textContent = montoPesos.toFixed(2) + " pesos";
		} else {
			estadoElement.textContent =
				"Transacción fallida (No aceptada la conversión a pesos mexicanos)";
		}
	}

	// Realizar las transacciones
	realizarTransaccion("transaccion1", "Susana Crampón", 500000);
	realizarTransaccion("transaccion2", "Susana Crampón", 300000);
	realizarTransaccion("transaccion3", "Arturo Gomez", 350000);
};
