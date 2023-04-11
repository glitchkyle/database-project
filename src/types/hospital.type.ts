import {
    IsNotEmpty,
    IsNumber,
    IsPositive,
    IsString,
    Validate,
    validate,
} from "class-validator";
import Logger from "../config/logger";
import { ValidateNumericString } from "../utils/validator";

export interface IHospitalPayload {
    // hospital_id: id of testing facility
    hospital_id: number | string;
    // patient_mrn: patient medical record number (UUID)
    patient_mrn: string;
    // patient_name: name of patient
    patient_name: string;
    // patient_status: in-patient = 1, icu = 2, vent = 3
    patient_status: number | string;
}

export class Hospital {
    // hospital_id: id of testing facility
    @Validate(ValidateNumericString)
    hospital_id: number | string;

    // patient_mrn: patient medical record number (UUID)
    @IsNotEmpty()
    @IsString()
    patient_mrn: string;

    // patient_name: name of patient
    @IsNotEmpty()
    @IsString()
    patient_name: string;

    // patient_status: in-patient = 1, icu = 2, vent = 3
    @Validate(ValidateNumericString)
    patient_status: number | string;

    constructor(hospitalPayload: IHospitalPayload) {
        this.hospital_id = hospitalPayload.hospital_id;
        this.patient_mrn = hospitalPayload.patient_mrn;
        this.patient_name = hospitalPayload.patient_name;
        this.patient_status = hospitalPayload.patient_status;
    }

    preprocess() {}

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
            id: Number(this.hospital_id),
            HospitalizedPatient: {
                propertiesMergeConfig: {
                    nodes: true,
                    relationship: true,
                },
                properties: [
                    {
                        name: undefined,
                        mrn: this.patient_mrn,
                        Status: Number(this.patient_status),
                        zipcode: undefined,
                    },
                ],
            },
        };
    }
}
