// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, push, onValue, set, remove } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Tu configuración de Firebase
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

// Función para guardar un pedido
export const guardarPedido = (pedido) => {
  return push(pedidosRef, pedido);
};

// Función para obtener los pedidos
export const obtenerPedidos = (callback) => {
  onValue(pedidosRef, (snapshot) => {
    const data = snapshot.val();
    callback(data);
  });
};

// Función para actualizar un pedido
export const actualizarPedido = (id, pedido) => {
  const pedidoRef = ref(database, `pedidos/${id}`);
  return set(pedidoRef, pedido);
};

// Función para eliminar un pedido
export const eliminarPedido = (id) => {
  const pedidoRef = ref(database, `pedidos/${id}`);
  return remove(pedidoRef);
};
