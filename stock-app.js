// stock-app.js
import { actualizarStock, obtenerStock } from "./firebase.js";

const productos = [
  "Blend Fusion","Tilo y Lavanda","Tilo","Manzana","Manzana Maracuyá","Higos y lirios","Albahaca Verbena",
  "Maderas Nobles","Amarettis y café","Vainilla Coco","Flores blancas","Fresh Cardamomo","Jazmin",
  "Vainilla canela chocolate","Maderas y flores","Limón y flores","Peonias y olivas","Bambú","Coco lima","Frambuesa Pimienta"
];

let stock = [];
const stockTabla = document.getElementById("stockTabla");
const disponiblesDiv = document.createElement("div");
disponiblesDiv.id = "disponibles";
document.body.appendChild(disponiblesDiv);

function renderStock() {
  stockTabla.innerHTML = "";

  // 👇 ordenar: primero disponibles (true), luego no disponibles (false)
  stock.sort((a, b) => b.disponible - a.disponible);

  stock.forEach((item, index) => {
    const row = document.createElement("tr");

    const tdCheck = document.createElement("td");
    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = item.disponible;

    check.addEventListener("change", () => {
      stock[index].disponible = check.checked;
      actualizarStock(item.producto, check.checked); // guarda en Firebase
      renderStock(); // 🔄 re-renderizar para que se reordene
    });

    tdCheck.appendChild(check);
    tdCheck.appendChild(document.createTextNode(" " + item.producto));
    row.appendChild(tdCheck);
    stockTabla.appendChild(row);
  });
}


// Escuchar cambios en Firebase en tiempo real
obtenerStock((data) => {
  stock = productos.map(p => ({
    producto: p,
    disponible: data[p] !== undefined ? data[p] : true // si no existe en DB, por defecto true
  }));
  renderStock();
});
