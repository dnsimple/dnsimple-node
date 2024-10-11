import fetchMock from "fetch-mock";
import { NotFoundError } from "../lib/main";
import { createTestClient, responseFromFixture } from "./util";

const dnsimple = createTestClient();

describe("templates", () => {
  describe("#listTemplates", () => {
    const accountId = 1010;

    it("supports pagination", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/templates?page=1",
        responseFromFixture("listTemplates/success.http")
      );

      await dnsimple.templates.listTemplates(accountId, { page: 1 });

      expect(fetchMock.calls()).not.toBe([]);
    });

    it("supports extra request options", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/templates?foo=bar",
        responseFromFixture("listTemplates/success.http")
      );

      await dnsimple.templates.listTemplates(accountId, { foo: "bar" });

      expect(fetchMock.calls()).not.toBe([]);
    });

    it("supports sorting", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/templates?sort=name%3Aasc",
        responseFromFixture("listTemplates/success.http")
      );

      await dnsimple.templates.listTemplates(accountId, { sort: "name:asc" });

      expect(fetchMock.calls()).not.toBe([]);
    });

    it("produces a template list", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/templates",
        responseFromFixture("listTemplates/success.http")
      );

      const response = await dnsimple.templates.listTemplates(accountId);

      const templates = response.data;
      expect(templates.length).toBe(2);
      expect(templates[0].name).toBe("Alpha");
      expect(templates[0].account_id).toBe(1010);
    });

    it("exposes the pagination info", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/templates",
        responseFromFixture("listTemplates/success.http")
      );

      const response = await dnsimple.templates.listTemplates(accountId);

      const pagination = response.pagination;
      expect(pagination).not.toBe(null);
      expect(pagination.current_page).toBe(1);
    });
  });

  describe("#listTemplates.collectAll", () => {
    const accountId = 1010;

    it("produces a complete list", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/templates?page=1",
        responseFromFixture("pages-1of3.http")
      );

      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/templates?page=2",
        responseFromFixture("pages-2of3.http")
      );

      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/templates?page=3",
        responseFromFixture("pages-3of3.http")
      );

      const items =
        await dnsimple.templates.listTemplates.collectAll(accountId);

      expect(items.length).toBe(5);
      expect(items[0].id).toBe(1);
      expect(items[4].id).toBe(5);
    });
  });

  describe("#getTemplate", () => {
    const accountId = 1010;
    const templateId = "name";

    it("produces a template", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/templates/name",
        responseFromFixture("getTemplate/success.http")
      );

      const response = await dnsimple.templates.getTemplate(
        accountId,
        templateId
      );

      const template = response.data;
      expect(template.id).toBe(1);
      expect(template.account_id).toBe(1010);
      expect(template.name).toBe("Alpha");
      expect(template.sid).toBe("alpha");
      expect(template.description).toBe("An alpha template.");
      expect(template.created_at).toBe("2016-03-22T11:08:58Z");
      expect(template.updated_at).toBe("2016-03-22T11:08:58Z");
    });

    describe("when the template does not exist", () => {
      it("produces an error", async () => {
        fetchMock.get(
          "https://api.dnsimple.com/v2/1010/templates/name",
          responseFromFixture("notfound-template.http")
        );

        await expect(
          dnsimple.templates.getTemplate(accountId, templateId)
        ).rejects.toThrow(NotFoundError);
      });
    });
  });

  describe("#createTemplate", () => {
    const accountId = 1010;
    const attributes = { name: "Beta" };

    it("builds the correct request", async () => {
      const expectedPayload = { name: "Beta" };
      fetchMock.post(
        "https://api.dnsimple.com/v2/1010/templates",
        responseFromFixture("createTemplate/created.http")
      );

      await dnsimple.templates.createTemplate(accountId, attributes);

      expect(fetchMock.calls()[0][1]!.body).toEqual(
        JSON.stringify(expectedPayload)
      );
    });

    it("produces a template", async () => {
      fetchMock.post(
        "https://api.dnsimple.com/v2/1010/templates",
        responseFromFixture("createTemplate/created.http")
      );

      const response = await dnsimple.templates.createTemplate(
        accountId,
        attributes
      );

      expect(response.data.id).toBe(1);
    });
  });

  describe("#updateTemplate", () => {
    const accountId = 1010;
    const templateId = 1;
    const attributes = { name: "Alpha" };

    it("builds the correct request", async () => {
      const expectedPayload = { name: "Alpha" };
      fetchMock.patch(
        "https://api.dnsimple.com/v2/1010/templates/1",
        responseFromFixture("updateTemplate/success.http")
      );

      await dnsimple.templates.updateTemplate(
        accountId,
        templateId,
        attributes
      );

      expect(fetchMock.calls()[0][1]!.body).toEqual(
        JSON.stringify(expectedPayload)
      );
    });

    it("produces a template", async () => {
      fetchMock.patch(
        "https://api.dnsimple.com/v2/1010/templates/1",
        responseFromFixture("updateTemplate/success.http")
      );

      const response = await dnsimple.templates.updateTemplate(
        accountId,
        templateId,
        attributes
      );

      expect(response.data.id).toBe(1);
    });

    describe("when the template does not exist", () => {
      it("produces an error", async () => {
        fetchMock.patch(
          "https://api.dnsimple.com/v2/1010/templates/0",
          responseFromFixture("notfound-template.http")
        );

        await expect(
          dnsimple.templates.updateTemplate(accountId, 0, attributes)
        ).rejects.toThrow(NotFoundError);
      });
    });
  });

  describe("#deleteTemplate", () => {
    const accountId = 1010;
    const templateId = 1;

    it("produces nothing", async () => {
      fetchMock.delete(
        "https://api.dnsimple.com/v2/1010/templates/1",
        responseFromFixture("deleteTemplate/success.http")
      );

      const response = await dnsimple.templates.deleteTemplate(
        accountId,
        templateId
      );

      expect(response).toEqual({});
    });
  });

  describe("#applyTemplate", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const templateId = 1;

    it("produces nothing", async () => {
      fetchMock.post(
        "https://api.dnsimple.com/v2/1010/domains/example.com/templates/1",
        responseFromFixture("applyTemplate/success.http")
      );

      const response = await dnsimple.templates.applyTemplate(
        accountId,
        domainId,
        templateId
      );

      expect(response).toEqual({});
    });
  });
});

describe("template records", () => {
  afterEach(() => {
    fetchMock.restore();
  });

  describe("#listTemplateRecords", () => {
    const accountId = 1010;
    const templateId = "1";

    it("supports pagination", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/templates/1/records?page=1",
        responseFromFixture("listTemplateRecords/success.http")
      );

      await dnsimple.templates.listTemplateRecords(accountId, templateId, {
        page: 1,
      });

      expect(fetchMock.calls()).not.toBe([]);
    });

    it("supports extra request options", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/templates/1/records?foo=bar",
        responseFromFixture("listTemplateRecords/success.http")
      );

      await dnsimple.templates.listTemplateRecords(accountId, templateId, {
        foo: "bar",
      });

      expect(fetchMock.calls()).not.toBe([]);
    });

    it("supports sorting", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/templates/1/records?sort=name%3Aasc",
        responseFromFixture("listTemplateRecords/success.http")
      );

      await dnsimple.templates.listTemplateRecords(accountId, templateId, {
        sort: "name:asc",
      });

      expect(fetchMock.calls()).not.toBe([]);
    });

    it("produces a template list", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/templates/1/records",
        responseFromFixture("listTemplateRecords/success.http")
      );

      const response = await dnsimple.templates.listTemplateRecords(
        accountId,
        templateId
      );

      expect(response.data.length).toBe(2);
    });

    it("exposes the pagination info", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/templates/1/records",
        responseFromFixture("listTemplateRecords/success.http")
      );

      const response = await dnsimple.templates.listTemplateRecords(
        accountId,
        templateId
      );

      const pagination = response.pagination;
      expect(pagination).not.toBe(null);
      expect(pagination.current_page).toBe(1);
    });
  });

  describe("#listTemplateRecords.collectAll", () => {
    const accountId = 1010;
    const templateId = 1;

    it("produces a complete list", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/templates/1/records?page=1",
        responseFromFixture("pages-1of3.http")
      );

      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/templates/1/records?page=2",
        responseFromFixture("pages-2of3.http")
      );

      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/templates/1/records?page=3",
        responseFromFixture("pages-3of3.http")
      );

      const items = await dnsimple.templates.listTemplateRecords.collectAll(
        accountId,
        templateId
      );
      expect(items.length).toBe(5);
      expect(items[0].id).toBe(1);
      expect(items[4].id).toBe(5);
    });
  });

  describe("#getTemplateRecord", () => {
    const accountId = 1010;
    const templateId = "name";
    const recordId = 1;

    it("produces a template", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1010/templates/name/records/1",
        responseFromFixture("getTemplateRecord/success.http")
      );

      const response = await dnsimple.templates.getTemplateRecord(
        accountId,
        templateId,
        recordId
      );

      const record = response.data;
      expect(record.id).toBe(301);
      expect(record.template_id).toBe(268);
      expect(record.name).toBe("");
      expect(record.content).toBe("mx.example.com");
      expect(record.ttl).toBe(600);
      expect(record.priority).toBe(10);
      expect(record.type).toBe("MX");
      expect(record.created_at).toBe("2016-05-03T08:03:26Z");
      expect(record.updated_at).toBe("2016-05-03T08:03:26Z");
    });

    describe("when the template does not exist", () => {
      it("produces an error", async () => {
        fetchMock.get(
          "https://api.dnsimple.com/v2/1010/templates/0/records/1",
          responseFromFixture("notfound-template.http")
        );

        await expect(
          dnsimple.templates.getTemplateRecord(accountId, 0, recordId)
        ).rejects.toThrow(NotFoundError);
      });
    });

    describe("when the template record does not exist", () => {
      it("produces an error", async () => {
        fetchMock.get(
          "https://api.dnsimple.com/v2/1010/templates/name/records/0",
          responseFromFixture("notfound-record.http")
        );

        await expect(
          dnsimple.templates.getTemplateRecord(accountId, templateId, 0)
        ).rejects.toThrow(NotFoundError);
      });
    });
  });

  describe("#createTemplateRecord", () => {
    const accountId = 1010;
    const templateId = 1;
    const attributes = { content: "mx.example.com" };

    it("builds the correct request", async () => {
      const expectedPayload = { content: "mx.example.com" };
      fetchMock.post(
        "https://api.dnsimple.com/v2/1010/templates/1/records",
        responseFromFixture("createTemplateRecord/created.http")
      );

      await dnsimple.templates.createTemplateRecord(
        accountId,
        templateId,
        attributes
      );

      expect(fetchMock.calls()[0][1]!.body).toEqual(
        JSON.stringify(expectedPayload)
      );
    });

    it("produces a record", async () => {
      fetchMock.post(
        "https://api.dnsimple.com/v2/1010/templates/1/records",
        responseFromFixture("createTemplateRecord/created.http")
      );

      const response = await dnsimple.templates.createTemplateRecord(
        accountId,
        templateId,
        attributes
      );

      expect(response.data.id).toBe(300);
    });
  });

  describe("#deleteTemplateRecord", () => {
    const accountId = 1010;
    const templateId = 1;
    const recordId = 2;

    it("produces nothing", async () => {
      fetchMock.delete(
        "https://api.dnsimple.com/v2/1010/templates/1/records/2",
        responseFromFixture("deleteTemplateRecord/success.http")
      );

      const response = await dnsimple.templates.deleteTemplateRecord(
        accountId,
        templateId,
        recordId
      );

      expect(response).toEqual({});
    });
  });
});
