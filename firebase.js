import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, push, onValue, set } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBt2AnygOlB1WCA2FUE0zE1OJFOvsaDKsw",
  authDomain: "aromasluecs.firebaseapp.com",
  databaseURL: "https://aromasluecs-default-rtdb.firebaseio.com",
  projectId: "aromasluecs",
  storageBucket: "aromasluecs.firebasestorage.app",
  messagingSenderId: "107214706343",
  appId: "1:107214706343:web:0a5d4fe9eae2ffd2482d82"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Referencia a la base de datos
const pedidosRef = ref(database, 'pedidos');

// Bandera para evitar ciclos infinitos
let isUpdating = false;

// Función para guardar un pedido
export const guardarPedido = (pedido) => {
  return push(pedidosRef, pedido);
};

// Función para obtener los pedidos
export const obtenerPedidos = (callback) => {
  onValue(pedidosRef, (snapshot) => {
    if (!isUpdating) { // Solo ejecuta el callback si no estamos actualizando
      const data = snapshot.val();
      callback(data);
    }
  });
};

// Función para actualizar un pedido
export const actualizarPedido = (id, pedido) => {
  const pedidoRef = ref(database, `pedidos/${id}`);
  isUpdating = true; // Activar la bandera antes de la actualización
  return set(pedidoRef, pedido).then(() => {
    isUpdating = false; // Desactivar la bandera después de la actualización
  }).catch((error) => {
    console.error("Error al actualizar el pedido:", error);
    isUpdating = false; // Asegurar que la bandera se desactiva en caso de error
  });
};
