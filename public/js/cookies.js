
let cookieBox = document.querySelector('#cookies');
let aceptar = document.querySelector('#btn-cookie-aceptar');
let cookiesInnecesarias = document.querySelector('#cookies-innecesarias');

document.addEventListener('DOMContentLoaded', () => {
    checkCookies();
});

aceptar.addEventListener('click', () => {
    setCookieVisto();
    setCookies();
});

function setCookies(){
    let html = 
        `
        <!-- Global site tag (gtag.js) - Google Analytics -->
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-2691D74HQ0"></script>
        <script>
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-2691D74HQ0');
        </script>
        `;
    if (cookiesInnecesarias.checked){
        html += 
            `<script>
                <!-- COOKIES INNECESARIAS AQUÍ -->
            </script>`;
    }
    //document.getElementById('scripts-here').innerHTML += html;
    document.head.innerHTML += html;
}

function muestraCookieBox() {
    cookieBox.classList.add('fadeIn');
}
function ocultaCookieBox(){
    cookieBox.classList.remove('fadeIn');
    cookieBox.classList.add('fadeOut');
    setTimeout(() => {
        cookieBox.classList.remove('fadeOut');
    }, 900);
}
function setCookieVisto() {
    //Cookie cuando has visto y aceptado las cookies
    let expDate = new Date();
    //Un año para el banner de politica de privacidad
    expDate.setTime(expDate.getTime() + 364 * 24 * 60 * 60 * 1000);
    let options = "expires="+expDate.toUTCString();
    document.cookie = "visto_politica_privacidad=yes;"+options;
    ocultaCookieBox();
}
function checkCookies() {
    let cookies = document.cookie;
    if (cookies == '') muestraCookieBox();
    else setCookies();
}
