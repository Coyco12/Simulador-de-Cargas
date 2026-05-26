let carga0= 'La carga necesita un valor diferente a 0';
let dimension0= 'Selecciona una dimensión para colocar las cargas';

let cuadro1, dim, canvas, figura, container;
let switch_click = "crear";
var allcargas = [];
let button_borrar = document.getElementById("borrar");
button_borrar.classList.remove("borrando");
let prefix = document.getElementById("prefix");
function inicializarYReseize() {
    
    cuadro1 = document.getElementById("valorcarga");
    dim = document.getElementById("dimension");
    canvas = document.getElementById("canvas");
    container = canvas.parentNode;
    figura = canvas.getContext("2d");

    if (canvas) {
        
        let rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;
        
        
        if (allcargas.length > 0) {
            for (let i = 0; i < allcargas.length; i++) {
                allcargas[i].draw();
            }
        }
    }
}


window.addEventListener("DOMContentLoaded", inicializarYReseize);


window.addEventListener("resize", inicializarYReseize);

button_borrar.addEventListener("click",()=> {
    button_borrar.classList.toggle("borrando");
});

function calcDistancia(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

class carga{
    constructor(x,y,radio,valor){
        this.x=x; 
        this.y=y;
        this.radio=radio;
        this.valor=valor;
    }
    draw(){
        if(this.x<0+this.radio){
            this.x=this.radio;
        }
        if(this.x>canvas.width-this.radio){
            this.x=canvas.width-this.radio;
        }
        if(this.y<0+this.radio){
            this.y=this.radio;
        }
        if(this.y>canvas.height-this.radio){
            this.y=canvas.height-this.radio;
        }
       
        figura.beginPath();
        figura.arc(this.x,this.y,this.radio,0,Math.PI*2);
        if(this.valor<0){
            figura.fillStyle="darkblue";
            figura.fill(); 
        }else if(this.valor>0){
            figura.fillStyle="red";
            figura.fill();
        }
        figura.strokeStyle="black";
        figura.lineWidth=2;
        figura.stroke();
        figura.textAlign="center";
        figura.textBaseline="middle";
        figura.font="20px Arial";
        figura.fillStyle="white";
        if(this.valor<0){
            figura.fillText("-",this.x,this.y);
        }
        if(this.valor>0){
            figura.fillText("+",this.x,this.y);
        }
        figura.closePath();
    }
}

function cambiodim(event){
    if(dim.value=="1D"||dim.value=="2D"||dim.value=="general"){
        limpiar();
        switch_click = "crear"; 
    }

}
function click_switch(event){
    if(button_borrar.classList.contains("borrando"))
        borrar(event);
    else
        createCharge(event);
}

function measureCharge(event){
    let rect = canvas.getBoundingClientRect();
    let x_clic = event.clientX - rect.left;
    let y_clic = event.clientY - rect.top;
    let mindistance = Infinity;
    let closestcharge = null;
    for (let i = 0; i < allcargas.length; i++) {
        if(allcargas[i]!=closestcharge){
            let cargaActual = allcargas[i];
            let distancia = calcDistancia(cargaActual.x,cargaActual.y,x_clic,y_clic);
            if (distancia <= 1.75*cargaActual.radio) {
                if (distancia < mindistance){
                    mindistance = distancia;
                    closestcharge = cargaActual;
                }
            }
        }
    }
    if(closestcharge==null){
        return false;
    }else{
        for (let i = 0; i < allcargas.length; i++) {
            if(allcargas[i]!=closestcharge){
                let cargaActual = allcargas[i];
                let distancia = calcDistancia(cargaActual.x,cargaActual.y,x_clic,y_clic);
                let fuerza= (9*Math.pow(10,9)*cargaActual.valor*closestcharge.valor)/Math.pow(distancia,2);
                figura.beginPath();
                figura.moveTo(closestcharge.x, closestcharge.y);
                figura.lineTo(cargaActual.x, cargaActual.y);
                figura.strokeStyle="blue";
                figura.lineWidth=2;
                figura.stroke();
                figura.save();
                figura.translate((closestcharge.x+cargaActual.x)/2, (closestcharge.y+cargaActual.y)/2);
                let angle = Math.atan2(cargaActual.y - closestcharge.y, cargaActual.x - closestcharge.x);
                figura.rotate(angle);
                figura.font="20px Arial";
                figura.fillStyle="white";
                figura.textAlign="center";
                figura.textBaseline="middle";
                figura.fillText(fuerza.toExponential(2)+" N", (closestcharge.x+cargaActual.x)/2, (closestcharge.y+cargaActual.y)/2);
                figura.restore();
                figura.closePath();
            }
        }
        return true;
    }
}

function createCharge(event) {   
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    
    if(dim.value=="1D"){
        y=canvas.height/2;
    }
    if(dim.value=="general"){
        notificacion(dimension0);
        return;
    }
    if(!measureCharge(event)){    
        let coulomb=Number(cuadro1.value);
        let prefixValue = prefix.value;
        if (prefixValue === "milicoulomb") {
            coulomb *= 1e-3;
        } else if (prefixValue === "microcoulomb") {
            coulomb *= 1e-6;
        }
        else if (prefixValue === "nanocoulomb") {
            coulomb *= 1e-9;
        }
        if(coulomb==0){
            notificacion(carga0);
            return;
        }  
        let newCharge = new carga(x, y, 25, coulomb);
        allcargas.push(newCharge);
        newCharge.draw();
    }
}
function borrar(event){
    let rect = canvas.getBoundingClientRect();
    let x_clic = event.clientX - rect.left;
    let y_clic = event.clientY - rect.top;

    for (let i = 0; i < allcargas.length; i++) {
        let cargaActual = allcargas[i];
        let distancia = calcDistancia(cargaActual.x,cargaActual.y,x_clic,y_clic);
        if (distancia <= cargaActual.radio) {
            allcargas.splice(i, 1); 
            figura.clearRect(0, 0, canvas.width, canvas.height);
            for (let j = 0; j < allcargas.length; j++) {
                allcargas[j].draw();
            }
            break; 
        }
    }
}

function limpiar(){
    figura.clearRect(0, 0, canvas.width, canvas.height);
    allcargas = [];
}

function notificacion(texto){
    let contenedorNoti = document.getElementById("notificacion");
    
    if (!contenedorNoti) {
        console.error("No se encontró el contenedor <div id='notificacion'> en el HTML");
        return;
    }

    let noti = document.createElement('div');
    noti.classList.add("noti");
    noti.innerHTML = texto;
    
    contenedorNoti.appendChild(noti);

    setTimeout(() => {
        if (noti && noti.parentNode) {
            noti.remove();
        }
    }, 3000);
}

function inicializarYReseize() {

    cuadro1 = document.getElementById("valorcarga");
    dim = document.getElementById("dimension");
    canvas = document.getElementById("canvas");
    container = canvas.parentNode;
    figura = canvas.getContext("2d");

    if (canvas && dim) {
        let rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        canvas.removeEventListener("click", click_switch); 
        canvas.addEventListener("click", click_switch); 
        
        dim.removeEventListener("change", cambiodim);
        dim.addEventListener("change", cambiodim);

        if (allcargas.length > 0) {
            for (let i = 0; i < allcargas.length; i++) {
                allcargas[i].draw();
            }
        }
    }
}

window.addEventListener("DOMContentLoaded", inicializarYReseize);
window.addEventListener("resize", inicializarYReseize);