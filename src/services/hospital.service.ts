import Logger from "../config/logger";
import { Hospitals, HospitalsInstance } from "../models/hospital.model";
import { Hospital, IHospitalPayload } from "../types/hospital.type";
import { ITestPayload, Test } from "../types/test.type";
import { IVaccinationPayload, Vaccination } from "../types/vaccination.type";
import { notNull } from "../utils/validator";

export async function createManyVaccinationData(
    vaccinationObjs: IVaccinationPayload[]
): Promise<HospitalsInstance[]> {
    Logger.debug("Creating many vaccination data");
    for (const vaccination of vaccinationObjs) {
        Logger.debug(vaccination);
    }

    const vaccinations = vaccinationObjs.map(
        (vaccinationObj) => new Vaccination(vaccinationObj)
    );

    let createDatas;

    try {
        createDatas = (
            await Promise.all(
                vaccinations.map(async (vaccination) => {
                    return await vaccination.toGraphQuery();
                })
            )
        ).filter(notNull);
    } catch (e) {
        throw e;
    }

    try {
        const hospitals = await Hospitals.createMany(createDatas, {
            merge: true,
            validate: true,
        });
        return hospitals;
    } catch (e) {
        throw e;
    }
}

export async function createManyHospitalData(
    hospitalObjs: IHospitalPayload[]
): Promise<HospitalsInstance[]> {
    Logger.debug("Creating many hospital data");
    for (const hospital of hospitalObjs) {
        Logger.debug(hospital);
    }

    const hospitals = hospitalObjs.map(
        (hospitalObj) => new Hospital(hospitalObj)
    );

    let createDatas;

    try {
        createDatas = (
            await Promise.all(
                hospitals.map(async (hospital) => {
                    return await hospital.toGraphQuery();
                })
            )
        ).filter(notNull);
    } catch (e) {
        throw e;
    }

    try {
        const hospitals = await Hospitals.createMany(createDatas, {
            merge: true,
            validate: true,
        });
        return hospitals;
    } catch (e) {
        throw e;
    }
}

export async function createManyTestData(
    testObjs: ITestPayload[]
): Promise<HospitalsInstance[]> {
    Logger.debug("Creating many test data");
    for (const test of testObjs) {
        Logger.debug(test);
    }

    const tests = testObjs.map((testObj) => new Test(testObj));

    let createDatas;

    try {
        createDatas = (
            await Promise.all(
                tests.map(async (test) => {
                    return await test.toGraphQuery();
                })
            )
        ).filter(notNull);
    } catch (e) {
        throw e;
    }

    try {
        const hospitals = await Hospitals.createMany(createDatas, {
            merge: true,
            validate: true,
        });
        return hospitals;
    } catch (e) {
        throw e;
    }
}
