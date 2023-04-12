import Logger from "../config/logger";
import { queryRunner } from "../app";
import { loadHospitalData, loadTestData, loadVaccinationData } from "./seeder";

export const populateData = async () => {
    Logger.info("Database: Initializing");

    try {
        Logger.info("Database: Purging Database");
        await queryRunner.delete({ detach: true });
        Logger.info("Database: Successfully Purged Database");
    } catch (e) {
        Logger.error(e);
    }

    Logger.info("Database: Populating database");

    try {
        Logger.info("Database: Seeding Vaccination Data");
        await loadVaccinationData();
        Logger.info("Database: Finished Seeding Vaccination Data");
    } catch (e) {
        Logger.info(`Database: Vaccination Data Seeding Error: ${e}`);
    }

    try {
        Logger.info("Database: Seeding Hospital Data");
        await loadHospitalData();
        Logger.info("Database: Finished Seeding Hospital Data");
    } catch (e) {
        Logger.info(`Database: Hospital Data Seeding Error: ${e}`);
    }

    try {
        Logger.info("Database: Seeding Test Data");
        await loadTestData();
        Logger.info("Database: Finished Seeding Test Data");
    } catch (e) {
        Logger.info(`Database: Testing Data Seeding Error: ${e}`);
    }

    Logger.info("Database: Finished populating");

    Logger.info("Database: Finished initializing");
};
