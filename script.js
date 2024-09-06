// Declaramos variables para almacenar los datos
let productos = [];
let montoTotal = 0;

// Función para agregar productos
function agregarProducto() {
    let grosor = document.getElementById("grosor").value;
    let ancho = document.getElementById("ancho").value;
    let alto = document.getElementById("alto").value;
    let precio_u = document.getElementById("preciopie").value;
    let cantidad = document.getElementById("cantidad").value;

    const can_pies = (grosor * ancho * alto / 12 * cantidad).toFixed(2);
    const monto = (grosor * ancho * alto / 12 * precio_u * cantidad).toFixed(2);
    const medidas = `${grosor}x${ancho}x${alto}`;
    
    // Guardar producto en la lista
    productos.push({
        medidas,
        cantidad,
        can_pies,
        monto
    });
    
    // Actualizar el monto total
    montoTotal += parseFloat(monto);
    
    // Mostrar el producto en la tarjeta
    const resumen = document.querySelector("article.card-articles");
    const productoHTML = `
        <div class="product-card">
            <p>Medidas: ${medidas}</p>
            <p>Cantidad: ${cantidad}</p>
            <p>Cantidad de pies: ${can_pies}</p>
            <p>Monto: RD$${monto}</p>
        </div>`;
    
    resumen.innerHTML += productoHTML;

    // Actualizar el monto total en el HTML
    document.getElementById("detalles").innerHTML = `Monto Total: RD$${montoTotal.toFixed(2)}`;
}

function generarFacturaPDF() {
    const { jsPDF } = window.jspdf;

    // Solicita el nombre del cliente mediante un prompt
    const nombreCliente = prompt("Por favor, ingresa el nombre del cliente:");

    if (!nombreCliente) {
        alert("El nombre del cliente es requerido para generar la factura.");
        return;
    }

    // Configura la fuente y los márgenes
    const margenIzq = 10;
    let y = 15; // Márgenes superior
    const espacioEntreItems = 4;
    const espacioEntreSecciones = 8;
    let alturaContenido = 15; // Inicializa con la altura del título

    // Calcula la altura total del contenido
    productos.forEach((producto, index) => {
        alturaContenido += 5 + 4 * 4 + espacioEntreSecciones; // Altura para cada tabla
    });

    // Asegúrate de incluir espacio para el monto total
    alturaContenido += 12; // Espacio para el monto total
    const margenInferior = 10; // Espacio inferior

    // Crea el documento con altura dinámica
    const doc = new jsPDF({
        unit: 'mm',
        format: [80, alturaContenido + margenInferior] // Tamaño de página en milímetros (ancho, alto dinámico)
    });

    // Título de la factura en negrita
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Aserradero RYD", margenIzq, y);
    y += 3; // Espacio después del título

    // Título de la factura en negrita
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.text("WhatsApp: 809-546-9519 | 849-244-2380", margenIzq, y);
    y += 8; // Espacio después del título


    // Título de la factura en negrita
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("Factura", margenIzq, y);
    y += 8; // Espacio después del título

    // Nombre del cliente
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Cliente: ${nombreCliente}`, margenIzq, y);
    y += 6; // Espacio después del nombre del cliente

    // Lista de productos
    doc.setFont("helvetica", "normal");
    productos.forEach((producto, index) => {
        doc.setFont("helvetica", "bold");
        doc.text(`Tabla ${index + 1}:`, margenIzq, y);
        y += 4; // Espacio después del título de la tabla
        
        doc.setFont("helvetica", "normal");
        doc.text(`Medidas: ${producto.medidas}`, margenIzq, y);
        y += espacioEntreItems;
        doc.text(`Cantidad: ${producto.cantidad}`, margenIzq, y);
        y += espacioEntreItems;
        doc.text(`Pies: ${producto.can_pies}`, margenIzq, y);
        y += espacioEntreItems;
        doc.text(`Monto: RD$${producto.monto}`, margenIzq, y);
        y += espacioEntreSecciones; // Espacio después de cada producto
    });

    // Monto total al final
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10); // Tamaño de fuente para el monto total
    doc.text(`Monto Total: RD$${montoTotal.toFixed(2)}`, margenIzq, y);
    y += 4;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7); // Tamaño de fuente para el monto total
    doc.text(`Creador del sistema Ramger Duran (849-281-1452)`, margenIzq, y);

    // Ajusta la posición vertical para evitar mucho espacio en blanco
    const alturaFinal = alturaContenido + margenInferior;
    if (y > alturaFinal - margenInferior) {
        doc.addPage(); // Añade una página si el contenido excede el margen inferior
        y = margenIzq; // Reinicia la posición vertical para la nueva página
    }

    // Descargar el PDF
    doc.save("factura.pdf");

    // Limpiar las tarjetas y la lista de productos
    document.querySelector("article.card-articles").innerHTML = '';
    document.getElementById("detalles").innerHTML = '';
    productos = [];
    montoTotal = 0;
}
