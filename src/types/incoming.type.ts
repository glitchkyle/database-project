//          NOTES
// MRN is unique and sent exactly once
// No discharge from hospital, to make it easier
// No change in patient status

import { HospitalsInstance } from "../models/hospital.model";

export interface ITest {
    // testing_id: id of testing facility
    testing_id: number;
    // patient_mrn: patient medical record number (UUID)
    patient_mrn: string;
    // patient_name: name of patient
    patient_name: string;
    // patient_zipcode: zipcode of patient
    patient_zipcode: number;
    // patient_status: positive = 1, negative = 0
    patient_status: number;
    // contact_list: list of patient_mrns that are known to have been in contact
    contact_list: string[];
    // event_list: list of event_id that the person visited
    event_list: string[];
}

export interface IHospital {
    // hospital_id: id of testing facility
    hospital_id: number;
    // patient_mrn: patient medical record number (UUID)
    patient_mrn: string;
    // patient_name: name of patient
    patient_name: string;
    // patient_status: in-patient = 1, icu = 2, vent = 3
    patient_status: number;
}

export interface IVaccination {
    // vaccination_id: id of testing facility
    vaccination_id: number;
    // patient_mrn: patient medical record number (UUID)
    patient_name: string;
    // patient_name: name of patient
    patient_mrn: string;
}

export function transfomTestDataToHospital(testObj: ITest) {
    return {};
}

export function transfomTestDataToPatient(testObj: ITest) {
    return {};
}

export function transformVaccinationData(vaccinationObj: IVaccination) {
    return {
        id: vaccinationObj.vaccination_id,
        VaccinatedPatient: {
            propertiesMergeConfig: {
                nodes: true,
                relationship: true,
            },
            properties: [
                {
                    name: vaccinationObj.patient_name,
                    mrn: vaccinationObj.patient_mrn,
                    zipcode: undefined,
                },
            ],
        },
    };
}

export function transformHospitalData(hospitalObj: IHospital) {
    return {
        id: hospitalObj.hospital_id,
        HospitalizedPatient: {
            propertiesMergeConfig: {
                nodes: true,
                relationship: true,
            },
            properties: [
                {
                    name: hospitalObj.patient_name,
                    mrn: hospitalObj.patient_mrn,
                    Status: hospitalObj.patient_status,
                    zipcode: undefined,
                },
            ],
        },
    };
}
