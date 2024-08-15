import 'dotenv/config';
import { vcr, Voice } from "@vonage/vcr-sdk";
import { Vonage } from "@vonage/server-sdk";
import { fileURLToPath } from "url";
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import { getSipInfo, generateJwt, getDomainInfo } from "./helpers/helpers.js";
import CSVManager from './helpers/csvManager.js';
import brands from './routes/brands.js';
import calls from './routes/calls.js';


const app = express();
const port = process.env.VCR_PORT || process.env.PORT || 3000;

const applicationId = process.env.API_APPLICATION_ID || process.env.VONAGE_APPLICATION_ID;
const privateKey = process.env.PRIVATE_KEY || fs.readFileSync(process.env.VONAGE_PRIVATE_KEY_PATH);
const sipDomain = process.env.SIP_DOMAIN_NAME;

const vonage = new Vonage(
    {
        applicationId: applicationId,
        privateKey: privateKey
    }
);

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.use('/', calls);
app.use('/', brands);
 
if (process.env.CSV_STORAGE !== 'true') {
    const voice = new Voice(vcr.getGlobalSession());
    await voice.onCall('/voice/answer');
    await voice.onCallEvent({ callback: '/voice/event' });
} else {
    const manager = new CSVManager('./data.csv');
}

app.get('/_/health', async (req, res) => {
    res.sendStatus(200);
});

app.get('/_/metrics', async (req, res) => {
    res.sendStatus(200);
});

app.post('/user', async (req, res, next) => {
    try {
        const username = req.body.username;
        await vonage.users.createUser({ name: username, displayName: username })
        const jwt = generateJwt(username);
        res.json({
            token: jwt
        });
    } catch (error) {
        next(error);
    }
});

app.get('/token', async (req, res, next) => {
    try {
        const username = req.query.username;
        const jwt = generateJwt(username);
        res.json({
            token: jwt
        });
    } catch (error) {
        next(error);
    }
});

app.get('/docs', (req, res) => {
    res.sendFile(path.join(__dirname, "/docs.md"));
});

app.get('/settings', async (req, res, next) => {
    try {
        let settingsObj = {
            sip_trunk_link: `https://dashboard.nexmo.com/sip-trunking/trunk/${sipDomain}`
        };

        try {
            const sipUri = await getSipInfo();
            if (sipUri) {
                settingsObj['sip_uri'] = sipUri;
            }

            const domainInfo = await getDomainInfo();

            if (domainInfo) {
                const correctAppId = domainInfo.application_id == applicationId;
                settingsObj['configured_correctly'] = correctAppId ? true : false;
            }

            res.json(settingsObj);
        } catch (e) {
            settingsObj['sip_uri'] = `Error getting your domain: "${sipDomain}". Check your configuration`;
            res.json(settingsObj);
        }
    } catch (e) {
        next(e);
    }
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});