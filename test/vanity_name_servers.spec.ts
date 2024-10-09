import fetchMock from "fetch-mock";
import { createTestClient, fetchMockResponse } from "./util";

const dnsimple = createTestClient();

describe("vanity name servers", () => {
  const accountId = 1010;
  const domainId = "example.com";

  describe("#enableVanityNameServers", () => {
    it("produces a list of name servers", async () => {
      fetchMock.put(
        "https://api.dnsimple.com/v2/1010/vanity/example.com",
        fetchMockResponse("enableVanityNameServers/success.http")
      );

      const response = await dnsimple.vanityNameServers.enableVanityNameServers(accountId, domainId);

      const vanityNameServers = response.data;
      expect(vanityNameServers.length).toBe(4);
      expect(vanityNameServers[0].id).toBe(1);
      expect(vanityNameServers[0].ipv4).toBe("127.0.0.1");
      expect(vanityNameServers[0].ipv6).toBe("::1");
      expect(vanityNameServers[0].created_at).toBe("2016-07-14T13:22:17Z");
      expect(vanityNameServers[0].updated_at).toBe("2016-07-14T13:22:17Z");
    });
  });

  describe("#disableVanityNameServers", () => {
    it("produces nothing", async () => {
      fetchMock.delete(
        "https://api.dnsimple.com/v2/1010/vanity/example.com",
        fetchMockResponse("disableVanityNameServers/success.http")
      );

      const response = await dnsimple.vanityNameServers.disableVanityNameServers(accountId, domainId);

      expect(response).toEqual({});
    });
  });
});
