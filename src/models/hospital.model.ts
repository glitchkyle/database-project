import { ModelFactory, NeogmaInstance, ModelRelatedNodesI } from "neogma";
import { Patients, PatientsInstance } from "./patient.model";
import { neogma } from "../app";

export type HospitalsPropertiesI = {
    id: number;
};

// Defines relationship configurations
export interface HospitalsRelatedNodesI {
    TestedPatient: ModelRelatedNodesI<
        typeof Patients,
        PatientsInstance,
        { Status: number },
        { status: number }
    >;
    HospitalizedPatient: ModelRelatedNodesI<
        typeof Patients,
        PatientsInstance,
        { Status: number },
        { status: number }
    >;
    VaccinatedPatient: ModelRelatedNodesI<typeof Patients, PatientsInstance>;
}

export type HospitalsInstance = NeogmaInstance<
    HospitalsPropertiesI,
    HospitalsRelatedNodesI
>;

export const Hospitals = ModelFactory<
    HospitalsPropertiesI,
    HospitalsRelatedNodesI
>(
    {
        label: "Hospital",
        primaryKeyField: "id",
        schema: {
            id: {
                type: "number",
                required: true,
            },
        },
        relationships: {
            TestedPatient: {
                model: Patients,
                direction: "out",
                name: "TESTED",
                properties: {
                    Status: {
                        property: "status",
                        schema: {
                            type: "number",
                            minimum: 0,
                            maximum: 1,
                        },
                    },
                },
            },
            HospitalizedPatient: {
                model: Patients,
                direction: "out",
                name: "HOSPITALIZED",
                properties: {
                    Status: {
                        property: "status",
                        schema: {
                            type: "number",
                            minimum: 1,
                            maximum: 3,
                        },
                    },
                },
            },
            VaccinatedPatient: {
                model: Patients,
                direction: "out",
                name: "VACCINATED",
            },
        },
    },
    neogma
);
