const Subscriptions = require('../models/Subscriptions'),
            webpush = require('web-push');

exports.saveSubscription = (req, res) => {
    if(!isValidSaveRequest(req, res)) {
        return;
    }

    return saveSubToDataBase(req.body)
        .then((subscriptionId) => {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ data: { success: true } }));
            console.log('[saveSubToDataBase] Subscripcion guardada en la base de datos');
            //TriggerPushMsg(req.body,  )
        })
        .catch(err => {
            res.status(500);
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({
                error: {
                    id: 'unable-to-save-subscription',
                    message: 'The subscription was received but we were unable to save it to our database.'
                }
            }))
        })
}


function saveSubToDataBase(subscription) {
    return Subscriptions.create({
       content: JSON.stringify(subscription)
   })
}

exports.triggerPushMessage = (req, res) => {
    const dataToSend = req.body;
    return getSubscriptionsFromDB()
        .then(subscriptions => {
            console.log('[TriggerPushMessage] Subscripciones recividas desde la base de datos');
            let promiseChain = Promise.resolve();

            for (let i = 0; i < subscriptions.length; i++) {
                const subscription = subscriptions[i];
                promiseChain = promiseChain.then(() => {
                    return triggerPushMsg(subscription, JSON.stringify(dataToSend))
                });
            }
            return promiseChain;
        })
}

const getSubscriptionsFromDB = async () => {
    return await Subscriptions.findAll();
}


const triggerPushMsg = (subscription, dataToSend) => {
    console.log('[triggerPushMsg] Enviando las notificaciones subscritas');
    return webpush.sendNotification(JSON.parse(subscription.content), dataToSend)
        .catch((err) => {
            if (err.statusCode === 404 || err.statusCode === 410) {
                console.log('Subscripcion expirada o no valida, ' + err);
                return deleteSubFromDB(subscription.id);
            } else {
                throw err;
            }
        })
}


async function deleteSubFromDB (subscriptionId) { 
    await Subscriptions.destroy({
        where: {
            id: subscriptionId
        }
    })
    .then(res => {
        if (res === 1){
            console.log('[deleteSubFromDb] Subscripcion borrada porque no era valida');
        }
    })
 }


const isValidSaveRequest = (req, res) => {
    if (!req.body || !req.body.endpoint) {
        //Subscripción No valida
        res.status(400);
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({
            error: {
                id: 'no-endpoint',
                messaage: 'Subcriciones deben tener un en-point'
            }
        }));
        return false;
    }
    return true;
}