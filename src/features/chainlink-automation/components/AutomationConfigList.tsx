/** @jsxImportSource preact */
import {
  AutomationConfig,
  chainlinkAutomationConfig,
  automationAddresses,
} from "@features/chainlink-automation"
import { SupportedChain, SupportedTechnology } from "@config"
import {
  getTitle,
  getExplorer,
  getExplorerAddressUrl,
  normalizeConfig,
} from "@features/utils"
import GithubSlugger from "github-slugger"

export const AutomationConfigList = () => {
  const slugger = new GithubSlugger()
  const normalizedConfig = normalizeConfig(chainlinkAutomationConfig)
  return Object.keys(normalizedConfig).map(
    (technology: SupportedTechnology) => {
      const config = normalizedConfig[technology]
      const technologyTitle = config.title
      return !technologyTitle ? (
        <p />
      ) : (
        <div key={technology}>
          <h3 id={slugger.slug(technologyTitle)}>{technologyTitle}</h3>
          {Object.keys(config.chains).map((supportedChain: SupportedChain) => {
            const title = getTitle(supportedChain)
            const explorerUrl = getExplorer(supportedChain)
            const registryAddress = automationAddresses[supportedChain]
              ? automationAddresses[supportedChain].registryAddress
              : ""
            return !title ? (
              <p />
            ) : (
              <div key={supportedChain}>
                <h4 id={slugger.slug(title)}>{title}</h4>
                <AutomationConfig
                  config={chainlinkAutomationConfig[supportedChain]}
                  registryAddress={registryAddress}
                  getExplorerAddressUrl={getExplorerAddressUrl(explorerUrl)}
                />
              </div>
            )
          })}
        </div>
      )
    }
  )
}
