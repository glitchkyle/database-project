// Server technical configurations
import dotenv from "dotenv";
dotenv.config();

export const APP_STATUS_CODE = Number(process.env.APP_STATUS_CODE) || 0;

export const NODE_ENV = process.env.NODE_ENV || "development";

export const SERVER_PORT = process.env.SERVER_PORT || "8080";

export const TEAM_NAME = process.env.TEAM_NAME || "Me, Myself, and I";

export const GRAPH_DATABASE_URL =
    process.env.GRAPH_DATABASE_URL || "bolt://localhost:7474";
