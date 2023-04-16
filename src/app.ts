import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import "reflect-metadata";
import { rateLimit } from "express-rate-limit";
import { createServer } from "http";
import { Neogma, QueryRunner } from "neogma";

import Logger from "./config/logger";
import {
    GRAPH_DATABASE_PASSWORD,
    GRAPH_DATABASE_URL,
    GRAPH_DATABASE_USERNAME,
    NODE_ENV,
    SERVER_PORT,
} from "./config/config";

export const neogma = new Neogma(
    {
        url: GRAPH_DATABASE_URL,
        username: GRAPH_DATABASE_USERNAME,
        password: GRAPH_DATABASE_PASSWORD,
    },
    {
        /* --> any driver configuration can be used */
        encrypted: false,
    }
);

export const queryRunner = new QueryRunner({
    driver: neogma.driver,
});

import { getTeam, resetDatabase } from "./controllers/management.controller";
import { populateData } from "./database/db";
import {
    getEventContactList,
    getPatientContactList,
} from "./controllers/tracing.controller";
import {
    getAlertList,
    getAllHospitalStatus,
    getHospitalStatus,
    getZipAlertList,
} from "./controllers/reporting.controller";
import Morgan from "./config/morgan";
import { initializeMessageQueue } from "./config/queue";

const app = express();

// Configure Express application

// Enable CORS
app.use(cors());

// Body Parser
app.use(express.json());

// Cookie Parser
app.use(cookieParser());

// Security Headers
app.use(helmet());

// Morgan Logger
if (NODE_ENV !== "testing") {
    app.use(Morgan);
}

// Rate Limiting
app.use(
    rateLimit({
        windowMs: 10 * 60 * 1000,
        max: 500,
    })
);

// Configure database
populateData().catch((e) => {
    Logger.error(e);
});

// Configure message queue
initializeMessageQueue().catch((e) => {
    Logger.error(e);
});

// Mount Routers

// Management Functions
app.route("/api/getteam").get(getTeam);
app.route("/api/reset").get(resetDatabase);

app.route("/api/alertlist").get(getAlertList);
app.route("/api/zipalertlist").get(getZipAlertList);

// Contact Tracing
app.route("/api/getconfirmedcontacts/:mrn").get(getPatientContactList);
app.route("/api/getpossiblecontacts/:mrn").get(getEventContactList);

// Operational Reporting
app.route("/api/getpatientstatus/:hospitalId").get(getHospitalStatus);
app.route("/api/getpatientstatus").get(getAllHospitalStatus);

// Health Check Route
app.get("/ping", (req: Request, res: Response, next: NextFunction) => {
    res.status(200).send("CS505 Database Final Project - Kyle Lastimosa");
});

export const httpServer = createServer(app);

httpServer.listen(SERVER_PORT, undefined, () => {
    Logger.info(
        `Application listening in ${NODE_ENV} mode on port ${SERVER_PORT}`
    );
});

process.on("unhandledRejection", (err: Error) => {
    Logger.error(`Server Unhandled Rejection Error: ${err.message}`);
    httpServer.close(() => process.exit(1));
});
