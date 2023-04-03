import { ModelFactory, NeogmaInstance, ModelRelatedNodesI } from "neogma";
import { neogma } from "../app";

export type EventsPropertiesI = {
    event_id: string;
};

export type EventsRelatedNodesI = {};

export type EventsInstance = NeogmaInstance<
    EventsPropertiesI,
    EventsRelatedNodesI
>;

export const Events = ModelFactory<EventsPropertiesI, EventsRelatedNodesI>(
    {
        label: "Event",
        primaryKeyField: "event_id",
        schema: {
            event_id: {
                type: "string",
                minLength: 1,
                required: true,
            },
        },
    },
    neogma
);
