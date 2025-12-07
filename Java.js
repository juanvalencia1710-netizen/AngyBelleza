// --- CARRITO DE COMPRAS ---
const btnCarrito = document.getElementById("btnCarrito");
const carritoDropdown = document.getElementById("carritoDropdown");
const contador = document.getElementById("contador");
const totalSpan = document.getElementById("total");
const btnsAgregar = document.querySelectorAll(".btn-agregar");

let carrito = {};

// Toggle Dropdown
btnCarrito.addEventListener("click", function (e) {
    e.preventDefault();
    carritoDropdown.classList.toggle("visible");
});

// Función para actualizar carrito en UI
function actualizarCarritoUI() {
    // Limpiar contenido previo (excepto el header y el total)
    let totalPrecio = 0;
    let totalItems = 0;
    let itemsHTML = '';

    for (const [nombre, producto] of Object.entries(carrito)) {
        totalPrecio += producto.precio * producto.cantidad;
        totalItems += producto.cantidad;
        itemsHTML += `
            <p>
                <span>${producto.cantidad}x ${nombre}</span>
                <span>$${(producto.precio * producto.cantidad).toLocaleString()}</span>
            </p>
        `;
    }

    contador.textContent = totalItems;
    totalSpan.textContent = totalPrecio.toLocaleString();

    // Reconstruir el dropdown manteniendo el botón de vaciar
    carritoDropdown.innerHTML = `
        <h3>🛍️ Mi Carrito</h3>
        ${itemsHTML}
        <p style="border-top: 1px solid #eee; margin-top: 10px; padding-top: 5px; font-weight: bold;">
            Total: <span>$${totalPrecio.toLocaleString()} COP</span>
        </p>
        <button id="btnComprarCarrito">Comprar Ahora 💖</button>
        <button id="vaciarCarritoDynamic">Vaciar Carrito</button>
    `;

    // Re-asignar evento al nuevo botón Comprar
    const btnComprar = document.getElementById('btnComprarCarrito');
    if (btnComprar) {
        btnComprar.addEventListener('click', abrirModalPago);
    }

    // Re-asignar evento al nuevo botón vaciar
    const btnVaciar = document.getElementById('vaciarCarritoDynamic');
    if (btnVaciar) {
        btnVaciar.addEventListener('click', () => {
            carrito = {};
            actualizarCarritoUI();
            document.querySelectorAll('.producto').forEach(p => p.classList.remove('seleccionado'));
        });
    }
}

// Función agregar producto
function agregarProducto(nombre, precio) {
    if (carrito[nombre]) {
        carrito[nombre].cantidad++;
    } else {
        carrito[nombre] = {
            precio: precio,
            cantidad: 1
        };
    }
    actualizarCarritoUI();
}

// Asignar evento a todos los botones
btnsAgregar.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar que el click en el botón seleccione la carta
        const tarjeta = e.target.closest('.producto');
        const nombre = tarjeta.querySelector('h3').textContent;
        // Extraer precio del texto "Precio: $25.000 COP" -> 25000
        const precioTexto = tarjeta.querySelector('p').textContent;
        const precio = parseInt(precioTexto.replace(/[^0-9]/g, ''), 10);

        agregarProducto(nombre, precio);

        // Feedback visual en el botón
        const originalText = btn.textContent;
        btn.textContent = "¡Agregado!";
        btn.style.backgroundColor = "#4CAF50";
        setTimeout(() => {
            btn.textContent = originalText;
            btn.style.backgroundColor = "";
        }, 1500);
    });
});

// --- INTERACCIÓN DE CARTAS (SELECCIÓN) ---
const tarjetas = document.querySelectorAll('.producto');
tarjetas.forEach(tarjeta => {
    tarjeta.addEventListener('click', () => {
        // Opción 2: Toggle (puedes seleccionar varias)
        tarjeta.classList.toggle('seleccionado');
    });
});


// --- HAMBURGUESA MENU ---
const hamburguesa = document.getElementById('hamburguesa');
const navLinks = document.getElementById('nav-links');

if (hamburguesa) {
    hamburguesa.addEventListener('click', () => {
        hamburguesa.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
}

// --- CARRUSEL AUTOMÁTICO ---
document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.carrusel-fondo .slide');
    if (slides.length > 0) {
        let index = 0;
        slides[index].classList.add('activo'); // PRIMERA IMAGEN

        setInterval(() => {
            slides[index].classList.remove('activo');
            index = (index + 1) % slides.length;
            slides[index].classList.add('activo');
        }, 5000); // cambia cada 5 segundos
    }
});

// --- MODAL DE DOMICILIO ---
const modal = document.getElementById("modalDomicilio");
const btnDomicilio = document.getElementById("btnDomicilio");
const spanClose = document.getElementsByClassName("close")[0];
const formDomicilio = document.getElementById("formDomicilio");

if (btnDomicilio) {
    btnDomicilio.onclick = function () {
        modal.style.display = "block";
    }
}

if (spanClose) {
    spanClose.onclick = function () {
        modal.style.display = "none";
    }
}

if (formDomicilio) {
    formDomicilio.onsubmit = function (e) {
        e.preventDefault();
        const ciudad = document.getElementById("ciudad").value;
        const direccion = document.getElementById("direccion").value;
        const telefono = document.getElementById("telefono").value;
        const metodo = document.getElementById("selectMetodoPagoDomicilio").value;

        if (!metodo) {
            alert("⚠️ Por favor selecciona un método de pago.");
            return;
        }

        alert(`¡Domicilio Confirmado! 🛵\n\nEnviaremos tu pedido a:\nCiudad: ${ciudad}\nDirección: ${direccion}\nTeléfono: ${telefono}\n\nMétodo de Pago: ${metodo.toUpperCase()}\n\n¡Gracias por tu compra! 💖`);
        modal.style.display = "none";
        formDomicilio.reset();
    }
}

// --- ANIMACIONES DE SCROLL ---
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.productos').forEach(section => {
    observer.observe(section);
});

// --- PORTAL DE REGISTRO (INTEGRADO) ---
const portalContainer = document.getElementById('portalRegistro');
const btnAbrirPortalNav = document.getElementById('btnAbrirPortalNav');
const btnCerrarPortal = document.querySelector('.close-portal');
const formRegistro = document.getElementById('formRegistro');

// Abrir portal desde link del nav
if (btnAbrirPortalNav) {
    btnAbrirPortalNav.addEventListener('click', (e) => {
        e.preventDefault();
        portalContainer.style.display = 'block';
    });
}

// Cerrar portal
if (btnCerrarPortal) {
    btnCerrarPortal.addEventListener('click', () => {
        portalContainer.style.display = 'none';
    });
}

// Validación y Submit del Registro
if (formRegistro) {
    formRegistro.addEventListener('submit', (e) => {
        e.preventDefault();
        const nombre = document.getElementById('reg-nombre').value;
        alert(`¡Bienvenid@ ${nombre}! 🎉\nTe has registrado exitosamente. Tu descuento del 10% se aplicará en tu próxima compra.`);
        portalContainer.style.display = 'none';
        formRegistro.reset();
    });
}

// --- MODAL PAGO DEL CARRITO ---
const modalPago = document.getElementById('modalPago');
const btnPagarCarritoFinal = document.getElementById('btnPagarCarrito');
const selectPagoCarrito = document.getElementById('selectMetodoPagoCarrito');

function abrirModalPago() {
    // Verificar si hay items en el carrito
    if (Object.keys(carrito).length === 0) {
        alert("Tu carrito está vacío 😢. ¡Agrega productos primero!");
        return;
    }
    // Cerrar dropdown del carrito si está abierto
    carritoDropdown.classList.remove('visible');
    // Abrir modal pago
    modalPago.style.display = 'block';
}

function cerrarModalPago() {
    modalPago.style.display = 'none';
}

// Lógica de pago del modal
if (btnPagarCarritoFinal) {
    btnPagarCarritoFinal.addEventListener('click', () => {
        const metodo = selectPagoCarrito.value;

        if (!metodo) {
            alert('Por favor selecciona un método de pago 💳.');
            return;
        }

        if (metodo === 'tarjeta') {
            alert('Redirigiendo a pasarela de pagos con Tarjeta... 💳');
            // Aquí iría window.location.href = '...';
        } else if (metodo === 'nequi') {
            alert('Abriendo Nequi para realizar el pago... 📲');
            window.open('https://www.nequi.com.co', '_blank');
        } else if (metodo === 'bancolombia') {
            alert('Redirigiendo a Sucursal Virtual Bancolombia... 🏦');
            window.open('https://www.grupobancolombia.com/personas', '_blank');
        } else if (metodo === 'efectivo') {
            alert('Pago en Efectivo seleccionado 💵.\n\nGeneraremos un código de pago para que te acerques a un punto físico.');
        }

        // Simular compra exitosa
        setTimeout(() => {
            alert('¡Gracias por tu compra! Tu pedido está siendo procesado. 💖');
            cerrarModalPago();
            carrito = {}; // Vaciar carrito
            actualizarCarritoUI();
        }, 1000);
    });
}

// Cierre global de modales al hacer click fuera
window.addEventListener('click', (e) => {
    if (e.target === modalPago) {
        cerrarModalPago();
    }
    if (e.target === portalContainer) {
        portalContainer.style.display = 'none';
    }
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});
