import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import "reflect-metadata";
import { rateLimit } from "express-rate-limit";
import { createServer } from "http";
import { Neogma, QueryRunner } from "neogma";

export const neogma = new Neogma(
    {
        url: "bolt://localhost:7687",
        username: "neo4j",
        password: "neo4jadminpassword",
    },
    {
        /* --> (optional) logs every query that Neogma runs, using the given function */
        logger: console.log,
        /* --> any driver configuration can be used */
        encrypted: false,
    }
);

export const queryRunner = new QueryRunner({
    driver: neogma.driver,
    logger: console.log,
});

import { NODE_ENV, SERVER_PORT } from "./config/config";
import { getTeam, resetDatabase } from "./controllers/management.controller";
import { initializeModels, populateData } from "./database/db";
import {
    getEventContactList,
    getPatientContactList,
} from "./controllers/tracing.controller";

const main = async () => {
    const app = express();

    // Enable CORS
    app.use(cors());

    // Body Parser
    app.use(express.json());

    // Cookie Parser
    app.use(cookieParser());

    // Security Headers
    app.use(helmet());

    // Rate Limiting
    app.use(
        rateLimit({
            windowMs: 10 * 60 * 1000,
            max: 500,
        })
    );

    await initializeModels();

    // await populateData();

    // Mount Routers

    // Management Functions
    app.route("/api/getteam").get(getTeam);
    app.route("/api/reset").get(resetDatabase);

    // Contact Tracing
    app.route("/api/getconfirmedcontacts/:mrn").get(getPatientContactList);
    app.route("/api/getpossiblecontacts/:mrn").get(getEventContactList);

    // Health Check Route
    app.get("/ping", (req: Request, res: Response, next: NextFunction) => {
        res.status(200).send("CS505 Database Final Project - Kyle Lastimosa");
    });

    const httpServer = createServer(app);

    httpServer.listen(SERVER_PORT, undefined, () => {
        console.log(
            `Application listening in ${NODE_ENV} mode on port ${SERVER_PORT}`
        );
    });

    process.on("unhandledRejection", (err: Error) => {
        console.log(`Server Unhandled Rejection Error: ${err.message}`);
        httpServer.close(() => process.exit(1));
    });
};

main();
