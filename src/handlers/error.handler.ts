import { Response } from "express";

// eslint-disable-next-line
export const errorHandler = (e: any, res: Response) => {
    const error = { ...e };

    error.message = e?.message;

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Server Error",
    });

    return error;
};
