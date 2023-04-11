import { Channel, Connection, connect } from "amqplib";

import Logger from "./logger";
import { MESSAGE_QUEUE_URL } from "./config";
import { ErrorResponse } from "../utils/errorResponse";

export async function initializeMessageQueue() {
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

    channel.assertQueue(queue);

    channel.prefetch(1);

    channel.consume(queue, (msg) => {
        if (msg) {
            Logger.debug(`Received ${msg.content.toString()}`);
            channel.ack(msg);
            // TODO: Preprocess data and store in graph database
        } else {
            Logger.error("Consumer cancelled by server");
        }
    });
}
