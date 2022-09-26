---
layout: nodes.liquid
section: ethereum
date: Last Modified
title: "Proof of Reserve Feeds"
permalink: "docs/data-feeds/proof-of-reserve/"
whatsnext: {
  "Find contract addresses for Proof of Reserve Feeds":"/docs/data-feeds/proof-of-reserve/addresses/"
}
---

Chainlink Proof of Reserve Feeds provide the status of the reserves that back several asset tokens on-chain. These feeds operate the same way as other Chainlink Data Feeds. To learn how to use these feeds, see the [Using Data Feeds](/docs/data-feeds/price-feeds/) guide.

To find a list of available Proof of Reserve Feeds, see the [Contract Addresses](/docs/data-feeds/proof-of-reserve/addresses/) page.

**Topics**

- [Types of Proof of Reserve Feeds](#types-of-proof-of-reserve-feeds)
  - [Cross-chain reserves](#cross-chain-reserves)
  - [Off-chain reserves](#off-chain-reserves)
- [Using Proof of Reserve Feeds](#using-proof-of-reserve-feeds)

## Types of Proof of Reserve Feeds

Reserves are available for both cross-chain assets and off-chain assets. Token issuers prove the reserves for their assets through several different methods. 

- [Cross-chain reserves](#cross-chain-reserves):
  - Wallet address manager
  - Self-attested wallet API
- [Off-chain reserves](#off-chain-reserves):
  - Third-party API
  - Custodian API
  - Self-attested API


### Cross-chain reserves

Cross-Chain reserves are sourced from the network where the reserves are held. This includes but is not limited to networks including Bitcoin, Filecoin, Cardano, and chains where Chainlink has a native integration. Chainlink Node operators can report cross-chain reserves by running an [external adapter](/docs/external-adapters/) and querying the source-chain client directly. In some instances, the reserves are composed of a dynamic list of IDs or addresses using a composite adapter.

Cross-chain reserves provide their data using the following methods:

- Wallet address manager: The project uses the [IPoRAddressList](https://github.com/smartcontractkit/chainlink/blob/develop/contracts/src/v0.8/interfaces/PoRAddressList.sol) wallet address manager contract and self-attests to which addresses they own.
- Self-attested wallet API: The project attests which addresses they own through a self-hosted API.

### Off-chain reserves

Off-Chain reserves are sourced from APIs through an [external adapter](/docs/external-adapters/).

Off-chain reserves provide their data using the following methods:

- Third-party API: An auditor or a third-party verifies the reserves and provides that data through an API.
- Custodian API: Reserve status is read directly from a bank or custodian API.
- Self-attested API: Reserve status is read from an API that the token issuer hosts.

## Using Proof of Reserve Feeds

Read answers from Proof of Reserve Feeds the same way that you use [other Data Feeds](/docs/data-feeds/price-feeds/).

Using Solidity, your smart contract should reference [`AggregatorV3Interface`](https://github.com/smartcontractkit/chainlink/blob/master/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol), which defines the external functions implemented by Data Feeds.

```solidity Goerli
{% include 'samples/PriceFeeds/PoRPriceConsumerV3.sol' %}
```

<div class="remix-callout">
      <a href="https://remix.ethereum.org/#url=https://docs.chain.link/samples/PriceFeeds/PoRPriceConsumerV3.sol" target="_blank" >Open in Remix</a>
      <a href="/docs/conceptual-overview/#what-is-remix">What is Remix?</a>
</div>