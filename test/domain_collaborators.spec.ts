import * as nock from "nock";
import { createTestClient, readFixtureAt } from "./util";

const dnsimple = createTestClient();

describe("collaborators", () => {
  describe("#listCollaborators", () => {
    const accountId = 1010;
    const domainId = "example.com";

    it("supports pagination", async () => {
      const scope = nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/collaborators?page=1")
        .reply(readFixtureAt("listCollaborators/success.http"));

      await dnsimple.domains.listCollaborators(accountId, domainId, { page: 1 });

      expect(scope.isDone()).toBeTruthy();
    });

    it("supports extra request options", async () => {
      const scope = nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/collaborators?foo=bar")
        .reply(readFixtureAt("listCollaborators/success.http"));

      await dnsimple.domains.listCollaborators(accountId, domainId, { foo: "bar" });

      expect(scope.isDone()).toBeTruthy();
    });

    it("produces a collaborators list", async () => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/collaborators")
        .reply(readFixtureAt("listCollaborators/success.http"));

      const response = await dnsimple.domains.listCollaborators(accountId, domainId);

      const collaborators = response.data;
      expect(collaborators.length).toBe(2);
      expect(collaborators[0].id).toBe(100);
      expect(collaborators[0].domain_id).toBe(1);
      expect(collaborators[0].user_id).toBe(999);
    });

    it("exposes the pagination info", async () => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/collaborators")
        .reply(readFixtureAt("listCollaborators/success.http"));

      const response = await dnsimple.domains.listCollaborators(accountId, domainId);

      const pagination = response.pagination;
      expect(pagination).not.toBe(null);
      expect(pagination.current_page).toBe(1);
    });
  });

  describe("#addCollaborator", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const collaborator = {
      email: "existing-user@example.com",
    };

    it("produces a response", async () => {
      nock("https://api.dnsimple.com")
        .post("/v2/1010/domains/example.com/collaborators")
        .reply(readFixtureAt("addCollaborator/success.http"));

      const response = await dnsimple.domains.addCollaborator(accountId, domainId, collaborator);

      const data = response.data;
      expect(data.id).toEqual(100);
      expect(data.invitation).toEqual(false);
    });
  });

  describe("#removeCollaborator", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const collaboratorId = 100;

    it("produces nothing", async () => {

      nock("https://api.dnsimple.com")
        .delete("/v2/1010/domains/example.com/collaborators/100")
        .reply(readFixtureAt("removeCollaborator/success.http"));

      const response = await dnsimple.domains.removeCollaborator(accountId, domainId, collaboratorId);

      expect(response).toEqual({});
    });
  });
});
