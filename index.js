const express = require('express')
const {RtcTokenBuilder, RtcRole} = require('agora-access-token')

const PORT =8080;

const APP_ID = "fdd42680b3304d3b9dd01ab3c4538738";
const APP_CERTIFICATE = "73ae3f3da2a748788cabe203f2bd327c";

const app = express();

const nocache = (req, resp, next) => {
    resp.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    resp.header('Expires', '-1');
    resp.header('Pragma', 'no-cache');
    next();
    }

const generateAccessToken = (req, resp) => {

    resp.header('Acess-Control-Allow-Origin', '*'); 
    const channelName = req.query.channelName;
    if (!channelName) {
        return resp.status(500).json({ 'error': 'channel is required' });
    }

    // get uid
    let uid = req.query.uid;
    if(!uid || uid == '') {
    uid=0;
    }
    // get role
    let role = RtcRole.SUBSCRIBER;
    if (req.query.role == 'publisher') {
        role = RtcRole.PUBLISHER;
    }

    // get the expire time

    let expireTime = req.query.expireTime; if 
    (!expireTime || expireTime =='') {
        expireTime = 3600;
    } else {
        expireTime = parseInt(expireTime, 10);
    }    
        // calculate privilege expire time
    const currentTime = Math.floor(Date.now() / 1000);
    const privilegeExpireTime = currentTime + expireTime;  
        // build the token
    const token = RtcTokenBuilder.buildTokenWithUid(APP_ID,APP_CERTIFICATE,channelName, uid, role ,privilegeExpireTime)
        // return the token
    return resp.json({'token': token})
}   
app.get('/access_token', nocache, generateAccessToken);
app.listen(PORT, () => {
console.log(`Listening on port: ${PORT}`);
});