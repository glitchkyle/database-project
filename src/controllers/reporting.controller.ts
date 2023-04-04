import { Request, Response, NextFunction } from "express";

import { asyncHandler } from "../middlewares/async";

// @desc    API alert on zipcode that is in alert state based on growth of positive tests
// @route   GET /api/zipalertlist
// @access  Public
export const getZipAlertList = asyncHandler(
    async (
        req: Request<{}, {}, {}, {}>,
        res: Response,
        next: NextFunction
    ) => {}
);

// @desc    API alert on statewide when at least five zipcodes are in alert state within 15 second window
// @route   GET /api/alertlist
// @access  Public
export const getAlertList = asyncHandler(
    async (
        req: Request<{}, {}, {}, {}>,
        res: Response,
        next: NextFunction
    ) => {}
);

// @desc    API to provide summarized patient status per hospital
// @route   GET /api/getpatientstatus/:hospitalId
// @access  Public
export const getHospitalStatus = asyncHandler(
    async (
        req: Request<{}, {}, {}, {}>,
        res: Response,
        next: NextFunction
    ) => {}
);

// @desc    Gets team name
// @route   GET /api/getpatientstatus/
// @access  Public
export const getAllHospitalStatus = asyncHandler(
    async (
        req: Request<{}, {}, {}, {}>,
        res: Response,
        next: NextFunction
    ) => {}
);
