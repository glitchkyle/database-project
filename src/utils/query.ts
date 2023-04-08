import {
    MatchLiteralI,
    MatchMultipleI,
    MatchNodeI,
    MatchRelatedI,
} from "neogma/dist/Queries/QueryBuilder/QueryBuilder.types";

export function getHospitalizedPatientQuery({
    hospitalId,
    status,
}: {
    hospitalId: number;
    status: number;
}): string | MatchNodeI | MatchRelatedI | MatchMultipleI | MatchLiteralI {
    return {
        related: [
            {
                label: "Hospital",
                where: {
                    id: hospitalId,
                },
            },
            {
                direction: "out",
                name: "HOSPITALIZED",
                where: {
                    status: status,
                },
            },
            {
                label: "Patient",
                identifier: "InPatient",
            },
        ],
    };
}

export function getAllHospitalizedPatientQuery({
    status,
}: {
    status: number;
}): string | MatchNodeI | MatchRelatedI | MatchMultipleI | MatchLiteralI {
    return {
        related: [
            {
                label: "Hospital",
            },
            {
                direction: "out",
                name: "HOSPITALIZED",
                where: {
                    status: status,
                },
            },
            {
                label: "Patient",
                identifier: "InPatient",
            },
        ],
    };
}

export function getVaccinatedPatientQuery({
    hospitalId,
    status,
}: {
    hospitalId: number;
    status: number;
}): string | MatchNodeI | MatchRelatedI | MatchMultipleI | MatchLiteralI {
    return {
        related: [
            {
                label: "Hospital",
                where: {
                    id: hospitalId,
                },
            },
            {
                direction: "out",
                name: "HOSPITALIZED",
                where: {
                    status: status,
                },
            },
            {
                label: "Patient",
                identifier: "InPatient",
            },
            {
                direction: "in",
                name: "VACCINATED",
            },
            {
                label: "Hospital",
                where: {
                    id: hospitalId,
                },
            },
        ],
    };
}
