export type Date = string;

export type DateTime = string;

export type NullableDate = string;

export type NullableDateTime = string;

export type Error = { message: string };

export type Pagination = {
  current_page: number;
  per_page: number;
  total_entries: number;
  total_pages: number;
};

export type Account = {
  id: number;
  email: string;
  plan_identifier: string;
  created_at: DateTime;
  updated_at: DateTime;
};

export type WebhookAccount = {
  id: number;
  display: string;
  identifier: string;
};

export type AccountInvitation = {
  id: number;
  account_id: number;
  email: string;
  token: string;
  invitation_sent_at: DateTime;
  invitation_accepted_at: NullableDateTime;
  created_at: DateTime;
  updated_at: DateTime;
};

export type Actor = { id: number; identifier: string; pretty: string };

export type BillingSettings = {};

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
  created_at: DateTime;
  updated_at: DateTime;
  expires_at: DateTime;
  expires_on: Date;
};

export type CertificateDownload = {
  server: string;
  root: string;
  chain: Array<string>;
};

export type CertificatePrivateKey = { private_key: string };

export type Collaborator = {
  id: number;
  domain_id: number;
  domain_name: string;
  user_id: number;
  user_email: string;
  invitation: boolean;
  created_at: DateTime;
  updated_at: DateTime;
  accepted_at: DateTime;
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
  created_at: DateTime;
  updated_at: DateTime;
};

export type DelegationSigner = {
  id: number;
  domain_id: number;
  algorithm: string;
  digest: string;
  digest_type: string;
  keytag: string;
  public_key: string;
  created_at: DateTime;
  updated_at: DateTime;
};

export type Domain = {
  id: number;
  account_id: number;
  registrant_id: number;
  name: string;
  unicode_name: string;
  state: "hosted" | "registered" | "expired";
  auto_renew: boolean;
  private_whois: boolean;
  expires_at: NullableDateTime;
  expires_on: Date;
  created_at: DateTime;
  updated_at: DateTime;
};

export type DomainCheckResult = {
  domain: string;
  available: boolean;
  premium: boolean;
};

export type DomainNameServer = string;

export type DomainPremiumPrice = { premium_price: string; action: string };

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
  created_at: DateTime;
  updated_at: DateTime;
};

export type DomainRenewal = {
  id: number;
  domain_id: number;
  period: number;
  state: "cancelled" | "new" | "renewing" | "renewed" | "failed";
  created_at: DateTime;
  updated_at: DateTime;
};

export type DomainTransfer = {
  id: number;
  domain_id: number;
  registrant_id: number;
  state: "cancelled" | "new" | "transferring" | "transferred" | "failed";
  auto_renew: boolean;
  whois_privacy: boolean;
  status_description: string;
  created_at: DateTime;
  updated_at: DateTime;
};

export type DNSSEC = {
  enabled: boolean;
  created_at: DateTime;
  updated_at: DateTime;
};

export type EmailForward = {
  id: number;
  domain_id: number;
  alias_email: string;
  destination_email: string;
  from: string;
  to: string;
  created_at: DateTime;
  updated_at: DateTime;
};

export type EventAccountAddUser = { account: Account; user: User };

export type EventAccountBillingSettingsUpdate = {
  account: Account;
  billing_settings: BillingSettings;
};

export type EventAccountPaymentDetailsUpdate = { account: Account };

export type EventAccountRemoveUser = { account: Account; user: User };

export type EventAccountUpdate = { account: Account };

export type EventAccountInvitationAccept = {
  account: Account;
  account_invitation: AccountInvitation;
};

export type EventAccountInvitationCreate = {
  account: Account;
  account_invitation: AccountInvitation;
};

export type EventAccountInvitationRemove = {
  account: Account;
  account_invitation: AccountInvitation;
};

export type EventAccountInvitationResend = {
  account: Account;
  account_invitation: AccountInvitation;
};

export type EventCertificateAutoRenewalDisable = { certificate: Certificate };

export type EventCertificateAutoRenewalEnable = { certificate: Certificate };

export type EventCertificateAutoRenewalFailed = { certificate: Certificate };

export type EventCertificateIssue = { certificate: Certificate };

export type EventCertificateReissue = { certificate: Certificate };

export type EventCertificateRemovePrivateKey = { certificate: Certificate };

export type EventContactCreate = { contact: Contact };

export type EventContactDelete = { contact: Contact };

export type EventContactUpdate = { contact: Contact };

export type EventDNSSECCreate = { dnssec: DNSSEC };

export type EventDNSSECDelete = { dnssec: DNSSEC };

export type EventDNSSECRotationStart = {
  delegation_signer_record: DelegationSigner;
  dnssec: DNSSEC;
};

export type EventDNSSECRotationComplete = {
  delegation_signer_record: DelegationSigner;
  dnssec: DNSSEC;
};

export type EventDomainAutoRenewalDisable = { domain: Domain };

export type EventDomainAutoRenewalEnable = { domain: Domain };

export type EventDomainCreate = { domain: Domain };

export type EventDomainDelete = { domain: Domain };

export type EventDomainRegisterStarted = { domain: Domain };

export type EventDomainRegister = { domain: Domain };

export type EventDomainRegisterCancelled = { domain: Domain };

export type EventDomainRenewStarted = { auto: boolean; domain: Domain };

export type EventDomainRenew = { auto: boolean; domain: Domain };

export type EventDomainRenewCancelled = { auto: boolean; domain: Domain };

export type EventDomainDelegationChange = {
  domain: Domain;
  name_servers: Array<NameServer>;
};

export type EventDomainRegistrantChangeStarted = {
  domain: Domain;
  registrant: Contact;
};

export type EventDomainRegistrantChange = {
  domain: Domain;
  registrant: Contact;
};

export type EventDomainRegistrantChangeCancelled = {
  domain: Domain;
  registrant: Contact;
};

export type EventDomainResolutionDisable = { domain: Domain };

export type EventDomainResolutionEnable = { domain: Domain };

export type EventDomainTransferStarted = { domain: Domain };

export type EventDomainTransfer = { domain: Domain };

export type EventDomainTransferCancelled = { domain: Domain };

export type EventEmailForwardCreate = { email_forward: EmailForward };

export type EventEmailForwardDelete = { email_forward: EmailForward };

export type EventEmailForwardUpdate = { email_forward: EmailForward };

export type EventInvoiceCollect = { invoice: Invoice };

export type EventNameServerDeregister = { name_server: { name: string } };

export type EventNameServerRegister = { name_server: { name: string } };

export type EventOauthApplicationCreate = {
  oauth_application: OauthApplication;
};

export type EventOauthApplicationDelete = {
  oauth_application: OauthApplication;
};

export type EventOauthApplicationResetClientSecret = {
  oauth_application: OauthApplication;
};

export type EventOauthApplicationRevokeAccessTokens = {
  oauth_application: OauthApplication;
};

export type EventOauthApplicationUpdate = {
  oauth_application: OauthApplication;
};

export type EventPushAccept = { push: Push };

export type EventPushInitiate = { push: Push };

export type EventPushReject = { push: Push };

export type EventRecordCreate = { zone_record: ZoneRecord };

export type EventRecordDelete = { zone_record: ZoneRecord };

export type EventRecordUpdate = { zone_record: ZoneRecord };

export type EventSecondaryDNSCreate = { configuration: SecondaryDNS };

export type EventSecondaryDNSDelete = { configuration: SecondaryDNS };

export type EventSecondaryDNSUpdate = { configuration: SecondaryDNS };

export type EventSubscriptionMigrate = { subscription: Subscription };

export type EventSubscriptionRenew = { subscription: Subscription };

export type EventSubscriptionSubscribe = { subscription: Subscription };

export type EventSubscriptionUnsubscribe = { subscription: Subscription };

export type EventTemplateApply = { template: Template; zone: Zone };

export type EventTemplateCreate = { template: Template };

export type EventTemplateDelete = { template: Template };

export type EventTemplateUpdate = { template: Template };

export type EventTemplateRecordCreate = { template_record: TemplateRecord };

export type EventTemplateRecordDelete = { template_record: TemplateRecord };

export type EventVanityDisable = { domain: Domain };

export type EventVanityEnable = { domain: Domain };

export type EventWebhookCreate = { webhook: Webhook };

export type EventWebhookDelete = { webhook: Webhook };

export type EventWhoisPrivacyDisable = {
  domain: Domain;
  whois_privacy: WhoisPrivacy;
};

export type EventWhoisPrivacyEnable = {
  domain: Domain;
  whois_privacy: WhoisPrivacy;
};

export type EventWhoisPrivacyPurchase = {
  domain: Domain;
  whois_privacy: WhoisPrivacy;
};

export type EventWhoisPrivacyRenew = {
  domain: Domain;
  whois_privacy: WhoisPrivacy;
};

export type EventZoneCreate = { zone: Zone };

export type EventZoneDelete = { zone: Zone };

export type ExtendedAttribute = {
  name: string;
  description: string;
  required: boolean;
  options: Array<ExtendedAttributeOption>;
};

export type TradeExtendedAttributes = Record<string, string>;

export type ExtendedAttributeOption = {
  title: string;
  value: string;
  description: string;
};

export type Invoice = {
  id: number;
  invoice_number: string;
  created_at: DateTime;
  updated_at: DateTime;
};

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
  created_at: DateTime;
  updated_at: DateTime;
};

export type LetsencryptCertificateRenewal = {
  id: number;
  old_certificate_id: number;
  new_certificate_id: number;
  state: "cancelled" | "new" | "renewing" | "renewed" | "failed";
  auto_renew: boolean;
  created_at: DateTime;
  updated_at: DateTime;
};

export type NameServer = {
  id: number;
  name: string;
  ipv4: string;
  ipv6: string;
  created_at: DateTime;
  updated_at: DateTime;
};

export type OauthApplication = {
  id: number;
  name: string;
  description: string;
  homepage_url: string;
  created_at: DateTime;
  updated_at: DateTime;
};

export type PrimaryServer = {
  id: number;
  account_id: number;
  name: string;
  ip: string;
  port: number;
  linked_secondary_zones: Array<string>;
  created_at: DateTime;
  updated_at: DateTime;
};

export type Push = {
  id: number;
  domain_id: number;
  contact_id: number;
  account_id: number;
  created_at: DateTime;
  updated_at: DateTime;
  accepted_at: NullableDateTime;
};

export type RegistrantChange = {
  id: number;
  account_id: number;
  contact_id: number;
  domain_id: number;
  state: "new" | "pending" | "cancelling" | "cancelled" | "completed";
  extended_attributes: TradeExtendedAttributes;
  registry_owner_change: boolean;
  irt_lock_lifted_by: Date;
  created_at: DateTime;
  updated_at: DateTime;
};

export type RegistrantChangeCheck = {
  contact_id: number;
  domain_id: number;
  extended_attributes: Array<ExtendedAttribute>;
  registry_owner_change: boolean;
};

export type SecondaryDNS = {
  id: number;
  zone_id: string;
  name_servers: Array<string>;
  whitelisted_ips: Array<string>;
  created_at: DateTime;
  updated_at: DateTime;
};

export type Service = {
  id: number;
  name: string;
  sid: string;
  description: string;
  setup_description: string;
  requires_setup: boolean;
  default_subdomain: string;
  created_at: DateTime;
  updated_at: DateTime;
  settings: Array<ServiceSetting>;
};

export type ServiceSetting = {
  name: string;
  label: string;
  append: string;
  description: string;
  example: string;
  password: boolean;
};

export type Subscription = {
  id: number;
  plan_name:
    | "Silver"
    | "Gold"
    | "Silver v1 Yearly"
    | "Bronze Yearly"
    | "Gold v1 Yearly"
    | "No DNS"
    | "Professional Yearly"
    | "Platinum Yearly"
    | "Personal Yearly"
    | "Silver Yearly"
    | "Business"
    | "Bronze Yearly v1"
    | "Bronze"
    | "Business Yearly"
    | "Personal"
    | "Basic Reseller Yearly"
    | "Expert Reseller"
    | "Expert Reseller Yearly"
    | "Silver v1"
    | "Master Reseller Yearly"
    | "Basic Reseller"
    | "Gold Yearly"
    | "Bronze v1"
    | "Professional"
    | "Master Reseller"
    | "Gold v1"
    | "Platinum";
  state:
    | "new"
    | "subscribing"
    | "subscribed"
    | "unsubscribed"
    | "not_subscribed";
  created_at: DateTime;
  updated_at: DateTime;
};

export type Template = {
  id: number;
  account_id: number;
  name: string;
  sid: string;
  description: string;
  created_at: DateTime;
  updated_at: DateTime;
};

export type TemplateRecord = {
  id: number;
  template_id: number;
  name: string;
  content: string;
  ttl: TTL;
  priority: number;
  type: TemplateRecordType;
  created_at: DateTime;
  updated_at: DateTime;
};

export type TemplateRecordType =
  | "A"
  | "AAAA"
  | "ALIAS"
  | "CAA"
  | "CNAME"
  | "DNSKEY"
  | "DS"
  | "HINFO"
  | "MX"
  | "NAPTR"
  | "NS"
  | "POOL"
  | "PTR"
  | "SOA"
  | "SPF"
  | "SRV"
  | "SSHFP"
  | "TXT"
  | "URL";

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

export type TLDType = 1 | 2 | 3;

export type TTL = number;

export type User = {
  id: number;
  email: string;
  created_at: DateTime;
  updated_at: DateTime;
};

export type VanityNameServer = {
  id: number;
  name: string;
  ipv4: string;
  ipv6: string;
  created_at: DateTime;
  updated_at: DateTime;
};

export type Webhook = { id: number; url: string; suppressed_at: DateTime };

export type WebhookPayload = {
  name:
    | "account.add_user"
    | "account.billing_settings_update"
    | "account.payment_details_update"
    | "account.remove_user"
    | "account.update"
    | "account_invitation.accept"
    | "account_invitation.create"
    | "account_invitation.remove"
    | "account_invitation.resend"
    | "certificate.auto_renewal_disable"
    | "certificate.auto_renewal_enable"
    | "certificate.auto_renewal_failed"
    | "certificate.issue"
    | "certificate.reissue"
    | "certificate.remove_private_key"
    | "contact.create"
    | "contact.update"
    | "contact.delete"
    | "dnssec.create"
    | "dnssec.delete"
    | "dnssec.rotation_start"
    | "dnssec.rotation_complete"
    | "domain.auto_renewal_disable"
    | "domain.auto_renewal_enable"
    | "domain.create"
    | "domain.delete"
    | "domain.register:started"
    | "domain.register"
    | "domain.register:cancelled"
    | "domain.renew:started"
    | "domain.renew"
    | "domain.renew:cancelled"
    | "domain.delegation_change"
    | "domain.registrant_change:started"
    | "domain.registrant_change"
    | "domain.registrant_change:cancelled"
    | "domain.resolution_disable"
    | "domain.resolution_enable"
    | "domain.transfer:started"
    | "domain.transfer"
    | "domain.transfer:cancelled"
    | "email_forward.create"
    | "email_forward.update"
    | "email_forward.delete"
    | "name_server.deregister"
    | "name_server.register"
    | "oauth_application.create"
    | "oauth_application.delete"
    | "oauth_application.reset_client_secret"
    | "oauth_application.revoke_access_tokens"
    | "push.accept"
    | "push.initiate"
    | "push.reject"
    | "secondary_dns.create"
    | "secondary_dns.delete"
    | "secondary_dns.update"
    | "subscription.migrate"
    | "subscription.subscribe"
    | "subscription.unsubscribe"
    | "template.create"
    | "template.delete"
    | "template.update"
    | "template_record.create"
    | "template_record.delete"
    | "vanity.disable"
    | "vanity.enable"
    | "webhook.create"
    | "webhook.delete"
    | "whois_privacy.disable"
    | "whois_privacy.enable"
    | "whois_privacy.purchase"
    | "whois_privacy.renew"
    | "zone.create"
    | "zone.delete"
    | "zone_record.create"
    | "zone_record.delete"
    | "zone_record.update";
  api_version: "v2";
  request_identifier: string;
  data:
    | EventAccountAddUser
    | EventAccountBillingSettingsUpdate
    | EventAccountPaymentDetailsUpdate
    | EventAccountRemoveUser
    | EventAccountUpdate
    | EventAccountInvitationAccept
    | EventAccountInvitationCreate
    | EventAccountInvitationRemove
    | EventAccountInvitationResend
    | EventCertificateAutoRenewalDisable
    | EventCertificateAutoRenewalEnable
    | EventCertificateAutoRenewalFailed
    | EventCertificateIssue
    | EventCertificateReissue
    | EventCertificateRemovePrivateKey
    | EventContactCreate
    | EventContactDelete
    | EventContactUpdate
    | EventDNSSECCreate
    | EventDNSSECDelete
    | EventDNSSECRotationStart
    | EventDNSSECRotationComplete
    | EventDomainAutoRenewalDisable
    | EventDomainAutoRenewalEnable
    | EventDomainCreate
    | EventDomainDelete
    | EventDomainRegisterStarted
    | EventDomainRegister
    | EventDomainRegisterCancelled
    | EventDomainRenewStarted
    | EventDomainRenew
    | EventDomainRenewCancelled
    | EventDomainDelegationChange
    | EventDomainRegistrantChangeStarted
    | EventDomainRegistrantChange
    | EventDomainRegistrantChangeCancelled
    | EventDomainResolutionDisable
    | EventDomainResolutionEnable
    | EventDomainTransferStarted
    | EventDomainTransfer
    | EventDomainTransferCancelled
    | EventEmailForwardCreate
    | EventEmailForwardDelete
    | EventEmailForwardUpdate
    | EventInvoiceCollect
    | EventNameServerDeregister
    | EventNameServerRegister
    | EventOauthApplicationCreate
    | EventOauthApplicationDelete
    | EventOauthApplicationUpdate
    | EventOauthApplicationResetClientSecret
    | EventOauthApplicationRevokeAccessTokens
    | EventPushAccept
    | EventPushInitiate
    | EventPushReject
    | EventRecordCreate
    | EventRecordDelete
    | EventRecordUpdate
    | EventSecondaryDNSCreate
    | EventSecondaryDNSDelete
    | EventSecondaryDNSUpdate
    | EventSubscriptionMigrate
    | EventSubscriptionRenew
    | EventSubscriptionSubscribe
    | EventSubscriptionUnsubscribe
    | EventTemplateApply
    | EventTemplateCreate
    | EventTemplateDelete
    | EventTemplateUpdate
    | EventTemplateRecordCreate
    | EventTemplateRecordDelete
    | EventVanityDisable
    | EventVanityEnable
    | EventWebhookCreate
    | EventWebhookDelete
    | EventWhoisPrivacyDisable
    | EventWhoisPrivacyEnable
    | EventWhoisPrivacyPurchase
    | EventWhoisPrivacyRenew
    | EventZoneCreate
    | EventZoneDelete;
  account: unknown;
  actor: unknown;
};

export type WhoisPrivacy = {
  id: number;
  domain_id: number;
  enabled: boolean;
  expires_on: Date;
  created_at: DateTime;
  updated_at: DateTime;
};

export type WhoisPrivacyRenewal = {
  id: number;
  domain_id: number;
  whois_privacy_id: number;
  state: string;
  enabled: boolean;
  expires_on: Date;
  created_at: DateTime;
  updated_at: DateTime;
};

export type Zone = {
  id: number;
  account_id: number;
  name: string;
  reverse: boolean;
  secondary: boolean;
  last_transferred_at: DateTime;
  created_at: DateTime;
  updated_at: DateTime;
};

export type ZoneFile = { zone: string };

export type ZoneDistribution = { distributed: boolean };

export type ZoneRecord = {
  id: number;
  zone_id: string;
  parent_id: number;
  name: string;
  content: string;
  ttl: TTL;
  priority: number;
  type: ZoneRecordType;
  regions: Array<ZoneRecordRegion>;
  system_record: boolean;
  created_at: DateTime;
  updated_at: DateTime;
};

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

export type ZoneRecordType =
  | "A"
  | "AAAA"
  | "ALIAS"
  | "CAA"
  | "CNAME"
  | "DNSKEY"
  | "DS"
  | "HINFO"
  | "MX"
  | "NAPTR"
  | "NS"
  | "POOL"
  | "PTR"
  | "SOA"
  | "SPF"
  | "SRV"
  | "SSHFP"
  | "TXT"
  | "URL";
