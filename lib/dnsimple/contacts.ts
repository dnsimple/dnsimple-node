import type Client from "./client";
import paginate from "./paginate";
import type { RequestOptions } from "./request";

export default class Contacts {
  constructor(private readonly _client: Client) {}

  /**
   * List contacts in the account.
   *
   * This API is paginated. Call `listContacts.paginate(...args)` to use the pagination helper and iterate individual items across pages; see {@link paginate} for more details and examples.
   *
   * GET /{account}/contacts
   *
   * @param account The account id
   * @param options Query parameters
   * @param options.sort Sort results. Default sorting is by id ascending.
   */
  listContacts = (() => {
    const method = (
      account: number,
      options: RequestOptions & { sort?: string } = {}
    ): Promise<{
      data: Array<{
        id: number;
        account_id: number;
        label: string;
        first_name: string;
        last_name: string;
        organization_name: string;
        job_title: string;
        address1: string;
        address2: string;
        city: string;
        state_province: string;
        postal_code: string;
        country: string;
        phone: string;
        fax: string;
        email: string;
        created_at: string;
        updated_at: string;
      }>;
      pagination: {
        current_page: number;
        per_page: number;
        total_entries: number;
        total_pages: number;
      };
    }> => this._client.request("GET", `/${account}/contacts`, null, options);
    method.paginate = (
      account: number,
      options: RequestOptions & { sort?: string } = {}
    ) => paginate((page) => method(account, { ...options, page } as any));
    return method;
  })();

  /**
   * Creates a contact.
   *
   * POST /{account}/contacts
   *
   * @param account The account id
   * @param options Query parameters
   */
  createContact = (() => {
    const method = (
      account: number,
      data: {
        label: string;
        first_name: string;
        last_name: string;
        address1: string;
        address2: string | null;
        city: string;
        state_province: string;
        postal_code: string;
        country: string;
        email: string;
        phone: string;
        fax: string | null;
        organization_name: string;
        job_title: string;
      },
      options: RequestOptions & {} = {}
    ): Promise<{}> =>
      this._client.request("POST", `/${account}/contacts`, data, options);
    return method;
  })();

  /**
   * Retrieves the details of an existing contact.
   *
   * GET /{account}/contacts/{contact}
   *
   * @param account The account id
   * @param contact The contact id
   * @param options Query parameters
   */
  getContact = (() => {
    const method = (
      account: number,
      contact: number,
      options: RequestOptions & {} = {}
    ): Promise<{
      data: {
        id: number;
        account_id: number;
        label: string;
        first_name: string;
        last_name: string;
        organization_name: string;
        job_title: string;
        address1: string;
        address2: string;
        city: string;
        state_province: string;
        postal_code: string;
        country: string;
        phone: string;
        fax: string;
        email: string;
        created_at: string;
        updated_at: string;
      };
    }> =>
      this._client.request(
        "GET",
        `/${account}/contacts/${contact}`,
        null,
        options
      );
    return method;
  })();

  /**
   * Updates the contact details.
   *
   * PATCH /{account}/contacts/{contact}
   *
   * @param account The account id
   * @param contact The contact id
   * @param options Query parameters
   */
  updateContact = (() => {
    const method = (
      account: number,
      contact: number,
      data: {
        label: string;
        first_name: string;
        last_name: string;
        address1: string;
        address2: string | null;
        city: string;
        state_province: string;
        postal_code: string;
        country: string;
        email: string;
        phone: string;
        fax: string | null;
        organization_name: string;
        job_title: string;
      },
      options: RequestOptions & {} = {}
    ): Promise<{
      data: {
        id: number;
        account_id: number;
        label: string;
        first_name: string;
        last_name: string;
        organization_name: string;
        job_title: string;
        address1: string;
        address2: string;
        city: string;
        state_province: string;
        postal_code: string;
        country: string;
        phone: string;
        fax: string;
        email: string;
        created_at: string;
        updated_at: string;
      };
    }> =>
      this._client.request(
        "PATCH",
        `/${account}/contacts/${contact}`,
        data,
        options
      );
    return method;
  })();

  /**
   * Permanently deletes a contact from the account.
   *
   * DELETE /{account}/contacts/{contact}
   *
   * @param account The account id
   * @param contact The contact id
   * @param options Query parameters
   */
  deleteContact = (() => {
    const method = (
      account: number,
      contact: number,
      options: RequestOptions & {} = {}
    ): Promise<{}> =>
      this._client.request(
        "DELETE",
        `/${account}/contacts/${contact}`,
        null,
        options
      );
    return method;
  })();
}
