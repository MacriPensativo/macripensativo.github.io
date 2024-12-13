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
const pedidoFormDB = ref(database, 'condu');

// Obtener el formulario y agregar el listener
document.getElementById('pedidoForm').addEventListener('submit', submitForm);

// Función para manejar el envío del formulario
function submitForm(e) {
    e.preventDefault();

    // Obtener los valores de los campos del formulario
    const name = getElementVal('cliente');
    const fecha = getElementVal('fecha');
    const precio = getElementVal('precio');
    const fechaEntrega = getElementVal('fechaEntrega');

    // Guardar los datos en Firebase
    saveMessages(name, fecha, precio, fechaEntrega);

    // Opcional: limpiar el formulario
    document.getElementById('pedidoForm').reset();

    // Confirmar al usuario que se guardó correctamente
    alert('Pedido guardado exitosamente!');
}

// Función para guardar los datos en Firebase
const saveMessages = (name, fecha, precio, fechaEntrega) => {
    const newPedido = push(pedidoFormDB); // Crear una nueva referencia para el pedido
    set(newPedido, {
        name: name,
        fecha: fecha,
        precio: precio,
        fechaEntrega: fechaEntrega
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
