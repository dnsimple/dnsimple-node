import { createTestClient, responseFromFixture } from "./util";
import fetchMock from "fetch-mock";

const dnsimple = createTestClient();

describe("collaborators", () => {
  describe("#listCollaborators", () => {
    const accountId = 1010;
    const domainId = "example.com";

    it("supports pagination", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/domains/example.com/collaborators?page=1",
        responseFromFixture("listCollaborators/success.http")
      );

      await dnsimple.domains.listCollaborators(accountId, domainId, {
        page: 1,
      });

      expect(fetchMock.calls()).not.toEqual([]);
    });

    it("supports extra request options", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/domains/example.com/collaborators?foo=bar",
        responseFromFixture("listCollaborators/success.http")
      );

      await dnsimple.domains.listCollaborators(accountId, domainId, {
        foo: "bar",
      });

      expect(fetchMock.calls()).not.toEqual([]);
    });

    it("produces a collaborators list", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/domains/example.com/collaborators",
        responseFromFixture("listCollaborators/success.http")
      );

      const response = await dnsimple.domains.listCollaborators(
        accountId,
        domainId
      );

      const collaborators = response.data;
      expect(collaborators.length).toBe(2);
      expect(collaborators[0].id).toBe(100);
      expect(collaborators[0].domain_id).toBe(1);
      expect(collaborators[0].user_id).toBe(999);
    });

    it("exposes the pagination info", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/domains/example.com/collaborators",
        responseFromFixture("listCollaborators/success.http")
      );

      const response = await dnsimple.domains.listCollaborators(
        accountId,
        domainId
      );

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
      fetchMock.post(
        "https://api.dnsimple.com/v2/1010/domains/example.com/collaborators",
        responseFromFixture("addCollaborator/success.http")
      );

      const response = await dnsimple.domains.addCollaborator(
        accountId,
        domainId,
        collaborator
      );

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
      fetchMock.delete(
        "https://api.dnsimple.com/v2/1010/domains/example.com/collaborators/100",
        responseFromFixture("removeCollaborator/success.http")
      );

      const response = await dnsimple.domains.removeCollaborator(
        accountId,
        domainId,
        collaboratorId
      );

      expect(response).toEqual({});
    });
  });
});
