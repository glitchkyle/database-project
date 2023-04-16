import { Channel, Connection, connect } from "amqplib";

import Logger from "./logger";
import { MESSAGE_QUEUE_URL } from "./config";
import { ErrorResponse } from "../utils/errorResponse";
import { IVaccinationPayload } from "../types/vaccination.type";
import { createManyTestData, createManyVaccinationData } from "../services/hospital.service";
import { IHospitalPayload } from "../types/hospital.type";
import { createManyHospitalData } from "../services/hospital.service";
import { ITestPayload } from "../types/test.type";

async function initializeVaccinationQueue(conn: Connection) {
    const exchangeName = "vax_list";
    let channel: Channel;

    try {
        channel = await conn.createChannel();
    } catch (e) {
        throw e;
    }

    try {
        await channel.assertExchange(exchangeName, "topic", { durable: false });
    } catch (e) {
        throw e;
    }

    try {
        const { queue } = await channel.assertQueue("", { exclusive: true });

        const bindingKeys = ["#"];
        for (const bindingKey of bindingKeys) {
            await channel.bindQueue(queue, exchangeName, bindingKey);
        }

        channel.consume(queue, (msg) => {
            if (msg) {
                const vaccinationPayload: IVaccinationPayload[] = JSON.parse(
                    msg.content.toString()
                );
                Logger.debug(
                    `Message Queue: Received ${vaccinationPayload.length} vaccination data`
                );
                if (vaccinationPayload.length > 0) {
                    createManyVaccinationData(vaccinationPayload);
                }
            }
        });
    } catch (e) {
        throw e;
    }
}

async function initializePatientQueue(conn: Connection) {
    const exchangeName = "patient_list";
    let channel: Channel;

    var oldZipMap = new Map<Number, Number>();
    var alertMap = new Map<Number, Number>();
    var zipList: Number[] = [];
    var then = new Date()
    var testInt = 2;

    try {
        channel = await conn.createChannel();
    } catch (e) {
        throw e;
    }

    try {
        await channel.assertExchange(exchangeName, "topic", { durable: false });
    } catch (e) {
        throw e;
    }

    try {
        const { queue } = await channel.assertQueue("", { exclusive: true });

        const bindingKeys = ["#"];
        for (const bindingKey of bindingKeys) {
            await channel.bindQueue(queue, exchangeName, bindingKey);
        }

        channel.consume(queue, (msg) => {
            if (msg) {
                const testPayload: ITestPayload[] = JSON.parse(
                    msg.content.toString()
                );
                Logger.debug(
                    `Message Queue: Received ${testPayload.length} test data`
                );
                if (testPayload.length > 0) {
                    //TODO: Preprocess and load to database
                    var newZipMap = new Map<Number, Number>();
                    zipList = [];
                    var now = new Date()
                    //this is so scuffed
                    //making a map of the new message
                    for(let i = 0; i < testPayload.length; i++){
                        if(Number(testPayload[i]["patient_status"]) == 1){
                            if(!newZipMap.has(Number(testPayload[i]["patient_zipcode"]))){
                                newZipMap.set(Number(testPayload[i]["patient_zipcode"]), 1)
                            }
                            else{
                                var n = Number(newZipMap.get(Number(testPayload[i]["patient_zipcode"])))
                                newZipMap.set(Number(testPayload[i]["patient_zipcode"]), n+1)
                            }
                        }
                    }
                    //compare to old map
                    for(var key in newZipMap.keys){
                        if(oldZipMap.has(Number(key))){
                            if(Number(oldZipMap.get(Number(key))) * 2 <= Number(newZipMap.get(Number(key)))){
                                zipList.push(Number(key))
                            }
                        }
                    }
                    oldZipMap = newZipMap;
                    for(var z in zipList){
                        alertMap.set(Number(zipList[z]), now.getTime());
                    }
                    let count = 0;
                    for(const key of alertMap.keys()){
                        if(now.getTime() - Number(alertMap.get(key)) < 15000){
                            count++;
                        }   
                    }
                    then = now;
                    module.exports = {count, zipList}
                    //can record time stamp and length of ziplist as a pair to be queried later?
                    //createManyTestData(testPayload)
                }
            }
        });
    } catch (e) {
        throw e;
    }
}

async function initializeHospitalQueue(conn: Connection) {
    const exchangeName = "hospital_list";
    let channel: Channel;

    try {
        channel = await conn.createChannel();
    } catch (e) {
        throw e;
    }

    try {
        await channel.assertExchange(exchangeName, "topic", { durable: false });
    } catch (e) {
        throw e;
    }

    try {
        const { queue } = await channel.assertQueue("", { exclusive: true });

        const bindingKeys = ["#"];
        for (const bindingKey of bindingKeys) {
            await channel.bindQueue(queue, exchangeName, bindingKey);
        }

        channel.consume(queue, (msg) => {
            if (msg) {
                const hospitalPayload: IHospitalPayload[] = JSON.parse(
                    msg.content.toString()
                );
                Logger.debug(
                    `Message Queue: Received ${hospitalPayload.length} hospital data`
                );
                if (hospitalPayload.length > 0) {
                    createManyHospitalData(hospitalPayload);
                }
            }
        });
    } catch (e) {
        throw e;
    }
}

export async function initializeMessageQueue() {
    Logger.info("Message Queue: Initializing");

    if (!MESSAGE_QUEUE_URL) {
        throw new ErrorResponse("No Message Queue URL provided", 500);
    }

    let conn: Connection;

    try {
        conn = await connect(MESSAGE_QUEUE_URL);
    } catch (e) {
        throw e;
    }

    try {
        Logger.info("Message Queue: Subscribing to vax_list");
        await initializeVaccinationQueue(conn);
    } catch (e) {
        throw e;
    }

    try {
        Logger.info("Message Queue: Subscribing to hospital_list");
        await initializeHospitalQueue(conn);
    } catch (e) {
        throw e;
    }

    try {
        Logger.info("Message Queue: Subscribing to patient_list");
        await initializePatientQueue(conn);
    } catch (e) {
        throw e;
    }

    Logger.info("Message Queue: Finished initializing");
}
