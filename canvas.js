let botton = document.getElementById("boton1");
let cuadrox = document.getElementById("numbx");

let canvas=document.getElementById("canvas");
let figura=canvas.getContext("2d");


var windowWidth=window.innerWidth;
var windowHeight=window.innerHeight;
canvas.width=windowWidth;
canvas.height=windowHeight;


class circle{
    constructor(x,y,radio,color) {
        this.x=x; 
        this.y=y;
        this.radio=radio;
        this.color=color;
    }
    draw(){
        figura.beginPath();
        figura.arc(this.x,this.y,this.radio,0,Math.PI*2);
        figura.fillStyle=this.color;
        figura.fill();
        figura.strokeStyle="black";
        figura.lineWidth=5;
        figura.stroke();
        
    
        figura.textAlign="center";
        figura.textBaseline="middle";
        figura.font="30px Arial";
        figura.fillStyle="white";
        if(this.color=="darkblue"){
            figura.fillText("-",this.x,this.y);
        }else if(this.color=="red"){
            figura.fillText("+",this.x,this.y);
        }

    }
}

botton.addEventListener("click", function() {
    let valx= Number(cuadrox.value);
    let circles= new circle(valx,200,50,"red");
    circles.draw();
});





