/**
 * Habilitar calendario si se trata de un evento al crear un POST
 */
    const checkbox =  document.querySelector('#checkboxEvento');
    const fechaPicker = document.querySelector('#fechaEvento');
    if (document.URL.indexOf('nuevo-post') > 0 ) {
        fechaPicker.disabled = true;
        checkbox.addEventListener('change', () => {
            toggleFechaPicker();
        })
    }

    const toggleFechaPicker = () => {
        checkbox.checked ? fechaPicker.disabled = false : fechaPicker.disabled = true;
        fechaPicker.value = "";
    }


/**
 * Insertar el html del post formateado en /post
 */

 const div = document.createElement('p');
 const postHtml = document.querySelector('#post');
 const padre = document.querySelector('#post-html');
    div.innerHTML = postHtml.textContent;
    padre.appendChild(div);
    postHtml.remove();



const loginForm = document.querySelector('#loginForm');
const loginBtn = document.querySelector('#loginBtn');
/**
  * Events Listeners
  */

 document.addEventListener('DOMContentLoaded', () => {
    if ( document.location.pathname === '/')
        cargarDatosAemet();
    loginBtn.addEventListener('click', mostrarForm);
    
});


function collapse() {
    let colapsable = document.querySelector('.colapsable');
    let navegacion = document.querySelector('.navegacion');
    if (!colapsable.classList.contains('responsive')) {
        colapsable.className += ' responsive'
        navegacion.style.height = '320px';
    } else {
        colapsable.classList.remove('responsive');
        navegacion.style.height = '100px';
    }
}

function mostrarForm() {
    if ( !loginForm.classList.contains('fadeIn' ) ) {
        loginBtn.style.display = "none";
        loginForm.style.display = "block";
        loginForm.classList.add('fadeIn');
    } else {
        loginForm.classList.remove('fadeIn');
        loginForm.style.display = "none";
        loginBtn.style.display = "block";
    }
  }
