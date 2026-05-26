let cuadro1 = document.getElementById("valorcarga");
let dim= document.getElementById("dimension");
let canvas=document.getElementById("canvas");
let figura=canvas.getContext("2d");
let container= canvas.parentNode;

var windowWidth=window.innerWidth;
var windowHeight=window.innerHeight;
canvas.width=container.clientWidth-20;
canvas.height=container.clientHeight-20;


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

dim.addEventListener("change", cambiodim)
function cambiodim(event){
    if(dim.value=="1D"||dim.value=="2D"||dim.value=="general"){
    limpiar();
    }

}

canvas.addEventListener("click", createCharge); 
var allCargas = [];

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



function limpiar(){
    figura.clearRect(0, 0, canvas.width, canvas.height);
    allcargas = [];
}

let carga0= 'La carga necesita un valor diferente a 0';
let dimension0= 'Selecciona una dimensión para colocar las cargas';

function notificacion(texto){
    let noti= document.createElement('div');
    noti.classList.add("noti");
    noti.innerHTML=texto;
    document.getElementById("notificacion").appendChild(noti);
}