import * as nock from "nock";
import { ClientError, MethodNotAllowedError } from "../lib/main";
import { createTestClient, loadFixture } from "./util";

const dnsimple = createTestClient();

describe("response handling", () => {
  describe("a 400 error", () => {
    it("includes the error message from the server", (done) => {
      const fixture = loadFixture("validation-error.http");
      nock("https://api.dnsimple.com")
        .post("/v2/validation-error", {})
        .reply(fixture.statusCode, fixture.body);

      dnsimple.request("POST", "/validation-error", {}, {}).then(
        (response) => {
          done("Expected error but promise resolved");
        },
        (error) => {
          expect(error).toBeInstanceOf(ClientError);
          expect(error.data.errors.email).toEqual(
            expect.arrayContaining(["can't be blank"])
          );
          done();
        }
      );
    });
  });

  describe("a 200 response with malformed json", () => {
    it("produces a JSON parse error", (done) => {
      const fixture = loadFixture("success-with-malformed-json.http");
      nock("https://api.dnsimple.com")
        .get("/v2/success-with-malformed-json")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.request("GET", "/success-with-malformed-json", null, {}).then(
        (response) => {
          done("Expected error but promise resolved");
        },
        (error) => {
          expect(error).toBeInstanceOf(SyntaxError);
          done();
        }
      );
    });
  });

  describe("an error response with HTML content", () => {
    it("produces a JSON parse error", (done) => {
      const fixture = loadFixture("badgateway.http");
      nock("https://api.dnsimple.com")
        .get("/v2/badgateway")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.request("GET", "/badgateway", null, {}).then(
        (response) => {
          done("Expected error but promise resolved");
        },
        (error) => {
          expect(error).toBeInstanceOf(SyntaxError);
          done();
        }
      );
    });
  });

  describe("a 405 error", () => {
    it("results in a rejected promise", (done) => {
      const fixture = loadFixture("method-not-allowed.http");
      nock("https://api.dnsimple.com")
        .get("/v2/method-not-allowed")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.request("GET", "/method-not-allowed", null, {}).then(
        (response) => {
          done("Expected error but promise resolved");
        },
        (error) => {
          expect(error).toBeInstanceOf(MethodNotAllowedError);
          done();
        }
      );
    });
  });
});
