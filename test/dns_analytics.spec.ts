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

      const data = response.data;
      expect(data.headers).toEqual(["zone_name", "date", "volume"]);
      expect(data.rows.length).toBe(12);
      expect(data.rows[0]).toEqual(["bar.com", "2023-12-08", 1200]);
      expect(data.rows[11]).toEqual(["foo.com", "2024-01-08", 1200]);
    });

    it("exposes the query", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1/dns_analytics",
        responseFromFixture("dnsAnalytics/success.http")
      );

      const response = await dnsimple.dnsAnalytics.queryDnsAnalytics(accountId);

      const query = response.query;
      expect(query.account_id).toBe(1);
      expect(query.start_date).toBe("2023-12-08");
      expect(query.end_date).toBe("2024-01-08");
      expect(query.sort).toBe("zone_name:asc,date:asc");
      expect(query.page).toBe(0);
      expect(query.per_page).toBe(100);
      expect(query.groupings).toBe("zone_name,date");
    });

    it("exposes the pagination info", async () => {
      fetchMock.get(
        "https://api.dnsimple.com/v2/1/dns_analytics",
        responseFromFixture("dnsAnalytics/success.http")
      );

      const response = await dnsimple.dnsAnalytics.queryDnsAnalytics(accountId);

      const pagination = response.pagination;
      expect(pagination.current_page).toBe(0);
      expect(pagination.per_page).toBe(100);
      expect(pagination.total_entries).toBe(93);
      expect(pagination.total_pages).toBe(1);
    });
  });
});
