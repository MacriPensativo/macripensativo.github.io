// Importar las funciones necesarias de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCLi6KtmpY7Dun6PufyBFAVoIWskYj7tO0",
    authDomain: "condu-e3f5e.firebaseapp.com",
    databaseURL: "https://condu-e3f5e-default-rtdb.firebaseio.com",
    projectId: "condu-e3f5e",
    storageBucket: "condu-e3f5e.appspot.com",
    messagingSenderId: "623081405660",
    appId: "1:623081405660:web:2590ffc66542090d23c819"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar la base de datos
const database = getDatabase(app);
const pedidosRef = ref(database, 'pedidos');  // Cambié 'condu' a 'pedidos'

// Obtener el formulario y agregar el listener
document.getElementById('pedidoForm').addEventListener('submit', submitForm);

// Función para manejar el envío del formulario
function submitForm(e) {
    e.preventDefault();

    // Obtener los valores de los campos del formulario
    const cliente = getElementVal('cliente');
    const fecha = getElementVal('fecha');
    const detalle = getElementVal('detalle');  // Agregar detalle
    const precio = getElementVal('precio');
    const fechaEntrega = getElementVal('fechaEntrega');
    const lugarEntrega = document.querySelector('input[name="lugarEntrega"]:checked').value;

    // Guardar los datos en Firebase
    savePedido(cliente, fecha, detalle, precio, fechaEntrega, lugarEntrega);

    // Opcional: limpiar el formulario
    document.getElementById('pedidoForm').reset();

    // Confirmar al usuario que se guardó correctamente
    alert('Pedido guardado exitosamente!');
}

// Función para guardar los datos en Firebase
const savePedido = (cliente, fecha, detalle, precio, fechaEntrega, lugarEntrega) => {
    const nuevoPedidoRef = push(pedidosRef); // Crear una nueva referencia para el pedido
    set(nuevoPedidoRef, {
        cliente: cliente,
        fecha: fecha,
        detalle: detalle,  // Incluir el detalle
        precio: precio,
        fechaEntrega: fechaEntrega,
        lugarEntrega: lugarEntrega,
        estado: 'Pendiente'  // Estado inicial
    }).then(() => {
        console.log("Pedido guardado exitosamente en Firebase");
    }).catch((error) => {
        console.error("Error al guardar el pedido:", error);
    });
};

// Función para obtener el valor de un elemento por ID
const getElementVal = (id) => {
    return document.getElementById(id).value;
};


// Obtener los pedidos desde Firebase y mostrarlos en la tabla
const pedidosTabla = document.getElementById('pedidosTabla');

function obtenerPedidos() {
    const pedidosRef = ref(database, 'pedidos');
    onValue(pedidosRef, (snapshot) => {
        const pedidos = snapshot.val();
        pedidosTabla.innerHTML = '';  // Limpiar la tabla antes de volver a llenarla

        for (let id in pedidos) {
            const pedido = pedidos[id];
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${pedido.cliente}</td>
                <td>${pedido.fecha}</td>
                <td>${pedido.detalle}</td>
                <td>${pedido.precio}</td>
                <td>${pedido.fechaEntrega}</td>
                <td>${pedido.lugarEntrega}</td>
                <td>${pedido.estado}</td>
                <td>
                    <button class="btn-modify">Modificar</button>
                    <button class="btn-delete">Eliminar</button>
                    <button class="btn-complete">Completar</button>
                </td>
            `;
            pedidosTabla.appendChild(row);
        }
    });
}

// Llamar a la función para obtener y mostrar los pedidos cuando se cargue la página
window.onload = obtenerPedidos;
