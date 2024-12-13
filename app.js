import { guardarPedido, obtenerPedidos, actualizarPedido } from "./firebase.js";

const form = document.getElementById('pedidoForm');
const tabla = document.getElementById('pedidosTabla');

// Renderizar pedidos en la tabla
const renderPedidos = (pedidos) => {
  tabla.innerHTML = ''; // Limpiar tabla
  if (pedidos) {
    Object.entries(pedidos).forEach(([id, pedido]) => {
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
          <button class="btn-modify" onclick="modificarPedido('${id}')">Modificar</button>
          <button class="btn-delete" onclick="eliminarPedido('${id}')">Eliminar</button>
          <button class="btn-complete" onclick="completarPedido('${id}')">
            ${pedido.estado === 'Completado' ? 'Revertir' : 'Completar'}
          </button>
        </td>
      `;
      tabla.appendChild(row);
    });
  }
};

// Escuchar el formulario y agregar un nuevo pedido
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const cliente = document.getElementById('cliente').value;
  const fecha = document.getElementById('fecha').value;
  const detalle = document.getElementById('detalle').value;
  const precio = document.getElementById('precio').value;
  const fechaEntrega = document.getElementById('fechaEntrega').value;
  const lugarEntrega = document.querySelector('input[name="lugarEntrega"]:checked').value;

  // Crear un objeto del pedido
  const pedido = { cliente, fecha, detalle, precio, fechaEntrega, lugarEntrega, estado: 'Pendiente' };

  // Guardar el pedido en Firebase
  guardarPedido(pedido)
    .then(() => {
      console.log("Pedido guardado correctamente.");
      form.reset(); // Limpiar formulario
    })
    .catch((error) => console.error("Error al guardar el pedido:", error));
});

// Escuchar actualizaciones de la base de datos y renderizar
obtenerPedidos((data) => {
  renderPedidos(data);
});

// Modificar un pedido
window.modificarPedido = (id) => {
  const cliente = prompt('Modificar cliente:');
  const fecha = prompt('Modificar fecha:');
  const detalle = prompt('Modificar detalle:');
  const precio = prompt('Modificar precio:');
  const fechaEntrega = prompt('Modificar fecha de entrega:');
  const lugarEntrega = prompt('Modificar lugar de entrega:');

  if (cliente && fecha && detalle && precio && fechaEntrega && lugarEntrega) {
    actualizarPedido(id, {
      cliente, fecha, detalle, precio, fechaEntrega, lugarEntrega, estado: 'Pendiente'
    });
  }
};

// Eliminar un pedido
window.eliminarPedido = (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar este pedido?')) {
    actualizarPedido(id, null); // Esto elimina el nodo en Firebase
  }
};

// Completar/Revertir un pedido
window.completarPedido = (id) => {
  obtenerPedidos((data) => {
    const pedido = data[id];
    if (pedido) {
      actualizarPedido(id, { ...pedido, estado: pedido.estado === 'Completado' ? 'Pendiente' : 'Completado' });
    }
  });
};
