import fetchMock from "fetch-mock";
import { createTestClient, responseFromFixture } from "./util";

const dnsimple = createTestClient();

describe("dns analytics", () => {
  describe("#queryDnsAnalytics", () => {
    const accountId = 1;

    it("supports pagination", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1/dns_analytics?page=1",
        responseFromFixture("dnsAnalytics/success.http")
      );

      await dnsimple.dnsAnalytics.queryDnsAnalytics(accountId, { page: 1 });

      expect(fetchMock.callHistory.called()).toBe(true);
    });

    it("supports sorting", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1/dns_analytics?sort=volume%3Adesc%2Czone_name%3Aasc",
        responseFromFixture("dnsAnalytics/success.http")
      );

      await dnsimple.dnsAnalytics.queryDnsAnalytics(accountId, {
        sort: "volume:desc,zone_name:asc",
      });

      expect(fetchMock.callHistory.called()).toBe(true);
    });

    it("supports filter", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1/dns_analytics?start_date=2023-12-08&end_date=2024-01-08",
        responseFromFixture("dnsAnalytics/success.http")
      );

      await dnsimple.dnsAnalytics.queryDnsAnalytics(accountId, {
        start_date: "2023-12-08",
        end_date: "2024-01-08",
      });

      expect(fetchMock.callHistory.called()).toBe(true);
    });

    it("supports groupings", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1/dns_analytics?groupings=zone_name%2Cdate",
        responseFromFixture("dnsAnalytics/success.http")
      );

      await dnsimple.dnsAnalytics.queryDnsAnalytics(accountId, {
        groupings: "zone_name,date",
      });

      expect(fetchMock.callHistory.called()).toBe(true);
    });

    it("produces the analytics data", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1/dns_analytics",
        responseFromFixture("dnsAnalytics/success.http")
      );

      const response = await dnsimple.dnsAnalytics.queryDnsAnalytics(accountId);

      expect(response.data.headers).toEqual(["zone_name", "date", "volume"]);
      expect(response.data.rows.length).toBe(12);
      expect(response.data.rows[0]).toEqual(["bar.com", "2023-12-08", 1200]);
      expect(response.query).toEqual({
        account_id: 1,
        start_date: "2023-12-08",
        end_date: "2024-01-08",
        sort: "zone_name:asc,date:asc",
        page: 0,
        per_page: 100,
        groupings: "zone_name,date",
      });
      expect(response.pagination.current_page).toBe(0);
    });
  });
});
