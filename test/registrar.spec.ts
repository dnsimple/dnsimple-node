import * as nock from "nock";
import { ClientError } from "../lib/main";
import { createTestClient, readFixtureAt } from "./util";

const dnsimple = createTestClient();

describe("registrar", () => {
  const accountId = 1010;
  const domainId = "example.com";

  describe("#checkDomain", () => {
    const domainId = "ruby.codes";

    it("produces a check result", async () => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/registrar/domains/ruby.codes/check")
        .reply(readFixtureAt("checkDomain/success.http"));

      const response = await dnsimple.registrar.checkDomain(
        accountId,
        domainId
      );

      const checkResult = response.data;
      expect(checkResult.domain).toEqual("ruby.codes");
      expect(checkResult.available).toBe(true);
      expect(checkResult.premium).toBe(true);
    });
  });

  describe("#getDomainPremiumPrice", () => {
    describe("when the domain has a premium price", () => {
      const domainId = "ruby.codes";

      it("produces a premium price result", async () => {
        nock("https://api.dnsimple.com")
          .get("/v2/1010/registrar/domains/ruby.codes/premium_price")
          .reply(readFixtureAt("getDomainPremiumPrice/success.http"));

        const response = await dnsimple.registrar.getDomainPremiumPrice(
          accountId,
          domainId
        );

        const premiumPriceResult = response.data;
        expect(premiumPriceResult.premium_price).toEqual("109.00");
        expect(premiumPriceResult.action).toEqual("registration");
      });
    });

    describe("when the domain is not a premium domain", () => {
      const domainId = "example.com";

      it("produces an error", async () => {
        nock("https://api.dnsimple.com")
          .get("/v2/1010/registrar/domains/example.com/premium_price")
          .reply(readFixtureAt("getDomainPremiumPrice/failure.http"));

        try {
          await dnsimple.registrar.getDomainPremiumPrice(accountId, domainId);
        } catch (error) {
          expect(error).toBeInstanceOf(ClientError);
          expect(error.data.message).toBe(
            "`example.com` is not a premium domain for registration"
          );
        }
      });
    });
  });

  describe("#getDomainPrices", () => {
    describe("when the TLD is supported", () => {
      it("produces a domain prices result", async () => {
        nock("https://api.dnsimple.com")
          .get("/v2/1010/registrar/domains/bingo.pizza/prices")
          .reply(readFixtureAt("getDomainPrices/success.http"));

        const response = await dnsimple.registrar.getDomainPrices(
          accountId,
          "bingo.pizza"
        );

        const pricesResult = response.data;
        expect(pricesResult.domain).toEqual("bingo.pizza");
        expect(pricesResult.premium).toEqual(true);
        expect(pricesResult.registration_price).toEqual(20.0);
        expect(pricesResult.renewal_price).toEqual(20.0);
        expect(pricesResult.transfer_price).toEqual(20.0);
      });
    });

    describe("when the TLD is not available", () => {
      it("produces an error", async () => {
        nock("https://api.dnsimple.com")
          .get("/v2/1010/registrar/domains/bingo.pineaple/prices")
          .reply(readFixtureAt("getDomainPrices/failure.http"));

        try {
          await dnsimple.registrar.getDomainPrices(accountId, "bingo.pineaple");
        } catch (error) {
          expect(error).toBeInstanceOf(ClientError);
          expect(error.data.message).toBe("TLD .PINEAPPLE is not supported");
        }
      });
    });
  });

  describe("#getDomainRegistration", () => {
    it("calls the correct method", async () => {
      const scope = nock("https://api.dnsimple.com")
        .get("/v2/1010/registrar/domains/example.com/registrations/1535")
        .reply(200);

      await dnsimple.registrar.getDomainRegistration(
        1010,
        "example.com",
        1535,
        {}
      );

      expect(scope.isDone()).toBeTruthy();
    });
  });

  describe("#getDomainRenewal", () => {
    it("calls the correct method", async () => {
      const scope = nock("https://api.dnsimple.com")
        .get("/v2/1023/registrar/domains/example.com/renewals/1694")
        .reply(200);

      await dnsimple.registrar.getDomainRenewal(1023, "example.com", 1694, {});

      expect(scope.isDone()).toBeTruthy();
    });
  });

  describe("#registerDomain", () => {
    it("produces a domain", async () => {
      const attributes = { registrant_id: 10 };

      nock("https://api.dnsimple.com")
        .post(
          "/v2/1010/registrar/domains/example.com/registrations",
          attributes
        )
        .reply(readFixtureAt("registerDomain/success.http"));

      const response = await dnsimple.registrar.registerDomain(
        accountId,
        domainId,
        attributes
      );

      const domainRegistration = response.data;
      expect(domainRegistration.id).toBe(1);
      expect(domainRegistration.state).toBe("new");
    });
  });

  describe("#renewDomain", () => {
    it("produces a domain", async () => {
      const attributes = { period: 3 };

      nock("https://api.dnsimple.com")
        .post("/v2/1010/registrar/domains/example.com/renewals", attributes)
        .reply(readFixtureAt("renewDomain/success.http"));

      const response = await dnsimple.registrar.renewDomain(
        accountId,
        domainId,
        attributes
      );

      const renewDomainal = response.data;
      expect(renewDomainal.id).toBe(1);
      expect(renewDomainal.state).toBe("new");
    });

    describe("when it is too soon for the domain to be renewed", () => {
      it("results in an error", async () => {
        const attributes = {};

        nock("https://api.dnsimple.com")
          .post("/v2/1010/registrar/domains/example.com/renewals", attributes)
          .reply(readFixtureAt("renewDomain/error-tooearly.http"));

        await expect(
          dnsimple.registrar.renewDomain(accountId, domainId, attributes)
        ).rejects.toThrow();
      });
    });
  });

  describe("#transferDomain", () => {
    const attributes = { registrant_id: 10, auth_code: "x1y2z3" };

    it("produces a domain", async () => {
      nock("https://api.dnsimple.com")
        .post("/v2/1010/registrar/domains/example.com/transfers", attributes)
        .reply(readFixtureAt("transferDomain/success.http"));

      const response = await dnsimple.registrar.transferDomain(
        accountId,
        domainId,
        attributes
      );

      const domain = response.data;
      expect(domain.id).toBe(1);
      expect(domain.state).toBe("transferring");
    });

    describe("when the domain is already in DNSimple", () => {
      it("results in an error", async () => {
        nock("https://api.dnsimple.com")
          .post("/v2/1010/registrar/domains/example.com/transfers", attributes)
          .reply(readFixtureAt("transferDomain/error-indnsimple.http"));

        await expect(
          dnsimple.registrar.transferDomain(accountId, domainId, attributes)
        ).rejects.toThrow();
      });
    });

    describe("when authcode was not provided and is required by the TLD", () => {
      it("results in an error", async () => {
        nock("https://api.dnsimple.com")
          .post("/v2/1010/registrar/domains/example.com/transfers", attributes)
          .reply(readFixtureAt("transferDomain/error-missing-authcode.http"));

        await expect(
          dnsimple.registrar.transferDomain(accountId, domainId, attributes)
        ).rejects.toThrow();
      });
    });
  });

  describe("#getDomainTransfer", () => {
    it("retrieves a domain transfer", async () => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/registrar/domains/example.com/transfers/42")
        .reply(readFixtureAt("getDomainTransfer/success.http"));

      const response = await dnsimple.registrar.getDomainTransfer(
        accountId,
        domainId,
        42
      );

      const domainTransfer = response.data;
      expect(domainTransfer.id).toBe(361);
      expect(domainTransfer.domain_id).toBe(182245);
      expect(domainTransfer.registrant_id).toBe(2715);
      expect(domainTransfer.state).toBe("cancelled");
      expect(domainTransfer.auto_renew).toBe(false);
      expect(domainTransfer.whois_privacy).toBe(false);
      expect(domainTransfer.status_description).toBe("Canceled by customer");
      expect(domainTransfer.created_at).toBe("2020-06-05T18:08:00Z");
      expect(domainTransfer.updated_at).toBe("2020-06-05T18:10:01Z");
    });
  });

  describe("#cancelDomainTransfer", () => {
    it("cancels a domain transfer", async () => {
      nock("https://api.dnsimple.com")
        .delete("/v2/1010/registrar/domains/example.com/transfers/42")
        .reply(readFixtureAt("cancelDomainTransfer/success.http"));

      const response = await dnsimple.registrar.cancelDomainTransfer(
        accountId,
        domainId,
        42
      );

      const domainTransfer = response.data;
      expect(domainTransfer.id).toBe(361);
      expect(domainTransfer.domain_id).toBe(182245);
      expect(domainTransfer.registrant_id).toBe(2715);
      expect(domainTransfer.state).toBe("transferring");
      expect(domainTransfer.auto_renew).toBe(false);
      expect(domainTransfer.whois_privacy).toBe(false);
      expect(domainTransfer.status_description).toBe(null);
      expect(domainTransfer.created_at).toBe("2020-06-05T18:08:00Z");
      expect(domainTransfer.updated_at).toBe("2020-06-05T18:08:04Z");
    });
  });

  describe("#transferDomainOut", () => {
    it("produces nothing", async () => {
      nock("https://api.dnsimple.com")
        .post("/v2/1010/registrar/domains/example.com/authorize_transfer_out")
        .reply(readFixtureAt("authorizeDomainTransferOut/success.http"));

      const response = await dnsimple.registrar.transferDomainOut(
        accountId,
        domainId
      );

      expect(response).toEqual({});
    });
  });
});
