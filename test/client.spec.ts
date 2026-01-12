import fetchMock from "fetch-mock";
import { ClientError, MethodNotAllowedError, RateLimit } from "../lib/main";
import { createTestClient, responseFromFixture } from "./util";

const dnsimple = createTestClient();

describe("rate limit", () => {
  describe("when rate limit headers are present", () => {
    it("exposes the rate limit info", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/domains",
        responseFromFixture("listDomains/success.http")
      );

      const response = await dnsimple.domains.listDomains(1010);

      const rateLimit = response.rateLimit as RateLimit;
      expect(rateLimit).toBeDefined();
      expect(rateLimit.limit).toBe(2400);
      expect(rateLimit.remaining).toBe(2399);
      expect(rateLimit.reset).toBe(1591304056);
    });
  });

  describe("when rate limit headers are missing", () => {
    it("returns null values", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/test", {
        status: 200,
        body: { data: {} },
      });

      const response = await dnsimple.request("GET", "/1010/test", null, {});

      expect(response.rateLimit).toBeDefined();
      expect(response.rateLimit.limit).toBeNull();
      expect(response.rateLimit.remaining).toBeNull();
      expect(response.rateLimit.reset).toBeNull();
    });
  });

  describe("on a 204 response", () => {
    it("exposes the rate limit info", async () => {
      fetchMock.delete(
        "https://api.dnsimple.com/v2/1010/domains/example.com",
        responseFromFixture("deleteDomain/success.http")
      );

      const response = await dnsimple.domains.deleteDomain(1010, "example.com");

      expect(response.rateLimit).toBeDefined();
    });
  });
});

describe("response handling", () => {
  describe("a 400 error", () => {
    it("includes the error message from the server", async () => {
      fetchMock.post(
        "https://api.dnsimple.com/v2/validation-error",
        responseFromFixture("validation-error.http")
      );

      try {
        await dnsimple.request("POST", "/validation-error", {}, {});
      } catch (error) {
        expect(error).toBeInstanceOf(ClientError);
        expect(error.data.errors.email).toEqual(
          expect.arrayContaining(["can't be blank"])
        );
      }
    });
  });

  describe("a 200 response with malformed json", () => {
    it("produces a JSON parse error", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/success-with-malformed-json",
        responseFromFixture("success-with-malformed-json.http")
      );

      await expect(
        dnsimple.request("GET", "/success-with-malformed-json", null, {})
      ).rejects.toThrow(SyntaxError);
    });
  });

  describe("an error response with HTML content", () => {
    it("produces a JSON parse error", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/badgateway",
        responseFromFixture("badgateway.http")
      );

      await expect(
        dnsimple.request("GET", "/badgateway", null, {})
      ).rejects.toThrow(SyntaxError);
    });
  });

  describe("a 405 error", () => {
    it("results in a rejected promise", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/method-not-allowed",
        responseFromFixture("method-not-allowed.http")
      );

      await expect(
        dnsimple.request("GET", "/method-not-allowed", null, {})
      ).rejects.toThrow(MethodNotAllowedError);
    });
  });
});
