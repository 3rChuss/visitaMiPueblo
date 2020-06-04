
/**
 * Insertar el html del post formateado en /post
 */
    if ( window.location.pathname === '/' || document.URL.indexOf('/post') > 1 ) {
        const postHtml = document.querySelectorAll('#post');
        const padre = document.querySelectorAll('#post-html');
        for (let i = 0; i < postHtml.length; i++) {
            const post = postHtml[i];
            const div = document.createElement('p');
            div.innerHTML = post.textContent;
            div.setAttribute('id', 'formatPost');
            post.remove();
            padre[i].appendChild(div)
        }

        const btnEleminarPost = document.querySelector('#eliminar-post');
        const aEliminar = document.querySelector('#aeliminar');
        if (btnEleminarPost != null){
            let id = aEliminar.getAttribute('href');
            btnEleminarPost.addEventListener('click', (e) => {
                let respuesta = confirm('🚫¿Estas seguro de querer borrar este post?🚫');
                e.preventDefault();
                if (respuesta)
                    window.location.href="/api/eliminar-post?id="+id;
            })
        }

    }

// Slider
    let slideIndex = 0;
    function slider() {
        let imgs = document.querySelectorAll('.carousel-item');
        for(let i = 0; i < imgs.length; i++){
            imgs[i].style.display = 'none';
        }
        slideIndex++;
        if (slideIndex > imgs.length) slideIndex = 1;
        imgs[slideIndex-1].style.display = 'block';
        setTimeout(slider, 6000);
    }
    slider();

const loginForm = document.querySelector('#loginForm');
const loginBtn = document.querySelector('#loginBtn');
const backToTop = document.querySelector('#back-to-top');

/**
  * Events Listeners
  */

 document.addEventListener('DOMContentLoaded', (e) => {
    if ( document.location.pathname === '/')
        cargarDatosAemet();
    
    if (loginBtn != null)
        loginBtn.addEventListener('click', mostrarForm);
    window.onscroll = function() {this.scrollToTop()}

    
    setTimeout(console.log("%cPARA! Estás apunto de entrar en un mundo del que no podrás SALIR! \nSígueme en twitter: 'https://twitter.com/3rChuss' ", "font-size: 25px; color: #FA45FF;" ) , 0);
});

function scrollToTop () {
    if (document.body.scrollTop > 600 || document.documentElement.scrollTop > 600) {
        backToTop.style.display = 'block';
    } else {
        backToTop.style.display = 'none';
    }
  }

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


/***
 * CARGAMOS EL SERVICE WORKER
 */

window.addEventListener('load', e => {
    registerSW(); 
  });

async function registerSW() { 
    if ('serviceWorker' in navigator) { 
        try {
            await navigator.serviceWorker.register('/sw.js')
        } catch (err) {
            alert('ServiceWorker a fallado'); 
            console.log(err)
        }
    } else {
        subscribePush();
    }
}

// Muestra el mensaje de A2HS
let deferredPrompt;
const addBtn = document.querySelector('#bannerInstalar');
addBtn.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    addBtn.style.display = "flex";
    addBtn.addEventListener('click', (e) => {
        addBtn.style.display = "none";

        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choise) => {
            if (choise.outcome === "accepted") {
                console.log('Aceptado A2HS');
            } else {
                console.log('No aceptado A2HS');
            }
            deferredPrompt = null;
        })
    })
})


// Notificaciones
const PUBLIC_VAPID_KEY = 'BP0ZBUA0FACIyUNfB9wE_ER2NoWcsex_E2eyWA9gSGtLHEtwQuw-g8nOtAYtZ2tjF1Y9Fdl4jlLWrxTpLWcTah0';
function subscribePush () {
    return navigator.serviceWorker.ready.then(function(registration) {
        if (!registration.pushManager) {
            console.error('No soportado');
            return false;
        }
        const subscribeOptions = {
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(PUBLIC_VAPID_KEY)
        };
        return registration.pushManager.subscribe(subscribeOptions);
    })
    .then(function (pushSubscription) {
        sendSubToBackEnd(pushSubscription)
        return pushSubscription;
    })
}

function sendSubToBackEnd(subscription) {
    return fetch('/api/save-subcription/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(subscription)
    }).then(response => {
        if(!response.ok) {
            throw new Error('Bad status code from server.');
        }
        return response.json();
    })
    .then(responseData => {
        if(!(responseData.data && responseData.data.success)) {
            throw new Error('Bad response from server')
        }
    });
}

/**
 * urlBase64ToUint8Array
 * 
 * @param {string} base64String a public vavid key
 */
function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function unsubscribePush () {
    navigator.serviceWorker.ready
        .then(registration => {
            registration.pushManager.getSubscription()
            .then(subscription => {
                if(!subscription) {
                    console.log('no se ha podido eliminar el registro push')
                    return;
                }
                subscription.unsubscribe()
                .then( () => {
                    console.info('Push notification unsubscribed.');
                    changePushStatus(false);
                })
                .catch(function (error) {
                    console.error(error);
                });
            })
            .catch(function (error) {
                console.error('Failed to unsubscribe push notification.');
            });
        })
  }


window.addEventListener('appinstalled', (evt) => {
    console.log('INSTALL: Success');
    subscribePush();
  });