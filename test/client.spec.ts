import fetchMock from "fetch-mock";
import { ClientError, MethodNotAllowedError } from "../lib/main";
import { createTestClient, responseFromFixture } from "./util";

const dnsimple = createTestClient();

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
