$(document).ready(function () {
	const userIds = localStorage.getItem("userId");

	// Manejar inicio de sesión exitoso
	$("#login-form").submit(function (event) {
		event.preventDefault();
		const username = $("#login-username").val();
		const password = $("#login-password").val();
		$.post("/login", { username: username, password: password }, function (data) {
			if (data.success) {
				// Almacenar el ID del usuario
				userId = data.userId;
				localStorage.setItem("userId", data.userId);
				window.location.href = "/profile.html";
			} else {
				alert("Credenciales inválidas");
			}
		});
	});

	// Manejar el envío del formulario de registro
	$("#signup-form").submit(function (event) {
		event.preventDefault();
		const username = $("#signup-username").val();
		const email = $("#signup-email").val();
		const password = $("#signup-password").val();
		$.post(
			"/signup",
			{
				username: username,
				email: email,
				password: password,
			},
			function (data) {
				if (data.success) {
					alert("Registro exitoso");
				} else {
					alert("Registro fallido");
				}
			}
		);
	});

	if (userIds !== null) {
		console.log("NO PASO NADA");
		console.log("ID de usuario:", userIds);
	} else {
		if ($("#trigger").length > 0) {
			window.location.href = "/login-signup.html";
		}
	}

	// Verificar si el elemento #username existe en la página
	if ($("#trigger").length > 0 && userIds !== "undefined") {
		$.ajax({
			url: "/api/user-info",
			method: "GET",
			success: function (response) {
				// Mostrar el nombre de usuario y el balance en la página
				$("#username").text(response.username);
				$("#balance").text(response.balance);

				// Mostrar las últimas 10 transacciones en una tabla
				const transactions = response.transactions;
				for (let i = 0; i < transactions.length; i++) {
					const transaction = transactions[i];
					const row = $("<tr></tr>");
					row.append($("<td></td>").text(transaction.description));
					row.append($("<td></td>").text(transaction.amount));
					row.append($("<td></td>").text(transaction.transaction_date));
					$("#transaction-list").append(row);
				}
			},
			error: function () {
				// Mostrar mensaje de error al usuario
				alert("Error al obtener la información del usuario");
			},
		});
	}

	// Manejar el envío del formulario de depósito
	$("#deposit-form").on("submit", function (event) {
		event.preventDefault();

		// Obtener los valores del formulario
		const amount = $("#deposit-amount").val();
		const description = $("#deposit-description").val();

		// Enviar solicitud al servidor
		$.ajax({
			url: "/api/deposit",
			method: "POST",
			data: { amount, description },
			success: function (response) {
				if (response.success) {
					// Mostrar mensaje de éxito al usuario
					alert(response.message);
					$("#deposit-amount").val("");
					$("#deposit-description").val("");
					location.reload();
				} else {
					// Mostrar mensaje de error al usuario
					alert(response.message);
				}
			},
			error: function () {
				// Mostrar mensaje de error al usuario
				alert("Error en el servidor");
			},
		});
	});

	// Manejar el envío del formulario de retiro
	$("#withdraw-form").on("submit", function (event) {
		event.preventDefault();

		// Obtener los valores del formulario
		const amount = $("#withdraw-amount").val();
		const description = `Account ${$("#withdraw-description").val()} - To ${$(
			"#Bank"
		).val()}`;

		// Enviar solicitud al servidor
		$.ajax({
			url: "/api/withdraw",
			method: "POST",
			data: { amount, description },
			success: function (response) {
				if (response.success) {
					// Mostrar mensaje de éxito al usuario
					alert(response.message);
					$("#withdraw-amount").val("");
					$("#withdraw-description").val("");
					location.reload();
				} else {
					// Mostrar mensaje de error al usuario
					alert(response.message);
				}
			},
			error: function () {
				// Mostrar mensaje de error al usuario
				alert("Error en el servidor");
			},
		});
	});

	$("#logout-button").click(function () {
		$.post("/logout", function (data) {
			// Borrar información de sesión
			localStorage.removeItem("userId");
			// Redirigir a la página de inicio de sesión
			window.location.href = "/index.html";
		});
	});

	$("#bitcoin-btn").on("submit", function (event) {
		event.preventDefault();
		alert(
			"Por favor mantenga la paciencia estamos, trabajando con usted, Gracias"
		);

		// Obtiene la fecha y hora actual
		var currentDate = new Date();

		// Calcula la fecha y hora límite sumando 24 horas
		var deadline = new Date(
			currentDate.getTime() + 24 * 60 * 60 * 1000
		).toISOString();

		// Guarda la fecha y hora límite en el Local Storage
		localStorage.setItem("timer", deadline);

		window.location.href = "/profile.html";
	});

	$("#aceptar-btn").on("submit", function (event) {
		event.preventDefault();
		var nombre = prompt(
			"Por favor, ingrese su nombre, sera utilizado como firma digital:"
		);
		var telefono = prompt("Por favor, ingrese su CURP o CIF:");

		if (nombre && telefono) {
			alert(
				"El Sr. Omar Ray Piantini, debe viajar a firmar algunos documentos en mexico, ya que hay algunos conceptos de la inversión que no se encuentran claros y deben ser autorizados y revisados de manera personal."
			);
			window.location.href = "/profile.html";
		}
	});

	// Comprueba si se ha guardado el estado en el Local Storage
	var accepted = localStorage.getItem("accepted");

	if (accepted === "true") {
		// Los términos han sido aceptados, oculta el div container
		$(".container-acept").hide();
	} else if (accepted === "false") {
		// Los términos han sido rechazados, el div container se mantiene visible
	} else {
		// El estado no ha sido guardado, el div container se mantiene visible
	}

	$("#deposito-btn").on("submit", function (event) {
		event.preventDefault();
		var numeroFactura = $("input[placeholder='Numero de Factura']").val();

		// Verificar el valor del numeroFactura
		if (numeroFactura === "0100003456") {
			alert(
				"Número de factura No.1 confirmado, ingrese el siguiente número de factura."
			);
		} else if (numeroFactura === "0100003457") {
			alert(
				"Número de factura No.2 confirmado, ingrese el siguiente número de factura."
			);
		} else if (numeroFactura === "0100003458") {
			alert(
				"Número de factura No.3 confirmado, ingrese el siguiente número de factura."
			);
		} else if (numeroFactura === "0100003459") {
			alert(
				"Número de factura No.4 confirmado, PayPal en conjunto con el beneficiario/a debe de realizar la acreditación de monto correspondiente a la entidad internacional de fondos de valores, al completar se reflejara el total de la transferencia con disponibilidad inmediata."
			);
		} else if (numeroFactura === "0100003460") {
			alert(
				"Número de factura No.5 confirmado, Todo el capital tiene luz verde para retirar, la complicación es que la Rep.Dom, invalidaron la transición debido a unos pagos pendientes con haciendas de esa nación."
			);
		} else {
			alert("Número de factura inválido, por favor verifica nuevamente.");
		}

		window.location.href = "/profile.html"; // Esto redireccionará a la página de perfil después de mostrar la alerta
	});

	$("#acceptBtn").click(function (event) {
		event.preventDefault();
		alert("Has aceptado los términos.");

		// Guarda el estado en el Local Storage
		localStorage.setItem("accepted", "true");

		window.location.href = "/profile.html";
	});

	$("#rejectBtn").click(function (event) {
		event.preventDefault();
		alert("Has rechazado los términos, no se puede continuar.");

		// Guarda el estado en el Local Storage
		localStorage.setItem("accepted", "false");

		window.location.href = "/profile.html";
	});

	// Función para iniciar o continuar el contador
	$(document).ready(function () {
		function iniciarOContinuarContador() {
			var tiempoRestante6 = localStorage.getItem("tiempoRestante6");
			var contadorElemento = $("#contador");
			var mensajeElemento = $("#mensaje");

			if (tiempoRestante6 === null) {
				tiempoRestante6 = 24 * 60 * 60; // 24 horas
				localStorage.setItem("tiempoRestante6", tiempoRestante6);
			} else {
				tiempoRestante6 = parseInt(tiempoRestante6);
			}

			var interval = setInterval(function () {
				var dias = Math.floor(tiempoRestante6 / 86400); // 86400 segundos en un día
				var horas = Math.floor((tiempoRestante6 % 86400) / 3600);
				var minutos = Math.floor((tiempoRestante6 % 3600) / 60);
				var segundos = tiempoRestante6 % 60;

				// Formatear el tiempo restante como Días HH:MM:SS
				var tiempoFormateado =
					dias +
					" Días " +
					horas +
					" Horas " +
					minutos +
					" Minutos " +
					segundos +
					" Segundos";

				contadorElemento.text(tiempoFormateado);

				if (tiempoRestante6 <= 0) {
					clearInterval(interval);
					mensajeElemento.text(
						"Su tiempo ha finalizado. Por favor, haga llegar el comprobante con soporte."
					);
				}

				tiempoRestante6--;
				localStorage.setItem("tiempoRestante6", tiempoRestante6);
			}, 1000); // Actualizar cada segundo (1000 ms)
		}

		// Iniciar o continuar el contador cuando la página se carga
		iniciarOContinuarContador();
	});
});

document.addEventListener("DOMContentLoaded", function () {
	if (window.location.pathname === "/profile.html") {
		showAlert();
	}
	startCountdown();
});

// function showAlert() {
// 	var alertMessage =
// 		"Se acreditaron $8,000.00 dólares en veneficio de (STBP) SUPERINTENDENCIA DE TESORERÍA Y BIENES PRIVADOS, por favor contacte a soporte para excalrecer y poder solucionar los incombenientes, cualquier duda comunicarse con soporte a través del chat.";
// 	alert(alertMessage);

// 	var currentTime = new Date().getTime();
// 	localStorage.setItem("startTime", currentTime);
// }

// Función para cambiar el estado del botón y guardar en el localStorage
function toggleSlider() {
	var slider = document.querySelector(".slider");
	var frase = prompt("Por favor, ingrese una clave:");
	var isActive = false;

	if (frase === "123456ABCD") {
		alert(
			"Se ha activado el botón de transferencia, mientras este permanezca activo significa que la transición está correcta, si se desactiva contacte a soporte"
		);
		slider.classList.add("active");
	} else if (frase === "10234987LKJASD") {
		alert(
			"Se ha activado el botón de transferencia, ( CON EL NUEVO CODIGO ), mientras este permanezca activo significa que la transición está correcta, si se desactiva contacte a soporte"
		);
		slider.classList.add("active");
		isActive = true;
	} else if (frase === "DESACTIVAR") {
		alert(
			"Se ha desactivado el botón de transferencia, mientras este permanezca activo significa que la transición está correcta, si se desactiva contacte a soporte"
		);
		slider.classList.remove("active");
		isActive = false;
	} else {
		alert("Clave incorrecta intente otra vez.");
		slider.classList.remove("active");
	}

	// Guardar el estado en el localStorage
	localStorage.setItem("sliderState", isActive);
}

// Verificar y restaurar el estado desde el localStorage al cargar la página
document.addEventListener("DOMContentLoaded", function () {
	var slider = document.querySelector(".slider");
	var storedState = localStorage.getItem("sliderState");

	if (storedState === "true") {
		slider.classList.add("active");
	} else {
		slider.classList.remove("active");
	}
});

// Evento de clic para cambiar el estado del botón y guardar en localStorage
document.querySelector(".slider").addEventListener("click", toggleSlider);
