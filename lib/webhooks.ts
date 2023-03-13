import type { DNSimple, QueryParams } from "./main";

export class Webhooks {
  constructor(private readonly _client: DNSimple) {}

  /**
   * List the webhooks in the account.
   *
   * GET /{account}/webhooks
   *
   * @param account The account id
   * @param params Query parameters
   * @param params.sort Sort results. Default sorting is by name ascending.
   */
  listWebhooks = (() => {
    const method = (
      account: number,
      params: QueryParams & { sort?: string } = {}
    ): Promise<{
      data: Array<{ id: number; url: string; suppressed_at: string }>;
    }> => this._client.request("GET", `/${account}/webhooks`, null, params);
    return method;
  })();

  /**
   * Registers a webhook endpoint.
   *
   * POST /{account}/webhooks
   *
   * @param account The account id
   * @param params Query parameters
   */
  createWebhook = (() => {
    const method = (
      account: number,
      data: { url: string },
      params: QueryParams & {} = {}
    ): Promise<{ data: { id: number; url: string; suppressed_at: string } }> =>
      this._client.request("POST", `/${account}/webhooks`, data, params);
    return method;
  })();

  /**
   * Retrieves the details of a registered webhook.
   *
   * GET /{account}/webhooks/{webhook}
   *
   * @param account The account id
   * @param webhook The webhoook id
   * @param params Query parameters
   */
  getWebhook = (() => {
    const method = (
      account: number,
      webhook: number,
      params: QueryParams & {} = {}
    ): Promise<{ data: { id: number; url: string; suppressed_at: string } }> =>
      this._client.request(
        "GET",
        `/${account}/webhooks/${webhook}`,
        null,
        params
      );
    return method;
  })();

  /**
   * De-registers a webhook endpoint.
   *
   * DELETE /{account}/webhooks/{webhook}
   *
   * @param account The account id
   * @param webhook The webhoook id
   * @param params Query parameters
   */
  deleteWebhook = (() => {
    const method = (
      account: number,
      webhook: number,
      params: QueryParams & {} = {}
    ): Promise<{}> =>
      this._client.request(
        "DELETE",
        `/${account}/webhooks/${webhook}`,
        null,
        params
      );
    return method;
  })();
}
