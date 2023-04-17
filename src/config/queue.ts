import { Channel, Connection, connect } from "amqplib";

import Logger from "./logger";
import { MESSAGE_QUEUE_URL } from "./config";
import { ErrorResponse } from "../utils/errorResponse";
import { IVaccinationPayload } from "../types/vaccination.type";
import { createManyTestData, createManyVaccinationData } from "../services/hospital.service";
import { IHospitalPayload } from "../types/hospital.type";
import { createManyHospitalData } from "../services/hospital.service";
import { ITestPayload } from "../types/test.type";
import { ValidateNumericString } from "../utils/validator";
import { Validate } from "class-validator";

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
                    const now = new Date()
                    //this is so scuffed
                    //making a map of the new message
                    for(let i = 0; i < testPayload.length; i++){
                        
                        //validating input
                        if(ValidateNumericString.isValidNumericString(testPayload[i]["patient_zipcode"])
                            && ValidateNumericString.isValidNumericString(testPayload[i]["patient_status"]))
                            {
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
                        
                    }
                    //now we have a map where the KEY is a zipcode that appears in the current message, and
                    //the VALUE indicates how many times that zipcode appears in the current message with a positive test case

                    //compare to old map
                    //the old map is where we stored the zipcode->count map from the last message. Empty at first.
                    for(var key in newZipMap.keys){
                        //comparing zipcode positive-case counts. If a zipcode has twice as many positive cases as it did in the
                        //last message, we push that zipcode to an Alert list.
                        //This means that the zipcode must appear in both messages.
                        if(oldZipMap.has(Number(key))){
                            if(Number(oldZipMap.get(Number(key))) * 2 <= Number(newZipMap.get(Number(key)))){
                                zipList.push(Number(key))
                            }
                        }
                    }
                    //The current message becomes the last message that we will use for comparison next time.
                    oldZipMap = newZipMap;
                    //The zipcodes in zipList have to be timestamped, so we map zipcode->timestamp.
                    //Even if this overwrites an older zipcode entry, it's okay, because we aren't counting the same zipcode twice
                    //when checking for the statewide alert.
                    for(var z in zipList){
                        alertMap.set(Number(zipList[z]), now.getTime());
                    }
                    //Counting the entries in the alertMap whose timestamps were less than 15000 ms ago
                    let count = 0;
                    for(const key of alertMap.keys()){
                        if(now.getTime() - Number(alertMap.get(key)) < 15000){
                            count++;
                        }   
                    }
                    //This might be very poor JavaScript but this is where the variables are exported directly to the controllers
                    then = now;
                    module.exports = {count, zipList}
                    //add to graph
                    createManyTestData(testPayload)
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
