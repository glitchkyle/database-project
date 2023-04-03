import { Request, Response, NextFunction } from "express";

// eslint-disable-next-line
export function asyncHandler(
    fn: (...args: any) => any
): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
