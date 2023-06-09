import { Request, Response, NextFunction } from "express";

import { asyncHandler } from "../middlewares/async";
import { APP_STATUS_CODE, TEAM_NAME } from "../config/config";
import { TEAM_MEMBER_SIDS } from "../config/constants";
import { queryRunner } from "../app";

// @desc    Gets team name
// @route   GET /api/getteam
// @access  Public
export const getTeam = asyncHandler(
    async (req: Request<{}, {}, {}, {}>, res: Response, next: NextFunction) => {
        res.status(200).json({
            team_name: TEAM_NAME,
            Team_members_sids: TEAM_MEMBER_SIDS,
            app_status_code: APP_STATUS_CODE,
        });
    }
);

// @desc    Resets database
// @route   GET /api/reset
// @access  Public
export const resetDatabase = asyncHandler(
    async (req: Request<{}, {}, {}, {}>, res: Response, next: NextFunction) => {
        try {
            await queryRunner.delete({ detach: true });
            res.status(200).json({
                reset_status_code: 1,
            });
        } catch (e) {
            res.status(500).json({
                reset_status_code: 0,
            });
        }
    }
);
