/** @jsxImportSource preact */
import { ethers, BigNumber } from "ethers"
import { ChainlinkAutomationConfig } from "@features/chainlink-automation"

export const AutomationConfig = ({
  config,
  registryAddress,
  getExplorerAddressUrl: getUrl,
}: {
  config: ChainlinkAutomationConfig
  registryAddress: string
  getExplorerAddressUrl: (contractAddress: string) => string
}) => {
  const {
    paymentPremiumPPB,
    blockCountPerTurn,
    checkGasLimit,
    gasCeilingMultiplier,
    minUpkeepSpend,
    maxPerformGas,
    registrar,
  } = config

  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ display: "block", overflowX: "auto" }}>
        <thead>
          <tr>
            <th>Item</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Registry Address</td>
            {!registryAddress ? (
              <td />
            ) : (
              <td>
                <a href={getUrl(registryAddress)}>{registryAddress.toLocaleString()}</a>
              </td>
            )}
          </tr>
          <tr>
            <td>Registrar Address</td>
            {!registrar ? (
              <td />
            ) : (
              <td>
                <a href={getUrl(registrar)}>{registrar.toLocaleString()}</a>
              </td>
            )}
          </tr>
          <tr>
            <td>Payment Premium %</td>
            {!paymentPremiumPPB ? <td /> : <td>{Math.round(parseInt(paymentPremiumPPB.toString(), 10) / 10000000)}</td>}
          </tr>
          <tr>
            <td>Block Count Per Turn</td>
            {!blockCountPerTurn ? <td /> : <td>{blockCountPerTurn.toLocaleString()}</td>}
          </tr>
          <tr>
            <td>Check Gas Limit</td>
            {!checkGasLimit ? <td /> : <td>{checkGasLimit.toLocaleString()}</td>}
          </tr>
          <tr>
            <td>Call Gas Limit</td>
            {!maxPerformGas ? <td /> : <td>{maxPerformGas.toLocaleString()}</td>}
          </tr>
          <tr>
            <td>Gas Ceiling Multiplier</td>
            {!gasCeilingMultiplier ? <td /> : <td>{gasCeilingMultiplier.toLocaleString()}</td>}
          </tr>
          <tr>
            <td>Minimum Upkeep Spend (LINK)</td>
            {!minUpkeepSpend ? <td /> : <td>{ethers.utils.formatEther(BigNumber.from(minUpkeepSpend))}</td>}
          </tr>
        </tbody>
      </table>
    </div>
  )
}
