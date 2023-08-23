import type { DNSimple, QueryParams } from "./main";
import { paginate } from "./paginate";
import type * as types from "./types";

export class Templates {
  constructor(private readonly _client: DNSimple) {}

  /**
   * Lists the templates in the account.
   *
   * This API is paginated. Call `listTemplates.iterateAll(account, params)` to get an asynchronous iterator over individual items across all pages. You can also use `await listTemplates.collectAll(account, params)` to quickly retrieve all items across all pages into an array. We suggest using `iterateAll` when possible, as `collectAll` will make all requests at once, which may increase latency and trigger rate limits.
   *
   * GET /{account}/templates
   *
   * @see https://developer.dnsimple.com/v2/templates/#listTemplates
   *
   * @param account The account id
   * @param params Query parameters
   * @param params.sort Sort results. Default sorting is by id ascending.
   */
  listTemplates = (() => {
    const method = (
      account: number,
      params: QueryParams & {
        sort?:
          | "id:asc"
          | "id:desc"
          | "name:asc"
          | "name:desc"
          | "sid:asc"
          | "sid:desc";
      } = {}
    ): Promise<{ data: Array<types.Template>; pagination: types.Pagination }> =>
      this._client.request("GET", `/${account}/templates`, null, params);
    method.iterateAll = (
      account: number,
      params: QueryParams & {
        sort?:
          | "id:asc"
          | "id:desc"
          | "name:asc"
          | "name:desc"
          | "sid:asc"
          | "sid:desc";
      } = {}
    ) => paginate((page) => method(account, { ...params, page } as any));
    method.collectAll = async (
      account: number,
      params: QueryParams & {
        sort?:
          | "id:asc"
          | "id:desc"
          | "name:asc"
          | "name:desc"
          | "sid:asc"
          | "sid:desc";
      } = {}
    ) => {
      const items = [];
      for await (const item of method.iterateAll(account, params)) {
        items.push(item);
      }
      return items;
    };
    return method;
  })();

  /**
   * Creates a template.
   *
   * POST /{account}/templates
   *
   * @see https://developer.dnsimple.com/v2/templates/#createTemplate
   *
   * @param account The account id
   * @param params Query parameters
   */
  createTemplate = (() => {
    const method = (
      account: number,
      data: Partial<{ sid: string; name: string; description: string }>,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.Template }> =>
      this._client.request("POST", `/${account}/templates`, data, params);
    return method;
  })();

  /**
   * Retrieves the details of an existing template.
   *
   * GET /{account}/templates/{template}
   *
   * @see https://developer.dnsimple.com/v2/templates/#getTemplate
   *
   * @param account The account id
   * @param template The template id or short name
   * @param params Query parameters
   */
  getTemplate = (() => {
    const method = (
      account: number,
      template: string,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.Template }> =>
      this._client.request(
        "GET",
        `/${account}/templates/${template}`,
        null,
        params
      );
    return method;
  })();

  /**
   * Updates the template details.
   *
   * PATCH /{account}/templates/{template}
   *
   * @see https://developer.dnsimple.com/v2/templates/#updateTemplate
   *
   * @param account The account id
   * @param template The template id or short name
   * @param params Query parameters
   */
  updateTemplate = (() => {
    const method = (
      account: number,
      template: string,
      data: Partial<{ sid: string; name: string; description: string }>,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.Template }> =>
      this._client.request(
        "PATCH",
        `/${account}/templates/${template}`,
        data,
        params
      );
    return method;
  })();

  /**
   * Permanently deletes a template.
   *
   * DELETE /{account}/templates/{template}
   *
   * @see https://developer.dnsimple.com/v2/templates/#deleteTemplate
   *
   * @param account The account id
   * @param template The template id or short name
   * @param params Query parameters
   */
  deleteTemplate = (() => {
    const method = (
      account: number,
      template: string,
      params: QueryParams & {} = {}
    ): Promise<{}> =>
      this._client.request(
        "DELETE",
        `/${account}/templates/${template}`,
        null,
        params
      );
    return method;
  })();

  /**
   * Lists the records for a template.
   *
   * This API is paginated. Call `listTemplateRecords.iterateAll(account, template, params)` to get an asynchronous iterator over individual items across all pages. You can also use `await listTemplateRecords.collectAll(account, template, params)` to quickly retrieve all items across all pages into an array. We suggest using `iterateAll` when possible, as `collectAll` will make all requests at once, which may increase latency and trigger rate limits.
   *
   * GET /{account}/templates/{template}/records
   *
   * @see https://developer.dnsimple.com/v2/templates/#listTemplateRecords
   *
   * @param account The account id
   * @param template The template id or short name
   * @param params Query parameters
   * @param params.sort Sort results. Default sorting is by id ascending.
   */
  listTemplateRecords = (() => {
    const method = (
      account: number,
      template: string,
      params: QueryParams & {
        sort?:
          | "id:asc"
          | "id:desc"
          | "name:asc"
          | "name:desc"
          | "content:asc"
          | "content:desc"
          | "type:asc"
          | "type:desc";
      } = {}
    ): Promise<{
      data: Array<types.TemplateRecord>;
      pagination: types.Pagination;
    }> =>
      this._client.request(
        "GET",
        `/${account}/templates/${template}/records`,
        null,
        params
      );
    method.iterateAll = (
      account: number,
      template: string,
      params: QueryParams & {
        sort?:
          | "id:asc"
          | "id:desc"
          | "name:asc"
          | "name:desc"
          | "content:asc"
          | "content:desc"
          | "type:asc"
          | "type:desc";
      } = {}
    ) =>
      paginate((page) => method(account, template, { ...params, page } as any));
    method.collectAll = async (
      account: number,
      template: string,
      params: QueryParams & {
        sort?:
          | "id:asc"
          | "id:desc"
          | "name:asc"
          | "name:desc"
          | "content:asc"
          | "content:desc"
          | "type:asc"
          | "type:desc";
      } = {}
    ) => {
      const items = [];
      for await (const item of method.iterateAll(account, template, params)) {
        items.push(item);
      }
      return items;
    };
    return method;
  })();

  /**
   * Creates a new template record.
   *
   * POST /{account}/templates/{template}/records
   *
   * @see https://developer.dnsimple.com/v2/templates/#createTemplateRecord
   *
   * @param account The account id
   * @param template The template id or short name
   * @param params Query parameters
   */
  createTemplateRecord = (() => {
    const method = (
      account: number,
      template: string,
      data: Partial<{}>,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.TemplateRecord }> =>
      this._client.request(
        "POST",
        `/${account}/templates/${template}/records`,
        data,
        params
      );
    return method;
  })();

  /**
   * Retrieves the details of an existing template record.
   *
   * GET /{account}/templates/{template}/records/{templaterecord}
   *
   * @see https://developer.dnsimple.com/v2/templates/#getTemplateRecord
   *
   * @param account The account id
   * @param template The template id or short name
   * @param templaterecord The template record id
   * @param params Query parameters
   */
  getTemplateRecord = (() => {
    const method = (
      account: number,
      template: string,
      templaterecord: number,
      params: QueryParams & {} = {}
    ): Promise<{ data: types.TemplateRecord }> =>
      this._client.request(
        "GET",
        `/${account}/templates/${template}/records/${templaterecord}`,
        null,
        params
      );
    return method;
  })();

  /**
   * Permanently deletes a template record.
   *
   * DELETE /{account}/templates/{template}/records/{templaterecord}
   *
   * @see https://developer.dnsimple.com/v2/templates/#deleteTemplateRecord
   *
   * @param account The account id
   * @param template The template id or short name
   * @param templaterecord The template record id
   * @param params Query parameters
   */
  deleteTemplateRecord = (() => {
    const method = (
      account: number,
      template: string,
      templaterecord: number,
      params: QueryParams & {} = {}
    ): Promise<{}> =>
      this._client.request(
        "DELETE",
        `/${account}/templates/${template}/records/${templaterecord}`,
        null,
        params
      );
    return method;
  })();

  /**
   * Applies a template to a domain.
   *
   * POST /{account}/domains/{domain}/templates/{template}
   *
   * @see https://developer.dnsimple.com/v2/templates/#applyTemplateToDomain
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param template The template id or short name
   * @param params Query parameters
   */
  applyTemplate = (() => {
    const method = (
      account: number,
      domain: string,
      template: string,
      params: QueryParams & {} = {}
    ): Promise<{}> =>
      this._client.request(
        "POST",
        `/${account}/domains/${domain}/templates/${template}`,
        null,
        params
      );
    return method;
  })();
}
