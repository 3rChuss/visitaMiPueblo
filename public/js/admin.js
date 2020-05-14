const btnHabilitaForm = document.querySelector('#btn-form-habilitar');
const formulario = document.querySelector('#form-registrar');
const passwdTable = document.querySelector('.hidetext');

btnHabilitaForm.addEventListener('click', () => {
    console.log('click')
    formulario.removeAttribute('disabled');
})