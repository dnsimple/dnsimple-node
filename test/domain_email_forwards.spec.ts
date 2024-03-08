import * as nock from "nock";
import { NotFoundError } from "../lib/main";
import { createTestClient, loadFixture } from "./util";

const dnsimple = createTestClient();

describe("domains", () => {
  describe("#listEmailForwards", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const fixture = loadFixture("listEmailForwards/success.http");

    it("supports pagination", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/email_forwards?page=1")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.listEmailForwards(accountId, domainId, { page: 1 });

      nock.isDone();
      done();
    });

    it("supports extra request options", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/email_forwards?foo=bar")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.listEmailForwards(accountId, domainId, {
        foo: "bar",
      });

      nock.isDone();
      done();
    });

    it("supports sorting", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/email_forwards?sort=from%3Aasc")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.listEmailForwards(accountId, domainId, {
        sort: "from:asc",
      });

      nock.isDone();
      done();
    });

    it("produces an email forward list", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/email_forwards")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.listEmailForwards(accountId, domainId).then(
        (response) => {
          const emailForwards = response.data;
          expect(emailForwards.length).toBe(2);
          done();
        },
        (error) => {
          done(error);
        }
      );
    });

    it("exposes the pagination info", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/email_forwards")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.listEmailForwards(accountId, domainId).then(
        (response) => {
          const pagination = response.pagination;
          expect(pagination).not.toBe(null);
          expect(pagination.current_page).toBe(1);
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });

  describe("#listEmailForwards.collectAll", () => {
    const accountId = 1010;
    const domainId = "example.com";

    it("produces a complete list", (done) => {
      const fixture1 = loadFixture("pages-1of3.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/email_forwards?page=1")
        .reply(fixture1.statusCode, fixture1.body);

      const fixture2 = loadFixture("pages-2of3.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/email_forwards?page=2")
        .reply(fixture2.statusCode, fixture2.body);

      const fixture3 = loadFixture("pages-3of3.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/email_forwards?page=3")
        .reply(fixture3.statusCode, fixture3.body);

      dnsimple.domains.listEmailForwards
        .collectAll(accountId, domainId)
        .then(
          (items) => {
            expect(items.length).toBe(5);
            expect(items[0].id).toBe(1);
            expect(items[4].id).toBe(5);
            done();
          },
          (error) => {
            done(error);
          }
        )
        .catch((error) => {
          done(error);
        });
    });
  });

  describe("#getEmailForward", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const emailForwardId = 41872;
    const fixture = loadFixture("getEmailForward/success.http");

    it("produces an email forward", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/email_forwards/41872")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains
        .getEmailForward(accountId, domainId, emailForwardId)
        .then(
          (response) => {
            const emailForward = response.data;
            expect(emailForward.id).toBe(41872);
            expect(emailForward.domain_id).toBe(235146);
            expect(emailForward.from).toBe("example@dnsimple.xyz");
            expect(emailForward.to).toBe("example@example.com");
            expect(emailForward.created_at).toBe("2021-01-25T13:54:40Z");
            expect(emailForward.updated_at).toBe("2021-01-25T13:54:40Z");
            done();
          },
          (error) => {
            done(error);
          }
        );
    });

    describe("when the email forward does not exist", () => {
      const fixture = loadFixture("notfound-emailforward.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/email_forwards/0")
        .reply(fixture.statusCode, fixture.body);

      it("produces an error", (done) => {
        dnsimple.domains.getEmailForward(accountId, domainId, 0).then(
          (response) => {
            done();
          },
          (error) => {
            expect(error).toBeInstanceOf(NotFoundError);
            expect(error.data.message).toBe("Email forward `0` not found");
            done();
          }
        );
      });
    });
  });

  describe("#createEmailForward", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const attributes = { alias_name: "jim" };
    const fixture = loadFixture("createEmailForward/created.http");

    it("builds the correct request", (done) => {
      nock("https://api.dnsimple.com")
        .post("/v2/1010/domains/example.com/email_forwards", attributes)
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.createEmailForward(accountId, domainId, attributes);

      nock.isDone();
      done();
    });

    it("produces an email forward", (done) => {
      nock("https://api.dnsimple.com")
        .post("/v2/1010/domains/example.com/email_forwards")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains.createEmailForward(accountId, domainId, attributes).then(
        (response) => {
          const emailForward = response.data;
          expect(emailForward.id).toBe(41872);
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });

  describe("#deleteEmailForward", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const emailForwardId = 1;
    const fixture = loadFixture("deleteEmailForward/success.http");

    it("produces nothing", (done) => {
      nock("https://api.dnsimple.com")
        .delete("/v2/1010/domains/example.com/email_forwards/1")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.domains
        .deleteEmailForward(accountId, domainId, emailForwardId)
        .then(
          (response) => {
            expect(response).toEqual({});
            done();
          },
          (error) => {
            done(error);
          }
        );
    });
  });
});
