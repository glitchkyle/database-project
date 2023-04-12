import { IsNotEmpty, IsString, Validate, validate } from "class-validator";

import Logger from "../config/logger";
import { ValidateNumericString } from "../utils/validator";

export interface IVaccinationPayload {
    // vaccination_id: id of testing facility
    vaccination_id: number | string;
    // patient_mrn: patient medical record number (UUID)
    patient_name: string;
    // patient_name: name of patient
    patient_mrn: string;
}

export class Vaccination {
    // vaccination_id: id of testing facility
    @Validate(ValidateNumericString)
    vaccination_id: number | string;

    // patient_mrn: patient medical record number (UUID)
    @IsNotEmpty()
    @IsString()
    patient_name: string;

    // patient_name: name of patient
    @IsNotEmpty()
    @IsString()
    patient_mrn: string;

    constructor(vaccinationPayload: IVaccinationPayload) {
        this.vaccination_id = vaccinationPayload.vaccination_id;
        this.patient_name = vaccinationPayload.patient_name;
        this.patient_mrn = vaccinationPayload.patient_mrn;
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
            id: Number(this.vaccination_id),
            VaccinatedPatient: {
                propertiesMergeConfig: {
                    nodes: true,
                    relationship: true,
                },
                properties: [
                    {
                        name: undefined,
                        mrn: this.patient_mrn,
                        zipcode: undefined,
                    },
                ],
            },
        };
    }
}
