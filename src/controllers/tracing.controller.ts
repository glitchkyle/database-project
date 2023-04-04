import { Request, Response, NextFunction } from "express";

import { asyncHandler } from "../middlewares/async";

// @desc    API to determine groups of people who have reported that they have came in contact with one another
// @route   GET /api/getconfirmedcontacts/:mrn
// @access  Public
export const getPatientContactList = asyncHandler(
    async (
        req: Request<{}, {}, {}, {}>,
        res: Response,
        next: NextFunction
    ) => {}
);

// @desc    API  to determine number of people who might have been in contact if they attended the same event.
// @route   GET /api/getpossiblecontacts/:mrn
// @access  Public
export const getEventContactList = asyncHandler(
    async (
        req: Request<{}, {}, {}, {}>,
        res: Response,
        next: NextFunction
    ) => {}
);
