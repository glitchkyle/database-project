import { Request, Response, NextFunction } from "express";

import { asyncHandler } from "../middlewares/async";
import { errorHandler } from "../handlers/error.handler";
import { QueryBuilder } from "neogma";
import { queryRunner } from "../app";
import {
    getAllHospitalizedPatientQuery,
    getHospitalizedPatientQuery,
    getVaccinatedPatientQuery,
} from "../utils/query";

// @desc    API alert on zipcode that is in alert state based on growth of positive tests
// @route   GET /api/zipalertlist
// @access  Public
export const getZipAlertList = asyncHandler(
    async (
        req: Request<{}, {}, {}, {}>,
        res: Response,
        next: NextFunction
    ) => {
        //var arr: Number[] = []
        var { zipList } = require('../config/queue.ts');
        if(zipList != null){
            if(zipList.length > 0){
                res.status(200).json({
                    "ziplist": zipList,
                });
            }
            else{
                console.log("Working")
                res.status(200).json({
                    "ziplist": "None",
                });
            }
        }   
    }
);

// @desc    API alert on statewide when at least five zipcodes are in alert state within 15 second window
// @route   GET /api/alertlist
// @access  Public
export const getAlertList = asyncHandler(
    async (
        req: Request<{}, {}, {}, {}>,
        res: Response,
        next: NextFunction
    ) => {
        let stateStatus = 0;
        var now = new Date();
        var {count} = require('../config/queue.ts');
        if(count >= 5){
            stateStatus = 1;
        }

        res.status(200).json({
            "state_status": stateStatus,
        });
    }
);

// @desc    API to provide summarized patient status per hospital
// @route   GET /api/getpatientstatus/:hospitalId
// @access  Public
export const getHospitalStatus = asyncHandler(
    async (
        req: Request<{ hospitalId: string }, {}, {}, {}>,
        res: Response,
        next: NextFunction
    ) => {
        const { hospitalId } = req.params;

        let inPatient = 0;
        let inPatientVax = 0;

        let icuPatient = 0;
        let icuPatientVax = 0;

        let ventPatient = 0;
        let ventPatientVax = 0;

        try {
            const result = await new QueryBuilder()
                .match(
                    getHospitalizedPatientQuery({
                        hospitalId: Number(hospitalId),
                        status: 1,
                    })
                )
                .return(["InPatient"])
                .run(queryRunner);
            inPatient = result.records.length;
        } catch (e) {
            return next(errorHandler(e, res));
        }

        try {
            const result = await new QueryBuilder()
                .match(
                    getVaccinatedPatientQuery({
                        hospitalId: Number(hospitalId),
                        status: 1,
                    })
                )
                .return(["InPatient"])
                .run(queryRunner);
            if (inPatient > 0) {
                inPatientVax = result.records.length / inPatient;
            }
        } catch (e) {
            return next(errorHandler(e, res));
        }

        try {
            const result = await new QueryBuilder()
                .match(
                    getHospitalizedPatientQuery({
                        hospitalId: Number(hospitalId),
                        status: 2,
                    })
                )
                .return(["InPatient"])
                .run(queryRunner);
            icuPatient = result.records.length;
        } catch (e) {
            return next(errorHandler(e, res));
        }

        try {
            const result = await new QueryBuilder()
                .match(
                    getVaccinatedPatientQuery({
                        hospitalId: Number(hospitalId),
                        status: 2,
                    })
                )
                .return(["InPatient"])
                .run(queryRunner);
            if (icuPatient > 0) {
                icuPatientVax = result.records.length / icuPatient;
            }
        } catch (e) {
            return next(errorHandler(e, res));
        }

        try {
            const result = await new QueryBuilder()
                .match(
                    getHospitalizedPatientQuery({
                        hospitalId: Number(hospitalId),
                        status: 3,
                    })
                )
                .return(["InPatient"])
                .run(queryRunner);
            ventPatient = result.records.length;
        } catch (e) {
            return next(errorHandler(e, res));
        }

        try {
            const result = await new QueryBuilder()
                .match(
                    getVaccinatedPatientQuery({
                        hospitalId: Number(hospitalId),
                        status: 3,
                    })
                )
                .return(["InPatient"])
                .run(queryRunner);
            if (ventPatient > 0) {
                ventPatientVax = result.records.length / ventPatient;
            }
        } catch (e) {
            return next(errorHandler(e, res));
        }

        res.status(200).json({
            "in-patient_count": inPatient,
            "in-patient_vax": inPatientVax,
            "icu-patient_count": icuPatient,
            icu_patient_vax: icuPatientVax,
            patient_vent_count: ventPatient,
            patient_vent_vax: ventPatientVax,
        });
    }
);

// @desc    API to provide summarized patient status for all hospitals
// @route   GET /api/getpatientstatus/
// @access  Public
export const getAllHospitalStatus = asyncHandler(
    async (req: Request<{}, {}, {}, {}>, res: Response, next: NextFunction) => {
        let inPatient = 0;
        let inPatientVax = 0;

        let icuPatient = 0;
        let icuPatientVax = 0;

        let ventPatient = 0;
        let ventPatientVax = 0;

        try {
            const result = await new QueryBuilder()
                .match(getAllHospitalizedPatientQuery({ status: 1 }))
                .return(["InPatient"])
                .run(queryRunner);
            inPatient = result.records.length;
        } catch (e) {
            return next(errorHandler(e, res));
        }

        try {
            const result = await new QueryBuilder()
                .raw(
                    "MATCH (h:Hospital)-[:HOSPITALIZED { status: 1 }]->(p:Patient), (h)-[:VACCINATED]->(p)"
                )
                .return(["p"])
                .run(queryRunner);
            if (inPatient > 0) {
                inPatientVax = result.records.length / inPatient;
            }
        } catch (e) {
            return next(errorHandler(e, res));
        }

        try {
            const result = await new QueryBuilder()
                .match(getAllHospitalizedPatientQuery({ status: 2 }))
                .return(["InPatient"])
                .run(queryRunner);
            icuPatient = result.records.length;
        } catch (e) {
            return next(errorHandler(e, res));
        }

        try {
            const result = await new QueryBuilder()
                .raw(
                    "MATCH (h:Hospital)-[:HOSPITALIZED { status: 2 }]->(p:Patient), (h)-[:VACCINATED]->(p)"
                )
                .return(["p"])
                .run(queryRunner);
            if (icuPatient > 0) {
                icuPatientVax = result.records.length / icuPatient;
            }
        } catch (e) {
            return next(errorHandler(e, res));
        }

        try {
            const result = await new QueryBuilder()
                .match(getAllHospitalizedPatientQuery({ status: 3 }))
                .return(["InPatient"])
                .run(queryRunner);
            ventPatient = result.records.length;
        } catch (e) {
            return next(errorHandler(e, res));
        }

        try {
            const result = await new QueryBuilder()
                .raw(
                    "MATCH (h:Hospital)-[:HOSPITALIZED { status: 3 }]->(p:Patient), (h)-[:VACCINATED]->(p)"
                )
                .return(["p"])
                .run(queryRunner);
            if (ventPatient > 0) {
                ventPatientVax = result.records.length / ventPatient;
            }
        } catch (e) {
            return next(errorHandler(e, res));
        }

        res.status(200).json({
            "in-patient_count": inPatient,
            "in-patient_vax": inPatientVax,
            "icu-patient_count": icuPatient,
            icu_patient_vax: icuPatientVax,
            patient_vent_count: ventPatient,
            patient_vent_vax: ventPatientVax,
        });
    }
);
