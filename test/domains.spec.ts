import fetchMock from "fetch-mock";
import { NotFoundError } from "../lib/main";
import { createTestClient, fetchMockResponse } from "./util";

const dnsimple = createTestClient();

describe("domains", () => {
  describe("#listDomains", () => {
    const accountId = 1010;

    it("supports pagination", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/domains?page=1", fetchMockResponse("listDomains/success.http"));

      await dnsimple.domains.listDomains(accountId, { page: 1 });

      expect(fetchMock.calls()).not.toEqual([]);
    });

    it("supports extra request options", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/domains?foo=bar", fetchMockResponse("listDomains/success.http"));

      await dnsimple.domains.listDomains(accountId, { foo: "bar" });

      expect(fetchMock.calls()).not.toEqual([]);
    });

    it("supports sorting", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/domains?sort=expiration%3Aasc",
        fetchMockResponse("listDomains/success.http")
      );

      await dnsimple.domains.listDomains(accountId, { sort: "expiration:asc" });

      expect(fetchMock.calls()).not.toEqual([]);
    });

    it("supports filter", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/domains?name_like=example",
        fetchMockResponse("listDomains/success.http")
      );

      await dnsimple.domains.listDomains(accountId, { name_like: "example" });

      expect(fetchMock.calls()).not.toEqual([]);
    });

    it("produces a domain list", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/domains", fetchMockResponse("listDomains/success.http"));

      const response = await dnsimple.domains.listDomains(accountId);

      const domains = response.data;
      expect(domains.length).toBe(2);
      expect(domains[0].name).toBe("example-alpha.com");
      expect(domains[0].account_id).toBe(1385);
    });

    it("exposes the pagination info", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/domains", fetchMockResponse("listDomains/success.http"));

      const response = await dnsimple.domains.listDomains(accountId);

      const pagination = response.pagination;
      expect(pagination).not.toBe(null);
      expect(pagination.current_page).toBe(1);
    });
  });

  describe("#listDomains.collectAll", () => {
    const accountId = 1010;

    it("produces a complete list", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/domains?page=1", fetchMockResponse("pages-1of3.http"));

      fetchMock.get("https://api.dnsimple.com/v2/1010/domains?page=2", fetchMockResponse("pages-2of3.http"));

      fetchMock.get("https://api.dnsimple.com/v2/1010/domains?page=3", fetchMockResponse("pages-3of3.http"));

      const items = await dnsimple.domains.listDomains.collectAll(accountId);

      expect(items.length).toBe(5);
      expect(items[0].id).toBe(1);
      expect(items[4].id).toBe(5);
    });
  });

  describe("#getDomain", () => {
    const accountId = 1385;
    const domainId = "example-alpha.com";

    it("produces a domain", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1385/domains/example-alpha.com",
        fetchMockResponse("getDomain/success.http")
      );

      const response = await dnsimple.domains.getDomain(accountId, domainId);

      const domain = response.data;
      expect(domain.id).toBe(181984);
      expect(domain.account_id).toBe(1385);
      expect(domain.registrant_id).toBe(2715);
      expect(domain.name).toBe("example-alpha.com");
      expect(domain.state).toBe("registered");
      expect(domain.auto_renew).toBe(false);
      expect(domain.private_whois).toBe(false);
      expect(domain.expires_on).toBe("2021-06-05");
      expect(domain.expires_at).toBe("2021-06-05T02:15:00Z");
      expect(domain.created_at).toBe("2020-06-04T19:15:14Z");
      expect(domain.updated_at).toBe("2020-06-04T19:15:21Z");
    });

    describe("when the domain does not exist", () => {
      it("produces an error", async () => {
        fetchMock.get("https://api.dnsimple.com/v2/1385/domains/0", fetchMockResponse("notfound-domain.http"));

        await expect(dnsimple.domains.getDomain(accountId, "0")).rejects.toThrow(NotFoundError);
      });
    });
  });

  describe("#createDomain", () => {
    const accountId = 1385;
    const attributes = { name: "example-alpha.com" };

    it("builds the correct request", async () => {
      fetchMock.post("https://api.dnsimple.com/v2/1385/domains", fetchMockResponse("createDomain/created.http"));

      await dnsimple.domains.createDomain(accountId, attributes);

      expect(fetchMock.calls()[0][1]!.body).toEqual(JSON.stringify(attributes));
    });

    it("produces a domain", async () => {
      fetchMock.post("https://api.dnsimple.com/v2/1385/domains", fetchMockResponse("createDomain/created.http"));

      const response = await dnsimple.domains.createDomain(accountId, attributes);

      const domain = response.data;
      expect(domain.id).toBe(181985);
    });
  });

  describe("#deleteDomain", () => {
    const accountId = 1010;
    const domainId = "example.com";

    it("produces nothing", async () => {
      fetchMock.delete(
        "https://api.dnsimple.com/v2/1010/domains/example.com",
        fetchMockResponse("deleteDomain/success.http")
      );

      const response = await dnsimple.domains.deleteDomain(accountId, domainId);

      expect(response).toEqual({});
    });
  });
});
