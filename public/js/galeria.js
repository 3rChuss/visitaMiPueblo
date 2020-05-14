
 
/** 
 * Galeria
*/

const contenedorFoto = document.querySelector('.modal');
const fotoInsertar = document.querySelector('.modal-content');
const fotosGaleria = document.querySelectorAll('.galeria img');

/**
  * Events Listeners
  */
document.addEventListener('DOMContentLoaded', () => {


    fotosGaleria.forEach(function(img){
        img.onload = function() {
            setInterval(() => {
                img.style.opacity = 1;
            }, 500);
        }
        img.addEventListener('click', e => {
            abrirFoto(e.target.getAttribute('src'));
        })
    })

});

/**
  * Events Funciones
  */

function abrirFoto(url) {
    if (contenedorFoto.classList.contains('fadeOut')) contenedorFoto.classList.remove('fadeOut')
    contenedorFoto.classList.add('fadeIn')
    contenedorFoto.style.display = "block";
    fotoInsertar.setAttribute('src', url);
}
const span = document.querySelector('.close');
span.onclick = function () {
    if (contenedorFoto.classList.contains('fadeIn')) contenedorFoto.classList.remove('fadeIn')
    contenedorFoto.classList.add('fadeOut')
    setTimeout(() => {
        contenedorFoto.style.display = "none";
    }, 800);
  }

  function lazyLoad(){
      console.log('lazyload');
      
  }