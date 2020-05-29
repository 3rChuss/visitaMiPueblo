const Subscriptions = require('../models/Subscriptions'),
            webpush = require('web-push');

exports.saveSubscription = (req, res) => {
    if(!isValidSaveRequest(req, res)) {
        return;
    }
    const guardar = Subscriptions.create({
        content: JSON.stringify(req.body)
    }).then(result => console.log(result));

    return saveSubToDataBase(req.body)
        .then((subscriptionId) => {
            console.log('then esta dentro');
            
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify({ data: { success: true } }));
        })
        .catch(err => {
            res.status(500);
            res.setHeader('Content-Type', 'application/son');
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
       content: subscription
   }).then(result => {
       return result;
   })
}

exports.triggerPushMessage = (req, res) => {
    return getSubscriptionsFromDB()
        .then(subscriptions => {
            let promiseChain = Promise.resolve();

            for (let i = 0; i < subscriptions.length; i++) {
                const subscription = subscriptions[i];
                promiseChain = promiseChain.then(() => {
                    return triggerPushMsg(subscription, dataToSend)
                });
            }
            return promiseChain;
        })
}

const triggerPushMsg = (subscription, dataToSend) => {
    return webpush.sendNotification(subscription, dataToSend)
        .catch((err) => {
            if (err.statusCode === 404 || err.statusCode === 410) {
                console.log('Subscripcion expirada o no valida, ' + err);
                return deleteSubFromDB(subscription._id);
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
        console.log(res);
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