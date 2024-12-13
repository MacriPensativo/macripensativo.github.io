const form = document.getElementById('pedidoForm');
const tabla = document.getElementById('pedidosTabla');
const dbRef = firebase.database().ref('pedidos');
let pedidos = []; // Inicializar la variable para almacenar los pedidos

const renderPedidos = () => {
    tabla.innerHTML = '';
    pedidos.forEach((pedido, index) => {
        const row = document.createElement('tr');
        if (pedido.estado === 'Completado') row.classList.add('completed');
        row.innerHTML = `
            <td>${pedido.cliente}</td>
            <td>${pedido.fecha}</td>
            <td>${pedido.detalle}</td>
            <td>$${pedido.precio}</td>
            <td>${pedido.fechaEntrega}</td>
            <td>${pedido.lugarEntrega}</td>
            <td>${pedido.estado}</td>
            <td>
                <button class="btn-modify" onclick="modificarPedido(${index})">Modificar</button>
                <button class="btn-delete" onclick="eliminarPedido(${index})">Eliminar</button>
                <button class="btn-complete" onclick="completarPedido(${index})">
                    ${pedido.estado === 'Completado' ? 'Revertir' : 'Completar'}
                </button>
            </td>
        `;
        tabla.appendChild(row);
    });
};

const agregarPedido = (e) => {
    e.preventDefault();
    const cliente = document.getElementById('cliente').value;
    const fecha = document.getElementById('fecha').value;
    const detalle = document.getElementById('detalle').value;
    const precio = document.getElementById('precio').value;
    const fechaEntrega = document.getElementById('fechaEntrega').value;
    const lugarEntrega = document.querySelector('input[name="lugarEntrega"]:checked').value;

    const nuevoPedido = {
        cliente,
        fecha,
        detalle,
        precio,
        fechaEntrega,
        lugarEntrega,
        estado: 'Pendiente'
    };

    // Guardar el nuevo pedido en Firebase
    dbRef.push(nuevoPedido)
        .then(() => {
            alert("Pedido agregado con éxito");
        })
        .catch((error) => {
            console.error("Error al guardar el pedido: ", error);
        });

    renderPedidos();
    form.reset();
};

// Función para cargar los pedidos desde Firebase
const cargarPedidos = () => {
    dbRef.on('value', (snapshot) => {
        const pedidosData = snapshot.val();
        if (pedidosData) {
            pedidos = Object.values(pedidosData);
            renderPedidos();
        } else {
            pedidos = [];
        }
    });
};

const modificarPedido = (index) => {
    const pedido = pedidos[index];
    const nuevoCliente = prompt('Modificar cliente:', pedido.cliente);
    const nuevaFecha = prompt('Modificar fecha:', pedido.fecha);
    const nuevoDetalle = prompt('Modificar detalle:', pedido.detalle);
    const nuevoPrecio = prompt('Modificar precio:', pedido.precio);
    const nuevaFechaEntrega = prompt('Modificar fecha de entrega:', pedido.fechaEntrega);
    const nuevoLugarEntrega = prompt('Modificar lugar de entrega:', pedido.lugarEntrega);

    if (nuevoCliente && nuevaFecha && nuevoDetalle && nuevoPrecio && nuevaFechaEntrega && nuevoLugarEntrega) {
        pedidos[index] = {
            ...pedido,
            cliente: nuevoCliente,
            fecha: nuevaFecha,
            detalle: nuevoDetalle,
            precio: nuevoPrecio,
            fechaEntrega: nuevaFechaEntrega,
            lugarEntrega: nuevoLugarEntrega
        };

        // Actualizar el pedido modificado en Firebase
        const pedidoModificado = pedidos[index];
        const pedidoRef = dbRef.child(Object.keys(pedidosData)[index]);
        pedidoRef.update(pedidoModificado);
        
        renderPedidos();
    }
};

const eliminarPedido = (index) => {
    if (confirm('¿Estás seguro de que deseas eliminar este pedido?')) {
        const pedidoRef = dbRef.child(Object.keys(pedidosData)[index]);
        pedidoRef.remove()
            .then(() => {
                pedidos.splice(index, 1);
                renderPedidos();
            })
            .catch((error) => {
                console.error('Error al eliminar el pedido:', error);
            });
    }
};

const completarPedido = (index) => {
    pedidos[index].estado = pedidos[index].estado === 'Completado' ? 'Pendiente' : 'Completado';
    const pedidoRef = dbRef.child(Object.keys(pedidosData)[index]);
    pedidoRef.update({ estado: pedidos[index].estado });
    renderPedidos();
};

form.addEventListener('submit', agregarPedido);

// Llamar a la función para cargar los pedidos cuando se cargue la página
document.addEventListener('DOMContentLoaded', cargarPedidos);
