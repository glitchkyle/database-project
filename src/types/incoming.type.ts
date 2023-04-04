//          NOTES
// MRN is unique and sent exactly once
// No discharge from hospital, to make it easier
// No change in patient status

export interface ITest {
    // testing_id: id of testing facility
    testing_id: number | string;
    // patient_mrn: patient medical record number (UUID)
    patient_mrn: string;
    // patient_name: name of patient
    patient_name: string;
    // patient_zipcode: zipcode of patient
    patient_zipcode: number | string;
    // patient_status: positive = 1, negative = 0
    patient_status: number | string;
    // contact_list: list of patient_mrns that are known to have been in contact
    contact_list: string[];
    // event_list: list of event_id that the person visited
    event_list: string[];
}

export interface IHospital {
    // hospital_id: id of testing facility
    hospital_id: number | string;
    // patient_mrn: patient medical record number (UUID)
    patient_mrn: string;
    // patient_name: name of patient
    patient_name: string;
    // patient_status: in-patient = 1, icu = 2, vent = 3
    patient_status: number | string;
}

export interface IVaccination {
    // vaccination_id: id of testing facility
    vaccination_id: number | string;
    // patient_mrn: patient medical record number (UUID)
    patient_name: string;
    // patient_name: name of patient
    patient_mrn: string;
}

export function cleanTestData(testObj: ITest) {
    // Don't need to know about patients contacting themselves
    testObj.contact_list = testObj.contact_list.filter(
        (mrn) => mrn !== testObj.patient_mrn
    );

    // Each contact is an update to date interaction, no need to see it twice
    testObj.contact_list = [...new Set(testObj.contact_list)];

    // Each event is a unique event, no need to see it twice
    testObj.event_list = [...new Set(testObj.event_list)];

    return testObj;
}

export function transformTestData(testObj: ITest) {
    testObj = cleanTestData(testObj);

    const contactedData = testObj.contact_list.map((mrn) => {
        return {
            name: undefined,
            mrn: mrn,
            zipcode: undefined,
        };
    });

    const eventData = testObj.event_list.map((event_id) => {
        return {
            event_id,
        };
    });

    return {
        id: Number(testObj.testing_id),
        TestedPatient: {
            properties: [
                {
                    name: testObj.patient_name,
                    mrn: testObj.patient_mrn,
                    zipcode: Number(testObj.patient_zipcode),
                    Status: Number(testObj.patient_status),
                    AttendedEvent: {
                        propertiesMergeConfig: {
                            nodes: true,
                            relationship: true,
                        },
                        properties: eventData,
                    },
                    ContactedPatient: {
                        propertiesMergeConfig: {
                            nodes: true,
                            relationship: true,
                        },
                        properties: contactedData,
                    },
                },
            ],
        },
    };
}

export function transformVaccinationData(vaccinationObj: IVaccination) {
    return {
        id: Number(vaccinationObj.vaccination_id),
        VaccinatedPatient: {
            propertiesMergeConfig: {
                nodes: true,
                relationship: true,
            },
            properties: [
                {
                    name: vaccinationObj.patient_name,
                    mrn: vaccinationObj.patient_mrn,
                    zipcode: undefined,
                },
            ],
        },
    };
}

export function transformHospitalData(hospitalObj: IHospital) {
    return {
        id: Number(hospitalObj.hospital_id),
        HospitalizedPatient: {
            propertiesMergeConfig: {
                nodes: true,
                relationship: true,
            },
            properties: [
                {
                    name: hospitalObj.patient_name,
                    mrn: hospitalObj.patient_mrn,
                    Status: Number(hospitalObj.patient_status),
                    zipcode: undefined,
                },
            ],
        },
    };
}
