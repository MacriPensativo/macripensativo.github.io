import { guardarPedido, obtenerPedidos, actualizarPedido } from "./firebase.js";

const form = document.getElementById('pedidoForm');
const tabla = document.getElementById('pedidosTabla');

// Función global para almacenar pedidos en memoria
let pedidosEnMemoria = {};

// Renderizar pedidos en la tabla
const renderPedidos = (pedidos) => {
  pedidosEnMemoria = pedidos || {}; // Actualizamos la memoria local
  tabla.innerHTML = ''; // Limpiar tabla
  Object.entries(pedidosEnMemoria).forEach(([id, pedido]) => {
    const row = document.createElement('tr');

    // Asignar clases según el estado
    if (pedido.estado === 'Entregado') {
      row.classList.add('completed'); // Clase para "Entregado"
    } else if (pedido.estado === 'En Armado') {
      row.classList.add('armado'); // Clase para "En Armado"
    } else if (pedido.estado === 'Listo') {
      row.classList.add('listo'); // Clase para "Listo"
    }

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
        <button class="btn-complete" onclick="EntregarPedido('${id}')">
          ${pedido.estado === 'Entregado' ? 'Revertir' : 'Entregar'}
        </button>
        <button class="btn-armado" onclick="cambiarEstado('${id}', 'En Armado')">En Armado</button>
        <button class="btn-listo" onclick="cambiarEstado('${id}', 'Listo')">Listo</button>
      </td>
    `;
    tabla.appendChild(row);
  });
};



window.cambiarEstado = (id, nuevoEstado) => {
  const pedido = pedidosEnMemoria[id];
  if (pedido) {
    actualizarPedido(id, { ...pedido, estado: nuevoEstado })
      .then(() => {
        console.log(`Pedido marcado como "${nuevoEstado}".`);
        // Forzar recarga de datos y actualización de la tabla
        obtenerPedidos((data) => {
          renderPedidos(data);
        });
      })
      .catch((error) => console.error("Error al actualizar el estado del pedido:", error));
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
  const pedido = { cliente, fecha, detalle, precio, fechaEntrega, lugarEntrega, estado: 'No Entregado' };

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
  const pedidoActual = pedidosEnMemoria[id];
  if (!pedidoActual) return;

  const cliente = prompt('Modificar cliente:', pedidoActual.cliente);
  const fecha = prompt('Modificar fecha:', pedidoActual.fecha);
  const detalle = prompt('Modificar detalle:', pedidoActual.detalle);
  const precio = prompt('Modificar precio:', pedidoActual.precio);
  const fechaEntrega = prompt('Modificar fecha de entrega:', pedidoActual.fechaEntrega);
  const lugarEntrega = prompt('Modificar lugar de entrega:', pedidoActual.lugarEntrega);

  if (cliente && fecha && detalle && precio && fechaEntrega && lugarEntrega) {
    actualizarPedido(id, { ...pedidoActual, cliente, fecha, detalle, precio, fechaEntrega, lugarEntrega });
  }
};

// Eliminar un pedido
window.eliminarPedido = (id) => {
  if (confirm('¿Estás seguro de que deseas eliminar este pedido?')) {
    actualizarPedido(id, null); // Esto elimina el nodo en Firebase
  }
};

// Entregar/Revertir un pedido
// Entregar/Revertir un pedido
window.EntregarPedido = (id) => {
  const pedido = pedidosEnMemoria[id]; // Obtenemos el pedido de memoria
  if (pedido) {
    const nuevoEstado = pedido.estado === 'Entregado' ? 'No Entregado' : 'Entregado';
    actualizarPedido(id, { ...pedido, estado: nuevoEstado })
      .then(() => {
        console.log("Pedido entregado/revertido correctamente.");
        // Forzar recarga de datos
        obtenerPedidos((data) => {
          renderPedidos(data);
        });
      })
      .catch((error) => console.error("Error al actualizar el estado del pedido:", error));
  }
};
