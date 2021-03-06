import express from 'express'
import { sendMessage } from '../config/rabbitmq.js';
import { randomBytes } from 'crypto';
import { getFromRedis, errorResponse, successResponse } from '../utils.js'
const router = express.Router();

router.post("/submit", async (req, res) => {
    try {
        var host = req.headers.host;
        var origin = req.headers.origin;

        console.log(host);
        console.log(origin);

        let data = {
            'src': req.body.src,
            'input': req.body.stdin,
            'lang': req.body.lang,
            'timeOut': req.body.timeout,
            'folder': randomBytes(10).toString('hex')
        }
        console.log(data)
        await sendMessage(data);
        res.status(202).send(successResponse(`https://rec-server.onrender.com/results/${data.folder}`));
    } catch (error) {
        console.log(error);
        res.status(500).send(errorResponse(500, "System error"));
    }

});

router.get("/results/:id", async (req, res) => {

    try {
        let key = req.params.id;
        let status = await getFromRedis(key);

        if (status == null) {
            res.status(202).send({ "status": "Queued" });
        }
        else if (status == 'Processing') {
            res.status(202).send({ "status": "Processing" });
        }
        else {
            status = JSON.parse(status);
            res.status(200).send(successResponse(status));
        }
    } catch (error) {
        res.status(500).send(errorResponse(500, "System error"));
    }

});

router.get('/heart_beat',async(req,res)=>{
    res.status(200).send(successResponse("Roger that !"))
})

router.get('/loaderio-49bd382af592331e780c13f4da135f33',async(req,res)=>{
    res.send('loaderio-49bd382af592331e780c13f4da135f33')
})

export const coreRoutes = router;
