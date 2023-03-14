import { expect } from "chai";
import * as nock from "nock";
import { createTestClient, loadFixture, stubRequest } from "./util";

const dnsimple = createTestClient();

describe("registrar", () => {
  const accountId = 1010;
  const domainId = "example.com";

  describe("#checkDomain", () => {
    const domainId = "ruby.codes";
    const fixture = loadFixture("checkDomain/success.http");

    it("produces a check result", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/registrar/domains/ruby.codes/check")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.checkDomain(accountId, domainId).then(
        (response) => {
          const checkResult = response.data;
          expect(checkResult.domain).to.eql("ruby.codes");
          expect(checkResult.available).to.eq(true);
          expect(checkResult.premium).to.eq(true);
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });

  describe("#getDomainPremiumPrice", () => {
    describe("when the domain has a premium price", () => {
      const domainId = "ruby.codes";
      const fixture = loadFixture("getDomainPremiumPrice/success.http");

      it("produces a premium price result", (done) => {
        nock("https://api.dnsimple.com")
          .get("/v2/1010/registrar/domains/ruby.codes/premium_price")
          .reply(fixture.statusCode, fixture.body);

        dnsimple.registrar.getDomainPremiumPrice(accountId, domainId).then(
          (response) => {
            const premiumPriceResult = response.data;
            expect(premiumPriceResult.premium_price).to.eql("109.00");
            expect(premiumPriceResult.action).to.eql("registration");
            done();
          },
          (error) => {
            done(error);
          }
        );
      });
    });

    describe("when the domain is not a premium domain", () => {
      const domainId = "example.com";
      const fixture = loadFixture("getDomainPremiumPrice/failure.http");

      it("produces an error", (done) => {
        nock("https://api.dnsimple.com")
          .get("/v2/1010/registrar/domains/example.com/premium_price")
          .reply(fixture.statusCode, fixture.body);

        dnsimple.registrar.getDomainPremiumPrice(accountId, domainId).then(
          (response) => {
            done();
          },
          (error) => {
            expect(error).to.not.eq(null);
            expect(error.description).to.eq("Bad request");
            expect(error.message).to.eq(
              "`example.com` is not a premium domain for registration"
            );
            done();
          }
        );
      });
    });
  });

  describe("#getDomainPrices", () => {
    describe("when the TLD is supported", () => {
      const fixture = loadFixture("getDomainPrices/success.http");

      it("produces a domain prices result", (done) => {
        nock("https://api.dnsimple.com")
          .get("/v2/1010/registrar/domains/bingo.pizza/prices")
          .reply(fixture.statusCode, fixture.body);

        dnsimple.registrar.getDomainPrices(accountId, "bingo.pizza").then(
          (response) => {
            const pricesResult = response.data;
            expect(pricesResult.domain).to.eql("bingo.pizza");
            expect(pricesResult.premium).to.eql(true);
            expect(pricesResult.registration_price).to.eql(20.0);
            expect(pricesResult.renewal_price).to.eql(20.0);
            expect(pricesResult.transfer_price).to.eql(20.0);
            done();
          },
          (error) => {
            done(error);
          }
        );
      });
    });

    describe("when the TLD is not available", () => {
      const fixture = loadFixture("getDomainPrices/failure.http");

      it("produces an error", (done) => {
        nock("https://api.dnsimple.com")
          .get("/v2/1010/registrar/domains/bingo.pineaple/prices")
          .reply(fixture.statusCode, fixture.body);

        dnsimple.registrar.getDomainPrices(accountId, "bingo.pineaple").then(
          (response) => {
            done();
          },
          (error) => {
            expect(error).to.not.eq(null);
            expect(error.description).to.eq("Bad request");
            expect(error.message).to.eq("TLD .PINEAPPLE is not supported");
            done();
          }
        );
      });
    });
  });

  describe("#getDomainRegistration", () => {
    it("calls the correct method", (done) => {
      // TODO Use shared global client and remove `done()` call once all other tests migrate away from testing fixture responses.
      const dnsimple = createTestClient();
      const stub = stubRequest(dnsimple);

      const options = {};
      dnsimple.registrar.getDomainRegistration(
        1010,
        "example.com",
        1535,
        options
      );
      expect(
        stub.calledOnceWithExactly(
          "GET",
          "/1010/registrar/domains/example.com/registrations/1535",
          null,
          options
        )
      ).to.equal(true);
      done();
    });
  });

  describe("#getDomainRenewal", () => {
    it("calls the correct method", (done) => {
      // TODO Use shared global client and remove `done()` call once all other tests migrate away from testing fixture responses.
      const dnsimple = createTestClient();
      const stub = stubRequest(dnsimple);

      const options = {};
      dnsimple.registrar.getDomainRenewal(1023, "example.com", 1694, options);
      expect(
        stub.calledOnceWithExactly(
          "GET",
          "/1023/registrar/domains/example.com/renewals/1694",
          null,
          options
        )
      ).to.equal(true);
      done();
    });
  });

  describe("#registerDomain", () => {
    const fixture = loadFixture("registerDomain/success.http");

    it("produces a domain", (done) => {
      const attributes = { registrant_id: "10" } as any;

      nock("https://api.dnsimple.com")
        .post(
          "/v2/1010/registrar/domains/example.com/registrations",
          attributes
        )
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.registerDomain(accountId, domainId, attributes).then(
        (response) => {
          const domainRegistration = response.data;
          expect(domainRegistration.id).to.eq(1);
          expect(domainRegistration.state).to.eq("new");
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });

  describe("#domainRenew", () => {
    const fixture = loadFixture("renewDomain/success.http");

    it("produces a domain", (done) => {
      const attributes = { period: "3" } as any;

      nock("https://api.dnsimple.com")
        .post("/v2/1010/registrar/domains/example.com/renewals", attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.domainRenew(accountId, domainId, attributes).then(
        (response) => {
          const domainRenewal = response.data;
          expect(domainRenewal.id).to.eq(1);
          expect(domainRenewal.state).to.eq("new");
          done();
        },
        (error) => {
          done(error);
        }
      );
    });

    describe("when it is too soon for the domain to be renewed", () => {
      const fixture = loadFixture("renewDomain/error-tooearly.http");

      it("results in an error", (done) => {
        const attributes = {} as any;

        nock("https://api.dnsimple.com")
          .post("/v2/1010/registrar/domains/example.com/renewals", attributes)
          .reply(fixture.statusCode, fixture.body);

        dnsimple.registrar.domainRenew(accountId, domainId, attributes).then(
          (response) => {
            done("Expected error, but future resolved");
          },
          (error) => {
            expect(error).to.not.eq(null);
            done();
          }
        );
      });
    });
  });

  describe("#transferDomain", () => {
    const attributes = { registrant_id: "10", auth_code: "x1y2z3" } as any;

    it("produces a domain", (done) => {
      const fixture = loadFixture("transferDomain/success.http");
      nock("https://api.dnsimple.com")
        .post("/v2/1010/registrar/domains/example.com/transfers", attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.transferDomain(accountId, domainId, attributes).then(
        (response) => {
          const domain = response.data;
          expect(domain.id).to.eq(1);
          expect(domain.state).to.eq("transferring");
          done();
        },
        (error) => {
          done(error);
        }
      );
    });

    describe("when the domain is already in DNSimple", () => {
      const fixture = loadFixture("transferDomain/error-indnsimple.http");

      it("results in an error", (done) => {
        nock("https://api.dnsimple.com")
          .post("/v2/1010/registrar/domains/example.com/transfers", attributes)
          .reply(fixture.statusCode, fixture.body);

        dnsimple.registrar.transferDomain(accountId, domainId, attributes).then(
          (response) => {
            done("Expected error, but future resolved");
          },
          (error) => {
            expect(error).to.not.eq(null);
            done();
          }
        );
      });
    });

    describe("when authcode was not provided and is required by the TLD", () => {
      const fixture = loadFixture("transferDomain/error-missing-authcode.http");

      it("results in an error", (done) => {
        const attributes = { registrant_id: "10" } as any;

        nock("https://api.dnsimple.com")
          .post("/v2/1010/registrar/domains/example.com/transfers", attributes)
          .reply(fixture.statusCode, fixture.body);

        dnsimple.registrar.transferDomain(accountId, domainId, attributes).then(
          (response) => {
            done("Expected error, but future resolved");
          },
          (error) => {
            expect(error).to.not.eq(null);
            done();
          }
        );
      });
    });
  });

  describe("#getDomainTransfer", () => {
    const fixture = loadFixture("getDomainTransfer/success.http");

    it("retrieves a domain transfer", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/registrar/domains/example.com/transfers/42")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.getDomainTransfer(accountId, domainId, 42).then(
        (response) => {
          const domainTransfer = response.data;
          expect(domainTransfer.id).to.eq(361);
          expect(domainTransfer.domain_id).to.eq(182245);
          expect(domainTransfer.registrant_id).to.eq(2715);
          expect(domainTransfer.state).to.eq("cancelled");
          expect(domainTransfer.auto_renew).to.eq(false);
          expect(domainTransfer.whois_privacy).to.eq(false);
          expect(domainTransfer.status_description).to.eq(
            "Canceled by customer"
          );
          expect(domainTransfer.created_at).to.eq("2020-06-05T18:08:00Z");
          expect(domainTransfer.updated_at).to.eq("2020-06-05T18:10:01Z");
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });

  describe("#cancelDomainTransfer", () => {
    const fixture = loadFixture("cancelDomainTransfer/success.http");

    it("cancels a domain transfer", (done) => {
      nock("https://api.dnsimple.com")
        .delete("/v2/1010/registrar/domains/example.com/transfers/42")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.cancelDomainTransfer(accountId, domainId, 42).then(
        (response) => {
          const domainTransfer = response.data;
          expect(domainTransfer.id).to.eq(361);
          expect(domainTransfer.domain_id).to.eq(182245);
          expect(domainTransfer.registrant_id).to.eq(2715);
          expect(domainTransfer.state).to.eq("transferring");
          expect(domainTransfer.auto_renew).to.eq(false);
          expect(domainTransfer.whois_privacy).to.eq(false);
          expect(domainTransfer.status_description).to.eq(null);
          expect(domainTransfer.created_at).to.eq("2020-06-05T18:08:00Z");
          expect(domainTransfer.updated_at).to.eq("2020-06-05T18:08:04Z");
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });

  describe("#authorizeDomainTransferOut", () => {
    const fixture = loadFixture("authorizeDomainTransferOut/success.http");

    it("produces nothing", (done) => {
      nock("https://api.dnsimple.com")
        .post("/v2/1010/registrar/domains/example.com/authorize_transfer_out")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.registrar.authorizeDomainTransferOut(accountId, domainId).then(
        (response) => {
          expect(response).to.eql({});
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });
});
