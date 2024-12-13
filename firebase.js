// Importar las funciones necesarias de Firebase (versión modular)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue, remove, update } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

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
const database = getDatabase(app);

// Inicializar la referencia a la base de datos 'pedidos'
const pedidosRef = ref(database, 'pedidos');

// Función para obtener los pedidos desde Firebase y ejecutar una callback
export const obtenerPedidos = (callback) => {
    onValue(pedidosRef, (snapshot) => {
        const pedidos = snapshot.val();
        callback(pedidos);
    });
};

// Función para guardar un nuevo pedido en Firebase
export const savePedido = (cliente, fecha, detalle, precio, fechaEntrega, lugarEntrega) => {
    const nuevoPedidoRef = push(pedidosRef);  // Crear una nueva referencia para el pedido
    return set(nuevoPedidoRef, {
        cliente,
        fecha,
        detalle,
        precio,
        fechaEntrega,
        lugarEntrega,
        estado: 'Pendiente'  // Estado inicial
    }).then(() => {
        console.log("Pedido guardado exitosamente en Firebase");
        return nuevoPedidoRef.key;  // Retornar el ID del nuevo pedido
    }).catch((error) => {
        console.error("Error al guardar el pedido:", error);
    });
};


// Función para actualizar el estado del pedido (completar o revertir)
export const actualizarEstadoPedido = (pedidoId, estado) => {
    const pedidoRef = ref(database, `pedidos/${pedidoId}`);
    update(pedidoRef, {
        estado: estado
    }).then(() => {
        console.log("Estado actualizado exitosamente");
    }).catch((error) => {
        console.error("Error al actualizar el estado del pedido:", error);
    });
};

// Función para eliminar un pedido de Firebase
export const eliminarPedido = (pedidoId) => {
    const pedidoRef = ref(database, `pedidos/${pedidoId}`);
    remove(pedidoRef).then(() => {
        console.log("Pedido eliminado exitosamente");
    }).catch((error) => {
        console.error("Error al eliminar el pedido:", error);
    });
};
