const btnHabilitaFormRegistrar = document.querySelector('#btn-form-habilitar');
const btnHabilitaFormEditar = document.querySelector('#editar-user');
const formRegistrar = document.querySelector('#form-registrar'); 
const passwdTable = document.querySelector('.hidetext');
const iconoVerPassword = document.querySelector('#verPasswrd');
const inputPassword = document.querySelector('#passwdInput');
const iconoEliminarUser = document.querySelector('#eliminar-user');
const iconoCancelarEdit = document.querySelector('#cancelar-edit');
const iconoEditarUser = document.querySelector('#editar-user');
const botonEnviar = document.querySelector('#boton-enviar');

btnHabilitaFormRegistrar.addEventListener('click', () => {
    formRegistrar.removeAttribute('disabled');
})

btnHabilitaFormEditar.addEventListener('click', (e) => {
    const userRow = e.target.parentElement.parentElement;
    const inputs = userRow.getElementsByTagName('input');
    for (let e of inputs) {
        e.removeAttribute('disabled')
    }
    document.querySelector('#aceptar-user').style.display = "inherit";
    iconoEliminarUser.style.display = "inline";
    iconoCancelarEdit.style.display = "inline";
    iconoEditarUser.style.display = "none";
})

iconoCancelarEdit.addEventListener('click', (e) => {
    const userRow = e.target.parentElement.parentElement;
    console.log(userRow);
    
    const inputs = userRow.getElementsByTagName('input');
    for (let e of inputs) {
        e.setAttribute('disabled', 'disabled')
    }
    document.querySelector('#aceptar-user').style.display = "none";
    iconoEliminarUser.style.display = "none";
    iconoCancelarEdit.style.display = "none";
    iconoEditarUser.style.display = "inline";
})

iconoVerPassword.addEventListener('click', () => {
    if (inputPassword.type === 'password'){
        inputPassword.type = "text";
    } else {
        inputPassword.type = "password";
    }
})

botonEnviar.addEventListener('click', () => {

    Notification.requestPermission((result) => {
        console.log('enviando notificacion');

        if (result === 'granted') {
            navigator.serviceWorker.getRegistration().then((registration) => {
                registration.showNotification('Vibration sample', {
                    "body": 'Buzz buzz',
                    "vibrate": [200, 100, 200, 100, 200, 100, 400],
                    "tag": 'vibration-sample'
                })
            })
        } else {
            console.log('no enviada');
        }
    })
    
})