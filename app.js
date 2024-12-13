const form = document.getElementById('pedidoForm');
const tabla = document.getElementById('pedidosTabla');
let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

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

    pedidos.push({ cliente, fecha, detalle, precio, fechaEntrega, lugarEntrega, estado: 'Pendiente' });
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    renderPedidos();
    form.reset();
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
        localStorage.setItem('pedidos', JSON.stringify(pedidos));
        renderPedidos();
    }
};

const eliminarPedido = (index) => {
    if (confirm('¿Estás seguro de que deseas eliminar este pedido?')) {
        pedidos.splice(index, 1);
        localStorage.setItem('pedidos', JSON.stringify(pedidos));
        renderPedidos();
    }
};

const completarPedido = (index) => {
    pedidos[index].estado = pedidos[index].estado === 'Completado' ? 'Pendiente' : 'Completado';
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    renderPedidos();
};

form.addEventListener('submit', agregarPedido);
renderPedidos();

