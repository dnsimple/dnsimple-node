'use strict';

class Certificates {
  constructor(client) {
    this._client = client;
  }

  listCertificates(accountId, domainId, options = {}) {
    return this._client.get(`/${accountId}/domains/${domainId}/certificates`, options);
  }

  getCertificate(accountId, domainId, certificateId, options = {}) {
    return this._client.get(`/${accountId}/domains/${domainId}/certificates/${certificateId}`, options);
  }

  downloadCertificate(accountId, domainId, certificateId, options = {}) {
    return this._client.get(`/${accountId}/domains/${domainId}/certificates/${certificateId}/download`, options);
  }

  getCertificatePrivateKey(accountId, domainId, certificateId, options = {}) {
    return this._client.get(`/${accountId}/domains/${domainId}/certificates/${certificateId}/private_key`, options);
  }
}

module.exports = Certificates;
