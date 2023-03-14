import type { DNSimple, QueryParams } from "./main";
import { paginate } from "./paginate";

export class Collaborators {
  constructor(private readonly _client: DNSimple) {}

  /**
   * Lists collaborators for the domain.
   *
   * This API is paginated. Call `listDomainCollaborators.iterateAll(account, domain, params)` to get an asynchronous iterator over individual items across all pages. You can also use `await listDomainCollaborators.collectAll(account, domain, params)` to quickly retrieve all items across all pages into an array. We suggest using `iterateAll` when possible, as `collectAll` will make all requests at once, which may increase latency and trigger rate limits.
   *
   * GET /{account}/domains/{domain}/collaborators
   *
   * @param account The account id
   * @param domain The domain name or id
   * @param params Query parameters
   */
  listDomainCollaborators = (() => {
    const method = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
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
        params
      );
    method.iterateAll = (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ) =>
      paginate((page) => method(account, domain, { ...params, page } as any));
    method.collectAll = async (
      account: number,
      domain: string,
      params: QueryParams & {} = {}
    ) => {
      const items = [];
      for await (const item of method.iterateAll(account, domain, params)) {
        items.push(item);
      }
      return items;
    };
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
   * @param params Query parameters
   */
  addDomainCollaborator = (() => {
    const method = (
      account: number,
      domain: string,
      data: { email: string },
      params: QueryParams & {} = {}
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
        params
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
   * @param params Query parameters
   */
  removeDomainCollaborator = (() => {
    const method = (
      account: number,
      domain: string,
      collaborator: number,
      params: QueryParams & {} = {}
    ): Promise<{}> =>
      this._client.request(
        "DELETE",
        `/${account}/domains/${domain}/collaborators/${collaborator}`,
        null,
        params
      );
    return method;
  })();
}
