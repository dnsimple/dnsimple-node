import type Client = require("./client");
import type { RequestOptions } from "./request";
import paginate = require("./paginate");
class Zones {
  constructor(private readonly _client: Client) {}

  /**
   * Lists the zones in the account.
   *
   *
   * This API is paginated. Call `listZones.paginate(...args)` to use the pagination helper and iterate individual items across pages; see {@link paginate} for more details and examples.
   *
   * GET /{account}/zones
   *
   * @param account The account id
   * @param options Query parameters
   * @param options.name_like Only include results with a name field containing the given string
   * @param options.sort Sort results. Default sorting is by name ascending.
   */
  listZones = (() => {
    const method = (
      account: number,
      options: RequestOptions & {
        name_like?: string;
        sort?: string;
      } = {}
    ): Promise<{
      data: Array<{
        id: number;
        account_id: number;
        name: string;
        reverse: boolean;
        secondary: boolean;
        last_transferred_at: string;
        created_at: string;
        updated_at: string;
      }>;
      pagination: {
        current_page: number;
        per_page: number;
        total_entries: number;
        total_pages: number;
      };
    }> => this._client.request("GET", `/${account}/zones`, null, options);
    method.paginate = (
      account: number,
      options: RequestOptions & {
        name_like?: string;
        sort?: string;
      } = {}
    ) => paginate((page) => method(account, { ...options, page } as any));
    return method;
  })();

  /**
   * Retrieves the details of an existing zone.
   *
   * GET /{account}/zones/{zone}
   *
   * @param account The account id
   * @param zone The zone name
   * @param options Query parameters
   */
  getZone = (() => {
    const method = (
      account: number,
      zone: string,
      options: RequestOptions & {} = {}
    ): Promise<{
      data: {
        id: number;
        account_id: number;
        name: string;
        reverse: boolean;
        secondary: boolean;
        last_transferred_at: string;
        created_at: string;
        updated_at: string;
      };
    }> =>
      this._client.request("GET", `/${account}/zones/${zone}`, null, options);
    return method;
  })();

  /**
   * Download the zonefile for an existing zone.
   *
   * GET /{account}/zones/{zone}/file
   *
   * @param account The account id
   * @param zone The zone name
   * @param options Query parameters
   */
  getZoneFile = (() => {
    const method = (
      account: number,
      zone: string,
      options: RequestOptions & {} = {}
    ): Promise<{ data: { zone: string } }> =>
      this._client.request(
        "GET",
        `/${account}/zones/${zone}/file`,
        null,
        options
      );
    return method;
  })();

  /**
   * Checks if a zone is fully distributed to all our name servers across the globe.
   *
   * GET /{account}/zones/{zone}/distribution
   *
   * @param account The account id
   * @param zone The zone name
   * @param options Query parameters
   */
  checkZoneDistribution = (() => {
    const method = (
      account: number,
      zone: string,
      options: RequestOptions & {} = {}
    ): Promise<{ data: { distributed: boolean } }> =>
      this._client.request(
        "GET",
        `/${account}/zones/${zone}/distribution`,
        null,
        options
      );
    return method;
  })();

  /**
   * Updates the zone's NS records
   *
   * PUT /{account}/zones/{zone}/ns_records
   *
   * @param account The account id
   * @param zone The zone name
   * @param options Query parameters
   */
  updateZoneNsRecords = (() => {
    const method = (
      account: number,
      zone: string,
      data: { ns_names: Array<string>; ns_set_ids: Array<number> },
      options: RequestOptions & {} = {}
    ): Promise<{
      data: Array<{
        id: number;
        zone_id: string;
        parent_id: number | null;
        name: string;
        content: string;
        ttl: number;
        priority: number | null;
        type: string;
        regions: Array<string>;
        system_record: boolean;
        created_at: string;
        updated_at: string;
      }>;
    }> =>
      this._client.request(
        "PUT",
        `/${account}/zones/${zone}/ns_records`,
        data,
        options
      );
    return method;
  })();

  /**
   * Lists the records for a zone.
   *
   * GET /{account}/zones/{zone}/records
   *
   * @param account The account id
   * @param zone The zone name
   * @param options Query parameters
   * @param options.name_like Only include results with a name field containing the given string
   * @param options.name Only include results with a name field exactly matching the given string
   * @param options.type Only include results with a type field exactly matching the given string
   * @param options.sort Sort results. Default sorting is by name ascending.
   */
  listZoneRecords = (() => {
    const method = (
      account: number,
      zone: string,
      options: RequestOptions & {
        name_like?: string;
        name?: string;
        type?: string;
        sort?: string;
      } = {}
    ): Promise<{
      data: Array<{
        id: number;
        zone_id: string;
        parent_id: number | null;
        name: string;
        content: string;
        ttl: number;
        priority: number | null;
        type: string;
        regions: Array<string>;
        system_record: boolean;
        created_at: string;
        updated_at: string;
      }>;
    }> =>
      this._client.request(
        "GET",
        `/${account}/zones/${zone}/records`,
        null,
        options
      );
    return method;
  })();

  /**
   * Creates a new zone record.
   *
   * POST /{account}/zones/{zone}/records
   *
   * @param account The account id
   * @param zone The zone name
   * @param options Query parameters
   */
  createZoneRecord = (() => {
    const method = (
      account: number,
      zone: string,
      data: {
        name: string;
        type: string;
        content: string;
        ttl: number;
        priority: number;
        regions: Array<string>;
      },
      options: RequestOptions & {} = {}
    ): Promise<{
      data: {
        id: number;
        zone_id: string;
        parent_id: number | null;
        name: string;
        content: string;
        ttl: number;
        priority: number | null;
        type: string;
        regions: Array<string>;
        system_record: boolean;
        created_at: string;
        updated_at: string;
      };
    }> =>
      this._client.request(
        "POST",
        `/${account}/zones/${zone}/records`,
        data,
        options
      );
    return method;
  })();

  /**
   * Retrieves the details of an existing zone record.
   *
   * GET /{account}/zones/{zone}/records/{zonerecord}
   *
   * @param account The account id
   * @param zone The zone name
   * @param zonerecord The zone record id
   * @param options Query parameters
   */
  getZoneRecord = (() => {
    const method = (
      account: number,
      zone: string,
      zonerecord: number,
      options: RequestOptions & {} = {}
    ): Promise<{
      data: {
        id: number;
        zone_id: string;
        parent_id: number | null;
        name: string;
        content: string;
        ttl: number;
        priority: number | null;
        type: string;
        regions: Array<string>;
        system_record: boolean;
        created_at: string;
        updated_at: string;
      };
    }> =>
      this._client.request(
        "GET",
        `/${account}/zones/${zone}/records/${zonerecord}`,
        null,
        options
      );
    return method;
  })();

  /**
   * Updates the zone record details.
   *
   * PATCH /{account}/zones/{zone}/records/{zonerecord}
   *
   * @param account The account id
   * @param zone The zone name
   * @param zonerecord The zone record id
   * @param options Query parameters
   */
  updateZoneRecord = (() => {
    const method = (
      account: number,
      zone: string,
      zonerecord: number,
      data: {
        name: string;
        content: string;
        ttl: number;
        priority: number;
        regions: Array<string>;
      },
      options: RequestOptions & {} = {}
    ): Promise<{
      data: {
        id: number;
        zone_id: string;
        parent_id: number | null;
        name: string;
        content: string;
        ttl: number;
        priority: number | null;
        type: string;
        regions: Array<string>;
        system_record: boolean;
        created_at: string;
        updated_at: string;
      };
    }> =>
      this._client.request(
        "PATCH",
        `/${account}/zones/${zone}/records/${zonerecord}`,
        data,
        options
      );
    return method;
  })();

  /**
   * Permanently deletes a zone record.
   *
   * DELETE /{account}/zones/{zone}/records/{zonerecord}
   *
   * @param account The account id
   * @param zone The zone name
   * @param zonerecord The zone record id
   * @param options Query parameters
   */
  deleteZoneRecord = (() => {
    const method = (
      account: number,
      zone: string,
      zonerecord: number,
      options: RequestOptions & {} = {}
    ): Promise<{}> =>
      this._client.request(
        "DELETE",
        `/${account}/zones/${zone}/records/${zonerecord}`,
        null,
        options
      );
    return method;
  })();

  /**
   * Checks if a zone record is fully distributed to all our name servers across the globe.
   *
   * GET /{account}/zones/{zone}/records/{zonerecord}/distribution
   *
   * @param account The account id
   * @param zone The zone name
   * @param zonerecord The zone record id
   * @param options Query parameters
   */
  checkZoneRecordDistribution = (() => {
    const method = (
      account: number,
      zone: string,
      zonerecord: number,
      options: RequestOptions & {} = {}
    ): Promise<{ data: { distributed: boolean } }> =>
      this._client.request(
        "GET",
        `/${account}/zones/${zone}/records/${zonerecord}/distribution`,
        null,
        options
      );
    return method;
  })();
}
export = Zones;
