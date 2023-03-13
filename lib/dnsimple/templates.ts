import type Client from "./client";
import type { RequestOptions } from "./request";
import paginate from "./paginate";

export default class Templates {
  constructor(private readonly _client: Client) {}

  /**
   * Lists the templates in the account.
   *
   * This API is paginated. Call `listTemplates.paginate(...args)` to use the pagination helper and iterate individual items across pages; see {@link paginate} for more details and examples.
   *
   * GET /{account}/templates
   *
   * @param account The account id
   * @param options Query parameters
   * @param options.sort Sort results. Default sorting is by id ascending.
   */
  listTemplates = (() => {
    const method = (
      account: number,
      options: RequestOptions & { sort?: string } = {}
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
    }> => this._client.request("GET", `/${account}/templates`, null, options);
    method.paginate = (
      account: number,
      options: RequestOptions & { sort?: string } = {}
    ) => paginate((page) => method(account, { ...options, page } as any));
    return method;
  })();

  /**
   * Creates a template.
   *
   * POST /{account}/templates
   *
   * @param account The account id
   * @param options Query parameters
   */
  createTemplate = (() => {
    const method = (
      account: number,
      data: { sid: string; name: string; description: string },
      options: RequestOptions & {} = {}
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
    }> => this._client.request("POST", `/${account}/templates`, data, options);
    return method;
  })();

  /**
   * Retrieves the details of an existing template.
   *
   * GET /{account}/templates/{template}
   *
   * @param account The account id
   * @param template The template id
   * @param options Query parameters
   */
  getTemplate = (() => {
    const method = (
      account: number,
      template: number,
      options: RequestOptions & {} = {}
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
        options
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
   * @param options Query parameters
   */
  updateTemplate = (() => {
    const method = (
      account: number,
      template: number,
      data: { sid: string; name: string; description: string },
      options: RequestOptions & {} = {}
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
        options
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
   * @param options Query parameters
   */
  deleteTemplate = (() => {
    const method = (
      account: number,
      template: number,
      options: RequestOptions & {} = {}
    ): Promise<{}> =>
      this._client.request(
        "DELETE",
        `/${account}/templates/${template}`,
        null,
        options
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
   * @param options Query parameters
   * @param options.sort Sort results. Default sorting is by id ascending.
   */
  listTemplateRecords = (() => {
    const method = (
      account: number,
      template: number,
      options: RequestOptions & { sort?: string } = {}
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
        options
      );
    method.paginate = (
      account: number,
      template: number,
      options: RequestOptions & { sort?: string } = {}
    ) =>
      paginate((page) =>
        method(account, template, { ...options, page } as any)
      );
    return method;
  })();

  /**
   * Creates a new template record.
   *
   * POST /{account}/templates/{template}/records
   *
   * @param account The account id
   * @param template The template id
   * @param options Query parameters
   */
  createTemplateRecord = (() => {
    const method = (
      account: number,
      template: number,
      data: {},
      options: RequestOptions & {} = {}
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
        options
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
   * @param options Query parameters
   */
  getTemplateRecord = (() => {
    const method = (
      account: number,
      template: number,
      templaterecord: number,
      options: RequestOptions & {} = {}
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
        options
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
   * @param options Query parameters
   */
  deleteTemplateRecord = (() => {
    const method = (
      account: number,
      template: number,
      templaterecord: number,
      options: RequestOptions & {} = {}
    ): Promise<{}> =>
      this._client.request(
        "DELETE",
        `/${account}/templates/${template}/records/${templaterecord}`,
        null,
        options
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
   * @param options Query parameters
   */
  applyTemplateToDomain = (() => {
    const method = (
      account: number,
      domain: string,
      template: number,
      options: RequestOptions & {} = {}
    ): Promise<{}> =>
      this._client.request(
        "POST",
        `/${account}/domains/${domain}/templates/${template}`,
        null,
        options
      );
    return method;
  })();
}
