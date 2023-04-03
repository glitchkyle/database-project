import { Patients, PatientsInstance } from "../models/patient.model";

export async function findOnePatient({
    mrn,
}: {
    mrn: string;
}): Promise<PatientsInstance | null> {
    try {
        const patient = await Patients.findOne({ where: { mrn } });
        return patient;
    } catch (e) {
        throw e;
    }
}

export async function createOnePatient({
    name,
    mrn,
    zipcode,
}: {
    name: string;
    mrn: string;
    zipcode: number;
}): Promise<PatientsInstance> {
    try {
        const patient = await Patients.createOne(
            { name, mrn, zipcode },
            { validate: true }
        );
        return patient;
    } catch (e) {
        throw e;
    }
}
