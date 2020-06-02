const btnHabilitaFormRegistrar = document.querySelector('#btn-form-habilitar');
const formRegistrar = document.querySelector('#form-registrar'); 
const passwdTable = document.querySelector('.hidetext');
const iconoVerPassword = document.querySelector('#verPasswrd');
const inputPassword = document.querySelector('#passwdInput');
const iconoEliminarUser = document.querySelectorAll('#eliminar-user');
const iconoCancelarEdit = document.querySelectorAll('#cancelar-edit');
const iconoEditarUser = document.querySelectorAll('#editar-user');
const iconoAceptarUser = document.querySelectorAll('#aceptar-user');
const botonEnviar = document.querySelector('#enviar-noticia');

if (document.URL.includes('panel-usuarios')) {
    btnHabilitaFormRegistrar.addEventListener('click', () => {
        formRegistrar.removeAttribute('disabled');
    })

    iconoEditarUser.forEach((element, i) => {
        element.addEventListener('click', (e) => {
            const userRow = e.target.parentElement.parentElement;
            console.log(userRow);
            const inputs = userRow.getElementsByTagName('input');
            for (let e of inputs) {
                e.removeAttribute('disabled')
            }

            iconoAceptarUser[i].style.display = "inherit";
            iconoEliminarUser[i].style.display = "inline";
            iconoCancelarEdit[i].style.display = "inline";
            iconoEditarUser[i].style.display = "none"; 
        });
    });

    iconoCancelarEdit.forEach((element, i) => {
        element.addEventListener('click', (e) => {
            const userRow = e.target.parentElement.parentElement;
            const inputs = userRow.getElementsByTagName('input');
            for (let e of inputs) {
                e.setAttribute('disabled', 'disabled')
            }

            iconoAceptarUser[i].style.display = "none";
            iconoEliminarUser[i].style.display = "none";
            iconoCancelarEdit[i].style.display = "none";
            iconoEditarUser[i].style.display = "inline";
        })
    })

    iconoVerPassword.addEventListener('click', () => {
        if (inputPassword.type === 'password'){
            inputPassword.type = "text";
        } else {
            inputPassword.type = "password";
        }
    })
}

/**
 * Habilitar calendario si se trata de un evento al crear un POST
 */

if (document.URL.includes('nuevo-post')) {
    const checkbox =  document.querySelector('#checkboxEvento');
    const fechaPicker = document.querySelector('#fechaEvento');
    const titulo = document.querySelector('#titulo');
    const subtitulo = document.querySelector('#subtitulo');

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

    botonEnviar.addEventListener('click', () => {
        
        fetch('/api/trigger-push-msg/', {
            method: 'POST',
            body: JSON.stringify({
                titulo: titulo.value,
                subtitulo: subtitulo.value
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    })
}
