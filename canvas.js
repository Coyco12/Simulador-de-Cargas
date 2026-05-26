let carga0= 'La carga necesita un valor diferente a 0';
let dimension0= 'Selecciona una dimensión para colocar las cargas';

let cuadro1, dim, canvas, figura, container;
let switch_click = "crear";
var allcargas = [];


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
        /*
        for(each of allcargas){
            if(each!=this&&this.x+this.radio<each.x-each.radio&&each.x-this.x<this.radio+each.radio){
                this.x-=Math.cos(Math.atan((each.y-this.y)/(each.x-this.x)))*this.radio;
            }
        }
        */
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
    if(switch_click=="borrar")
        borrar(event);
    else 
        createCharge(event);
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
    let coulomb=Number(cuadro1.value);
    if(coulomb==0){
        notificacion(carga0);
        return;
    }  
    let newCharge = new carga(x, y, 25, coulomb);
    newCharge.draw();
    allcargas.push(newCharge);
    
}

function borrar(event){
    let rect = canvas.getBoundingClientRect();
    let x_clic = event.clientX - rect.left;
    let y_clic = event.clientY - rect.top;

    for (let i = 0; i < allcargas.length; i++) {
        let cargaActual = allcargas[i];

        let distanciaX = x_clic - cargaActual.x;
        let distanciaY = y_clic - cargaActual.y;
        let distancia = Math.sqrt(distanciaX * distanciaX + distanciaY * distanciaY);

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