import * as nock from "nock";
import { ClientError } from "../lib/main";
import { createTestClient, loadFixture } from "./util";

const dnsimple = createTestClient();

describe("billing", () => {
  describe("#listCharges", () => {
    const accountId = 1010;

    it("produces a charges list", (done) => {
      const fixture = loadFixture("listCharges/success.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/billing/charges")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.billing.listCharges(accountId).then(
        (response) => {
          const certificates = response.data;
          expect(certificates).toEqual([
            {
              invoiced_at: "2023-08-17T05:53:36Z",
              total_amount: "14.50",
              balance_amount: "0.00",
              reference: "1-2",
              state: "collected",
              items: [
                {
                  description: "Register bubble-registered.com",
                  amount: "14.50",
                  product_id: 1,
                  product_type: "domain-registration",
                  product_reference: "bubble-registered.com",
                },
              ],
            },
            {
              invoiced_at: "2023-08-17T05:57:53Z",
              total_amount: "14.50",
              balance_amount: "0.00",
              reference: "2-2",
              state: "refunded",
              items: [
                {
                  description: "Register example.com",
                  amount: "14.50",
                  product_id: 2,
                  product_type: "domain-registration",
                  product_reference: "example.com",
                },
              ],
            },
            {
              invoiced_at: "2023-10-24T07:49:05Z",
              total_amount: "1099999.99",
              balance_amount: "0.00",
              reference: "4-2",
              state: "collected",
              items: [
                {
                  description: "Test Line Item 1",
                  amount: "99999.99",
                  product_id: null,
                  product_type: "manual",
                  product_reference: null,
                },
                {
                  description: "Test Line Item 2",
                  amount: "1000000.00",
                  product_id: null,
                  product_type: "manual",
                  product_reference: null,
                },
              ],
            },
          ]);
          done();
        },
        (error) => {
          done(error);
        }
      );
    });

    it("throws an error on bad filter", (done) => {
      const fixture = loadFixture("listCharges/fail-400-bad-filter.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/billing/charges")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.billing.listCharges(accountId).then(
        () => {
          throw new Error("Unreachable");
        },
        (error) => {
          expect(error).toBeInstanceOf(ClientError);
          const clientError = error as ClientError;
          expect(clientError.status).toBe(400);
          expect(clientError.data.message).toBe(
            "Invalid date format must be ISO8601 (YYYY-MM-DD)"
          );
          done();
        }
      );
    });

    it("throws an error on missing scope", (done) => {
      const fixture = loadFixture("listCharges/fail-403.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/billing/charges")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.billing.listCharges(accountId).then(
        () => {
          throw new Error("Unreachable");
        },
        (error) => {
          expect(error).toBeInstanceOf(ClientError);
          const clientError = error as ClientError;
          expect(clientError.status).toBe(403);
          expect(clientError.data.message).toBe(
            "Permission Denied. Required Scope: billing:*:read"
          );
          done();
        }
      );
    });
  });
});
