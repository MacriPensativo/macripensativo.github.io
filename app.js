import { guardarPedido, obtenerPedidos, actualizarPedido, eliminarPedido } from "./firebase.js";

const form = document.getElementById('pedidoForm');
const tabla = document.getElementById('pedidosTabla');

// Función para mostrar mensajes en pantalla
const mostrarMensaje = (mensaje, tipo = 'success') => {
    const mensajeDiv = document.createElement('div');
    mensajeDiv.textContent = mensaje;
    mensajeDiv.className = `alert alert-${tipo}`;
    document.body.appendChild(mensajeDiv);
    setTimeout(() => mensajeDiv.remove(), 3000);
};

// Renderizar pedidos en la tabla
const renderPedidos = (pedidos) => {
    tabla.innerHTML = ''; // Limpiar la tabla antes de actualizar
    if (pedidos) {
        Object.entries(pedidos).forEach(([id, pedido]) => {
            const row = document.createElement('tr');
            row.className = pedido.estado === 'Entregado' ? 'completed' : '';

            row.innerHTML = `
                <td>${pedido.cliente}</td>
                <td>${pedido.fecha}</td>
                <td>${pedido.detalle}</td>
                <td>$${pedido.precio}</td>
                <td>${pedido.fechaEntrega}</td>
                <td>${pedido.lugarEntrega}</td>
                <td>${pedido.estado}</td>
                <td>${getAccionesHTML(id, pedido.estado)}</td>
            `;
            tabla.appendChild(row);
        });
    }
};

// Generar botones dinámicos según el estado actual
const getAccionesHTML = (id, estado) => {
    let botones = `
        <button class="btn-modify" data-id="${id}">Modificar</button>
        <button class="btn-delete" data-id="${id}">Eliminar</button>
    `;

    switch (estado) {
        case 'Pendiente':
            botones += `<button class="btn-prepare" data-id="${id}">Preparado</button>`;
            break;
        case 'Preparado':
            botones += `
                <button class="btn-deliver" data-id="${id}">Entregado</button>
                <button class="btn-not-deliver" data-id="${id}">No Entregado</button>
            `;
            break;
        case 'Entregado':
        case 'No Entregado':
            botones += `<button class="btn-revert" data-id="${id}">Revertir</button>`;
            break;
    }

    return botones;
};

// Escuchar el formulario para agregar o modificar un pedido
let editando = false;
let idEditando = null;

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const cliente = document.getElementById('cliente').value.trim();
    const fecha = document.getElementById('fecha').value.trim();
    const detalle = document.getElementById('detalle').value.trim();
    const precio = document.getElementById('precio').value.trim();
    const fechaEntrega = document.getElementById('fechaEntrega').value.trim();
    const lugarEntrega = document.querySelector('input[name="lugarEntrega"]:checked').value;

    if (!cliente || !fecha || !detalle || !precio || !fechaEntrega || !lugarEntrega) {
        mostrarMensaje('Por favor, completa todos los campos.', 'error');
        return;
    }

    const pedido = { cliente, fecha, detalle, precio, fechaEntrega, lugarEntrega, estado: 'Pendiente' };

    try {
        if (editando) {
            await actualizarPedido(idEditando, pedido);
            mostrarMensaje('Pedido actualizado exitosamente.');
        } else {
            await guardarPedido(pedido);
            mostrarMensaje('Pedido guardado exitosamente.');
        }

        form.reset();
        editando = false;
        idEditando = null;

        // Forzar la actualización de la tabla después de guardar
        obtenerPedidos((data) => renderPedidos(data));
    } catch (error) {
        mostrarMensaje('Error al guardar el pedido.', 'error');
        console.error(error);
    }
});

// Escuchar actualizaciones de Firebase y renderizar la tabla
obtenerPedidos((data) => renderPedidos(data));

// Delegación de eventos para manejar botones
tabla.addEventListener('click', async (e) => {
  const id = e.target.dataset.id;
  if (!id) return; // Si no hay ID, no hacer nada

  obtenerPedidos(async (data) => {
      const pedido = data[id];
      if (!pedido) return; // Si no existe el pedido, no hacer nada

      // Modificación de pedido
      if (e.target.classList.contains('btn-modify')) {
          // Cargar los datos en el formulario para editar
          document.getElementById('cliente').value = pedido.cliente;
          document.getElementById('fecha').value = pedido.fecha;
          document.getElementById('detalle').value = pedido.detalle;
          document.getElementById('precio').value = pedido.precio;
          document.getElementById('fechaEntrega').value = pedido.fechaEntrega;
          document.querySelector(`input[name="lugarEntrega"][value="${pedido.lugarEntrega}"]`).checked = true;

          // Establecer la variable de edición
          editando = true;
          idEditando = id;

          mostrarMensaje('Edita los datos en el formulario y guarda.');
      } 
      // Eliminación de pedido
      else if (e.target.classList.contains('btn-delete')) {
          // Confirmar eliminación
          if (confirm('¿Estás seguro de eliminar este pedido?')) {
              try {
                  await eliminarPedido(id);
                  mostrarMensaje('Pedido eliminado exitosamente.');
              } catch (error) {
                  mostrarMensaje('Error al eliminar el pedido.', 'error');
                  console.error(error);
              }
          }
      } 
      // Actualización de estado
      else {
          let nuevoEstado;
          if (e.target.classList.contains('btn-prepare')) {
              nuevoEstado = 'Preparado';
          } else if (e.target.classList.contains('btn-deliver')) {
              nuevoEstado = 'Entregado';
          } else if (e.target.classList.contains('btn-not-deliver')) {
              nuevoEstado = 'No Entregado';
          } else if (e.target.classList.contains('btn-revert')) {
              nuevoEstado = 'Pendiente';
          }

          // Actualizar el estado si corresponde
          if (nuevoEstado) {
              try {
                  await actualizarPedido(id, { ...pedido, estado: nuevoEstado });
                  mostrarMensaje(`Estado actualizado a ${nuevoEstado}.`);
              } catch (error) {
                  mostrarMensaje('Error al actualizar el estado.', 'error');
                  console.error(error);
              }
          }
      }
  });
});
