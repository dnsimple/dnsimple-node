/**
 * From the repository root:
 *   1. npm install && npm run build
 *   2. node test_local.mjs
 */
import { DNSimple } from "./dist/lib/main.js";

const client = new DNSimple({
  accessToken: "dnsimpletest_a_FSYtfYn7p74jfPd3GBUUsnLoOXia8hkR",
  baseUrl: "http://api.localhost:5000",
});

const accountId = 2;
const registrantId = 1;
const tldName = "eu";
const domainName = "anexamplelydomain.to";
const newDomainName = "nodelibdomaintrustee233";

const list = await client.tlds.listTlds();
for (const t of list.data) {
  console.log(
    `tld=${t.tld} trustee_service_enabled=${t.trustee_service_enabled} trustee_service_required=${t.trustee_service_required}`
  );
}

const tld = (await client.tlds.getTld(tldName)).data;
console.log(
  `tld=${tld.tld} trustee_service_enabled=${tld.trustee_service_enabled} trustee_service_required=${tld.trustee_service_required}`
);

const domain = (await client.domains.getDomain(accountId, domainName)).data;
console.log(`domain=${domain.name} trustee=${domain.trustee}`);

const prices = (await client.registrar.getDomainPrices(accountId, domainName))
  .data;
console.log(
  `prices domain=${prices.domain} trustee_price=${prices.trustee_price}`
);

const registration = (
  await client.registrar.registerDomain(accountId, `${newDomainName}.eu`, {
    registrant_id: registrantId,
  })
).data;
console.log(
  `registration domain_id=${registration.domain_id} trustee=${registration.trustee}`
);
