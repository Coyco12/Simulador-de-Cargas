let carga0= 'La carga necesita un valor diferente a 0';
let dimension0= 'Selecciona una dimensión para colocar las cargas';

let cuadro1, dim, canvas, figura, container;
let switch_click = "crear";
var allcargas = [];
let button_borrar = document.getElementById("borrar");
button_borrar.classList.remove("borrando");
let prefix = document.getElementById("prefix");
let canvasdata=null;

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
        button_borrar.classList.remove("borrando");
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
        if(canvasdata!=null){
            figura.putImageData(canvasdata, 0, 0);
        }
        let fuerza=0;
        let fuerzax=0;
        let fuerzay=0;
        for (let i = 0; i < allcargas.length; i++) {
            if(allcargas[i]!=closestcharge){
                let cargaActual = allcargas[i];
                let distancia = calcDistancia(cargaActual.x,cargaActual.y,closestcharge.x,closestcharge.y);
                let angulo = Math.atan2(cargaActual.y - closestcharge.y, cargaActual.x - closestcharge.x)+180*Math.PI/180;
                fuerza += (9*Math.pow(10,9)*Math.abs(cargaActual.valor*closestcharge.valor)/Math.pow(distancia,2));
                fuerzax += fuerza * Math.cos(angulo);
                fuerzay += fuerza * Math.sin(angulo);
            }
        }
        canvasdata = figura.getImageData(0, 0, canvas.width, canvas.height);
        figura.beginPath();
        figura.moveTo(closestcharge.x, closestcharge.y);
        figura.linecap="round";
        if(Math.abs(fuerzax)/1e+8>closestcharge.radio&&Math.abs(fuerzay)/1e+8>closestcharge.radio){
            figura.lineTo(closestcharge.x+fuerzax/1e+8, closestcharge.y+fuerzay/1e+8);
            figura.strokeStyle="#fa4646";
            figura.lineWidth=6;
        }else if(Math.abs(fuerzax)/1e+4>closestcharge.radio&&Math.abs(fuerzay)/1e+4>closestcharge.radio){
            figura.lineTo(closestcharge.x+fuerzax/1e+4, closestcharge.y+fuerzay/1e+4);
            figura.strokeStyle="#fae246";
            figura.lineWidth=5;
        }else if(Math.abs(fuerzax)>closestcharge.radio&&Math.abs(fuerzay)>closestcharge.radio){
            figura.lineTo(closestcharge.x+fuerzax, closestcharge.y+fuerzay);
            figura.strokeStyle="#4cfa46";
            figura.lineWidth=4;
        }else if(Math.abs(fuerzax)/1e-4>closestcharge.radio&&Math.abs(fuerzay)/1e-4>closestcharge.radio){
            figura.lineTo(closestcharge.x+fuerzax/1e-4, closestcharge.y+fuerzay/1e-4);
            figura.strokeStyle="#46fae2";
            figura.lineWidth=3;
        }else if(Math.abs(fuerzax)/1e-8>closestcharge.radio&&Math.abs(fuerzay)/1e-8>closestcharge.radio){
            figura.lineTo(closestcharge.x+fuerzax/1e-8, closestcharge.y+fuerzay/1e-8);
            figura.strokeStyle="#4646fa";
            figura.lineWidth=2;
        }else{
            figura.lineTo(closestcharge.x+fuerzax/1e-12, closestcharge.y+fuerzay/1e-12);
            figura.strokeStyle="#7a28ff";
            figura.lineWidth=1;
        }
        figura.stroke();
        figura.closePath();
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
        if(canvasdata!=null) figura.putImageData(canvasdata, 0, 0);
        canvasdata=null;    
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
    if(canvasdata!=null) figura.putImageData(canvasdata, 0, 0);
    canvasdata=null;
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
    canvasdata=null;
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
    figura = canvas.getContext("2d",{willReadFrequently: true});

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