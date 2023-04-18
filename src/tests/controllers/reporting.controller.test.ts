import chaiHTTP from "chai-http";
import chai, { expect } from "chai";
import { Response } from "superagent";

import { httpServer as server } from "../../app";

chai.use(chaiHTTP);

// TODO: Create more demo data
// No other way to check correctness without more data

describe("Reporting Controller", async () => {
    describe("GET /api/getpatientstatus/:hospitalId", async () => {
        const hospitalId = "6";
        let res: Response;
        before(async () => {
            res = await chai
                .request(server)
                .get(`/api/getpatientstatus/${hospitalId}`);
            expect(res).to.exist;
            expect(res).to.have.status(200);
            expect(res.body).to.exist;
        });
        it("Should return valid in-patient_count", async () => {
            expect(res.body["in-patient_count"]).to.exist;
            expect(res.body["in-patient_count"]).to.equal(1);
        });
        it("Should return valid in-patient_vax", async () => {
            expect(res.body["in-patient_vax"]).to.exist;
            expect(res.body["in-patient_vax"]).to.equal(1);
        });
        it("Should return valid icu-patient_count", async () => {
            expect(res.body["icu-patient_count"]).to.exist;
            expect(res.body["icu-patient_count"]).to.equal(0);
        });
        it("Should return valid icu_patient_vax", async () => {
            expect(res.body["icu_patient_vax"]).to.exist;
            expect(res.body["icu_patient_vax"]).to.equal(0);
        });
        it("Should return valid patient_vent_count", async () => {
            expect(res.body["patient_vent_count"]).to.exist;
            expect(res.body["patient_vent_count"]).to.equal(0);
        });
        it("Should return valid patient_vent_vax", async () => {
            expect(res.body["patient_vent_vax"]).to.exist;
            expect(res.body["patient_vent_vax"]).to.equal(0);
        });
    });
    describe("GET /api/getpatientstatus/", async () => {
        let res: Response;
        before(async () => {
            res = await chai.request(server).get(`/api/getpatientstatus`);
            expect(res).to.exist;
            expect(res).to.have.status(200);
            expect(res.body).to.exist;
        });
        it("Should return valid in-patient_count", async () => {
            expect(res.body["in-patient_count"]).to.exist;
            expect(res.body["in-patient_count"]).to.equal(4);
        });
        it("Should return valid in-patient_vax", async () => {
            expect(res.body["in-patient_vax"]).to.exist;
            expect(res.body["in-patient_vax"]).to.equal(0.25);
        });
        it("Should return valid icu-patient_count", async () => {
            expect(res.body["icu-patient_count"]).to.exist;
            expect(res.body["icu-patient_count"]).to.equal(4);
        });
        it("Should return valid icu_patient_vax", async () => {
            expect(res.body["icu_patient_vax"]).to.exist;
            expect(res.body["icu_patient_vax"]).to.equal(0);
        });
        it("Should return valid patient_vent_count", async () => {
            expect(res.body["patient_vent_count"]).to.exist;
            expect(res.body["patient_vent_count"]).to.equal(4);
        });
        it("Should return valid patient_vent_vax", async () => {
            expect(res.body["patient_vent_vax"]).to.exist;
            expect(res.body["icu_patient_vax"]).to.equal(0);
        });
    });
});
