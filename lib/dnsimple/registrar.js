'use strict';

/**
 * Class providing access to the DNSimple Registrar API.
 *
 * @see https://developer.dnsimple.com/v2/registrar/
 */
class Registrar {
  constructor(client) {
    this._client = client;
  }

  /**
   * Checks whether a domain is available for registration.
   *
   * @see https://developer.dnsimple.com/v2/registrar/#check
   *
   * @example Check whether example.com is available
   * client.registrar.checkDomain(1010, 'example.com').then(function(response) {
   *   // handle response
   * }, function(error) {
   *   // handle error
   * });
   *
   * @param {number} accountId The account ID
   * @param {string} domainName The domain name to check
   * @param {Object} [options]
   * @return {Promise}
   */
  checkDomain(accountId, domainName, options = {}) {
    return this._client.get(this._registrar_path(accountId, domainName, 'check'), options);
  }

  /**
   * Gets the premium price for a domain.
   *
   * @see https://developer.dnsimple.com/v2/registrar/#check
   *
   * @example Check whether example.com is available
   * client.registrar.getDomainPremiumPrice(1010, 'example.com').then(function(response) {
   *   // handle response
   * }, function(error) {
   *   // handle error
   * });
   *
   * @param {number} accountId The account ID
   * @param {string} domainName The domain name to get the premium price on
   * @param {Object} [options]
   * @return {Promise}
   */
  getDomainPremiumPrice(accountId, domainName, options = {}) {
    return this._client.get(this._registrar_path(accountId, domainName, 'premium_price'), options);
  }

  /**
   * Registers a domain.
   *
   * @see https://developer.dnsimple.com/v2/registrar/#register
   *
   * @example Initiate the registration of example.com using the contact 1234 as registrant,
   *   and including whois privacy for the domain as well as auto-renewal
   * var attributes = {registrant_id: 1234, private_whois: true, auto_renew: true};
   * client.registrar.registerDomain(1010, 'example.com', attributes).then(function(response) {
   *   // handle response
   * }, function(error) {
   *   // handle error
   * });
   *
   * @param {number} accountId The account ID
   * @param {string} domainName The domain name to register
   * @param {Object} attributes Attributes of the registration
   * @param {number} attributes.registrant_id The registrant ID number.
   * @param {boolean} [attributes.private_whois] Set to true to enable whois privacy (additional charge)
   * @param {boolean} [attributes.auto_renew] Set to true to automatically renew the domain
   * @param {Object} [options]
   * @return {Promise}
   */
  registerDomain(accountId, domainName, attributes, options = {}) {
    // Note: registrar_id is required, but no validation occurs here.
    // In the ruby library this is validated.
    return this._client.post(this._registrar_path(accountId, domainName, 'registrations'), attributes, options);
  }

  /**
   * Renews a domain.
   *
   * @see https://developer.dnsimple.com/v2/registrar/#renew
   *
   * @example Renew example.com for 3 years:
   * client.registrar.renewDomain(1010, 'example.com', {period: 3}).then(function(response) {
   *  // handle response
   * }, function(error) {
   *  // handle error
   * });
   *
   * @param {number} accountId The account ID
   * @param {string} domainName The domain name to renew
   * @param {Object} attributes Attributes of the renewal
   * @param {number} [attributes.period] The number of years to renew (max 3, default 1)
   * @param {Object} [options]
   * @return {Promise}
   */
  renewDomain(accountId, domainName, attributes, options = {}) {
    return this._client.post(this._registrar_path(accountId, domainName, 'renewals'), attributes, options);
  }

  /**
   * Starts the transfer of a domain to DNSimple.
   *
   * @see https://developer.dnsimple.com/v2/registrar/#transfer
   *
   * @example Initiate the transfer for example.com using contact 1234 as registrant
   * client.registrar.transferDomain(1010, 'example.com', {registrant_id: 1234}).then(function(response) {
   *  // handle response
   * }, function(error) {
   *  // handle error
   * });
   *
   * @param {number} accountId The account ID
   * @param {string} domainName The domain name to transfer
   * @param {Object} attributes Attributes of the transfer
   * @param {number} attributes.registrant_id The registrant ID number
   * @param {Object} [options]
   * @return {Promise}
   */
  transferDomain(accountId, domainName, attributes, options = {}) {
    // Note: registrar_id is required, but no validation occurs here.
    // In the ruby library this is validated.
    return this._client.post(this._registrar_path(accountId, domainName, 'transfers'), attributes, options);
  }

  /**
   * Requests the transfer of a domain out of DNSimple.
   *
   * @see https://developer.dnsimple.com/v2/registrar/#transfer-out
   *
   * @example Request the transfer of example.com out of DNSimple
   * client.registrar.transferDomainOut(1010, 'example.com').then(function(response) {
   *  // handle response
   * }, function(error) {
   *  // handle error
   * });
   *
   * @param {number} accountId The account ID
   * @param {string} domainName The domain name to transfer out
   * @param {Object} [options]
   * @return {Promise}
   */
  transferDomainOut(accountId, domainName, options = {}) {
    return this._client.post(this._registrar_path(accountId, domainName, 'authorize_transfer_out'), null, options);
  }

  // Auto-renewal

  /**
   * @deprecated Use `enableDomainAutoRenewal`.
   */
  enableAutoRenewal(accountId, domainName, options = {}) {
    return this._client.put(this._registrar_path(accountId, domainName, 'auto_renewal'), null, options);
  }

  /**
   * Enable auto renewal for the domain in the account.
   *
   * @see https://developer.dnsimple.com/v2/registrar/auto-renewal/
   *
   * @param {number} accountId The account ID
   * @param {string} domainName The domain name
   * @param {Object} [options]
   * @return {Promise}
   */
  enableDomainAutoRenewal(accountId, domainName, options = {}) {
    return this._client.put(this._registrar_path(accountId, domainName, 'auto_renewal'), null, options);
  }

  /**
   * @deprecated Use `disableDomainAutoRenewal`
   */
  disableAutoRenewal(accountId, domainName, options = {}) {
    return this._client.delete(this._registrar_path(accountId, domainName, 'auto_renewal'), options);
  }

  /**
   * Disable auto renewal for the domain in the account.
   *
   * @see https://developer.dnsimple.com/v2/registrar/auto-renewal/
   *
   * @param {number} accountId The account ID
   * @param {string} domainName The domain name
   * @param {Object} [options]
   * @return {Promise}
   */
  disableDomainAutoRenewal(accountId, domainName, options = {}) {
    return this._client.delete(this._registrar_path(accountId, domainName, 'auto_renewal'), options);
  }

  // Whois Privacy

  /**
   * Gets the whois privacy for the domain.
   *
   * @see https://developer.dnsimple.com/v2/registrar/whois-privacy/#get
   *
   * @param {number} accountId The account ID
   * @param {string} domainName The domain name
   * @param {Object} [options]
   * @return {Promise}
   */
  getWhoisPrivacy(accountId, domainName, options = {}) {
    return this._client.get(this._registrar_path(accountId, domainName, 'whois_privacy'), options);
  }

  /**
   * Enable whois privacy for the domain.
   *
   * @see https://developer.dnsimple.com/v2/registrar/whois-privacy/#enable
   *
   * @example
   * client.registrar.enableWhoisPrivacy(1010, 'example.com').then(function(response) {
   *  // handle response
   * }, function(error) {
   *  // handle error
   * });
   *
   * @param {number} accountId The account ID
   * @param {string} domainName The domain name
   * @param {Object} [options]
   * @return {Promise}
   */
  enableWhoisPrivacy(accountId, domainName, options = {}) {
    return this._client.put(this._registrar_path(accountId, domainName, 'whois_privacy'), null, options);
  }

  /**
   * Disable whois privacy for the domain.
   *
   * @see https://developer.dnsimple.com/v2/registrar/whois-privacy/#disable
   *
   * @example
   * client.registrar.disableWhoisPrivacy(1010, 'example.com').then(function(response) {
   *  // handle response
   * }, function(error) {
   *  // handle error
   * });
   *
   * @param {number} accountId The account ID
   * @param {string} domainName The domain name
   * @param {Object} [options]
   * @return {Promise}
   */
  disableWhoisPrivacy(accountId, domainName, options = {}) {
    return this._client.delete(this._registrar_path(accountId, domainName, 'whois_privacy'), options);
  }

  /**
   * Renew whois privacy for the domain.
   *
   * @see https://developer.dnsimple.com/v2/registrar/whois-privacy/#renew
   *
   * @example
   * client.registrar.renewWhoisPrivacy(1010, 'example.com').then(function(response) {
   *  // handle response
   * }, function(error) {
   *  // handle error
   * });
   *
   * @param {number} accountId The account ID
   * @param {string} domainName The domain name
   * @param {Object} [options]
   * @return {Promise}
   */
  renewWhoisPrivacy(accountId, domainName, options = {}) {
    return this._client.post(this._registrar_path(accountId, domainName, 'whois_privacy/renewals'), null, options);
  }

  // Domain Delegation

  /**
   * Lists name servers the domain is delegating to.
   *
   * @see https://developer.dnsimple.com/v2/registrar/delegation/#list
   *
   * @example
   * client.registrar.getDomainDelegation(1010, 'example.com').then(function(response) {
   *  // handle response
   * }, function(error) {
   *  // handle error
   * });
   *
   * @param {number} accountId The account ID
   * @param {string} domainName The domain name
   * @param {Object} [options]
   * @return {Promise}
   */
  getDomainDelegation(accountId, domainName, options = {}) {
    return this._client.get(this._registrar_path(accountId, domainName, 'delegation'), options);
  }

  /**
   * Change name servers the domain is delegating to.
   *
   * @see https://developer.dnsimple.com/v2/registrar/delegation/#update
   *
   * @example
   * let nameServers = ['ns1.example.com','ns2.example.com'];
   * client.registrar.changeDomainDelegation(1010, 'example.com', nameServers).then(function(response) {
   *  // handle response
   * }, function(error) {
   *  // handle error
   * });
   *
   * @param {number} accountId The account ID
   * @param {string} domainName The domain name
   * @param {Array} attributes The name servers to delegate to
   * @param {Object} [options]
   * @return {Promise}
   */
  changeDomainDelegation(accountId, domainName, attributes, options = {}) {
    return this._client.put(this._registrar_path(accountId, domainName, 'delegation'), attributes, options);
  }

  /**
   * Enable vanity name servers for the domain.
   *
   * @see https://developer.dnsimple.com/v2/registrar/delegation/#delegateToVanity
   *
   * @example
   * let nameServers = ['ns1.example.com','ns2.example.com', 'ns3.example.com', 'ns4.example.com'];
   * client.registrar.changeDomainDelegationToVanity(1010, 'example.com', nameServers).then(function(response) {
   *  // handle response
   * }, function(error) {
   *  // handle error
   * });
   *
   * @param {number} accountId The account ID
   * @param {string} domainName The domain name
   * @param {Array} attributes The name servers to use
   * @param {Object} [options]
   * @return {Promise}
   */
  changeDomainDelegationToVanity(accountId, domainName, attributes, options = {}) {
    return this._client.put(this._registrar_path(accountId, domainName, 'delegation/vanity'), attributes, options);
  }

  /**
   * Disable vanity name servers for the domain.
   *
   * @see https://developer.dnsimple.com/v2/registrar/delegation/#delegateFromVanity
   *
   * @example
   * client.registrar.changeDomainDelegationFromVanity(1010, 'example.com').then(function(response) {
   *  // handle response
   * }, function(error) {
   *  // handle error
   * });
   *
   * @param {number} accountId The account ID
   * @param {string} domainName The domain name
   * @param {Object} [options]
   * @return {Promise}
   */
  changeDomainDelegationFromVanity(accountId, domainName, options = {}) {
    return this._client.delete(this._registrar_path(accountId, domainName, 'delegation/vanity'), options);
  }

  // Internal functions

  _registrar_path(accountId, domainName, resource) {
    return `/${accountId}/registrar/domains/${domainName}/${resource}`;
  }
}

module.exports = Registrar;
