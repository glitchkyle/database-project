import { Channel, Connection, connect } from "amqplib";

import { MESSAGE_QUEUE_URL } from "../config/config";
import { ErrorResponse } from "../utils/errorResponse";

async function send() {
    const queue = "tasks";

    let conn: Connection;
    let channel: Channel;

    if (!MESSAGE_QUEUE_URL) {
        throw new ErrorResponse("No Message Queue URL provided", 500);
    }

    try {
        conn = await connect(MESSAGE_QUEUE_URL);
    } catch (e) {
        throw e;
    }

    try {
        channel = await conn.createChannel();
    } catch (e) {
        throw e;
    }

    channel.sendToQueue(queue, Buffer.from("Hello World!"));

    return;
}

send()
    .then(() => {
        console.log("Finished sending message");
    })
    .catch(() => {
        console.log("Something went wrong");
    });
