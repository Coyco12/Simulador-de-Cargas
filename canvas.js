let botton = document.getElementById("boton1");
let cuadrox = document.getElementById("numbx");

let canvas=document.getElementById("canvas");
let figura=canvas.getContext("2d");
let container= canvas.parentNode;

var windowWidth=window.innerWidth;
var windowHeight=window.innerHeight;
canvas.width=container.clientWidth-20;
canvas.height=container.clientHeight-20;


class carga{
    constructor(x,y,radio,color,valor){
        this.x=x; 
        this.y=y;
        this.radio=radio;
        this.color=color;
        this.valor=valor;
    }
    draw(){
        figura.beginPath();
        figura.arc(this.x,this.y,this.radio,0,Math.PI*2);
        figura.fillStyle=this.color;
        figura.fill();
        figura.strokeStyle="black";
        figura.lineWidth=2;
        figura.stroke();
        figura.textAlign="center";
        figura.textBaseline="middle";
        figura.font="20px Arial";
        figura.fillStyle="white";
        if(this.color=="darkblue"){
            figura.fillText("-",this.x,this.y);
        }else if(this.color=="red"){
            figura.fillText("+",this.x,this.y);
        }

    }
}

canvas.addEventListener("click", createCharge);

function createCharge(event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    let allcargas = [];
    let newCharge = new carga(x, y, 25, "red");
    newCharge.draw();
    allcargas.push(newCharge);
}



