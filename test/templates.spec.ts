import { expect } from "chai";
import * as nock from "nock";
import { NotFoundError } from "../lib/main";
import { createTestClient, loadFixture } from "./util";

const dnsimple = createTestClient();

describe("templates", () => {
  describe("#listTemplates", () => {
    const accountId = 1010;
    const fixture = loadFixture("listTemplates/success.http");

    it("supports pagination", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/templates?page=1")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.listTemplates(accountId, { page: 1 });

      nock.isDone();
      done();
    });

    it("supports extra request options", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/templates?foo=bar")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.listTemplates(accountId, { foo: "bar" });

      nock.isDone();
      done();
    });

    it("supports sorting", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/templates?sort=name%3Aasc")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.listTemplates(accountId, { sort: "name:asc" });

      nock.isDone();
      done();
    });

    it("produces a template list", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/templates")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.listTemplates(accountId).then(
        (response) => {
          const templates = response.data;
          expect(templates.length).to.eq(2);
          expect(templates[0].name).to.eq("Alpha");
          expect(templates[0].account_id).to.eq(1010);
          done();
        },
        (error) => {
          done(error);
        }
      );
    });

    it("exposes the pagination info", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/templates")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.listTemplates(accountId).then(
        (response) => {
          const pagination = response.pagination;
          expect(pagination).to.not.eq(null);
          expect(pagination.current_page).to.eq(1);
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });

  describe("#listTemplates.collectAll", () => {
    const accountId = 1010;

    it("produces a complete list", (done) => {
      const fixture1 = loadFixture("pages-1of3.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/templates?page=1")
        .reply(fixture1.statusCode, fixture1.body);

      const fixture2 = loadFixture("pages-2of3.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/templates?page=2")
        .reply(fixture2.statusCode, fixture2.body);

      const fixture3 = loadFixture("pages-3of3.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/templates?page=3")
        .reply(fixture3.statusCode, fixture3.body);

      dnsimple.templates.listTemplates
        .collectAll(accountId)
        .then(
          (items) => {
            expect(items.length).to.eq(5);
            expect(items[0].id).to.eq(1);
            expect(items[4].id).to.eq(5);
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

  describe("#getTemplate", () => {
    const accountId = 1010;
    const templateId = "name";

    it("produces a template", (done) => {
      const fixture = loadFixture("getTemplate/success.http");

      nock("https://api.dnsimple.com")
        .get("/v2/1010/templates/name")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.getTemplate(accountId, templateId).then(
        (response) => {
          const template = response.data;
          expect(template.id).to.eq(1);
          expect(template.account_id).to.eq(1010);
          expect(template.name).to.eq("Alpha");
          expect(template.sid).to.eq("alpha");
          expect(template.description).to.eq("An alpha template.");
          expect(template.created_at).to.eq("2016-03-22T11:08:58Z");
          expect(template.updated_at).to.eq("2016-03-22T11:08:58Z");
          done();
        },
        (error) => {
          done(error);
        }
      );
    });

    describe("when the template does not exist", () => {
      it("produces an error", (done) => {
        const fixture = loadFixture("notfound-template.http");

        nock("https://api.dnsimple.com")
          .get("/v2/1010/templates/name")
          .reply(fixture.statusCode, fixture.body);

        dnsimple.templates.getTemplate(accountId, templateId).then(
          (response) => {
            done();
          },
          (error) => {
            expect(error).to.be.instanceOf(NotFoundError);
            expect(error.data.message).to.eq("Template `beta` not found");
            done();
          }
        );
      });
    });
  });

  describe("#createTemplate", () => {
    const accountId = 1010;
    const attributes = { name: "Beta" } as any;
    const fixture = loadFixture("createTemplate/created.http");

    it("builds the correct request", (done) => {
      nock("https://api.dnsimple.com")
        .post("/v2/1010/templates", { name: "Beta" })
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.createTemplate(accountId, attributes);

      nock.isDone();
      done();
    });

    it("produces a template", (done) => {
      nock("https://api.dnsimple.com")
        .post("/v2/1010/templates")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.createTemplate(accountId, attributes).then(
        (response) => {
          const template = response.data;
          expect(template.id).to.eq(1);
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });

  describe("#updateTemplate", () => {
    const accountId = 1010;
    const templateId = 1;
    const attributes = { name: "Alpha" } as any;
    const fixture = loadFixture("updateTemplate/success.http");

    it("builds the correct request", (done) => {
      nock("https://api.dnsimple.com")
        .patch("/v2/1010/templates/1", { name: "Alpha" })
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.updateTemplate(accountId, templateId, attributes);

      nock.isDone();
      done();
    });

    it("produces a template", (done) => {
      nock("https://api.dnsimple.com")
        .patch("/v2/1010/templates/1")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.updateTemplate(accountId, templateId, attributes).then(
        (response) => {
          const template = response.data;
          expect(template.id).to.eq(1);
          done();
        },
        (error) => {
          done(error);
        }
      );
    });

    describe("when the template does not exist", () => {
      it("produces an error", (done) => {
        const fixture = loadFixture("notfound-template.http");

        nock("https://api.dnsimple.com")
          .patch("/v2/1010/templates/0")
          .reply(fixture.statusCode, fixture.body);

        dnsimple.templates.updateTemplate(accountId, 0, attributes).then(
          (response) => {
            done();
          },
          (error) => {
            expect(error).to.be.instanceOf(NotFoundError);
            done();
          }
        );
      });
    });
  });

  describe("#deleteTemplate", () => {
    const accountId = 1010;
    const templateId = 1;
    const fixture = loadFixture("deleteTemplate/success.http");

    it("produces nothing", (done) => {
      nock("https://api.dnsimple.com")
        .delete("/v2/1010/templates/1")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.deleteTemplate(accountId, templateId).then(
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

  describe("#applyTemplateToDomain", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const templateId = 1;
    const fixture = loadFixture("applyTemplate/success.http");

    it("produces nothing", (done) => {
      nock("https://api.dnsimple.com")
        .post("/v2/1010/domains/example.com/templates/1")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates
        .applyTemplateToDomain(accountId, domainId, templateId)
        .then(
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

describe("template records", () => {
  describe("#listTemplateRecords", () => {
    const accountId = 1010;
    const templateId = "1";
    const fixture = loadFixture("listTemplateRecords/success.http");

    it("supports pagination", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/templates/1/records?page=1")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.listTemplateRecords(accountId, templateId, {
        page: 1,
      });

      nock.isDone();
      done();
    });

    it("supports extra request options", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/templates/1/records?foo=bar")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.listTemplateRecords(accountId, templateId, {
        foo: "bar",
      });

      nock.isDone();
      done();
    });

    it("supports sorting", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/templates/1/records?sort=name%3Aasc")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.listTemplateRecords(accountId, templateId, {
        sort: "name:asc",
      });

      nock.isDone();
      done();
    });

    it("produces a template list", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/templates/1/records")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.listTemplateRecords(accountId, templateId).then(
        (response) => {
          const records = response.data;
          expect(records.length).to.eq(2);
          done();
        },
        (error) => {
          done(error);
        }
      );
    });

    it("exposes the pagination info", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/templates/1/records")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.listTemplateRecords(accountId, templateId).then(
        (response) => {
          const pagination = response.pagination;
          expect(pagination).to.not.eq(null);
          expect(pagination.current_page).to.eq(1);
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });

  describe("#listTemplateRecords.collectAll", () => {
    const accountId = 1010;
    const templateId = 1;

    it("produces a complete list", (done) => {
      const fixture1 = loadFixture("pages-1of3.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/templates/1/records?page=1")
        .reply(fixture1.statusCode, fixture1.body);

      const fixture2 = loadFixture("pages-2of3.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/templates/1/records?page=2")
        .reply(fixture2.statusCode, fixture2.body);

      const fixture3 = loadFixture("pages-3of3.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/templates/1/records?page=3")
        .reply(fixture3.statusCode, fixture3.body);

      dnsimple.templates.listTemplateRecords
        .collectAll(accountId, templateId)
        .then(
          (items) => {
            expect(items.length).to.eq(5);
            expect(items[0].id).to.eq(1);
            expect(items[4].id).to.eq(5);
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

  describe("#getTemplateRecord", () => {
    const accountId = 1010;
    const templateId = "name";
    const recordId = 1;

    it("produces a template", (done) => {
      const fixture = loadFixture("getTemplateRecord/success.http");

      nock("https://api.dnsimple.com")
        .get("/v2/1010/templates/name/records/1")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates
        .getTemplateRecord(accountId, templateId, recordId)
        .then(
          (response) => {
            const record = response.data;
            expect(record.id).to.eq(301);
            expect(record.template_id).to.eq(268);
            expect(record.name).to.eq("");
            expect(record.content).to.eq("mx.example.com");
            expect(record.ttl).to.eq(600);
            expect(record.priority).to.eq(10);
            expect(record.type).to.eq("MX");
            expect(record.created_at).to.eq("2016-05-03T08:03:26Z");
            expect(record.updated_at).to.eq("2016-05-03T08:03:26Z");
            done();
          },
          (error) => {
            done(error);
          }
        );
    });

    describe("when the template does not exist", () => {
      it("produces an error", (done) => {
        const fixture = loadFixture("notfound-template.http");

        nock("https://api.dnsimple.com")
          .get("/v2/1010/templates/0/records/1")
          .reply(fixture.statusCode, fixture.body);

        dnsimple.templates.getTemplateRecord(accountId, 0, recordId).then(
          (response) => {
            done();
          },
          (error) => {
            expect(error).to.be.instanceOf(NotFoundError);
            expect(error.data.message).to.eq("Template `beta` not found");
            done();
          }
        );
      });
    });

    describe("when the template record does not exist", () => {
      it("produces an error", (done) => {
        const fixture = loadFixture("notfound-record.http");

        nock("https://api.dnsimple.com")
          .get("/v2/1010/templates/name/records/0")
          .reply(fixture.statusCode, fixture.body);

        dnsimple.templates.getTemplateRecord(accountId, templateId, 0).then(
          (response) => {
            done();
          },
          (error) => {
            expect(error).to.be.instanceOf(NotFoundError);
            done();
          }
        );
      });
    });
  });

  describe("#createTemplateRecord", () => {
    const accountId = 1010;
    const templateId = 1;
    const attributes = { content: "mx.example.com" };
    const fixture = loadFixture("createTemplateRecord/created.http");

    it("builds the correct request", (done) => {
      nock("https://api.dnsimple.com")
        .post("/v2/1010/templates/1/records", { content: "mx.example.com" })
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates.createTemplateRecord(
        accountId,
        templateId,
        attributes
      );

      nock.isDone();
      done();
    });

    it("produces a record", (done) => {
      nock("https://api.dnsimple.com")
        .post("/v2/1010/templates/1/records")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates
        .createTemplateRecord(accountId, templateId, attributes)
        .then(
          (response) => {
            const record = response.data;
            expect(record.id).to.eq(300);
            done();
          },
          (error) => {
            done(error);
          }
        );
    });
  });

  describe("#deleteTemplateRecord", () => {
    const accountId = 1010;
    const templateId = 1;
    const recordId = 2;
    const fixture = loadFixture("deleteTemplateRecord/success.http");

    it("produces nothing", (done) => {
      nock("https://api.dnsimple.com")
        .delete("/v2/1010/templates/1/records/2")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.templates
        .deleteTemplateRecord(accountId, templateId, recordId)
        .then(
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
