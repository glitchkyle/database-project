import fs from "fs";

import { IHospitalPayload } from "../types/hospital.type";
import { IVaccinationPayload } from "../types/vaccination.type";
import { ITestPayload } from "../types/test.type";

export async function loadTestData(cb: Function) {
    const tests = JSON.parse(
        fs.readFileSync(`${__dirname}/data/tests.json`, "utf-8")
    ) as ITestPayload[];
    try {
        await cb(tests);
    } catch (e) {
        throw e;
    }
}

export async function loadHospitalData(cb: Function) {
    const hospitals = JSON.parse(
        fs.readFileSync(`${__dirname}/data/hospitals.json`, "utf-8")
    ) as IHospitalPayload[];
    try {
        await cb(hospitals);
    } catch (e) {
        throw e;
    }
}

export async function loadVaccinationData(cb: Function) {
    const vaccinations = JSON.parse(
        fs.readFileSync(`${__dirname}/data/vaccinations.json`, "utf-8")
    ) as IVaccinationPayload[];
    try {
        await cb(vaccinations);
    } catch (e) {
        throw e;
    }
}