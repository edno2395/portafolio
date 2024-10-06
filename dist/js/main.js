
		document.addEventListener("DOMContentLoaded", function() {
			var mensaje = document.getElementById("mensaje");
			var contador = document.getElementById("contador");

			mensaje.addEventListener("input", function () {
				var init = mensaje.value.length;
				var total_characters = 200 - init;

				if (total_characters >= 0) {
					contador.textContent = total_characters + " caracteres restantes";
				} else {
					// Limitar los caracteres cuando se supera el límite
					mensaje.value = mensaje.value.substring(0, 200);
					contador.textContent = "0 caracteres restantes";
				}
			});
		});


		
        function mostrarSobreMi(event) {
            event.preventDefault();
            document.getElementById('contenido').classList.remove('d-none');
            document.getElementById('formularioContacto').classList.add('d-none');
            document.getElementById('contenidoProyectos').classList.add('d-none');
        }

        function mostrarContacto(event) {
            event.preventDefault();
            document.getElementById('contenido').classList.add('d-none');
            document.getElementById('formularioContacto').classList.remove('d-none');
            document.getElementById('contenidoProyectos').classList.add('d-none');
        }

        function mostrarProyectos(event) {
            event.preventDefault();
            document.getElementById('contenido').classList.add('d-none');
            document.getElementById('formularioContacto').classList.add('d-none');
            document.getElementById('contenidoProyectos').classList.remove('d-none');
        }
		
		
		function openCarousel(cardNumber) {
    const imageSets = {
        1: [
            "https://res.cloudinary.com/dirukaz36/image/upload/v1728176167/imagen1_gmwxsg.webp",
            "https://res.cloudinary.com/dirukaz36/image/upload/v1728176405/imagen2_s3eauz.webp",
            "https://res.cloudinary.com/dirukaz36/image/upload/v1728176344/imagen3_jdi6ue.webp",
            "https://res.cloudinary.com/dirukaz36/image/upload/v1728176392/imagen4_gusvwi.webp",
            "https://res.cloudinary.com/dirukaz36/image/upload/v1728176343/imagen5_snqizf.webp",
            "https://res.cloudinary.com/dirukaz36/image/upload/v1728176341/imagen6_vgmvzn.webp",
            "https://res.cloudinary.com/dirukaz36/image/upload/v1728176341/imagen7_bzr0mb.webp",
            "https://res.cloudinary.com/dirukaz36/image/upload/v1728176340/imagen8_g4yblr.webp",
            "https://res.cloudinary.com/dirukaz36/image/upload/v1728176437/imagen9_wfofgf.webp",
            "https://res.cloudinary.com/dirukaz36/image/upload/v1728176437/imagen10_1_g4pzez.webp",
        ],
        2: [
            "https://res.cloudinary.com/dirukaz36/image/upload/v1728179984/imagen1_vhzs1w.webp",
            "https://res.cloudinary.com/dirukaz36/image/upload/v1728179984/imagen2_fdfkpp.webp",
            "https://res.cloudinary.com/dirukaz36/image/upload/v1728179984/imagen3_trbn70.webp",
            "https://res.cloudinary.com/dirukaz36/image/upload/v1728179984/imagen4_hvawxi.webp",
            "https://res.cloudinary.com/dirukaz36/image/upload/v1728179983/imagen5_vyedlo.webp",
            "https://res.cloudinary.com/dirukaz36/image/upload/v1728179983/imagen6_ujxpsv.webp",
            "https://res.cloudinary.com/dirukaz36/image/upload/v1728179983/imagen7_ovllrh.webp",
            "https://res.cloudinary.com/dirukaz36/image/upload/v1728179983/imagen8_y6toyb.webp",
            "https://res.cloudinary.com/dirukaz36/image/upload/v1728179983/imagen9_clws0c.webp",
            "https://res.cloudinary.com/dirukaz36/image/upload/v1728179983/imagen10_ene55t.webp",
        ],
        3: [
            "https://res.cloudinary.com/dirukaz36/image/upload/v1728181285/imagen1_n2hs4v.webp",
            "https://res.cloudinary.com/dirukaz36/image/upload/v1728181285/imagen2_s8b2u6.webp",
            "https://res.cloudinary.com/dirukaz36/image/upload/v1728181285/imagen3_n1kzga.webp",
            "https://res.cloudinary.com/dirukaz36/image/upload/v1728181285/imagen4_ckrhyn.webp",
            "https://res.cloudinary.com/dirukaz36/image/upload/v1728181285/imagen5_kyjknp.webp",
            "https://res.cloudinary.com/dirukaz36/image/upload/v1728181432/imagen6_yhuhl1.webp",
            "https://res.cloudinary.com/dirukaz36/image/upload/v1728181432/imagen7_ngcsgd.webp",
            "https://res.cloudinary.com/dirukaz36/image/upload/v1728181432/imagen8_vrzgoh.webp",
            "https://res.cloudinary.com/dirukaz36/image/upload/v1728181431/imagen9_hqndme.webp",
        ],
        4: [
            "https://res.cloudinary.com/dirukaz36/image/upload/v1728182511/imagen1_pxsjnv.webp",
			"https://res.cloudinary.com/dirukaz36/image/upload/v1728182509/imagen2_e8ut7r.webp",
			"https://res.cloudinary.com/dirukaz36/image/upload/v1728182508/imagen3_q9fkao.webp",
			"https://res.cloudinary.com/dirukaz36/image/upload/v1728182506/imagen4_q7mee5.webp",
			"https://res.cloudinary.com/dirukaz36/image/upload/v1728182506/imagen5_qogufl.webp",
			"https://res.cloudinary.com/dirukaz36/image/upload/v1728182504/imagen6_onbo4t.webp",
			"https://res.cloudinary.com/dirukaz36/image/upload/v1728182503/imagen7_bi4iqt.webp",
			"https://res.cloudinary.com/dirukaz36/image/upload/v1728182503/imagen8_uwotux.webp",
			"https://res.cloudinary.com/dirukaz36/image/upload/v1728182503/imagen9_no6eh0.webp",

        ],
		5: [
            "https://res.cloudinary.com/dirukaz36/image/upload/v1728195418/imagen1_s7aptp.webp",
			"https://res.cloudinary.com/dirukaz36/image/upload/v1728195417/imagen2_pw1dfg.webp",
			"https://res.cloudinary.com/dirukaz36/image/upload/v1728195416/imagen3_itecgg.webp",
			"https://res.cloudinary.com/dirukaz36/image/upload/v1728195414/imagen4_tuqucq.webp",
			"https://res.cloudinary.com/dirukaz36/image/upload/v1728195414/imagen5_ufrl6b.webp",
			"https://res.cloudinary.com/dirukaz36/image/upload/v1728195414/imagen6_ieeah9.webp",
			"https://res.cloudinary.com/dirukaz36/image/upload/v1728195413/imagen7_do3d04.webp",
			"https://res.cloudinary.com/dirukaz36/image/upload/v1728195409/imagen8_fexcci.webp",
			"https://res.cloudinary.com/dirukaz36/image/upload/v1728195410/imagen9_r9d10k.webp",
			"https://res.cloudinary.com/dirukaz36/image/upload/v1728195409/imagen10_mmjkgz.webp",
			"https://res.cloudinary.com/dirukaz36/image/upload/v1728195409/imagen11_jrjwuv.webp",
			"https://res.cloudinary.com/dirukaz36/image/upload/v1728195409/imagen12_c4mtow.webp",
			"https://res.cloudinary.com/dirukaz36/image/upload/v1728195409/imagen13_je902f.webp",
			"https://res.cloudinary.com/dirukaz36/image/upload/v1728195409/imagen14_u1x7hh.webp",
			"https://res.cloudinary.com/dirukaz36/image/upload/v1728195409/imagen15_uxcmf5.webp",
        ]
		
    };

    const carouselInner = document.getElementById('carouselInner');
    carouselInner.innerHTML = ''; // Limpiar el contenido anterior

    imageSets[cardNumber].forEach((src, index) => {
        const isActive = index === 0 ? 'active' : '';
        const carouselItem = `
            <div class="carousel-item ${isActive}">
                <img src="${src}" class="d-block w-100" alt="...">
            </div>
        `;
        carouselInner.innerHTML += carouselItem;
    });

    // Mostrar la modal
    const modal = new bootstrap.Modal(document.getElementById('modalCarousel'));
    modal.show();
}



document.getElementById('mensaje').addEventListener('input', function() {
        let value = this.value;
        value = value.toLowerCase();
        const sentences = value.split('. ');
        for (let i = 0; i < sentences.length; i++) {
            sentences[i] = sentences[i].charAt(0).toUpperCase() + sentences[i].slice(1);
        }
        this.value = sentences.join('. ');
    });

        (function() {
            emailjs.init("X783RjVlxwxWlE7eu"); // Reemplaza esto con tu USER ID de EmailJS
        })();

      document.getElementById('contactFormulario').addEventListener('submit', function(e) {
			e.preventDefault();

			// Obtener Campos
			const nombre = document.getElementById('nombre').value.trim();
			const mensaje = document.getElementById('mensaje').value.trim();

			// Validaciones
			if (nombre === '') {
				Alerta('warning', 'Advertencia!', 'Complete los campos', 2100);
				return false;
			}
			if (nombre.length < 10) {
				Alerta('warning', 'Advertencia!', 'El nombre debe tener al menos 10 caracteres.', 2100);
				return false;
			}
			if (mensaje === '') {
				Alerta('warning', 'Advertencia!', 'Complete los campos', 2100);
				return false;
			}
			if (mensaje.length < 10) {
				Alerta('warning', 'Advertencia!', 'El mensaje debe tener al menos 10 caracteres', 2100);
				return false;
			}

			// SweetAlert con tres opciones
			Swal.fire({
				toast: true,
				position: 'top',
				title: '¿Cómo deseas contactar?',
				text: "Elige una opción para continuar:",
				icon: 'question',
				showCancelButton: true,
				confirmButtonText: '<i class="fas fa-envelope"></i> Correo',
                cancelButtonText: '<i class="fas fa-times"></i> Cancelar',
				denyButtonText: '<i class="fab fa-whatsapp"></i> WhatsApp', // Botón de WhatsApp
				confirmButtonColor: '#3085d6', // Color para el botón de correo
				cancelButtonColor: '#d33', // Color rojo para el botón de cancelar
				denyButtonColor: '#25D366', // Color verde para el botón de WhatsApp
				showDenyButton: true, // Mostrar el botón de cancelar
			}).then((result) => {
				if (result.isConfirmed) {
					// Lógica para enviar el correo
					emailjs.sendForm('service_gc9k6xd', 'template_xnothc7', document.getElementById('contactFormulario'))
						.then(function() {
							Alerta('success', 'Éxito!', 'Correo enviado correctamente.', 2200);
							// Limpiar el formulario después de enviar
							document.getElementById('contactFormulario').reset();
							// Resetea el contador de caracteres (si lo tienes)
							document.getElementById('contador').innerText = '200 caracteres restantes';
						}, function(error) {
							console.error('Error al enviar el correo:', error);
							Alerta('error', 'Error!', 'Error al enviar el correo', 2200);
						});
				} else if (result.isDenied) {
					// Lógica para enviar el WhatsApp
					const telefono = '+51973502271'; // Número de teléfono de destino
					// Redirecciona a WhatsApp con el mensaje
					const url = `https://wa.me/${telefono}?text=Hola, mi nombre es ${nombre}. ${mensaje}`;
					 //window.open(url, '_blank'); Abre el WhatsApp en una nueva pestaña
					window.open(url,'Conctamos whatsapp','width=600,height=400,left=50,top=50,toolbar=yes');
					document.getElementById('contactFormulario').reset();
					document.getElementById('contador').innerText = '200 caracteres restantes';
				} else if (result.dismiss === Swal.DismissReason.cancel) {
					// Limpiar el formulario al cancelar
					Alerta('info', 'Cancelado!', 'Formulario cancelado.', 2200);
					document.getElementById('contactFormulario').reset();
					document.getElementById('contador').innerText = '200 caracteres restantes';
				}
			});
		});


	
       // Función para contar caracteres restantes
        const mensajeTextarea = document.getElementById('mensaje');
        mensajeTextarea.addEventListener('input', function() {
            const maxLength = 200;
            const currentLength = mensajeTextarea.value.length;
            const remainingCharacters = maxLength - currentLength;

            document.getElementById('contador').innerText = `${remainingCharacters} caracteres restantes`;
        });
		
		
		function Alerta(icono, titulo, texto, tiempo) {
			Swal.fire({
				toast: true,
				icon: icono,
				title: titulo,
				text: texto,
				showClass: {
				popup: 'animate__animated  animate__slideInDown animate__faster '
				},
				hideClass: {
				popup: 'animate__animated animate__bounceOutUp animate__faster'
				},
				timer: tiempo,
				position: 'top',
				showConfirmButton: false,
				timerProgressBar: true
			  });
		}
		
		