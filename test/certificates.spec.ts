import { NotFoundError } from "../lib/main";
import { createTestClient, fetchMockResponse } from "./util";
import fetchMock from "fetch-mock";

const dnsimple = createTestClient();

describe("certificates", () => {
  describe("#listCertificates", () => {
    const accountId = 1010;
    const domainId = "example.com";

    it("supports pagination", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/domains/example.com/certificates?page=1", fetchMockResponse("listCertificates/success.http"));

      await dnsimple.certificates.listCertificates(accountId, domainId, {
        page: 1,
      });

      expect(fetchMock.calls()).not.toEqual([])
    });

    it("supports extra request options", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/domains/example.com/certificates?foo=bar", fetchMockResponse("listCertificates/success.http"));

      await dnsimple.certificates.listCertificates(accountId, domainId, {
        foo: "bar",
      });

      expect(fetchMock.calls()).not.toEqual([])
    });

    it("supports sorting", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/domains/example.com/certificates?sort=expiration%3Aasc", fetchMockResponse("listCertificates/success.http"));

      await dnsimple.certificates.listCertificates(accountId, domainId, {
        sort: "expiration:asc",
      });

      expect(fetchMock.calls()).not.toEqual([])
    });

    it("produces a certificate list", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/domains/example.com/certificates", fetchMockResponse("listCertificates/success.http"));

      const response = await dnsimple.certificates.listCertificates(accountId, domainId);

      const certificates = response.data;
      expect(certificates.length).toBe(2);
      expect(certificates[0].id).toBe(101973);
      expect(certificates[0].domain_id).toBe(14279);
      expect(certificates[0].common_name).toBe("www2.dnsimple.us");
    });

    it("exposes the pagination info", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/domains/example.com/certificates", fetchMockResponse("listCertificates/success.http"));

      const response = await dnsimple.certificates.listCertificates(accountId, domainId);

      const pagination = response.pagination;
      expect(pagination).not.toBe(null);
      expect(pagination.current_page).toBe(1);
    });
  });

  describe("#listCertificates.collectAll", () => {
    const accountId = 1010;
    const domainId = "example.com";

    it("produces a complete list", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/domains/example.com/certificates?page=1", fetchMockResponse("pages-1of3.http"));

      fetchMock.get("https://api.dnsimple.com/v2/1010/domains/example.com/certificates?page=2", fetchMockResponse("pages-2of3.http"));

      fetchMock.get("https://api.dnsimple.com/v2/1010/domains/example.com/certificates?page=3", fetchMockResponse("pages-3of3.http"));

      const certificates = await dnsimple.certificates.listCertificates.collectAll(accountId, domainId);

      expect(certificates.length).toBe(5);
      expect(certificates[0].id).toBe(1);
      expect(certificates[4].id).toBe(5);
    });
  });

  describe("#getCertificate", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const certificateId = 1;

    it("produces a certificate", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/domains/example.com/certificates/1", fetchMockResponse("getCertificate/success.http"));

      const response = await dnsimple.certificates.getCertificate(accountId, domainId, certificateId);

      const certificate = response.data;
      expect(certificate.id).toBe(101967);
      expect(certificate.domain_id).toBe(289333);
      expect(certificate.contact_id).toBe(2511);
      expect(certificate.common_name).toBe("www.bingo.pizza");
      expect(certificate.alternate_names).toEqual([]);
      expect(certificate.state).toBe("issued");
      expect(certificate.expires_on).toBe("2020-09-16");
    });

    describe("when the certificate does not exist", () => {
      it("produces an error", async () => {
        fetchMock.get("https://api.dnsimple.com/v2/1010/domains/example.com/certificates/0", fetchMockResponse("notfound-certificate.http"));

        try {
          await dnsimple.certificates.getCertificate(accountId, domainId, 0);
        } catch (error) {
          expect(error).not.toBe(null);
          expect(error).toBeInstanceOf(NotFoundError);
          expect(error.data.message).toBe("Certificate `0` not found");
        }
      });
    });
  });

  describe("#downloadCertificate", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const certificateId = 1;

    it("produces a certificate", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/domains/example.com/certificates/1/download", fetchMockResponse("downloadCertificate/success.http"));

      const response = await dnsimple.certificates.downloadCertificate(accountId, domainId, certificateId);

      const certificate = response.data;
      expect(certificate.server).toMatch(/-----BEGIN CERTIFICATE-----/);
      expect(certificate.root).toBe(null);
      expect(certificate.chain.length).toBe(1);
      expect(certificate.chain[0]).toMatch(/-----BEGIN CERTIFICATE-----/);
    });

    describe("when the certificate does not exist", () => {
      it("produces an error", async () => {
        fetchMock.get("https://api.dnsimple.com/v2/1010/domains/example.com/certificates/0/download", fetchMockResponse("notfound-certificate.http"));

        await expect(dnsimple.certificates.downloadCertificate(accountId, domainId, 0)).rejects.toThrow();
      });
    });
  });

  describe("#getCertificatePrivateKey", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const certificateId = 1;

    it("produces a certificate", async () => {
      fetchMock.get("https://api.dnsimple.com/v2/1010/domains/example.com/certificates/1/private_key", fetchMockResponse("getCertificatePrivateKey/success.http"));

      const response = await dnsimple.certificates.getCertificatePrivateKey(accountId, domainId, certificateId);

      expect(response.data.private_key).toMatch(/-----BEGIN RSA PRIVATE KEY-----/);
    });

    describe("when the certificate does not exist", () => {
      it("produces an error", async () => {
        fetchMock.get("https://api.dnsimple.com/v2/1010/domains/example.com/certificates/0/private_key", fetchMockResponse("notfound-certificate.http"));

        try {
          await dnsimple.certificates.getCertificatePrivateKey(accountId, domainId, 0);
        } catch (error) {
          expect(error).not.toBe(null);
        }
      });
    });
  });

  describe("#purchaseLetsencryptCertificate", () => {
    const accountId = 1010;
    const domainId = "example.com";

    it("purchases a certificate", async () => {
      fetchMock.post("https://api.dnsimple.com/v2/1010/domains/example.com/certificates/letsencrypt", fetchMockResponse("purchaseLetsencryptCertificate/success.http"));

      const response = await dnsimple.certificates.purchaseLetsencryptCertificate(accountId, domainId, {});

      const certificate = response.data;
      expect(certificate.id).toBe(101967);
    });
  });

  describe("#issueLetsencryptCertificate", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const certificateId = 101967;

    it("issues a certificate", async () => {
      fetchMock.post(`https://api.dnsimple.com/v2/1010/domains/example.com/certificates/letsencrypt/${certificateId}/issue`, fetchMockResponse("issueLetsencryptCertificate/success.http"));

      const response = await dnsimple.certificates.issueLetsencryptCertificate(accountId, domainId, certificateId);

      const certificate = response.data;
      expect(certificate.id).toBe(certificateId);
    });
  });

  describe("#purchaseLetsencryptCertificateRenewal", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const certificateId = 101967;

    it("purchases a certificate renewal", async () => {
      fetchMock.post(`https://api.dnsimple.com/v2/1010/domains/example.com/certificates/letsencrypt/${certificateId}/renewals`, fetchMockResponse("purchaseRenewalLetsencryptCertificate/success.http"));

      const response = await dnsimple.certificates.purchaseLetsencryptCertificateRenewal(accountId, domainId, certificateId, {});

      const certificateRenewal = response.data;
      expect(certificateRenewal.id).toBe(65082);
      expect(certificateRenewal.old_certificate_id).toBe(certificateId);
      expect(certificateRenewal.new_certificate_id).toBe(101972);
    });
  });

  describe("#issueLetsencryptCertificateRenewal", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const certificateId = 101967;
    const certificateRenewalId = 65082;
    const newCertificateId = 101972;

    it("issues a certificate renewal", async () => {
      fetchMock.post(`https://api.dnsimple.com/v2/1010/domains/example.com/certificates/letsencrypt/${certificateId}/renewals/${certificateRenewalId}/issue`, fetchMockResponse("issueRenewalLetsencryptCertificate/success.http"));

      const response = await dnsimple.certificates.issueLetsencryptCertificateRenewal(accountId, domainId, certificateId, certificateRenewalId);

      const newCertificate = response.data;
      expect(newCertificate.id).toBe(newCertificateId);
    });
  });
});
