import type Client from "./client";
import paginate from "./paginate";
import type { RequestOptions } from "./request";

export default class Collaborators {
  constructor(private readonly _client: Client) {}

  /**
   * Lists collaborators for the domain.
   *
   * This API is paginated. Call `listDomainCollaborators.paginate(...args)` to use the pagination helper and iterate individual items across pages; see {@link paginate} for more details and examples.
   *
   * GET /{account}/domains/{domain}/collaborators
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param options Query parameters
   */
  listDomainCollaborators = (() => {
    const method = (
      account: number,
      domain: string,
      options: RequestOptions & {} = {}
    ): Promise<{
      data: Array<{
        id: number;
        domain_id: number;
        domain_name: string;
        user_id: number;
        user_email: string;
        invitation: boolean;
        created_at: string;
        updated_at: string;
        accepted_at: string;
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
        `/${account}/domains/${domain}/collaborators`,
        null,
        options
      );
    method.paginate = (
      account: number,
      domain: string,
      options: RequestOptions & {} = {}
    ) =>
      paginate((page) => method(account, domain, { ...options, page } as any));
    return method;
  })();

  /**
   * Adds a collaborator to the domain.
   *
   * At the time of the add, a collaborator may or may not have a DNSimple account. In case the collaborator doesn't have a DNSimple account, the system will invite them to register to DNSimple first and then to accept the collaboration invitation. In the other case, they are automatically added to the domain as collaborator. They can decide to reject the invitation later.
   *
   * POST /{account}/domains/{domain}/collaborators
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param options Query parameters
   */
  addDomainCollaborator = (() => {
    const method = (
      account: number,
      domain: string,
      data: { email: string },
      options: RequestOptions & {} = {}
    ): Promise<{
      id: number;
      domain_id: number;
      domain_name: string;
      user_id: number;
      user_email: string;
      invitation: boolean;
      created_at: string;
      updated_at: string;
      accepted_at: string;
    }> =>
      this._client.request(
        "POST",
        `/${account}/domains/${domain}/collaborators`,
        data,
        options
      );
    return method;
  })();

  /**
   * Removes a collaborator from the domain.
   *
   * DELETE /{account}/domains/{domain}/collaborators/{collaborator}
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param collaborator The collaborator id
   * @param options Query parameters
   */
  removeDomainCollaborator = (() => {
    const method = (
      account: number,
      domain: string,
      collaborator: number,
      options: RequestOptions & {} = {}
    ): Promise<{}> =>
      this._client.request(
        "DELETE",
        `/${account}/domains/${domain}/collaborators/${collaborator}`,
        null,
        options
      );
    return method;
  })();
}
