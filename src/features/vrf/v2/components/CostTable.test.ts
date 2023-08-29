import { getGasCalculatorUrl } from "./CostTable"
import { expect, test } from "@jest/globals"
import { ChainNetwork } from "~/features/data/chains"

const vrfApiBaseUrl = "https://vrf.chain.link/api/calculator"

describe("getGasCalculatorUrl", () => {
  test("works with testnet", () => {
    const mainChainName = "ethereum"
    const networkName = "goerli"
    const chainNetwork: ChainNetwork = {
      name: "Goerli Testnet",
      explorerUrl: "https://goerli.etherscan.io/address/%s",
      networkType: "testnet",
      rddUrl: "https://reference-data-directory.vercel.app/feeds-goerli.json",
      queryString: "ethereum-goerli",
      tags: ["proofOfReserve", "nftFloorPrice"],
    }
    const method = "vrfSubscription"

    expect(getGasCalculatorUrl({ mainChainName, networkName, chainNetwork, method, vrfApiBaseUrl })).toEqual(
      "https://vrf.chain.link/api/calculator?networkName=ethereum&networkType=goerli&method=subscription"
    )
  })

  test("works with mainnet", () => {
    const mainChainName = "polygon"
    const networkName = "mainnet"
    const chainNetwork: ChainNetwork = {
      name: "Polygon Mainnet",
      explorerUrl: "https://polygonscan.com/address/%s",
      networkType: "mainnet",
      rddUrl: "https://reference-data-directory.vercel.app/feeds-matic-mainnet.json",
      queryString: "polygon-mainnet",
      tags: ["proofOfReserve"],
    }
    const method = "vrfDirectFunding"

    expect(getGasCalculatorUrl({ mainChainName, networkName, chainNetwork, method, vrfApiBaseUrl })).toEqual(
      "https://vrf.chain.link/api/calculator?networkName=polygon&networkType=mainnet&method=directFunding"
    )
  })
})
