import fs from "fs";

import { Events, EventsInstance } from "../models/event.model";
import { Patients, PatientsPropertiesI } from "../models/patient.model";
import { Hospitals, HospitalsPropertiesI } from "../models/hospital.model";
import {
    createManyHospitalData,
    createManyVaccinationData,
} from "../services/hospital.service";
import { IHospital, ITest, IVaccination } from "../types/incoming.type";

export const initializeModels = async () => {
    console.log("Database: Initializing models");

    Events.addRelationships({
        Attendee: Patients.reverseRelationshipConfiguration("AttendedEvent"),
    });

    // TODO: Consider adding bidirection for hospital-patient relationship

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
        fs.readFileSync(`${__dirname}/data/tests.json`, "utf-8")
    ) as IHospital[];

    try {
        await createManyVaccinationData(vaccinations);
    } catch (e) {
        console.log(`Vaccination Data Seeding Error: ${e}`);
    }

    try {
        await createManyHospitalData(hospitals);
    } catch (e) {
        console.log(`Hospital Data Seeding Error: ${e}`);
    }

    console.log("Database: Finished populating");
};
