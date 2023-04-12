import { IsNotEmpty, IsString, Validate, validate } from "class-validator";

import { ValidateNumericString, ValidateStringArray } from "../utils/validator";
import Logger from "../config/logger";

export interface ITestPayload {
    // testing_id: id of testing facility
    testing_id: number | string;
    // patient_mrn: patient medical record number (UUID)
    patient_mrn: string;
    // patient_name: name of patient
    patient_name: string;
    // patient_zipcode: zipcode of patient
    patient_zipcode: number | string;
    // patient_status: positive = 1, negative = 0
    patient_status: number | string;
    // contact_list: list of patient_mrns that are known to have been in contact
    contact_list: string[];
    // event_list: list of event_id that the person visited
    event_list: string[];
}

export class Test {
    // testing_id: id of testing facility
    @Validate(ValidateNumericString)
    testing_id: string | number;

    // patient_mrn: patient medical record number (UUID)
    @IsNotEmpty()
    @IsString()
    patient_mrn: string;

    // patient_name: name of patient
    @IsNotEmpty()
    @IsString()
    patient_name: string;

    // patient_zipcode: zipcode of patient
    @Validate(ValidateNumericString)
    patient_zipcode: string | number;

    // patient_status: positive = 1, negative = 0
    @Validate(ValidateNumericString)
    patient_status: string | number;

    // contact_list: list of patient_mrns that are known to have been in contact
    @Validate(ValidateStringArray)
    contact_list: string[];

    // event_list: list of event_id that the person visited
    @Validate(ValidateStringArray)
    event_list: string[];

    constructor(testPayload: ITestPayload) {
        this.testing_id = testPayload.testing_id;
        this.patient_mrn = testPayload.patient_mrn;
        this.patient_name = testPayload.patient_name;
        this.patient_zipcode = testPayload.patient_zipcode;
        this.patient_status = testPayload.patient_status;
        this.contact_list = testPayload.contact_list;
        this.event_list = testPayload.event_list;
    }

    preprocess() {
        // Don't need to know about patients contacting themselves
        this.contact_list = this.contact_list.filter(
            (mrn) => mrn !== this.patient_mrn
        );

        // Each contact is an update to date interaction, no need to see it twice
        this.contact_list = [...new Set(this.contact_list)];

        // Each event is a unique event, no need to see it twice
        this.event_list = [...new Set(this.event_list)];
    }

    async toGraphQuery() {
        try {
            const errors = await validate(this);
            if (errors.length > 0) {
                Logger.warn(errors);
                return null;
            }
        } catch (e) {
            throw e;
        }

        this.preprocess();

        return {
            id: Number(this.testing_id),
            TestedPatient: {
                propertiesMergeConfig: {
                    nodes: true,
                    relationship: true,
                },
                // Patient node will have undefined name and zipcode
                // to prevent duplicate patterns in Neo4j.
                // Name and zipcode is not needed anyways
                properties: [
                    {
                        name: undefined,
                        mrn: this.patient_mrn,
                        zipcode: undefined,
                        Status: Number(this.patient_status),
                        AttendedEvent: {
                            propertiesMergeConfig: {
                                nodes: true,
                                relationship: true,
                            },
                            properties: this.event_list.map((event_id) => {
                                return {
                                    event_id,
                                };
                            }),
                        },
                        ContactedPatient: {
                            propertiesMergeConfig: {
                                nodes: true,
                                relationship: true,
                            },
                            properties: this.contact_list.map((mrn) => {
                                return {
                                    name: undefined,
                                    mrn: mrn,
                                    zipcode: undefined,
                                };
                            }),
                        },
                    },
                ],
            },
        };
    }
}
