import fs from "fs";

import {
    createManyHospitalData,
    createManyTestData,
    createManyVaccinationData,
} from "../services/hospital.service";
import { IHospitalPayload } from "../types/hospital.type";
import { IVaccinationPayload } from "../types/vaccination.type";
import { ITestPayload } from "../types/test.type";
import Logger from "../config/logger";

export const populateData = async () => {
    Logger.info("Database: Populating database");

    const vaccinations = JSON.parse(
        fs.readFileSync(`${__dirname}/data/vaccinations.json`, "utf-8")
    ) as IVaccinationPayload[];

    const tests = JSON.parse(
        fs.readFileSync(`${__dirname}/data/tests.json`, "utf-8")
    ) as ITestPayload[];

    const hospitals = JSON.parse(
        fs.readFileSync(`${__dirname}/data/hospitals.json`, "utf-8")
    ) as IHospitalPayload[];

    try {
        Logger.info("Database: Seeding Test Data");
        await createManyTestData(tests);
        Logger.info("Database: Finished Seeding Test Data");
    } catch (e) {
        Logger.info(`Database: Testing Data Seeding Error: ${e}`);
    }

    try {
        Logger.info("Database: Seeding Vaccination Data");
        await createManyVaccinationData(vaccinations);
        Logger.info("Database: Finished Seeding Vaccination Data");
    } catch (e) {
        Logger.info(`Database: Vaccination Data Seeding Error: ${e}`);
    }

    try {
        Logger.info("Database: Seeding Hospital Data");
        await createManyHospitalData(hospitals);
        Logger.info("Database: Finished Seeding Hospital Data");
    } catch (e) {
        Logger.info(`Database: Hospital Data Seeding Error: ${e}`);
    }

    Logger.info("Database: Finished populating");
};
