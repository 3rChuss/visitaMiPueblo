async function fetchDatos () {
        const url = 'https://servicios.ine.es/wstempus/js/ES/DATOS_METADATAOPERACION/DPOP?g1=19:2410&g2=18:451&g3=34:8677&g4=3:20258&p=12&nult=1';
        let response = await fetch(url);
        let datos = await response.json();
        return datos;
}


const habitantes = document.querySelector('#poblacion');
const anio = document.querySelector('#anio');

document.addEventListener('DOMContentLoaded', () => {
    fetchDatos()
        .then(datos => {
            habitantes.innerHTML = datos[0].Data[0].Valor;
            anio.innerHTML = datos[0].Data[0].Anyo;
        })
        .catch(err => console.log(err) )
})

