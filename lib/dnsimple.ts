import Accounts from "./dnsimple/accounts";
import Certificates from "./dnsimple/certificates";
import Client from "./dnsimple/client";
import Collaborators from "./dnsimple/collaborators";
import Contacts from "./dnsimple/contacts";
import Domains from "./dnsimple/domains";
import Identity from "./dnsimple/identity";
import Oauth from "./dnsimple/oauth";
import Registrar from "./dnsimple/registrar";
import Services from "./dnsimple/services";
import Templates from "./dnsimple/templates";
import Tlds from "./dnsimple/tlds";
import VanityNameServers from "./dnsimple/vanity_name_servers";
import Webhooks from "./dnsimple/webhooks";
import Zones from "./dnsimple/zones";

export default class Dnsimple {
  static VERSION = "6.2.0";
  static DEFAULT_TIMEOUT = 120000;
  static DEFAULT_BASE_URL = "https://api.dnsimple.com";
  static DEFAULT_USER_AGENT = `dnsimple-node/${Dnsimple.VERSION}`;

  #accessToken?: string;
  #baseUrl!: URL;
  #userAgent!: string;

  public timeout!: number;
  public client = new Client(this);
  public accounts = new Accounts(this.client);
  public certificates = new Certificates(this.client);
  public collaborators = new Collaborators(this.client);
  public contacts = new Contacts(this.client);
  public domains = new Domains(this.client);
  public identity = new Identity(this.client);
  public oauth = new Oauth(this.client);
  public registrar = new Registrar(this.client);
  public services = new Services(this.client);
  public templates = new Templates(this.client);
  public tlds = new Tlds(this.client);
  public vanityNameServers = new VanityNameServers(this.client);
  public webhooks = new Webhooks(this.client);
  public zones = new Zones(this.client);

  constructor(attrs: {
    timeout?: number | null | undefined;
    accessToken?: string | null | undefined;
    baseUrl?: string | null | undefined;
    userAgent?: string | null | undefined;
  }) {
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
