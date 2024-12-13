import { savePedido, obtenerPedidos, actualizarEstadoPedido, eliminarPedido } from './firebase.js';

const form = document.getElementById('pedidoForm');
const tabla = document.getElementById('pedidosTabla');
let pedidos = []; // Inicializar la variable para almacenar los pedidos
let pedidosData = {}; // Para almacenar los pedidos con sus IDs de Firebase

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
                <button class="btn-modify" onclick="modificarPedido('${Object.keys(pedidosData)[index]}')">Modificar</button>
                <button class="btn-delete" onclick="eliminarPedido('${Object.keys(pedidosData)[index]}')">Eliminar</button>
                <button class="btn-complete" onclick="completarPedido('${Object.keys(pedidosData)[index]}')">
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

    // Guardar el nuevo pedido en Firebase y obtener su ID
    savePedido(cliente, fecha, detalle, precio, fechaEntrega, lugarEntrega)
        .then((pedidoId) => {
            // Cuando se guarda el pedido, actualizamos el estado local
            pedidosData[pedidoId] = nuevoPedido;
            pedidos.push(nuevoPedido);
            renderPedidos();
        });

    form.reset();
};

// Función para cargar los pedidos desde Firebase
const cargarPedidos = () => {
    obtenerPedidos((pedidosDataFirebase) => {
        if (pedidosDataFirebase) {
            pedidosData = pedidosDataFirebase;
            pedidos = Object.values(pedidosDataFirebase);
            renderPedidos();
        } else {
            pedidos = [];
            pedidosData = {};
        }
    });
};

const modificarPedido = (pedidoId) => {
    const pedido = pedidosData[pedidoId];
    const nuevoCliente = prompt('Modificar cliente:', pedido.cliente);
    const nuevaFecha = prompt('Modificar fecha:', pedido.fecha);
    const nuevoDetalle = prompt('Modificar detalle:', pedido.detalle);
    const nuevoPrecio = prompt('Modificar precio:', pedido.precio);
    const nuevaFechaEntrega = prompt('Modificar fecha de entrega:', pedido.fechaEntrega);
    const nuevoLugarEntrega = prompt('Modificar lugar de entrega:', pedido.lugarEntrega);

    if (nuevoCliente && nuevaFecha && nuevoDetalle && nuevoPrecio && nuevaFechaEntrega && nuevoLugarEntrega) {
        pedidosData[pedidoId] = {
            ...pedido,
            cliente: nuevoCliente,
            fecha: nuevaFecha,
            detalle: nuevoDetalle,
            precio: nuevoPrecio,
            fechaEntrega: nuevaFechaEntrega,
            lugarEntrega: nuevoLugarEntrega
        };

        // Actualizar el pedido modificado en Firebase
        actualizarEstadoPedido(pedidoId, pedidosData[pedidoId]);

        // Actualizar el array de pedidos para renderizar
        pedidos = Object.values(pedidosData);
        renderPedidos();
    }
};

const eliminarPedido = (pedidoId) => {
    if (confirm('¿Estás seguro de que deseas eliminar este pedido?')) {
        // Eliminar el pedido de Firebase
        eliminarPedido(pedidoId);

        // Eliminar el pedido localmente
        delete pedidosData[pedidoId];
        pedidos = Object.values(pedidosData);
        renderPedidos();
    }
};

const completarPedido = (pedidoId) => {
    const pedido = pedidosData[pedidoId];
    pedido.estado = pedido.estado === 'Completado' ? 'Pendiente' : 'Completado';

    // Actualizar el estado del pedido en Firebase
    actualizarEstadoPedido(pedidoId, pedido.estado);

    // Actualizar el array de pedidos para renderizar
    pedidos = Object.values(pedidosData);
    renderPedidos();
};

form.addEventListener('submit', agregarPedido);

// Llamar a la función para cargar los pedidos cuando se cargue la página
document.addEventListener('DOMContentLoaded', cargarPedidos);
