import type DNSimple from "./main";
import type { QueryParams } from "./main";
import paginate from "./paginate";

export default class Templates {
  constructor(private readonly _client: DNSimple) {}

  /**
   * Lists the templates in the account.
   *
   * This API is paginated. Call `listTemplates.paginate(...args)` to use the pagination helper and iterate individual items across pages; see {@link paginate} for more details and examples.
   *
   * GET /{account}/templates
   *
   * @param account The account id
   * @param params Query parameters
   * @param params.sort Sort results. Default sorting is by id ascending.
   */
  listTemplates = (() => {
    const method = (
      account: number,
      params: QueryParams & { sort?: string } = {}
    ): Promise<{
      data: Array<{
        id: number;
        account_id: number;
        name: string;
        sid: string;
        description: string;
        created_at: string;
        updated_at: string;
      }>;
      pagination: {
        current_page: number;
        per_page: number;
        total_entries: number;
        total_pages: number;
      };
    }> => this._client.request("GET", `/${account}/templates`, null, params);
    method.paginate = (
      account: number,
      params: QueryParams & { sort?: string } = {}
    ) => paginate((page) => method(account, { ...params, page } as any));
    return method;
  })();

  /**
   * Creates a template.
   *
   * POST /{account}/templates
   *
   * @param account The account id
   * @param params Query parameters
   */
  createTemplate = (() => {
    const method = (
      account: number,
      data: { sid: string; name: string; description: string },
      params: QueryParams & {} = {}
    ): Promise<{
      data: {
        id: number;
        account_id: number;
        name: string;
        sid: string;
        description: string;
        created_at: string;
        updated_at: string;
      };
    }> => this._client.request("POST", `/${account}/templates`, data, params);
    return method;
  })();

  /**
   * Retrieves the details of an existing template.
   *
   * GET /{account}/templates/{template}
   *
   * @param account The account id
   * @param template The template id
   * @param params Query parameters
   */
  getTemplate = (() => {
    const method = (
      account: number,
      template: number,
      params: QueryParams & {} = {}
    ): Promise<{
      data: {
        id: number;
        account_id: number;
        name: string;
        sid: string;
        description: string;
        created_at: string;
        updated_at: string;
      };
    }> =>
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
   * @param account The account id
   * @param template The template id
   * @param params Query parameters
   */
  updateTemplate = (() => {
    const method = (
      account: number,
      template: number,
      data: { sid: string; name: string; description: string },
      params: QueryParams & {} = {}
    ): Promise<{
      data: {
        id: number;
        account_id: number;
        name: string;
        sid: string;
        description: string;
        created_at: string;
        updated_at: string;
      };
    }> =>
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
   * @param account The account id
   * @param template The template id
   * @param params Query parameters
   */
  deleteTemplate = (() => {
    const method = (
      account: number,
      template: number,
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
   * This API is paginated. Call `listTemplateRecords.paginate(...args)` to use the pagination helper and iterate individual items across pages; see {@link paginate} for more details and examples.
   *
   * GET /{account}/templates/{template}/records
   *
   * @param account The account id
   * @param template The template id
   * @param params Query parameters
   * @param params.sort Sort results. Default sorting is by id ascending.
   */
  listTemplateRecords = (() => {
    const method = (
      account: number,
      template: number,
      params: QueryParams & { sort?: string } = {}
    ): Promise<{
      data: Array<{
        id: number;
        template_id: number;
        name: string;
        content: string;
        ttl: number;
        priority: number | null;
        type: string;
        created_at: string;
        updated_at: string;
      }>;
      pagination: {
        current_page: number;
        per_page: number;
        total_entries: number;
        total_pages: number;
      };
    }> =>
      this._client.request(
        "GET",
        `/${account}/templates/${template}/records`,
        null,
        params
      );
    method.paginate = (
      account: number,
      template: number,
      params: QueryParams & { sort?: string } = {}
    ) =>
      paginate((page) => method(account, template, { ...params, page } as any));
    return method;
  })();

  /**
   * Creates a new template record.
   *
   * POST /{account}/templates/{template}/records
   *
   * @param account The account id
   * @param template The template id
   * @param params Query parameters
   */
  createTemplateRecord = (() => {
    const method = (
      account: number,
      template: number,
      data: {},
      params: QueryParams & {} = {}
    ): Promise<{
      data: {
        id: number;
        template_id: number;
        name: string;
        content: string;
        ttl: number;
        priority: number | null;
        type: string;
        created_at: string;
        updated_at: string;
      };
    }> =>
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
   * @param account The account id
   * @param template The template id
   * @param templaterecord The template record id
   * @param params Query parameters
   */
  getTemplateRecord = (() => {
    const method = (
      account: number,
      template: number,
      templaterecord: number,
      params: QueryParams & {} = {}
    ): Promise<{
      data: {
        id: number;
        template_id: number;
        name: string;
        content: string;
        ttl: number;
        priority: number | null;
        type: string;
        created_at: string;
        updated_at: string;
      };
    }> =>
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
   * @param account The account id
   * @param template The template id
   * @param templaterecord The template record id
   * @param params Query parameters
   */
  deleteTemplateRecord = (() => {
    const method = (
      account: number,
      template: number,
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
   * @param account The account id
   * @param domain The domain name or id
   * @param template The template id
   * @param params Query parameters
   */
  applyTemplateToDomain = (() => {
    const method = (
      account: number,
      domain: string,
      template: number,
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
