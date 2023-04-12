import fs from "fs";

import { IHospitalPayload } from "../types/hospital.type";
import { IVaccinationPayload } from "../types/vaccination.type";
import { ITestPayload } from "../types/test.type";
import {
    createManyHospitalData,
    createManyTestData,
    createManyVaccinationData,
} from "../services/hospital.service";

export async function loadTestData() {
    const tests = JSON.parse(
        fs.readFileSync(`${__dirname}/data/tests.json`, "utf-8")
    ) as ITestPayload[];
    try {
        await createManyTestData(tests);
    } catch (e) {
        throw e;
    }
}

export async function loadHospitalData() {
    const hospitals = JSON.parse(
        fs.readFileSync(`${__dirname}/data/hospitals.json`, "utf-8")
    ) as IHospitalPayload[];
    try {
        await createManyHospitalData(hospitals);
    } catch (e) {
        throw e;
    }
}

export async function loadVaccinationData() {
    const vaccinations = JSON.parse(
        fs.readFileSync(`${__dirname}/data/vaccinations.json`, "utf-8")
    ) as IVaccinationPayload[];
    try {
        await createManyVaccinationData(vaccinations);
    } catch (e) {
        throw e;
    }
}
