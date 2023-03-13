import type Client from "./client";
import type { RequestOptions } from "./request";

export default class Webhooks {
  constructor(private readonly _client: Client) {}

  /**
   * List the webhooks in the account.
   *
   * GET /{account}/webhooks
   *
   * @param account The account id
   * @param options Query parameters
   * @param options.sort Sort results. Default sorting is by name ascending.
   */
  listWebhooks = (() => {
    const method = (
      account: number,
      options: RequestOptions & { sort?: string } = {}
    ): Promise<{
      data: Array<{ id: number; url: string; suppressed_at: string }>;
    }> => this._client.request("GET", `/${account}/webhooks`, null, options);
    return method;
  })();

  /**
   * Registers a webhook endpoint.
   *
   * POST /{account}/webhooks
   *
   * @param account The account id
   * @param options Query parameters
   */
  createWebhook = (() => {
    const method = (
      account: number,
      data: { url: string },
      options: RequestOptions & {} = {}
    ): Promise<{ data: { id: number; url: string; suppressed_at: string } }> =>
      this._client.request("POST", `/${account}/webhooks`, data, options);
    return method;
  })();

  /**
   * Retrieves the details of a registered webhook.
   *
   * GET /{account}/webhooks/{webhook}
   *
   * @param account The account id
   * @param webhook The webhoook id
   * @param options Query parameters
   */
  getWebhook = (() => {
    const method = (
      account: number,
      webhook: number,
      options: RequestOptions & {} = {}
    ): Promise<{ data: { id: number; url: string; suppressed_at: string } }> =>
      this._client.request(
        "GET",
        `/${account}/webhooks/${webhook}`,
        null,
        options
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
   * @param options Query parameters
   */
  deleteWebhook = (() => {
    const method = (
      account: number,
      webhook: number,
      options: RequestOptions & {} = {}
    ): Promise<{}> =>
      this._client.request(
        "DELETE",
        `/${account}/webhooks/${webhook}`,
        null,
        options
      );
    return method;
  })();
}
