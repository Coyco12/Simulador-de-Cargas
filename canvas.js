let carga0 = 'La carga necesita un valor diferente a 0';
let dimension0 = 'Selecciona una dimensión para colocar las cargas';

let cuadro1, dim, canvas, figura, container;
let switch_click = "crear"; 
var allcargas = [];
let canvasdata = null;

let button_borrar = document.getElementById("borrar");
let button_campo = document.getElementById("modoCampo");
let button_fuerza = document.getElementById("modoFuerza");
let prefix = document.getElementById("prefix");

let panelResultados, resEx, resEy, resEtotal;
let panelFuerza, resFx, resFy, resFtotal, resDist;
let contenedorfy= document.getElementById("contenedorfy");
let contenedorey= document.getElementById("contenedorey");
document.getElementById("mensaje").style.display = "none";
document.getElementById("mensaje3").style.display = "none";


function calcDistancia(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

class carga {
    constructor(x, y, radio, valor) {
        this.x = x; 
        this.y = y;
        this.radio = radio;
        this.valor = valor;
    }
    draw() {
        if (this.x < 0 + this.radio) this.x = this.radio;
        if (this.x > canvas.width - this.radio) this.x = canvas.width - this.radio;
        if (this.y < 0 + this.radio) this.y = this.radio;
        if (this.y > canvas.height - this.radio) this.y = canvas.height - this.radio;

        figura.beginPath();
        figura.arc(this.x, this.y, this.radio, 0, Math.PI * 2);
        if (this.valor < 0) {
            figura.fillStyle = "darkblue";
            figura.fill(); 
        } else if (this.valor > 0) {
            figura.fillStyle = "red";
            figura.fill();
        }
        figura.strokeStyle = "black";
        figura.lineWidth = 2;
        figura.stroke();
        figura.textAlign = "center";
        figura.textBaseline = "middle";
        figura.font = "20px Arial";
        figura.fillStyle = "white";
        if (this.valor < 0) figura.fillText("-", this.x, this.y);
        if (this.valor > 0) figura.fillText("+", this.x, this.y);
        figura.closePath();
    }
}
function ejes() {
    figura.save();
    figura. beginPath();
    figura.strokeStyle = "rgba(41, 39, 39, 0.7)";
    figura.lineWidth = 1.5;
 
    let mitady = canvas.height / 2;
    figura.moveTo(0, mitady);
    figura.lineTo(canvas.width, mitady);

    let mitadx = canvas.width / 2;
    figura.moveTo(mitadx, 0);
    figura.lineTo(mitadx, canvas.height);

    figura.stroke();
    figura.closePath();
    figura.restore();
}

function cambiodim(event) {
    if (dim.value == "1D" || dim.value == "2D" || dim.value == "general") {
        limpiar();
        button_borrar.classList.remove("borrando");
        button_campo.classList.remove("midiendo-campo");
        ocultarResultados();
        switch_click = "crear"; 
    }
}

function click_switch(event) {
    if (button_borrar.classList.contains("borrando")) {
        borrar(event);
    } else if (button_campo.classList.contains("midiendo-campo")) {
        calcularCampoPorClic(event);
    } else if (button_fuerza.classList.contains("analizando-fuerza")) {
        measureCharge(event);
    } else {
        createCharge(event);
    }
}

function measureCharge(event){
    let rect = canvas.getBoundingClientRect();
    let x_clic = event.clientX - rect.left;
    let y_clic = event.clientY - rect.top;
    let mindistance = Infinity;
    let closestcharge = null;

    for (let i = 0; i < allcargas.length; i++) {
        let cargaActual = allcargas[i];
        let distancia = calcDistancia(cargaActual.x, cargaActual.y, x_clic, y_clic);
        if (distancia <= 1.75 * cargaActual.radio) {
            if (distancia < mindistance){
                mindistance = distancia;
                closestcharge = cargaActual;
            }
        }
    }


    if (closestcharge == null) {
        notificacion("Haz clic directamente sobre una carga para calcular la fuerza neta.");
        return false;
    } else {
        if (canvasdata != null) {
            figura.putImageData(canvasdata, 0, 0);
        }
        ocultarResultados();

        let fuerza = 0;
        let fuerzax = 0;
        let fuerzay = 0;
        let ultimaDistanciaRegistrada = 0; 

        for (let i = 0; i < allcargas.length; i++) {
            if (allcargas[i] != closestcharge) {
                let cargaActual = allcargas[i];
                let distancia = calcDistancia(cargaActual.x, cargaActual.y, closestcharge.x, closestcharge.y);
                ultimaDistanciaRegistrada = distancia;

                let angulo = Math.atan2(cargaActual.y - closestcharge.y, cargaActual.x - closestcharge.x);
                
                if (cargaActual.valor * closestcharge.valor > 0) {
                    angulo += 180 * Math.PI / 180; 
                } 
                fuerza = 9 * Math.pow(10, 9) * Math.abs(cargaActual.valor * closestcharge.valor) / Math.pow(distancia, 2);
                fuerzax += fuerza * Math.cos(angulo);
                fuerzay += fuerza * Math.sin(angulo);

                figura.save(); 
                figura.beginPath();
                figura.setLineDash([6, 6]); 
                figura.moveTo(closestcharge.x, closestcharge.y);
                figura.lineTo(cargaActual.x, cargaActual.y);
                figura.strokeStyle = "white"; 
                figura.lineWidth = 2.5;
                figura.stroke();
                figura.closePath();

                let medioX = (closestcharge.x + cargaActual.x) / 2;
                let medioY = (closestcharge.y + cargaActual.y) / 2;
                figura.font = "bold 13px 'Elms Sans', Arial";
                figura.fillStyle = "#fff";
                figura.textAlign = "center";
                figura.textBaseline = "bottom";
                figura.shadowColor = "black";
                figura.shadowBlur = 4;
                figura.fillText(distancia.toFixed(1) + " px", medioX, medioY - 4);
                figura.restore(); 
            }
        }

        canvasdata = figura.getImageData(0, 0, canvas.width, canvas.height);
        let fuerzaTotal = Math.sqrt(fuerzax * fuerzax + fuerzay * fuerzay);

        if (fuerzaTotal === 0) return true;

        let longitudFuerza = 70;
        let escalaFuerza = longitudFuerza / fuerzaTotal;

        let finX = closestcharge.x + (fuerzax * escalaFuerza);
        let finY = closestcharge.y + (fuerzay * escalaFuerza);

        figura.beginPath();
        figura.moveTo(closestcharge.x, closestcharge.y);
        figura.lineTo(finX, finY);
        figura.linecap = "round";

        if (fuerzaTotal >= 1e+8) {
            figura.strokeStyle = "#fa4646"; 
            figura.lineWidth = 6;
        } else if (fuerzaTotal >= 1e+4) {
            figura.strokeStyle = "#fae246"; 
            figura.lineWidth = 5;
        } else if (fuerzaTotal >= 1) {
            figura.strokeStyle = "#4cfa46"; 
            figura.lineWidth = 4;
        } else if (fuerzaTotal >= 1e-4) {
            figura.strokeStyle = "#46fae2"; 
            figura.lineWidth = 3;
        } else if (fuerzaTotal >= 1e-8) {
            figura.strokeStyle = "#4646fa"; 
            figura.lineWidth = 2;
        } else {
            figura.strokeStyle = "#7a28ff"; 
            figura.lineWidth = 1;
        }
        figura.stroke();
        figura.closePath();

        let anguloVector = Math.atan2(finY - closestcharge.y, finX - closestcharge.x);
        let tamanoPunta = 14; 
        
        figura.beginPath();
        figura.moveTo(finX, finY);
        figura.lineTo(finX - tamanoPunta * Math.cos(anguloVector - Math.PI / 6), finY - tamanoPunta * Math.sin(anguloVector - Math.PI / 6));
        figura.moveTo(finX, finY);
        figura.lineTo(finX - tamanoPunta * Math.cos(anguloVector + Math.PI / 6), finY - tamanoPunta * Math.sin(anguloVector + Math.PI / 6));
        figura.lineWidth = figura.lineWidth - 1; 
        if (figura.lineWidth < 2) figura.lineWidth = 2;
        figura.stroke();
        figura.closePath();

        resFx.innerHTML = fuerzax.toExponential(4);
        resFy.innerHTML = fuerzay.toExponential(4);
        resFtotal.innerHTML = fuerzaTotal.toExponential(4);
        if (resDist) resDist.innerHTML = ultimaDistanciaRegistrada.toFixed(2); 
        if(dim.value=="1D") 
        {
            contenedorfy.style.display = "none";
        }
        else 
        {
            contenedorfy.style.display = "block";
        }

        document.getElementById("mensaje").style.display = "none";
        document.getElementById("mensaje2").style.display = "none";
        document.getElementById("mensaje3").style.display = "none";
        document.getElementById("panelResultados").style.display = "none";
        document.getElementById("panelFuerza").style.display = "block";    
        closestcharge.draw();

        return true;
    }
}

function createCharge(event) {   
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    
    if (dim.value == "1D") {
        y = canvas.height / 2;
    }
    if (dim.value == "general") {
        notificacion(dimension0);
        return;
    }

    for (let i = 0; i < allcargas.length; i++) {
        let cargaExistente = allcargas[i];
        let distanciaAlClic = calcDistancia(cargaExistente.x, cargaExistente.y, x, y);
        if (distanciaAlClic < (cargaExistente.radio * 2)) {
            notificacion("No se pueden colocar dos cargas en la misma posición.");
            return; 
        }
    }

    if (canvasdata != null) figura.putImageData(canvasdata, 0, 0);
    canvasdata = null;    
    let coulomb = Number(cuadro1.value);

    if (coulomb == 0) {
        notificacion(carga0);
        return;
    }  

    let prefixValue = prefix.value;
    if (prefixValue === "milicoulomb") {
        coulomb *= 1e-3;
    } else if (prefixValue === "microcoulomb") {
        coulomb *= 1e-6;
    } else if (prefixValue === "nanocoulomb") {
        coulomb *= 1e-9;
    }
    
    let newCharge = new carga(x, y, 25, coulomb);
    allcargas.push(newCharge);
    newCharge.draw();
}

function borrar(event) {
    if (canvasdata != null) figura.putImageData(canvasdata, 0, 0);
    canvasdata = null;
    

    let rect = canvas.getBoundingClientRect();
    let x_clic = event.clientX - rect.left;
    let y_clic = event.clientY - rect.top;

    for (let i = 0; i < allcargas.length; i++) {
        let cargaActual = allcargas[i];
        let distancia = calcDistancia(cargaActual.x, cargaActual.y, x_clic, y_clic);
        if (distancia <= cargaActual.radio) {
            allcargas.splice(i, 1); 
            figura.clearRect(0, 0, canvas.width, canvas.height);
            ejes();
            for (let j = 0; j < allcargas.length; j++) {
                allcargas[j].draw();
            }
            break; 
        }
    }
}

function limpiar() {
    figura.clearRect(0, 0, canvas.width, canvas.height);
    allcargas = [];
    canvasdata = null;
    panelFuerza.style.display = "none";
    panelResultados.style.display = "none";
    ejes();
}

function notificacion(texto) {
    let contenedorNoti = document.getElementById("notificacion");
    if (!contenedorNoti) return;

    let noti = document.createElement('div');
    noti.classList.add("noti");
    noti.innerHTML = texto;
    contenedorNoti.appendChild(noti);

    setTimeout(() => {
        noti.remove();
    }, 3000);
}

function calcularCampoPorClic(event) {
    if (allcargas.length == 0) {
        notificacion("Coloca al menos una carga en el espacio para calcular el campo eléctrico.");
        return;
    }

    let rect = canvas.getBoundingClientRect();
    let x_clic = event.clientX - rect.left;
    let y_clic = event.clientY - rect.top;

    if (dim.value == "1D") {
        y_clic = canvas.height / 2;
    }

    for (let i = 0; i < allcargas.length; i++) {
        let cargaExistente = allcargas[i];
        let distanciaAlClic = calcDistancia(cargaExistente.x, cargaExistente.y, x_clic, y_clic);
        
        if (distanciaAlClic <= cargaExistente.radio) {
            notificacion("No se puede calcular el campo eléctrico sobre la posición de una carga.");
            
            if (canvasdata != null) figura.putImageData(canvasdata, 0, 0);
            ocultarResultados();
            return; 
        }
    }

    if (canvasdata != null) figura.putImageData(canvasdata, 0, 0);

    let Ex = 0;
    let Ey = 0;
    const k = 9 * Math.pow(10, 9); 

    for (let i = 0; i < allcargas.length; i++) {
        let cargaActual = allcargas[i];
        let distancia = calcDistancia(cargaActual.x, cargaActual.y, x_clic, y_clic);
        
        if (distancia < 2) continue; 
        let magnitudE = (k * Math.abs(cargaActual.valor)) / Math.pow(distancia, 2);
        let angulo = Math.atan2(y_clic - cargaActual.y, x_clic - cargaActual.x);
        
        if (cargaActual.valor < 0) {
            angulo += Math.PI; 
        }

        Ex += magnitudE * Math.cos(angulo);
        Ey += magnitudE * Math.sin(angulo);
    }

    canvasdata = figura.getImageData(0, 0, canvas.width, canvas.height);
    let campoTotal = Math.sqrt(Ex * Ex + Ey * Ey);

    if (campoTotal === 0) return;

    let longitudDeseada = 60; 
    let escala = longitudDeseada / campoTotal;

    let finX = x_clic + (Ex * escala);
    let finY = y_clic + (Ey * escala);

    figura.beginPath();
    figura.moveTo(x_clic, y_clic);
    figura.lineTo(finX, finY);
    figura.strokeStyle = "rgb(182, 105, 201)"; 
    figura.lineWidth = 4;
    figura.linecap = "round";
    figura.stroke();
    figura.closePath();

    let anguloFlecha = Math.atan2(finY - y_clic, finX - x_clic);
    let tamanoPunta = 12; 

    figura.beginPath();
    figura.moveTo(finX, finY);
    figura.lineTo(finX - tamanoPunta * Math.cos(anguloFlecha - Math.PI / 6), finY - tamanoPunta * Math.sin(anguloFlecha - Math.PI / 6));
    figura.moveTo(finX, finY);
    figura.lineTo(finX - tamanoPunta * Math.cos(anguloFlecha + Math.PI / 6), finY - tamanoPunta * Math.sin(anguloFlecha + Math.PI / 6));
    figura.strokeStyle = "rgb(182, 105, 201)";
    figura.lineWidth = 4;
    figura.stroke();
    figura.closePath();

    figura.beginPath();
    figura.arc(x_clic, y_clic, 5, 0, Math.PI * 2);
    figura.fillStyle = "white";
    figura.fill();
    figura.strokeStyle = "black";
    figura.lineWidth = 2;
    figura.stroke();
    figura.closePath();

    resEx.innerHTML = Ex.toExponential(4);
    resEy.innerHTML = Ey.toExponential(4);
    resEtotal.innerHTML = campoTotal.toExponential(4);

    if(dim.value=="1D")
    {
        contenedorey.style.display = "none";
    }
    else
    {
        contenedorey.style.display = "block";
    }   

    document.getElementById("mensaje").style.display = "none";
    document.getElementById("mensaje2").style.display = "none";
    document.getElementById("mensaje3").style.display = "none";
    document.getElementById("panelResultados").style.display = "block";
    document.getElementById("panelFuerza").style.display = "none";
    
}

function ocultarResultados() {
    if(dim.value=="general")
    {
        document.getElementById("mensaje2").style.display = "block";
        document.getElementById("mensaje").style.display = "none";
    }
    else {
        document.getElementById("mensaje").style.display = "block";
        document.getElementById("mensaje2").style.display = "none";
        }
   
    document.getElementById("mensaje3").style.display = "none";
    
  
}

function inicializarYReseize() {
    cuadro1 = document.getElementById("valorcarga");
    dim = document.getElementById("dimension");
    canvas = document.getElementById("canvas");
    container = canvas.parentNode;
    figura = canvas.getContext("2d", { willReadFrequently: true });

    panelResultados = document.getElementById("panelResultados");
    resEx = document.getElementById("resEx");
    resEy = document.getElementById("resEy");
    resEtotal = document.getElementById("resEtotal");

    panelFuerza = document.getElementById("panelFuerza");
    resFx = document.getElementById("resFx");
    resFy = document.getElementById("resFy");
    resFtotal = document.getElementById("resFtotal");
    resDist = document.getElementById("resDist");

    button_fuerza = document.getElementById("modoFuerza");

    if (canvas && dim && container) {
        canvas.width = container.clientWidth - 20;
        canvas.height = container.clientHeight - 20;
        canvasdata = null; 

        canvas.removeEventListener("click", click_switch); 
        canvas.addEventListener("click", click_switch); 
        
        dim.removeEventListener("change", cambiodim);
        dim.addEventListener("change", cambiodim);

        button_borrar.onclick = function() {
            button_campo.classList.remove("midiendo-campo");
            button_fuerza.classList.remove("analizando-fuerza");
            button_borrar.classList.toggle("borrando");
           
            if(button_borrar.classList.contains("borrando")){
                document.getElementById("mensaje").style.display = "none";
                document.getElementById("mensaje3").style.display = "block";
                }
                else{
                    ocultarResultados();
                    }
            panelFuerza.style.display = "none";
            panelResultados.style.display = "none";
            
        
        };

        button_campo.onclick = function() {
            button_borrar.classList.remove("borrando");
            button_fuerza.classList.remove("analizando-fuerza");
            button_campo.classList.toggle("midiendo-campo");
            if (!button_campo.classList.contains("midiendo-campo")) {
                ocultarResultados();
                panelFuerza.style.display = "none";
                panelResultados.style.display = "none";
                if (canvasdata != null) figura.putImageData(canvasdata, 0, 0);
            }
            else {
                document.getElementById("mensaje3").style.display = "block";
                document.getElementById("mensaje").style.display = "none";
                document.getElementById("mensaje2").style.display = "none";
                document.getElementById("panelResultados").style.display = "none";
                document.getElementById("panelFuerza").style.display = "none";
            
            }
        };

        button_fuerza.onclick = function() {
            button_borrar.classList.remove("borrando");
            button_campo.classList.remove("midiendo-campo");
            button_fuerza.classList.toggle("analizando-fuerza");
            if (!button_fuerza.classList.contains("analizando-fuerza")) {
                
                ocultarResultados();
                panelFuerza.style.display = "none";
                panelResultados.style.display = "none";
                if (canvasdata != null) figura.putImageData(canvasdata, 0, 0);
            
            }
            else {
                document.getElementById("mensaje3").style.display = "block";
                document.getElementById("mensaje").style.display = "none";
                document.getElementById("mensaje2").style.display = "none";
                document.getElementById("panelResultados").style.display = "none";
                document.getElementById("panelFuerza").style.display = "none";
            }
        };

        ejes();
        
        if (allcargas.length > 0) {
            for (let i = 0; i < allcargas.length; i++) {
                allcargas[i].draw();
            }
        }
    }
}

window.addEventListener("DOMContentLoaded", inicializarYReseize);
window.addEventListener("resize", inicializarYReseize);
window.addEventListener("resize", inicializarYReseize);
