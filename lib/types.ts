export type RateLimit = {
  limit: number | null;
  remaining: number | null;
  reset: number | null;
};

export type Account = {
  id: number;
  email: string;
  plan_identifier: string;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: number;
  email: string;
  created_at: string;
  updated_at: string;
};

export type NullableDateTime = string | null;

export type Charge = {
  invoiced_at: string;
  total_amount: string;
  balance_amount: string;
  reference: string;
  state: "collected" | "refunded";
  items: Array<ChargeItem>;
};

export type ChargeItem = {
  description: string;
  amount: string;
  product_id: number | string | null;
  product_type: string;
  product_reference: string | null;
};

export type Domain = {
  id: number;
  account_id: number;
  registrant_id: number | null;
  name: string;
  unicode_name: string;
  state: "hosted" | "registered" | "expired";
  auto_renew: boolean;
  private_whois: boolean;
  expires_at: NullableDateTime;
  expires_on: string;
  created_at: string;
  updated_at: string;
};

export type Pagination = {
  current_page: number;
  per_page: number;
  total_entries: number;
  total_pages: number;
};

export type Collaborator = {
  id: number;
  domain_id: number;
  domain_name: string;
  user_id: number;
  user_email: string;
  invitation: boolean;
  created_at: string;
  updated_at: string;
  accepted_at: string;
};

export type DNSSEC = {
  enabled: boolean;
  created_at: string;
  updated_at: string;
};

export type DelegationSigner = {
  id: number;
  domain_id: number;
  algorithm: string;
  digest: string;
  digest_type: string;
  keytag: string;
  public_key: string;
  created_at: string;
  updated_at: string;
};

export type EmailForward = {
  id: number;
  domain_id: number;
  alias_email: string;
  destination_email: string;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type Push = {
  id: number;
  domain_id: number;
  contact_id: number;
  account_id: number;
  created_at: string;
  updated_at: string;
  accepted_at: NullableDateTime;
};

export type Certificate = {
  id: number;
  domain_id: number;
  contact_id: number;
  name: string;
  common_name: string;
  years: number;
  csr: string;
  state:
    | "new"
    | "purchased"
    | "configured"
    | "submitted"
    | "issued"
    | "rejected"
    | "refunded"
    | "cancelled"
    | "requesting"
    | "failed";
  auto_renew: boolean;
  alternate_names: Array<string>;
  authority_identifier: "comodo" | "rapidssl" | "letsencrypt";
  created_at: string;
  updated_at: string;
  expires_at: string;
  expires_on: string;
};

export type CertificateDownload = {
  server: string;
  root: string | null;
  chain: Array<string>;
};

export type CertificatePrivateKey = { private_key: string };

export type LetsencryptCertificatePurchase = {
  id: number;
  certificate_id: number;
  state:
    | "new"
    | "purchased"
    | "configured"
    | "submitted"
    | "issued"
    | "rejected"
    | "refunded"
    | "cancelled"
    | "requesting"
    | "failed";
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
};

export type LetsencryptCertificateRenewal = {
  id: number;
  old_certificate_id: number;
  new_certificate_id: number;
  state: "cancelled" | "new" | "renewing" | "renewed" | "failed";
  auto_renew: boolean;
  created_at: string;
  updated_at: string;
};

export type TLDType = 1 | 2 | 3;

export type TLD = {
  tld: string;
  tld_type: TLDType;
  whois_privacy: boolean;
  auto_renew_only: boolean;
  idn: boolean;
  minimum_registration: number;
  registration_enabled: boolean;
  renewal_enabled: boolean;
  transfer_enabled: boolean;
  dnssec_interface_type: "ds" | "key";
};

export type ExtendedAttributeOption = {
  title: string;
  value: string;
  description: string;
};

export type ExtendedAttribute = {
  name: string;
  description: string;
  required: boolean;
  options: Array<ExtendedAttributeOption>;
};

export type DomainCheckResult = {
  domain: string;
  available: boolean;
  premium: boolean;
};

export type DomainPrices = {
  domain: string;
  premium: boolean;
  registration_price: number;
  renewal_price: number;
  transfer_price: number;
};

export type DomainRegistration = {
  id: number;
  domain_id: number;
  registrant_id: number;
  period: number;
  state: "cancelled" | "new" | "registering" | "registered" | "failed";
  auto_renew: boolean;
  whois_privacy: boolean;
  created_at: string;
  updated_at: string;
};

export type DomainTransfer = {
  id: number;
  domain_id: number;
  registrant_id: number;
  state: "cancelled" | "new" | "transferring" | "transferred" | "failed";
  auto_renew: boolean;
  whois_privacy: boolean;
  status_description: string;
  created_at: string;
  updated_at: string;
};

export type DomainRenewal = {
  id: number;
  domain_id: number;
  period: number;
  state: "cancelled" | "new" | "renewing" | "renewed" | "failed";
  created_at: string;
  updated_at: string;
};

export type NameServer = {
  id: number;
  name: string;
  ipv4: string;
  ipv6: string;
  created_at: string;
  updated_at: string;
};

export type WhoisPrivacy = {
  id: number;
  domain_id: number;
  enabled: boolean;
  expires_on: string;
  created_at: string;
  updated_at: string;
};

export type PrimaryServer = {
  id: number;
  account_id: number;
  name: string;
  ip: string;
  port: number;
  linked_secondary_zones: Array<string>;
  created_at: string;
  updated_at: string;
};

export type Zone = {
  id: number;
  account_id: number;
  name: string;
  reverse: boolean;
  secondary: boolean;
  last_transferred_at: string;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type ZoneFile = { zone: string };

export type ZoneDistribution = { distributed: boolean };

export type ZoneRecordRegion =
  | "global"
  | "SV1"
  | "ORD"
  | "IAD"
  | "AMS"
  | "TKO"
  | "SYD"
  | "CDG"
  | "FRA";

export type ZoneRecord = {
  id: number;
  zone_id: string;
  parent_id: number | null;
  name: string;
  content: string;
  ttl: number;
  priority?: number | null;
  type: string;
  regions: Array<ZoneRecordRegion>;
  system_record: boolean;
  created_at: string;
  updated_at: string;
};

export type Contact = {
  id: number;
  account_id: number;
  label: string;
  first_name: string;
  last_name: string;
  organization_name: string;
  job_title: string;
  address1: string;
  address2: string;
  city: string;
  state_province: string;
  postal_code: string;
  country: string;
  phone: string;
  fax: string;
  email: string;
  created_at: string;
  updated_at: string;
};

export type ServiceSetting = {
  name: string;
  label: string;
  append: string;
  description: string;
  example: string;
  password?: boolean;
};

export type Service = {
  id: number;
  name: string;
  sid: string;
  description: string;
  setup_description: string | null;
  requires_setup: boolean;
  default_subdomain: string | null;
  created_at: string;
  updated_at: string;
  settings: Array<ServiceSetting>;
};

export type Template = {
  id: number;
  account_id: number;
  name: string;
  sid: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export type TemplateRecord = {
  id: number;
  template_id: number;
  name: string;
  content: string;
  ttl: number;
  priority: number | null;
  type: string;
  created_at: string;
  updated_at: string;
};

export type VanityNameServer = {
  id: number;
  name: string;
  ipv4: string;
  ipv6: string;
  created_at: string;
  updated_at: string;
};

export type Webhook = { id: number; url: string; suppressed_at: string };

export type RegistrantChange = {
  id: number;
  account_id: number;
  contact_id: number;
  domain_id: number;
  state: "new" | "pending" | "cancelling" | "cancelled" | "completed";
  extended_attributes: Record<string, string>;
  registry_owner_change: boolean;
  irt_lock_lifted_by: string;
  created_at: string;
  updated_at: string;
};

export type RegistrantChangeCheck = {
  contact_id: number;
  domain_id: number;
  extended_attributes: Array<ExtendedAttribute>;
  registry_owner_change: boolean;
};

export type DomainTransferLock = { enabled: boolean };
