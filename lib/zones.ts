import type { DNSimple, QueryParams } from "./main";
import { paginate } from "./paginate";

export class Zones {
  constructor(private readonly _client: DNSimple) {}

  /**
   * Lists the zones in the account.
   *
   * This API is paginated. Call `listZones.iterateAll(account, params)` to get an asynchronous iterator over individual items across all pages. You can also use `await listZones.collectAll(account, params)` to quickly retrieve all items across all pages into an array. We suggest using `iterateAll` when possible, as `collectAll` will make all requests at once, which may increase latency and trigger rate limits.
   *
   * GET /{account}/zones
   *
   * @param account The account id
   * @param params Query parameters
   * @param params.name_like Only include results with a name field containing the given string
   * @param params.sort Sort results. Default sorting is by name ascending.
   */
  listZones = (() => {
    const method = (
      account: number,
      params: QueryParams & { name_like?: string; sort?: string } = {}
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
    }> => this._client.request("GET", `/${account}/zones`, null, params);
    method.iterateAll = (
      account: number,
      params: QueryParams & { name_like?: string; sort?: string } = {}
    ) => paginate((page) => method(account, { ...params, page } as any));
    method.collectAll = async (
      account: number,
      params: QueryParams & { name_like?: string; sort?: string } = {}
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
   * Retrieves the details of an existing zone.
   *
   * GET /{account}/zones/{zone}
   *
   * @param account The account id
   * @param zone The zone name
   * @param params Query parameters
   */
  getZone = (() => {
    const method = (
      account: number,
      zone: string,
      params: QueryParams & {} = {}
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
      this._client.request("GET", `/${account}/zones/${zone}`, null, params);
    return method;
  })();

  /**
   * Download the zonefile for an existing zone.
   *
   * GET /{account}/zones/{zone}/file
   *
   * @param account The account id
   * @param zone The zone name
   * @param params Query parameters
   */
  getZoneFile = (() => {
    const method = (
      account: number,
      zone: string,
      params: QueryParams & {} = {}
    ): Promise<{ data: { zone: string } }> =>
      this._client.request(
        "GET",
        `/${account}/zones/${zone}/file`,
        null,
        params
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
   * @param params Query parameters
   */
  checkZoneDistribution = (() => {
    const method = (
      account: number,
      zone: string,
      params: QueryParams & {} = {}
    ): Promise<{ data: { distributed: boolean } }> =>
      this._client.request(
        "GET",
        `/${account}/zones/${zone}/distribution`,
        null,
        params
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
   * @param params Query parameters
   */
  updateZoneNsRecords = (() => {
    const method = (
      account: number,
      zone: string,
      data: { ns_names?: Array<string>; ns_set_ids?: Array<number> },
      params: QueryParams & {} = {}
    ): Promise<{
      data: Array<{
        id: number;
        zone_id: string;
        parent_id: number | null;
        name: string;
        content: string;
        ttl: number;
        priority?: number | null;
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
        params
      );
    return method;
  })();

  /**
   * Lists the records for a zone.
   *
   * This API is paginated. Call `listZoneRecords.iterateAll(account, zone, params)` to get an asynchronous iterator over individual items across all pages. You can also use `await listZoneRecords.collectAll(account, zone, params)` to quickly retrieve all items across all pages into an array. We suggest using `iterateAll` when possible, as `collectAll` will make all requests at once, which may increase latency and trigger rate limits.
   *
   * GET /{account}/zones/{zone}/records
   *
   * @param account The account id
   * @param zone The zone name
   * @param params Query parameters
   * @param params.name_like Only include results with a name field containing the given string
   * @param params.name Only include results with a name field exactly matching the given string
   * @param params.type Only include results with a type field exactly matching the given string
   * @param params.sort Sort results. Default sorting is by name ascending.
   */
  listZoneRecords = (() => {
    const method = (
      account: number,
      zone: string,
      params: QueryParams & {
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
        priority?: number | null;
        type: string;
        regions: Array<string>;
        system_record: boolean;
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
        `/${account}/zones/${zone}/records`,
        null,
        params
      );
    method.iterateAll = (
      account: number,
      zone: string,
      params: QueryParams & {
        name_like?: string;
        name?: string;
        type?: string;
        sort?: string;
      } = {}
    ) => paginate((page) => method(account, zone, { ...params, page } as any));
    method.collectAll = async (
      account: number,
      zone: string,
      params: QueryParams & {
        name_like?: string;
        name?: string;
        type?: string;
        sort?: string;
      } = {}
    ) => {
      const items = [];
      for await (const item of method.iterateAll(account, zone, params)) {
        items.push(item);
      }
      return items;
    };
    return method;
  })();

  /**
   * Creates a new zone record.
   *
   * POST /{account}/zones/{zone}/records
   *
   * @param account The account id
   * @param zone The zone name
   * @param params Query parameters
   */
  createZoneRecord = (() => {
    const method = (
      account: number,
      zone: string,
      data: {
        name?: string;
        type?: string;
        content?: string;
        ttl?: number;
        priority?: number;
        regions?: Array<string>;
      },
      params: QueryParams & {} = {}
    ): Promise<{
      data: {
        id: number;
        zone_id: string;
        parent_id: number | null;
        name: string;
        content: string;
        ttl: number;
        priority?: number | null;
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
        params
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
   * @param params Query parameters
   */
  getZoneRecord = (() => {
    const method = (
      account: number,
      zone: string,
      zonerecord: number,
      params: QueryParams & {} = {}
    ): Promise<{
      data: {
        id: number;
        zone_id: string;
        parent_id: number | null;
        name: string;
        content: string;
        ttl: number;
        priority?: number | null;
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
        params
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
   * @param params Query parameters
   */
  updateZoneRecord = (() => {
    const method = (
      account: number,
      zone: string,
      zonerecord: number,
      data: {
        name?: string;
        content?: string;
        ttl?: number;
        priority?: number;
        regions?: Array<string>;
      },
      params: QueryParams & {} = {}
    ): Promise<{
      data: {
        id: number;
        zone_id: string;
        parent_id: number | null;
        name: string;
        content: string;
        ttl: number;
        priority?: number | null;
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
        params
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
   * @param params Query parameters
   */
  deleteZoneRecord = (() => {
    const method = (
      account: number,
      zone: string,
      zonerecord: number,
      params: QueryParams & {} = {}
    ): Promise<{}> =>
      this._client.request(
        "DELETE",
        `/${account}/zones/${zone}/records/${zonerecord}`,
        null,
        params
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
   * @param params Query parameters
   */
  checkZoneRecordDistribution = (() => {
    const method = (
      account: number,
      zone: string,
      zonerecord: number,
      params: QueryParams & {} = {}
    ): Promise<{ data: { distributed: boolean } }> =>
      this._client.request(
        "GET",
        `/${account}/zones/${zone}/records/${zonerecord}/distribution`,
        null,
        params
      );
    return method;
  })();
}
