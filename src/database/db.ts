import fs from "fs";

import { Events } from "../models/event.model";
import { Patients } from "../models/patient.model";
import {
    createManyHospitalData,
    createManyTestData,
    createManyVaccinationData,
} from "../services/hospital.service";
import { IHospital, ITest, IVaccination } from "../types/incoming.type";

export const initializeModels = async () => {
    console.log("Database: Initializing models");

    Events.addRelationships({
        Attendee: Patients.reverseRelationshipConfiguration("AttendedEvent"),
    });

    console.log("Database: Finished initializing");
};

export const populateData = async () => {
    console.log("Database: Populating database");

    const vaccinations = JSON.parse(
        fs.readFileSync(`${__dirname}/data/vaccinations.json`, "utf-8")
    ) as IVaccination[];

    const tests = JSON.parse(
        fs.readFileSync(`${__dirname}/data/tests.json`, "utf-8")
    ) as ITest[];

    const hospitals = JSON.parse(
        fs.readFileSync(`${__dirname}/data/hospitals.json`, "utf-8")
    ) as IHospital[];

    try {
        console.log("Database: Seeding Test Data");
        await createManyTestData(tests);
        console.log("Database: Finished Seeding Test Data");
    } catch (e) {
        console.log(`Database: Testing Data Seeding Error: ${e}`);
    }

    try {
        console.log("Database: Seeding Vaccination Data");
        await createManyVaccinationData(vaccinations);
        console.log("Database: Finished Seeding Vaccination Data");
    } catch (e) {
        console.log(`Database: Vaccination Data Seeding Error: ${e}`);
    }

    try {
        console.log("Database: Seeding Hospital Data");
        await createManyHospitalData(hospitals);
        console.log("Database: Finished Seeding Hospital Data");
    } catch (e) {
        console.log(`Database: Hospital Data Seeding Error: ${e}`);
    }

    console.log("Database: Finished populating");
};
