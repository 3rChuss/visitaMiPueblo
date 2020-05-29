
/**
 * Insertar el html del post formateado en /post
 */
    if ( window.location.pathname === '/' || document.URL.indexOf('/post') > 1 ) {
        const div = document.createElement('p');
        const postHtml = document.querySelector('#post');
        const padre = document.querySelector('#post-html');
            div.innerHTML = postHtml.textContent;
            padre.appendChild(div);
            postHtml.remove();
    }


const loginForm = document.querySelector('#loginForm');
const loginBtn = document.querySelector('#loginBtn');
const backToTop = document.querySelector('#back-to-top');
/**
  * Events Listeners
  */

 document.addEventListener('DOMContentLoaded', (e) => {
    if ( document.location.pathname === '/')
        cargarDatosAemet();
    
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

function askPermission() {
    if ('PushManager' in window) {
        return new Promise(function(resolve, reject) {
            const permissionResult = Notification.requestPermission(function(result) {
                resolve(result);
            });
            if (permissionResult) {
                permissionResult.then(resolve, reject);
            }
         })
        .then(function(permissionResult) {
            if (permissionResult !== 'granted') {
                throw new Error('Sin permiso para notificaciones');
            }
        });
    } else {
        //No compatible
        return;
    }
  }

function subscribePush () {
    return navigator.serviceWorker.ready.then(function(registration) {
        if (!registration.pushManager) {
            console.error('No soportado');
            return false;
        }
        const subscribeOptions = {
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array('BAFaA-0JT7HvgWDNkmsmAIwbSjWVwtjJROECaF6Dj7Wx2mumA32D7hVi2WpFscRuqFeje0ikE3lx0eOiJRAgE4c')
        };
        return registration.pushManager.subscribe(subscribeOptions);
    })
    .then(function (pushSubscription) {
        console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
        sendSubToBackEnd(pushSubscription)
        return pushSubscription;
    })
}

//RECOJEMOS LA SUSCRIPCION Y LA ENVIAMOS AL SERVER
// const subscriptionObject = {
//     endpoint: pushSubscription.endpoint,
//     keys: {
//         p256dh: pushSubscription.getKeys('p256dh'),
//         auth: pushSubscription.getKeys('auth')
//     }
// }

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
        return response.json;
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
                    console.log(subscription);
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



// function showNotifications() {
//     Notification.requestPermission((result) => {
//         if (result === 'granted') {
//             navigator.serviceWorker.getRegistration().then((registration) => {
//                 registration.showNotification('Vibration sample', {
//                     "body": 'Buzz buzz',
//                     "vibrate": [200, 100, 200, 100, 200, 100, 400],
//                     "tag": 'vibration-sample'
//                 })
//             })
//         }
//     })
// }