
const contenedor = document.getElementById("contenedor-fotos");
const contador = document.getElementById("contador-badge");

const modal = document.getElementById("modal");
const imgGrande = document.getElementById("imagen-grande");

const btnCerrar = document.querySelector(".cerrar");
const btnAnterior = document.getElementById("btn-anterior");
const btnSiguiente = document.getElementById("btn-siguiente");

const btnSeleccionZoom = document.getElementById("btn-seleccionar-zoom");
const btnBorrarZoom = document.getElementById("btn-borrar-zoom");
btnBorrarZoom.style.display = "none";

const btnBorrarMini = document.getElementById("btn-borrar-mini");
btnBorrarMini.style.display = "none";

const miniaturasZoom = document.getElementById("miniaturas");

const carrito = document.getElementById("carrito");
carrito.style.display = "none";

const evento = "regatas-2026";

const rutaThumbs = `../assets/eventos/${evento}/thumbs/`;
const rutaFull = `../assets/eventos/${evento}/full/`;

let totalFotos =152;

let fotoActual = 1;
let zoom = 1;
const zoomStep = 0.15;
const zoomMax = 3;
const zoomMin = 1;

let seleccionadas = JSON.parse(localStorage.getItem("fotosSeleccionadas")) || [];

let fotosPorCarga = 30;
let fotosCargadas = 0;



function actualizarContador(){

contador.textContent = seleccionadas.length;

if(seleccionadas.length > 0){
btnBorrarMini.style.display = "flex";
btnBorrarZoom.style.display = "flex";
carrito.style.display = "flex";
}else{
btnBorrarMini.style.display = "none";
btnBorrarZoom.style.display = "none";
carrito.style.display = "none";
}

}



function guardarSeleccion(){

localStorage.setItem("fotosSeleccionadas", JSON.stringify(seleccionadas));

}



function borrarSeleccion(){

if(seleccionadas.length === 0) return;

seleccionadas.pop();

guardarSeleccion();

actualizarContador();
actualizarGaleria();
actualizarBotonZoom();

}



btnBorrarMini.addEventListener("click", borrarSeleccion);
btnBorrarZoom.addEventListener("click", borrarSeleccion);



function toggleSeleccion(nombre, elemento){

if(seleccionadas.includes(nombre)){

seleccionadas = seleccionadas.filter(f => f !== nombre);

}else{

seleccionadas.push(nombre);

animarAlCarrito(elemento);

}

guardarSeleccion();

actualizarContador();
actualizarGaleria();
actualizarBotonZoom();

}



function animarAlCarrito(img){

const carritoRect = carrito.getBoundingClientRect();
const imgRect = img.getBoundingClientRect();

const clon = img.cloneNode(true);

clon.style.position = "fixed";
clon.style.left = imgRect.left + "px";
clon.style.top = imgRect.top + "px";
clon.style.width = imgRect.width + "px";
clon.style.transition = "0.7s";
clon.style.zIndex = "9999";

document.body.appendChild(clon);

requestAnimationFrame(()=>{

clon.style.left = carritoRect.left + "px";
clon.style.top = carritoRect.top + "px";
clon.style.width = "30px";
clon.style.opacity = "0";

});

setTimeout(()=>{

clon.remove();

},700);

}



function crearMiniatura(i){

const numero = String(i).padStart(3,'0');
const nombre = `IMG_${numero}.jpg`;

const item = document.createElement("div");
item.className = "foto-item";
item.dataset.nombre = nombre;

const img = document.createElement("img");

img.src = rutaThumbs + nombre;
img.loading = "lazy";

img.onclick = ()=> abrirModal(i);

const btn = document.createElement("button");

btn.className = "btn-select";
btn.textContent = "+";

btn.onclick = (e)=>{

e.stopPropagation();
toggleSeleccion(nombre,img);

};

item.appendChild(img);
item.appendChild(btn);

contenedor.appendChild(item);

} 



function cargarFotos(){

let limite = fotosCargadas + fotosPorCarga;

for(let i = fotosCargadas + 1; i <= limite && i <= totalFotos; i++){

crearMiniatura(i);

}

fotosCargadas = limite;

actualizarGaleria();

}



window.addEventListener("scroll", ()=>{

if(window.innerHeight + window.scrollY >= document.body.offsetHeight - 200){

if(fotosCargadas < totalFotos){

cargarFotos();

}

}

});



function abrirModal(numero){

fotoActual = numero;

const num = String(numero).padStart(3,'0');
const nombre = `IMG_${num}.jpg`;

imgGrande.src = rutaFull + nombre;

modal.style.display = "flex";

zoom = 1;
imgGrande.style.transform = "scale(1)";

actualizarBotonZoom();
generarMiniaturasZoom();
document.body.focus();

}
document.addEventListener("keydown",(e)=>{

// solo si el visor está abierto
if(modal.style.display !== "flex") return;


// FOTO SIGUIENTE
if(e.key === "ArrowRight"){

if(fotoActual < totalFotos){

abrirModal(fotoActual + 1);

}

}


// FOTO ANTERIOR
if(e.key === "ArrowLeft"){

if(fotoActual > 1){

abrirModal(fotoActual - 1);

}

}


// CERRAR VISOR
if(e.key === "Escape"){

modal.style.display = "none";

}


// SELECCIONAR FOTO (ESPACIO)
if(e.code === "Space"){

e.preventDefault();

const num = String(fotoActual).padStart(3,'0');
const nombre = `IMG_${num}.jpg`;

toggleSeleccion(nombre,imgGrande);

}

});

imgGrande.addEventListener("wheel",(e)=>{

e.preventDefault();

if(modal.style.display !== "flex") return;

if(e.deltaY < 0){

zoom += zoomStep;

}else{

zoom -= zoomStep;

}

zoom = Math.max(zoomMin, Math.min(zoomMax, zoom));

imgGrande.style.transform = `scale(${zoom})`;

});



btnCerrar.onclick = ()=> modal.style.display = "none";



btnAnterior.onclick = ()=>{

if(fotoActual > 1){

abrirModal(fotoActual - 1);

}

};



btnSiguiente.onclick = ()=>{

if(fotoActual < totalFotos){

abrirModal(fotoActual + 1);

}

};



btnSeleccionZoom.onclick = ()=>{

const num = String(fotoActual).padStart(3,'0');
const nombre = `IMG_${num}.jpg`;

toggleSeleccion(nombre,imgGrande);

};



function actualizarBotonZoom(){

const num = String(fotoActual).padStart(3,'0');
const nombre = `IMG_${num}.jpg`;

btnSeleccionZoom.textContent = seleccionadas.includes(nombre) ? "✓" : "+";

}



function generarMiniaturasZoom(){

miniaturasZoom.innerHTML = "";

let inicio = Math.max(1,fotoActual-3);
let fin = Math.min(totalFotos,fotoActual+3);

for(let i=inicio;i<=fin;i++){

const num = String(i).padStart(3,'0');

const img = document.createElement("img");

img.src = rutaThumbs + `IMG_${num}.jpg`;

img.className = "mini-zoom";

if(i === fotoActual){

img.classList.add("activa");

}

img.onclick = ()=> abrirModal(i);

miniaturasZoom.appendChild(img);

}

}



function actualizarGaleria(){

document.querySelectorAll(".foto-item").forEach(item=>{

const nombre = item.dataset.nombre;

const btn = item.querySelector(".btn-select");

btn.textContent = seleccionadas.includes(nombre) ? "✓" : "+";

});

}



carrito.onclick = ()=>{

if(seleccionadas.length === 0){

alert("No hay fotos seleccionadas");
return;

}

guardarSeleccion();

window.location.href = "carrito.html";

};



document.addEventListener("contextmenu", e => e.preventDefault());

document.addEventListener("dragstart", e => {

if(e.target.tagName === "IMG"){

e.preventDefault();

}

});



cargarFotos();
actualizarContador();
actualizarGaleria();