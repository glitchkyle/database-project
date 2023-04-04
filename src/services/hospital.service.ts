import { Hospitals, HospitalsInstance } from "../models/hospital.model";
import {
    IHospital,
    ITest,
    IVaccination,
    transformHospitalData,
    transformTestData,
    transformVaccinationData,
} from "../types/incoming.type";
import { ErrorResponse } from "../utils/errorResponse";

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

export async function createOneVaccinationData(
    vaccinationObj: IVaccination
): Promise<HospitalsInstance> {
    const createData = transformVaccinationData(vaccinationObj);

    try {
        const hospital = await Hospitals.createOne(createData, {
            merge: true,
            validate: true,
        });
        return hospital;
    } catch (e) {
        throw e;
    }
}

export async function createManyVaccinationData(
    vaccinations: IVaccination[]
): Promise<HospitalsInstance[]> {
    const createDatas = vaccinations.map((vaccinationObj) =>
        transformVaccinationData(vaccinationObj)
    );

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

export async function createOneHospitalData(
    hospitalObj: IHospital
): Promise<HospitalsInstance> {
    const createData = transformHospitalData(hospitalObj);

    try {
        const hospital = await Hospitals.createOne(createData, {
            merge: true,
            validate: true,
        });
        return hospital;
    } catch (e) {
        throw e;
    }
}

export async function createManyHospitalData(
    hospitals: IHospital[]
): Promise<HospitalsInstance[]> {
    const createDatas = hospitals.map((hospitalObj) =>
        transformHospitalData(hospitalObj)
    );

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

export async function createOneTestData(
    testObj: ITest
): Promise<HospitalsInstance> {
    const createData = transformTestData(testObj);

    try {
        const hospital = await Hospitals.createOne(createData, {
            merge: true,
            validate: true,
        });
        return hospital;
    } catch (e) {
        throw e;
    }
}

export async function createManyTestData(
    tests: ITest[]
): Promise<HospitalsInstance[]> {
    const createDatas = tests.map((testObj) => transformTestData(testObj));

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
