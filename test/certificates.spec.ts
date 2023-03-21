import { expect } from "chai";
import * as nock from "nock";
import { NotFoundError } from "../lib/main";
import { createTestClient, loadFixture } from "./util";

const dnsimple = createTestClient();

describe("certificates", () => {
  describe("#listCertificates", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const fixture = loadFixture("listCertificates/success.http");

    it("supports pagination", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/certificates?page=1")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.certificates.listCertificates(accountId, domainId, { page: 1 });

      nock.isDone();
      done();
    });

    it("supports extra request options", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/certificates?foo=bar")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.certificates.listCertificates(accountId, domainId, {
        foo: "bar",
      });

      nock.isDone();
      done();
    });

    it("supports sorting", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/certificates?sort=expires_on%3Aasc")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.certificates.listCertificates(accountId, domainId, {
        sort: "expires_on:asc",
      });

      nock.isDone();
      done();
    });

    it("produces a certificate list", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/certificates")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.certificates.listCertificates(accountId, domainId).then(
        (response) => {
          const certificates = response.data;
          expect(certificates.length).to.eq(2);
          expect(certificates[0].id).to.eq(101973);
          expect(certificates[0].domain_id).to.eq(14279);
          expect(certificates[0].common_name).to.eq("www2.dnsimple.us");
          done();
        },
        (error) => {
          done(error);
        }
      );
    });

    it("exposes the pagination info", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/certificates")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.certificates.listCertificates(accountId, domainId).then(
        (response) => {
          const pagination = response.pagination;
          expect(pagination).to.not.eq(null);
          expect(pagination.current_page).to.eq(1);
          done();
        },
        (error) => {
          done(error);
        }
      );
    });
  });

  describe("#listCertificates.collectAll", () => {
    const accountId = 1010;
    const domainId = "example.com";

    it("produces a complete list", (done) => {
      const fixture1 = loadFixture("pages-1of3.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/certificates?page=1")
        .reply(fixture1.statusCode, fixture1.body);

      const fixture2 = loadFixture("pages-2of3.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/certificates?page=2")
        .reply(fixture2.statusCode, fixture2.body);

      const fixture3 = loadFixture("pages-3of3.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/certificates?page=3")
        .reply(fixture3.statusCode, fixture3.body);

      dnsimple.certificates.listCertificates
        .collectAll(accountId, domainId)
        .then(
          (certificates) => {
            expect(certificates.length).to.eq(5);
            expect(certificates[0].id).to.eq(1);
            expect(certificates[4].id).to.eq(5);
            done();
          },
          (error) => {
            done(error);
          }
        )
        .catch((error) => {
          done(error);
        });
    });
  });

  describe("#getCertificate", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const certificateId = 1;
    const fixture = loadFixture("getCertificate/success.http");

    it("produces a certificate", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/certificates/1")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.certificates
        .getCertificate(accountId, domainId, certificateId)
        .then(
          (response) => {
            const certificate = response.data;
            expect(certificate.id).to.eq(101967);
            expect(certificate.domain_id).to.eq(289333);
            expect(certificate.contact_id).to.eq(2511);
            expect(certificate.common_name).to.eq("www.bingo.pizza");
            expect(certificate.alternate_names).to.eql([]);
            expect(certificate.state).to.eq("issued");
            expect(certificate.expires_on).to.eq("2020-09-16");
            done();
          },
          (error) => {
            done(error);
          }
        );
    });

    describe("when the certificate does not exist", () => {
      const fixture = loadFixture("notfound-certificate.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/certificates/0")
        .reply(fixture.statusCode, fixture.body);

      it("produces an error", (done) => {
        dnsimple.certificates.getCertificate(accountId, domainId, 0).then(
          (response) => {
            done();
          },
          (error) => {
            expect(error).to.not.eq(null);
            expect(error).to.be.an.instanceOf(NotFoundError);
            expect(error.data.message).to.eq("Certificate `0` not found");
            done();
          }
        );
      });
    });
  });

  describe("#downloadCertificate", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const certificateId = 1;
    const fixture = loadFixture("downloadCertificate/success.http");

    it("produces a certificate", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/certificates/1/download")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.certificates
        .downloadCertificate(accountId, domainId, certificateId)
        .then(
          (response) => {
            const certificate = response.data;
            expect(certificate.server).to.match(/-----BEGIN CERTIFICATE-----/);
            expect(certificate.root).to.eq(null);
            expect(certificate.chain.length).to.eq(1);
            expect(certificate.chain[0]).to.match(
              /-----BEGIN CERTIFICATE-----/
            );
            done();
          },
          (error) => {
            done(error);
          }
        );
    });

    describe("when the certificate does not exist", () => {
      const fixture = loadFixture("notfound-certificate.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/certificates/0/download")
        .reply(fixture.statusCode, fixture.body);

      it("produces an error", (done) => {
        dnsimple.certificates.downloadCertificate(accountId, domainId, 0).then(
          (response) => {
            done();
          },
          (error) => {
            expect(error).to.not.eq(null);
            done();
          }
        );
      });
    });
  });

  describe("#getCertificatePrivateKey", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const certificateId = 1;
    const fixture = loadFixture("getCertificatePrivateKey/success.http");

    it("produces a certificate", (done) => {
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/certificates/1/private_key")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.certificates
        .getCertificatePrivateKey(accountId, domainId, certificateId)
        .then(
          (response) => {
            const certificate = response.data;
            expect(certificate.private_key).to.match(
              /-----BEGIN RSA PRIVATE KEY-----/
            );
            done();
          },
          (error) => {
            done(error);
          }
        );
    });

    describe("when the certificate does not exist", () => {
      const fixture = loadFixture("notfound-certificate.http");
      nock("https://api.dnsimple.com")
        .get("/v2/1010/domains/example.com/certificates/0/private_key")
        .reply(fixture.statusCode, fixture.body);

      it("produces an error", (done) => {
        dnsimple.certificates
          .getCertificatePrivateKey(accountId, domainId, 0)
          .then(
            (response) => {
              done();
            },
            (error) => {
              expect(error).to.not.eq(null);
              done();
            }
          );
      });
    });
  });

  describe("#purchaseLetsencryptCertificate", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const fixture = loadFixture("purchaseLetsencryptCertificate/success.http");

    it("purchases a certificate", (done) => {
      nock("https://api.dnsimple.com")
        .post("/v2/1010/domains/example.com/certificates/letsencrypt")
        .reply(fixture.statusCode, fixture.body);

      dnsimple.certificates
        .purchaseLetsencryptCertificate(accountId, domainId, {})
        .then(
          (response) => {
            const certificate = response.data;
            expect(certificate.id).to.eq(101967);
            done();
          },
          (error) => {
            done(error);
          }
        );
    });
  });

  describe("#issueLetsencryptCertificate", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const certificateId = 101967;
    const fixture = loadFixture("issueLetsencryptCertificate/success.http");

    it("issues a certificate", (done) => {
      nock("https://api.dnsimple.com")
        .post(
          `/v2/1010/domains/example.com/certificates/letsencrypt/${certificateId}/issue`
        )
        .reply(fixture.statusCode, fixture.body);

      dnsimple.certificates
        .issueLetsencryptCertificate(accountId, domainId, certificateId)
        .then(
          (response) => {
            const certificate = response.data;
            expect(certificate.id).to.eq(certificateId);
            done();
          },
          (error) => {
            done(error);
          }
        );
    });
  });

  describe("#purchaseLetsencryptCertificateRenewal", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const certificateId = 101967;
    const fixture = loadFixture(
      "purchaseRenewalLetsencryptCertificate/success.http"
    );

    it("purchases a certificate renewal", (done) => {
      nock("https://api.dnsimple.com")
        .post(
          `/v2/1010/domains/example.com/certificates/letsencrypt/${certificateId}/renewals`
        )
        .reply(fixture.statusCode, fixture.body);

      dnsimple.certificates
        .purchaseLetsencryptCertificateRenewal(
          accountId,
          domainId,
          certificateId,
          {}
        )
        .then(
          (response) => {
            const certificateRenewal = response.data;
            expect(certificateRenewal.id).to.eq(65082);
            expect(certificateRenewal.old_certificate_id).to.eq(certificateId);
            expect(certificateRenewal.new_certificate_id).to.eq(101972);
            done();
          },
          (error) => {
            done(error);
          }
        );
    });
  });

  describe("#issueLetsencryptCertificateRenewal", () => {
    const accountId = 1010;
    const domainId = "example.com";
    const certificateId = 101967;
    const certificateRenewalId = 65082;
    const newCertificateId = 101972;
    const fixture = loadFixture(
      "issueRenewalLetsencryptCertificate/success.http"
    );

    it("issues a certificate renewal", (done) => {
      nock("https://api.dnsimple.com")
        .post(
          `/v2/1010/domains/example.com/certificates/letsencrypt/${certificateId}/renewals/${certificateRenewalId}/issue`
        )
        .reply(fixture.statusCode, fixture.body);

      dnsimple.certificates
        .issueLetsencryptCertificateRenewal(
          accountId,
          domainId,
          certificateId,
          certificateRenewalId
        )
        .then(
          (response) => {
            const newCertificate = response.data;
            expect(newCertificate.id).to.eq(newCertificateId);
            done();
          },
          (error) => {
            done(error);
          }
        );
    });
  });
});
