import { Hospitals, HospitalsInstance } from "../models/hospital.model";
import { Hospital, IHospitalPayload } from "../types/hospital.type";
import { ITestPayload, Test } from "../types/test.type";
import { IVaccinationPayload, Vaccination } from "../types/vaccination.type";
import { ErrorResponse } from "../utils/errorResponse";
import { notNull } from "../utils/validator";

export async function findOneHospital({
    id,
}: {
    id: number;
}): Promise<HospitalsInstance | null> {
    try {
        const hospital = await Hospitals.findOne({ where: { id } });
        return hospital;
    } catch (e) {
        throw e;
    }
}

export async function createOneHospital({
    id,
}: {
    id: number;
}): Promise<HospitalsInstance> {
    try {
        const hospital = await Hospitals.createOne({ id }, { validate: true });
        return hospital;
    } catch (e) {
        throw e;
    }
}

export async function relateToHospitalizedPatient({
    id,
    mrn,
    status,
}: {
    id: number;
    mrn: string;
    status: number;
}): Promise<HospitalsInstance> {
    let hospital: HospitalsInstance | null;

    try {
        hospital = await Hospitals.findOne({ where: { id } });
        if (!hospital) {
            throw new ErrorResponse("Hospital not found", 404);
        }
    } catch (e) {
        throw e;
    }

    try {
        await hospital.relateTo({
            assertCreatedRelationships: 1,
            alias: "HospitalizedPatient",
            properties: {
                Status: status,
            },
            where: {
                mrn,
            },
        });
    } catch (e) {
        throw e;
    }

    return hospital;
}

export async function relateToTestedPatient({
    id,
    mrn,
    status,
}: {
    id: number;
    mrn: string;
    status: number;
}): Promise<HospitalsInstance> {
    let hospital: HospitalsInstance | null;

    try {
        hospital = await Hospitals.findOne({ where: { id } });
        if (!hospital) {
            throw new ErrorResponse("Hospital not found", 404);
        }
    } catch (e) {
        throw e;
    }

    try {
        await hospital.relateTo({
            assertCreatedRelationships: 1,
            alias: "TestedPatient",
            properties: {
                Status: status,
            },
            where: {
                mrn,
            },
        });
    } catch (e) {
        throw e;
    }

    return hospital;
}

export async function relateToVaccinatedPatient({
    id,
    mrn,
}: {
    id: number;
    mrn: string;
}): Promise<HospitalsInstance> {
    let hospital: HospitalsInstance | null;

    try {
        hospital = await Hospitals.findOne({ where: { id } });
        if (!hospital) {
            throw new ErrorResponse("Hospital not found", 404);
        }
    } catch (e) {
        throw e;
    }

    try {
        await hospital.relateTo({
            assertCreatedRelationships: 1,
            alias: "VaccinatedPatient",
            where: {
                mrn,
            },
        });
    } catch (e) {
        throw e;
    }

    return hospital;
}

export async function createManyVaccinationData(
    vaccinationObjs: IVaccinationPayload[]
): Promise<HospitalsInstance[]> {
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
