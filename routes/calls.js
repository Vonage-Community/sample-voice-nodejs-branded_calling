import { vcr } from '@vonage/vcr-sdk';
import express from "express";

import { getSipInfo } from "../helpers/helpers.js";
import { getBrand } from "../helpers/storage.js";

const router = express.Router();
const state = vcr.getInstanceState();

router.post('/voice/answer', async (req, res, next) => {
    try {
        console.log('NCCO request:');
        console.log('to: ', req.body.to);
        console.log('from: ', req.body.from);
        console.log('from_user: ', req.body.from_user);
        console.log('body: ', req.body);

        // App user calling
        if (req.body.from_user) {
            console.log('App -> SIP Flow');
            const sipUri = await getSipInfo();
            const brandObj = await getBrand(req.body.to);
            console.log('brand: ', brandObj);
    
            if (brandObj) {
                res.json([{
                    "action": "connect",
                    "from": req.body.from_user,
                    "endpoint": [
                        {
                            "type": "sip",
                            "uri": sipUri,
                            "headers": brandObj
                        }
                    ]       
                }]);
                return;
            }
        }

        // SIP user calling
        if (req.body.from) {
            console.log('SIP -> App Flow');
            const brandObj = await getBrand(req.body.from);
            console.log('brand: ', brandObj);

            if (brandObj) {
                res.json([{
                    "action": "connect",
                    "from": brandObj.brand,
                    "endpoint": [
                        {
                            "type": "app",
                            "user": req.body.to
                        }
                    ]       
                }]);
                return;
            }
        }

        res.json([{
            "action": "talk",
            "text": "Sorry, the call can not be connected. Try again"      
        }]);

    } catch (error) {
        next(error);
    }
});

router.post('/voice/event', (req, res, next) => {
    try {
        console.log('EVENT:');
        console.log(JSON.stringify(req.body));
        console.log('---');
    } catch (error) {
        next(error);
    }
});

export default router;