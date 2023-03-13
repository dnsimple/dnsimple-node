import Accounts = require("./dnsimple/accounts");
import Certificates = require("./dnsimple/certificates");
import Client = require("./dnsimple/client");
import Collaborators = require("./dnsimple/collaborators");
import Contacts = require("./dnsimple/contacts");
import Domains = require("./dnsimple/domains");
import Identity = require("./dnsimple/identity");
import Oauth = require("./dnsimple/oauth");
import Registrar = require("./dnsimple/registrar");
import Services = require("./dnsimple/services");
import Templates = require("./dnsimple/templates");
import Tlds = require("./dnsimple/tlds");
import VanityNameServers = require("./dnsimple/vanity_name_servers");
import Webhooks = require("./dnsimple/webhooks");
import Zones = require("./dnsimple/zones");

class Dnsimple {
  static VERSION = "6.2.0";
  static DEFAULT_TIMEOUT = 120000;
  static DEFAULT_BASE_URL = "https://api.dnsimple.com";
  static DEFAULT_USER_AGENT = `dnsimple-node/${Dnsimple.VERSION}`;
  static services = {
    accounts: Accounts,
    certificates: Certificates,
    collaborators: Collaborators,
    contacts: Contacts,
    domains: Domains,
    identity: Identity,
    oauth: Oauth,
    registrar: Registrar,
    services: Services,
    templates: Templates,
    tlds: Tlds,
    vanityNameServers: VanityNameServers,
    webhooks: Webhooks,
    zones: Zones,
  };
  public accounts!: Accounts;
  public certificates!: Certificates;
  public collaborators!: Collaborators;
  public contacts!: Contacts;
  public domains!: Domains;
  public identity!: Identity;
  public oauth!: Oauth;
  public registrar!: Registrar;
  public services!: Services;
  public templates!: Templates;
  public tlds!: Tlds;
  public vanityNameServers!: VanityNameServers;
  public webhooks!: Webhooks;
  public zones!: Zones;

  #accessToken?: string;
  #baseUrl!: URL;
  #userAgent!: string;

  public VERSION = Dnsimple.VERSION;
  public client = new Client(this);
  public timeout!: number;

  constructor(attrs: {
    timeout?: number | null | undefined;
    accessToken?: string | null | undefined;
    baseUrl?: string | null | undefined;
    userAgent?: string | null | undefined;
  }) {
    for (const [name, cls] of Object.entries(Dnsimple.services)) {
      (this as any)[name] = new cls(this.client);
    }

    this.setTimeout(attrs.timeout);
    this.setAccessToken(attrs.accessToken);
    this.setBaseUrl(attrs.baseUrl);
    this.setUserAgent(attrs.userAgent);
  }

  setTimeout(timeout: number | null | undefined) {
    this.timeout = timeout || Dnsimple.DEFAULT_TIMEOUT;
  }

  accessToken() {
    return this.#accessToken;
  }

  setAccessToken(accessToken: string | null | undefined) {
    this.#accessToken = accessToken ?? undefined;
  }

  baseUrl() {
    return this.#baseUrl;
  }

  setBaseUrl(baseUrl: string | null | undefined) {
    this.#baseUrl = new URL(baseUrl || Dnsimple.DEFAULT_BASE_URL);
  }

  userAgent() {
    return this.#userAgent;
  }

  setUserAgent(userAgent: string | null | undefined) {
    if (!userAgent) {
      this.#userAgent = Dnsimple.DEFAULT_USER_AGENT;
    } else {
      this.#userAgent = `${userAgent} ${Dnsimple.DEFAULT_USER_AGENT}`;
    }
  }
}

export = Dnsimple;
