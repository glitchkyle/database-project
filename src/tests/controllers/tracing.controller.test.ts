import chaiHTTP from "chai-http";
import chai, { expect } from "chai";
import { Response } from "superagent";

import { httpServer as server } from "../../app";
import _ from "lodash";

chai.use(chaiHTTP);

describe("Tracing Controller", async () => {
    describe("GET /api/getconfirmedcontacts/:mrn", async () => {
        context(
            "Wanda Hastings (1def220e-b4e8-11ec-a016-ac87a3187c5f)",
            async () => {
                const patientMrn = "1def220e-b4e8-11ec-a016-ac87a3187c5f";
                let res: Response;
                before(async () => {
                    res = await chai
                        .request(server)
                        .get(`/api/getconfirmedcontacts/${patientMrn}`);
                    expect(res).to.exist;
                    expect(res).to.have.status(200);
                    expect(res.body).to.exist;
                });
                it("Should return a contact list", async () => {
                    expect(res.body.contactlist).to.exist;
                    expect(res.body.contactlist).to.be.an("array").that.is.not
                        .empty;
                });
                it("Should list out all mrns that patient contacted", async () => {
                    expect(res.body.contactlist).to.include.members([
                        "1def233a-b4e8-11ec-a016-ac87a3187c5f",
                        "1def2362-b4e8-11ec-a016-ac87a3187c5f",
                        "1def254c-b4e8-11ec-a016-ac87a3187c5f",
                        "1def2524-b4e8-11ec-a016-ac87a3187c5f",
                        "1def23b2-b4e8-11ec-a016-ac87a3187c5f",
                        "1def25c4-b4e8-11ec-a016-ac87a3187c5f",
                        "1def24d4-b4e8-11ec-a016-ac87a3187c5f",
                        "1def2240-b4e8-11ec-a016-ac87a3187c5f",
                        "1def25ec-b4e8-11ec-a016-ac87a3187c5f",
                        "1def22ea-b4e8-11ec-a016-ac87a3187c5f",
                        "1def259c-b4e8-11ec-a016-ac87a3187c5f",
                        "1def263c-b4e8-11ec-a016-ac87a3187c5f",
                        "1def2452-b4e8-11ec-a016-ac87a3187c5f",
                        "1def247a-b4e8-11ec-a016-ac87a3187c5f",
                        "1def2614-b4e8-11ec-a016-ac87a3187c5f",
                        "1def238a-b4e8-11ec-a016-ac87a3187c5f",
                        "1def22b8-b4e8-11ec-a016-ac87a3187c5f",
                        "1def24fc-b4e8-11ec-a016-ac87a3187c5f",
                    ]);
                });
                it("Should list out all mrns that have contacted patient", async () => {
                    expect(res.body.contactlist).to.include.members([
                        "1def2240-b4e8-11ec-a016-ac87a3187c5f",
                        "1def2268-b4e8-11ec-a016-ac87a3187c5f",
                        "1def2290-b4e8-11ec-a016-ac87a3187c5f",
                        "1def22b8-b4e8-11ec-a016-ac87a3187c5f",
                    ]);
                });
            }
        );
        context(
            "Henrietta Cook (1def2240-b4e8-11ec-a016-ac87a3187c5f)",
            async () => {
                const patientMrn = "1def2240-b4e8-11ec-a016-ac87a3187c5f";
                let res: Response;
                before(async () => {
                    res = await chai
                        .request(server)
                        .get(`/api/getconfirmedcontacts/${patientMrn}`);
                    expect(res).to.exist;
                    expect(res).to.have.status(200);
                    expect(res.body).to.exist;
                });
                it("Should return a contact list", async () => {
                    expect(res.body.contactlist).to.exist;
                    expect(res.body.contactlist).to.be.an("array").that.is.not
                        .empty;
                });
                it("Should list out all mrns that patient contacted", async () => {
                    expect(res.body.contactlist).to.include.members([
                        "1def247a-b4e8-11ec-a016-ac87a3187c5f",
                        "1def2312-b4e8-11ec-a016-ac87a3187c5f",
                        "1def2574-b4e8-11ec-a016-ac87a3187c5f",
                        "1def254c-b4e8-11ec-a016-ac87a3187c5f",
                        "1def2268-b4e8-11ec-a016-ac87a3187c5f",
                        "1def242a-b4e8-11ec-a016-ac87a3187c5f",
                        "1def2290-b4e8-11ec-a016-ac87a3187c5f",
                        "1def266e-b4e8-11ec-a016-ac87a3187c5f",
                        "1def23b2-b4e8-11ec-a016-ac87a3187c5f",
                        "1def24fc-b4e8-11ec-a016-ac87a3187c5f",
                        "1def25ec-b4e8-11ec-a016-ac87a3187c5f",
                        "1def220e-b4e8-11ec-a016-ac87a3187c5f",
                    ]);
                });
                it("Should list out all mrns that have contacted patient", async () => {
                    expect(res.body.contactlist).to.include.members([
                        "1def220e-b4e8-11ec-a016-ac87a3187c5f",
                        "1def2268-b4e8-11ec-a016-ac87a3187c5f",
                        "1def2290-b4e8-11ec-a016-ac87a3187c5f",
                        "1def22b8-b4e8-11ec-a016-ac87a3187c5f",
                    ]);
                });
            }
        );
    });
    describe("GET /api/getpossiblecontacts/:mrn", async () => {
        context(
            "Wanda Hastings (1def220e-b4e8-11ec-a016-ac87a3187c5f)",
            async () => {
                const patientMrn = "1def220e-b4e8-11ec-a016-ac87a3187c5f";
                let res: Response;
                before(async () => {
                    res = await chai
                        .request(server)
                        .get(`/api/getpossiblecontacts/${patientMrn}`);
                    expect(res).to.exist;
                    expect(res).to.have.status(200);
                    expect(res.body).to.exist;
                });
                it("Should return a contact list", async () => {
                    expect(res.body.contactlist).to.exist;
                    expect(res.body.contactlist).to.be.an("array").that.is.not
                        .empty;

                    // Can't check length of event array because patient
                    // may have attended event that no one else attended
                    // yet this route is for finding everyone else who
                    // attended the same event
                });
                context(
                    "Event 1def1d22-b4e8-11ec-a016-ac87a3187c5f",
                    async () => {
                        const eventId = "1def1d22-b4e8-11ec-a016-ac87a3187c5f";
                        let eventContactList: any;
                        it("Should return event contact list", async () => {
                            eventContactList = _.find(res.body.contactlist, {
                                [eventId]: [],
                            });
                            expect(eventContactList).to.exist;
                            expect(eventContactList[eventId]).to.exist;
                            expect(
                                eventContactList[eventId]
                            ).to.have.length.above(0);
                        });
                        it("Should find every other patient who attended event", async () => {
                            expect(
                                eventContactList[eventId]
                            ).to.include.members([
                                "1def2268-b4e8-11ec-a016-ac87a3187c5f",
                            ]);
                        });
                    }
                );
                context(
                    "Event 1def1d9a-b4e8-11ec-a016-ac87a3187c5f",
                    async () => {
                        const eventId = "1def1d9a-b4e8-11ec-a016-ac87a3187c5f";
                        let eventContactList: any;
                        it("Should return event contact list", async () => {
                            eventContactList = _.find(res.body.contactlist, {
                                [eventId]: [],
                            });
                            expect(eventContactList).to.exist;
                            expect(eventContactList[eventId]).to.exist;
                            expect(
                                eventContactList[eventId]
                            ).to.have.length.above(0);
                        });
                        it("Should find every other patient who attended event", async () => {
                            expect(
                                eventContactList[eventId]
                            ).to.include.members([
                                "1def2268-b4e8-11ec-a016-ac87a3187c5f",
                                "1def2290-b4e8-11ec-a016-ac87a3187c5f",
                                "1def22b8-b4e8-11ec-a016-ac87a3187c5f",
                            ]);
                        });
                    }
                );
            }
        );
        context(
            "Henrietta Cook (1def2240-b4e8-11ec-a016-ac87a3187c5f)",
            async () => {
                const patientMrn = "1def2240-b4e8-11ec-a016-ac87a3187c5f";
                let res: Response;
                before(async () => {
                    res = await chai
                        .request(server)
                        .get(`/api/getpossiblecontacts/${patientMrn}`);
                    expect(res).to.exist;
                    expect(res).to.have.status(200);
                    expect(res.body).to.exist;
                });
                it("Should return a contact list", async () => {
                    expect(res.body.contactlist).to.exist;
                    expect(res.body.contactlist).to.be.an("array").that.is.not
                        .empty;

                    // Can't check length of event array because patient
                    // may have attended event that no one else attended
                    // yet this route is for finding everyone else who
                    // attended the same event
                });
                context(
                    "Event 1def2006-b4e8-11ec-a016-ac87a3187c5f",
                    async () => {
                        const eventId = "1def2006-b4e8-11ec-a016-ac87a3187c5f";
                        let eventContactList: any;
                        it("Should return event contact list", async () => {
                            eventContactList = _.find(res.body.contactlist, {
                                [eventId]: [],
                            });
                            expect(eventContactList).to.exist;
                            expect(eventContactList[eventId]).to.exist;
                            expect(
                                eventContactList[eventId]
                            ).to.have.length.above(0);
                        });
                        it("Should find every other patient who attended event", async () => {
                            expect(
                                eventContactList[eventId]
                            ).to.include.members([
                                "1def2268-b4e8-11ec-a016-ac87a3187c5f",
                            ]);
                        });
                    }
                );
                context(
                    "Event 1def202e-b4e8-11ec-a016-ac87a3187c5f",
                    async () => {
                        const eventId = "1def202e-b4e8-11ec-a016-ac87a3187c5f";
                        let eventContactList: any;
                        it("Should return event contact list", async () => {
                            eventContactList = _.find(res.body.contactlist, {
                                [eventId]: [],
                            });
                            expect(eventContactList).to.exist;
                            expect(eventContactList[eventId]).to.exist;
                            expect(
                                eventContactList[eventId]
                            ).to.have.length.above(0);
                        });
                        it("Should find every other patient who attended event", async () => {
                            expect(
                                eventContactList[eventId]
                            ).to.include.members([
                                "1def2268-b4e8-11ec-a016-ac87a3187c5f",
                                "1def22b8-b4e8-11ec-a016-ac87a3187c5f",
                            ]);
                        });
                    }
                );
            }
        );
    });
});
