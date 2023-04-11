import chaiHTTP from "chai-http";
import chai, { expect } from "chai";
import { Response } from "superagent";
import sinon, { SinonSandbox } from "sinon";

import { queryRunner } from "../../app";
import { httpServer as server } from "../../app";

chai.use(chaiHTTP);
describe("Management Controller", async () => {
    describe("GET /api/getteam", async () => {
        let res: Response;
        before(async () => {
            res = await chai.request(server).get("/api/getteam");
            expect(res).to.exist;
            expect(res).to.have.status(200);
            expect(res.body).to.exist;
        });
        it("Should GET team name", async () => {
            expect(res.body.team_name).to.exist;
            expect(res.body.team_name).to.be.equal("DataDynamos");
        });
        it("Should GET member SIDs", async () => {
            expect(res.body.Team_members_sids).to.exist;
            expect(res.body.Team_members_sids).to.have.length(2);
        });
        it("Should GET app status code", async () => {
            expect(res.body.app_status_code).to.exist;
            expect(res.body.app_status_code).to.equal(1);
        });
    });
    describe("GET /api/reset", async () => {
        let sandbox: SinonSandbox;
        beforeEach(async () => {
            sandbox = sinon.createSandbox();
        });
        afterEach(async () => {
            sandbox.restore();
        });
        it("Should return 1 if db successfully resetted", async () => {
            sandbox.stub(queryRunner, "delete").resolves();
            const res = await chai.request(server).get("/api/reset");
            expect(res).to.exist;
            expect(res).to.have.status(200);
            expect(res.body).to.exist;
            expect(res.body.reset_status_code).to.exist;
            expect(res.body.reset_status_code).to.equal(1);
        });
        it("Should return 0 if db not successfully resetted", async () => {
            sandbox.stub(queryRunner, "delete").rejects();
            const res = await chai.request(server).get("/api/reset");
            expect(res).to.exist;
            expect(res).to.have.status(500);
            expect(res.body).to.exist;
            expect(res.body.reset_status_code).to.exist;
            expect(res.body.reset_status_code).to.equal(0);
        });
    });
});
