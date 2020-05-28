
// API AEMET
const api_key = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIzcmNodXNzQGdtYWlsLmNvbSIsImp0aSI6ImM0MjU2ODU3LWViZmMtNDBhNC1iOGQxLTg5MDI5YmRlODAyMSIsImlzcyI6IkFFTUVUIiwiaWF0IjoxNTg4MTUwOTQ2LCJ1c2VySWQiOiJjNDI1Njg1Ny1lYmZjLTQwYTQtYjhkMS04OTAyOWJkZTgwMjEiLCJyb2xlIjoiIn0.Jp8C2P-zxJqxN-hmtow0O9fLNyyWxu30xUk-J0AewJY';

function cargarDatosAemet() {

    const url = `https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/18066?api_key=${api_key}`;
    let xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.addEventListener('readystatechange', function() {
        if (this.readyState === 4) {
            obtenerDatos(JSON.parse(xhr.responseText).datos)
                .then(datos => mostrarTiempo(datos.datos[0]))
                .catch(err => console.log(err))
                
        }         
    })
    xhr.open('GET', url);
    xhr.setRequestHeader('cache-control', 'no-cache')
    xhr.send(null)


    // Obtener la temp actual del pueblo
    const urlTempActual = `https://opendata.aemet.es/opendata/api/observacion/convencional/datos/estacion/5530E/?api_key=${api_key}`
    let xhrTemp = new XMLHttpRequest();
    xhrTemp.withCredentials = true;
    xhrTemp.addEventListener('readystatechange', function() {
        if (this.readyState === 4){
            obtenerDatos(JSON.parse(this.responseText).datos)
                .then( datos => mostrarTempActual(datos.datos))
                .catch( err => console.log(err))
        }
    })
    xhrTemp.open('GET', urlTempActual);
    xhrTemp.setRequestHeader('cache-control', 'no-cache');
    xhrTemp.send(null);

}

 async function obtenerDatos(url) {
    
    const obtenerTiempo = await fetch(url);
    const datos = await obtenerTiempo.json();

    return {
        datos
    }
}

const divTiempo  = document.querySelector('.elTiempo');
const tempMaxima = document.querySelector('#maxima');
const tempMinima = document.querySelector('#minima');
const text       = document.querySelector('.texto');
const imagen     = document.querySelector('.icono-tiempo img');

function mostrarTiempo(datos) {

    const { dia } = datos.prediccion;
    const hoy = new Date().getTimezoneOffset()


    let tiempoHoy = [];
    dia.forEach( dia => {
        let fecha = new Date(dia.fecha);
        if (fecha.getDate() === new Date().getDate()) {
            tiempoHoy.push(dia);
        }
    });


    const { maxima, minima } = tiempoHoy[0].temperatura
    const { estadoCielo } = tiempoHoy[0];
    
    const ahora = new Date().getHours();
    // Mostrar Temperaturas máximas
    tempMaxima.innerHTML = maxima + "º";
    tempMinima.innerHTML = " / " + minima + "º";

    // Obtener el estado del cielo
    // Periodos ["00-06", "06-12", "12-18", "18-24"];
    const cieloHoy = estadoCielo.filter(e => e.descripcion !== "" )
    let textoTiempo = '';    
    
    if ( cieloHoy.descripcion !== "") {
        
        for (let i = 0; i < cieloHoy.length; i++) {
            const cielo = cieloHoy[i];
            if ( cielo.periodo === "00-06" && (ahora >= '0' && ahora < '6' ) ) {
                textoTiempo = cielo.descripcion        
            } else if ( cielo.periodo === "06-12" && (ahora >= '6' && ahora < '12' ) ) {
                textoTiempo = cielo.descripcion  
            } else if ( cielo.periodo === "12-18" && (ahora >= '12' && ahora < '18' ) ) {
                textoTiempo = cielo.descripcion
            } else if ( cielo.periodo === "18-24" && (ahora >= '18' && ahora < '24' ) ) {
                textoTiempo = cielo.descripcion
            }
        }

    } else {
        textoTiempo = "Soleado";
    }
    // Mostrar texto del tiempo
    text.innerHTML = textoTiempo;
    
    // Comprobar el texto para cambiar el svg al correcto
    let iconosEstado = [
        {
            estado: 'Despejado',
            src: 'img/icons/day.svg',
            bg: 'bg-soleado'
        },
        {
            estado: 'Despejado noche',
            src: 'img/icons/night.svg',
            bg: 'bg-noche'
        },
        {
            estado: ['Poco nuboso', 'Nubes altas', 'Niebla', 'Bruma', 'Calima'],
            src: 'img/icons/cloudy-day-1.svg',
            bg: 'bg-pocoNublado'
        },
        {
            estado: ['Poco nuboso noche', 'Nubes altas noche'],
            src: 'img/icons/cloudy-night-1.svg',
            bg: 'bg-pocoNublado'
        },
        {
            estado: 'Intervalos nubosos',
            src: 'img/icons/cloudy-day-2.svg',
            bg: 'bg-pocoNublado'
        },
        {
            estado: 'Intervalos nubosos noche',
            src: 'img/icons/cloudy-night-2.svg',
            bg: 'bg-pocoNublado'
        },
        {
            estado: 'Nuboso',
            src: 'img/icons/cloudy.svg',
            bg: 'bg-nublado'
        },
        {
            estado: 'Nuboso noche',
            src: 'img/icons/cloudy.svg',
            bg: 'bg-nublado'
        },
        {
            estado: ['Muy nuboso', 'Cubierto'],
            src: 'img/icons/cloudy.svg',
            bg: 'bg-nublado'
        },
        {
            estado: 'Intervalos nubosos con lluvia escasa',
            src: 'img/icons/rainy-2.svg',
            bg: 'bg-nublado'
        },
        {
            estado: ['Intervalos nubosos con lluvia escasa noche', 'Nuboso con lluvia escasa noche' ,'Muy nuboso con lluvia escasa', 'Cubierto con lluvia escasa', 'Intervalos nubosos con lluvia noche', 'Nuboso con lluvia noche'],
            src: 'img/icons/rainy-4.svg',
            bg: 'bg-nublado'
        },
        {
            estado: ['Nuboso con lluvia escasa', 'Intervalos nubosos con lluvia', 'Nuboso con lluvia'],
            src: 'img/icons/rainy-3.svg',
            bg: 'bg-nublado'
        },
        {
            estado: 'Muy nuboso con lluvia',
            src: 'img/icons/rainy-5.svg',
            bg: 'bg-nublado'
        },
        {
            estado: 'Cubierto con lluvia',
            src: 'img/icons/rainy-6.svg',
            bg: 'bg-nublado'
        },
        {
            estado: ['Intervalos nubosos con nieve escasa', 'Intervalos nubosos con nieve escasa noche', 'Intervalos nubosos con nieve', 'Intervalos nubosos con nieve noche'],
            src: 'img/icons/snowy-2.svg',
            bg: 'bg-nieve'
        },
        {
            estado: ['Nuboso con nieve escasa', 'Nuboso con nieve escasa noche', 'Nuboso con nieve', 'Nuboso con nieve noche'],
            src: 'img/icons/snowy-3.svg',
            bg: 'bg-nieve'
        },
        {
            estado: ['Muy nuboso con nieve escasa', 'Cubierto con nieve escasa'],
            src: 'img/icons/snowy-4.svg',
            bg: 'bg-nieve'
        },
        {
            estado: ['Muy nuboso con nieve', 'Cubierto con nieve'],
            src: 'img/icons/snowy-6.svg',
            bg: 'bg-nieve'
        },
        {
            estado: ['Intervalos nubosos con tormenta', 'Intervalos nubosos con tormenta noche', 'Nuboso con tormenta', 'Nuboso con tormenta noche', 'Muy nuboso con tormenta', 'Cubierto con tormenta', 'Intervalos nubosos con tormenta y lluvia escasa', 'Intervalos nubosos con tormenta y lluvia escasa noche', 'Nuboso con tormenta y lluvia escasa', 'Nuboso con tormenta y lluvia escasa noche', 'Muy nuboso con tormenta y lluvia escasa', 'Cubierto con tormenta y lluvia escasa'],
            src: 'img/icons/thunder.svg',
            bg: 'bg-nublado'
        },
    ];

    let icono = '';
    for (let i = 0; i < iconosEstado.length; i++) {
        const e = iconosEstado[i];       
        if ( e.estado == textoTiempo) {
            icono = e;
        } else {
            if (Array.isArray(e.estado)) {
                for (let x = 0; x < e.estado.length; x++) {
                    const a = e.estado[x]
                    if ( a == textoTiempo) {
                        icono = e;
                    }
                }
            }
        }
    }


    imagen.setAttribute('src', icono.src);
    imagen.style.opacity = 1;
    divTiempo.classList.add(icono.bg);

}

const tempActualDiv = document.querySelector('.tempActual');
function mostrarTempActual(datos){

    let hoy = new Date();
    let tempActual = '';
    
    tempActual = datos.filter(x => hoy.getHours() <= new Date(x.fint).getHours());
    tempActualDiv.innerHTML = Math.round(tempActual[0].ta) + 'º';
    
}
