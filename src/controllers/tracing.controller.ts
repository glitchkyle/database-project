import { Request, Response, NextFunction } from "express";
import { QueryBuilder } from "neogma";

import { asyncHandler } from "../middlewares/async";
import { errorHandler } from "../handlers/error.handler";
import { queryRunner } from "../app";
import { Patients } from "../models/patient.model";
import { Events } from "../models/event.model";

// @desc    API to determine groups of people who have reported that they have came in contact with one another
// @route   GET /api/getconfirmedcontacts/:mrn
// @access  Public
export const getPatientContactList = asyncHandler(
    async (
        req: Request<{ mrn: string }, {}, {}, {}>,
        res: Response,
        next: NextFunction
    ) => {
        const { mrn } = req.params;

        const contactList = new Set();

        try {
            // Get all patients that have been contacted by patient_mrn
            const result = await new QueryBuilder()
                .match({
                    related: [
                        {
                            identifier: "Patient",
                            model: Patients,
                            where: {
                                mrn,
                            },
                        },
                        {
                            direction: "out",
                            name: "CONTACTED",
                        },
                        {
                            identifier: "Contacted",
                            model: Patients,
                        },
                    ],
                })
                .return(["Contacted"])
                .run(queryRunner);
            result.records.forEach((r) => {
                const { properties } = r.get("Contacted");
                contactList.add(properties.mrn);
            });
        } catch (e) {
            return next(errorHandler(e, res));
        }

        try {
            // Get all patients that contacted patient_mrn
            const result = await new QueryBuilder()
                .match({
                    related: [
                        {
                            identifier: "Patient",
                            model: Patients,
                            where: {
                                mrn,
                            },
                        },
                        {
                            direction: "in",
                        },
                        {
                            identifier: "ContactedBy",
                            model: Patients,
                        },
                    ],
                })
                .return(["ContactedBy"])
                .run(queryRunner);
            result.records.forEach((r) => {
                const { properties } = r.get("ContactedBy");
                contactList.add(properties.mrn);
            });
        } catch (e) {
            return next(errorHandler(e, res));
        }

        res.status(200).json({
            contactlist: [...contactList],
        });
    }
);

// @desc    API to determine number of people who might have been in contact if they attended the same event.
// @route   GET /api/getpossiblecontacts/:mrn
// @access  Public
export const getEventContactList = asyncHandler(
    async (
        req: Request<{ mrn: string }, {}, {}, {}>,
        res: Response,
        next: NextFunction
    ) => {
        const { mrn } = req.params;

        const contactObj: any = {};

        try {
            const result = await new QueryBuilder()
                .match({
                    related: [
                        {
                            identifier: "Patient",
                            model: Patients,
                            where: {
                                mrn,
                            },
                        },
                        {
                            direction: "out",
                            name: "ATTENDED",
                        },
                        {
                            identifier: "Event",
                            model: Events,
                        },
                        {
                            direction: "in",
                        },
                        {
                            identifier: "Participant",
                            model: Patients,
                        },
                    ],
                })
                .return(["Event", "Participant"])
                .run(queryRunner);

            result.records.forEach((r) => {
                const eventId = r.get("Event").properties.event_id as string;
                const participantMRN = r.get("Participant").properties
                    .mrn as string;

                if (eventId in contactObj) {
                    // Add to existing set if set exists
                    contactObj[eventId].add(participantMRN);
                } else {
                    // Create new set if it does not exist and add mrn
                    contactObj[eventId] = new Set();
                    contactObj[eventId].add(participantMRN);
                }
            });
        } catch (e) {
            return next(errorHandler(e, res));
        }

        const contactlist = Object.keys(contactObj).map((eventId) => {
            return {
                [eventId]: [...contactObj[eventId]],
            };
        });

        res.status(200).json({ contactlist });
    }
);
