import { Response } from "express";

import { ErrorResponse } from "../utils/errorResponse";

// eslint-disable-next-line
export const errorHandler = (e: any, res: Response) => {
    let error = { ...e };

    error.message = e?.message;

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Server Error",
    });

    return error;
};
