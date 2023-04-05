import { ModelFactory, NeogmaInstance, ModelRelatedNodesI } from "neogma";
import { neogma } from "../app";
import { Events, EventsInstance } from "./event.model";

// Defines what properties each Patient node has.
export type PatientsPropertiesI = {
    name: string | undefined;
    mrn: string;
    zipcode: number | undefined;
};

// Defines what relationships this patient has
export interface PatientsRelatedNodesI {
    AttendedEvent: ModelRelatedNodesI<typeof Events, EventsInstance>;
    ContactedPatient: ModelRelatedNodesI<typeof Patients, PatientsInstance>;
    ContactedByPatient: ModelRelatedNodesI<typeof Patients, PatientsInstance>;
}

// Define interface of the patient instance corresponding to
// node in the database and provides access to its properties,
// useful methods for editing its data etc.
export type PatientsInstance = NeogmaInstance<
    PatientsPropertiesI,
    PatientsRelatedNodesI
>;

export const Patients = ModelFactory<
    PatientsPropertiesI,
    PatientsRelatedNodesI
>(
    {
        label: "Patient",
        primaryKeyField: "mrn",
        schema: {
            name: {
                type: "string",
                minLength: 1,
                required: false,
            },
            mrn: { type: "string", minLength: 1, required: true },
            zipcode: { type: "number", minimum: 0, required: false },
        },
        relationships: {
            AttendedEvent: {
                model: Events,
                direction: "out",
                name: "ATTENDED",
            },
            ContactedPatient: {
                model: "self",
                direction: "out",
                name: "CONTACTED",
            }
        },
    },
    neogma
);
