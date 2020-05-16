const btnHabilitaFormRegistrar = document.querySelector('#btn-form-habilitar');
const btnHabilitaFormEditar = document.querySelector('#editar-user');
const formRegistrar = document.querySelector('#form-registrar'); 
const passwdTable = document.querySelector('.hidetext');

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
})