import EleventyFetch from "@11ty/eleventy-fetch"
import { ChainMetadata } from "."
import { Chain } from "../chains"

export const getServerSideChainMetadata = async (chains: Chain[]): Promise<Record<string, ChainMetadata>> => {
  const cache = {}

  chains.forEach(async (chain) => {
    const requests = chain.networks.map((nw) =>
      nw?.rddUrl
        ? EleventyFetch(nw?.rddUrl, {
            duration: "1d", // save for 1 day
            type: "json", // we’ll parse JSON for you
          }).then((metadata) => ({
            ...nw,
            metadata: metadata.filter(
              (meta) =>
                meta.docs?.hidden !== true &&
                (meta.proxyAddress || meta.transmissionsAccount || meta.feedId) &&
                meta.proxyAddress !== "0x80f8D7b4fB192De43Ed6aE0DD4A42A60f43641b0"
            ),
          }))
        : undefined
    )
    const networks = await Promise.all(requests)

    cache[chain.page] = { ...chain, networks }
  })

  return cache
}
