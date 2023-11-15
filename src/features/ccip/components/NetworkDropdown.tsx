/** @jsxImportSource preact */
import { useCallback, useEffect, useRef, useState } from "preact/hooks"
import styles from "./networkDropdown.module.css"
import button from "@chainlink/design-system/button.module.css"
import { MetaMaskInpageProvider } from "@metamask/providers"
import { ethers, Contract } from "ethers"
import { burnMintAbi } from "~/features/abi"
import { CCIPNetworkOptions, getchainByChainId } from "@config/data/ccip"
import { Toast } from "./Toast"

enum LoadingState {
  "START",
  "LOADING...",
  "ERROR",
  "END",
}

interface Props {
  options: CCIPNetworkOptions[]
  userAddress: string
}

interface SwitchNetworkError {
  code: number
  message: string
  stack: string
}

export const NetworkDropdown = ({ options, userAddress }: Props) => {
  const [activeNetwork, setActiveNetwork] = useState<CCIPNetworkOptions | undefined>(undefined)
  const [isNetworkChangePending, setIsNetworkChangePending] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<LoadingState>(LoadingState.START)
  const [toastMessage, setToastMessage] = useState<string>("")
  const [showToast, setShowToast] = useState<boolean>(false)
  const [mintBnMTokenButtonDisabled, setMintBnMTokenButtonDisabled] = useState<boolean>(false)
  const [mintLnMTokenButtonDisabled, setMintLnMTokenButtonDisabled] = useState<boolean>(false)
  const detailsElementRef = useRef<HTMLDetailsElement | null>(null)
  const closeDropdown = useCallback(() => {
    if (!detailsElementRef.current) return

    detailsElementRef.current.open = false
  }, [detailsElementRef])

  useEffect(() => {
    const handleChainChanged = (chainId: string) => {
      setActiveNetwork(options.find((option) => option.chainId === chainId))
      setIsLoading(LoadingState.START)
    }
    const refElement = detailsElementRef?.current

    const getCurrentChain = async () => {
      const chainId = await window.ethereum.request({
        method: "eth_chainId",
        params: [],
      })
      window.ethereum.on("chainChanged", handleChainChanged)
      const currentOption = options.find((option) => option.chainId === chainId)
      return currentOption
    }

    const onClick = (event: MouseEvent) => {
      if (!refElement) return

      const relatedTarget = event.target as HTMLElement | null
      if (refElement?.contains(relatedTarget)) return

      closeDropdown()
    }

    getCurrentChain().then((option) => {
      setActiveNetwork(option)
    })

    document.body.addEventListener("mouseup", onClick)
    return () => {
      document.body.removeEventListener("mouseup", onClick)
    }
  }, [activeNetwork])
  const dropdownDisabled = !window.ethereum.isConnected || isNetworkChangePending

  const isSwitchNetworkError = (error: unknown): error is SwitchNetworkError => {
    if (!error || typeof error !== "object") return false
    const isCode = "code" in error && error.code
    const isMessage = "message" in error && error.message
    const isStack = "stack" in error && error.stack
    return !!(isCode && isMessage && isStack)
  }

  const handleNetworkChange = async (option: CCIPNetworkOptions) => {
    if (!window.ethereum.isConnected) return
    setIsNetworkChangePending(true)
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: option.chainId,
          },
        ],
      })
    } catch (switchError: unknown) {
      if (isSwitchNetworkError(switchError) && switchError.code === 4902) {
        const chainInfo = getchainByChainId(option.chainId)
        if (!chainInfo) return
        const { nativeCurrency, rpc, explorers } = chainInfo
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: option.chainId,
              chainName: option.name,
              nativeCurrency,
              rpcUrls: rpc,
              blockExplorerUrls: explorers ? [explorers[0].url] : null,
            },
          ],
        })
      } else {
        Promise.reject(switchError)
      }
    }

    setIsNetworkChangePending(false)
    localStorage.setItem("isNetworkChangePending", "false")
    setActiveNetwork(option)
    setIsLoading(LoadingState.START)
    closeDropdown()
  }

  const validateEthereumApi = (ethereum: MetaMaskInpageProvider) => {
    if (!ethereum || !ethereum.isMetaMask) {
      throw new Error(`Something went wrong. Add to wallet is called while an ethereum object not detected.`)
    }
  }

  const addBnMAssetToWallet = async () => {
    if (!activeNetwork?.BnM) return
    const { type, options } = activeNetwork.BnM.params
    validateEthereumApi(window.ethereum)
    const success = await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type,
        options: {
          address: options.address,
          symbol: options.symbol,
          decimals: options.decimals,
          image: options.image,
        },
      },
    })

    if (success) {
      console.log(`${options.symbol} of address ${options.address} successfully added to the wallet`)
    } else {
      throw new Error(`Something went wrong. ${options.symbol} of address ${options.address} not added to the wallet`)
    }
  }

  const addLnMAssetToWallet = async () => {
    if (!activeNetwork?.LnM || activeNetwork.name !== "Ethereum Sepolia") {
      return
    }
    const { type, options } = activeNetwork.LnM.params
    validateEthereumApi(window.ethereum)
    const success = await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type,
        options: {
          address: options.address,
          symbol: options.symbol,
          decimals: options.decimals,
          image: options.image,
        },
      },
    })

    if (success) {
      console.log(`${options.symbol} of address ${options.address} successfully added to the wallet`)
    } else {
      throw new Error(`Something went wrong. ${options.symbol} of address ${options.address} not added to the wallet`)
    }
  }

  const mintBnMTokens = async () => {
    setIsLoading(LoadingState["LOADING..."])
    setMintBnMTokenButtonDisabled(true)
    if (!activeNetwork?.BnM) return
    const { address: ccipBNMContractAddress } = activeNetwork.BnM.params.options
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const mintTokensContract = new Contract(ccipBNMContractAddress, burnMintAbi, signer)
    try {
      const res = await mintTokensContract.drip(userAddress)
      if (!res) {
        setMintBnMTokenButtonDisabled(false)
        setToastMessage("Something went wrong ! Check your wallet.")
        setIsLoading(LoadingState.ERROR)
        setShowToast(true)
        return
      }
      await res.wait()
    } catch (error) {
      if (error.code === "ACTION_REJECTED") {
        setMintBnMTokenButtonDisabled(false)
        setToastMessage("Transaction request denied.")
        setIsLoading(LoadingState.ERROR)
      } else {
        setMintBnMTokenButtonDisabled(false)
        setToastMessage("Transaction failed to be included in the block. Check your wallet and try again.")
        setIsLoading(LoadingState.ERROR)
      }
      setShowToast(true)
      return
    }
    setMintBnMTokenButtonDisabled(false)
    setToastMessage("1 CCIP-BnM has been sent to your wallet !")
    setIsLoading(LoadingState.END)
    setShowToast(true)
  }

  const mintLnMTokens = async () => {
    setIsLoading(LoadingState["LOADING..."])
    setMintLnMTokenButtonDisabled(true)
    if (!activeNetwork?.LnM) return
    const { address: ccipLNMContractAddress } = activeNetwork.LnM.params.options
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const signer = provider.getSigner()
    const mintTokensContract = new Contract(ccipLNMContractAddress, burnMintAbi, signer)
    try {
      const res = await mintTokensContract.drip(userAddress)
      if (!res) {
        setMintBnMTokenButtonDisabled(false)
        setToastMessage("Something went wrong ! Check your wallet.")
        setIsLoading(LoadingState.ERROR)
        setShowToast(true)
        return
      }
      await res.wait()
    } catch (error) {
      if (error.code === "ACTION_REJECTED") {
        setMintLnMTokenButtonDisabled(false)
        setToastMessage("Transaction request denied.")
        setIsLoading(LoadingState.ERROR)
      } else {
        setMintLnMTokenButtonDisabled(false)
        setToastMessage("Transaction failed to be included in the block. Check your wallet and try again.")
        setIsLoading(LoadingState.ERROR)
      }
      setShowToast(true)
      return
    }
    setMintLnMTokenButtonDisabled(false)
    setToastMessage("1 CCIP-LnM has been sent to your wallet !")
    setIsLoading(LoadingState.END)
    setShowToast(true)
  }

  const closeToast = () => {
    setShowToast(false)
  }
  return (
    <div>
      <details
        data-testid="network-selector"
        ref={detailsElementRef}
        // This is so the component can't be focusable/opened from keyboard when it's disabled.
        tabIndex={dropdownDisabled ? -1 : undefined}
        className={[styles["network-selector-container"], ...(dropdownDisabled ? [styles.disabled] : [])].join(" ")}
      >
        <summary className={styles["network-selector-summary"]}>
          <div className={styles["network-selector"]}>
            {isNetworkChangePending ? (
              <>
                <img
                  src={
                    activeNetwork === undefined
                      ? "https://smartcontract.imgix.net/icons/alert.svg"
                      : activeNetwork?.icon
                  }
                  style={{ marginRight: "var(--space-2x)" }}
                />
                <span
                  style={{
                    color: dropdownDisabled ? "var(--color-text-disabled)" : "initial",
                  }}
                >
                  Switching networks...
                </span>
              </>
            ) : (
              <>
                <img
                  src={
                    activeNetwork === undefined
                      ? "https://smartcontract.imgix.net/icons/alert.svg"
                      : activeNetwork?.icon
                  }
                  style={{ marginRight: "var(--space-2x)", minHeight: "1.2em", minWidth: "1.2em" }}
                />
                <span
                  style={{
                    color: dropdownDisabled ? "var(--color-text-disabled)" : "initial",
                  }}
                >
                  {activeNetwork?.name ?? "Unknown network"}
                </span>
              </>
            )}
            <img src="https://smartcontract.imgix.net/icons/Caret2.svg" />
          </div>
        </summary>
        <div className={styles["dropdown-container"]}>
          {activeNetwork ? (
            <ul style={{ listStyle: "none" }}>
              {options.map((option) => {
                if (option.BnM || option.LnM) {
                  return (
                    <li
                      className={option.name === activeNetwork.name ? styles["selected-option"] : styles.option}
                      key={option.name}
                    >
                      <button onClick={() => handleNetworkChange(option)} className="text-200">
                        <span>
                          <img src={option.icon} style={{ minHeight: "1em", minWidth: "1em" }} />
                          {option.name}
                        </span>
                        {option.name === activeNetwork.name && (
                          <img src="https://smartcontract.imgix.net/icons/check_circle_bold.svg" />
                        )}
                      </button>
                    </li>
                  )
                } else {
                  return undefined
                }
              })}
            </ul>
          ) : (
            <div
              style={{
                backgroundColor: "var(--red-100)",
                padding: "var(--space-4x)",
              }}
            >
              <p
                className="paragraph-100"
                style={{
                  margin: 0,
                  padding: 0,
                  color: "var(--color-text-info)",
                  display: "flex",
                  alignItems: "flex-start",
                  userSelect: "none",
                }}
              >
                <img
                  style={{
                    width: "var(--space-4x)",
                    height: "var(--space-4x)",
                    marginRight: "var(--space-2x)",
                  }}
                  src="https://smartcontract.imgix.net/icons/alert.svg"
                />
                Your wallet is connected to an unsupported network.
              </p>
            </div>
          )}
        </div>
      </details>
      {activeNetwork !== undefined ? (
        activeNetwork.BnM || activeNetwork.LnM ? (
          <>
            <div className="add-asset-button-container">
              {activeNetwork && activeNetwork.BnM && (
                <div class="add-to-wallet-button">
                  <button
                    className={button.secondary}
                    style="margin: 1em;"
                    onClick={async () => {
                      await addBnMAssetToWallet()
                    }}
                  >
                    Add CCIP-BnM to wallet
                  </button>
                  <button className={button.primary} onClick={mintBnMTokens} disabled={mintBnMTokenButtonDisabled}>
                    {mintBnMTokenButtonDisabled ? "Minting Process Pending..." : "Mint 1 CCIP-BnM Token"}
                  </button>
                </div>
              )}
              {activeNetwork && activeNetwork.LnM && (
                <div class="add-to-wallet-button">
                  <hr />
                  <button
                    className={button.secondary}
                    style="margin: 1em;"
                    onClick={async () => {
                      await addLnMAssetToWallet()
                    }}
                  >
                    Add CCIP-LnM to wallet
                  </button>
                  <button className={button.primary} onClick={mintLnMTokens} disabled={mintLnMTokenButtonDisabled}>
                    {mintLnMTokenButtonDisabled ? "Minting Process Pending..." : "Mint 1 CCIP-LnM Token"}
                  </button>
                </div>
              )}
            </div>
            {isLoading === LoadingState.ERROR && showToast && <Toast message={toastMessage} onClose={closeToast} />}
            {isLoading === LoadingState.END && showToast && <Toast message={toastMessage} onClose={closeToast} />}
          </>
        ) : (
          <p>
            While CCIP does support this network, there are no test tokens available for it. Select a different network
            network from the dropdown menu.
          </p>
        )
      ) : (
        <>
          <p>Chainlink CCIP does not support this network. Switch your wallet to a supported network. </p>
          <ul style={{ marginTop: "1.5rem" }}>
            {options.map((option: CCIPNetworkOptions) => {
              if (option.BnM || option.LnM) {
                return (
                  <li style={{ display: "flex", justifyContent: "space-evenly", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", width: "9.673rem" }}>
                      <img
                        style={{
                          width: "var(--space-4x)",
                          height: "var(--space-4x)",
                          marginRight: "var(--space-3x)",
                        }}
                        src={option.icon}
                        alt="chain icon"
                      />
                      {option.name}
                    </div>
                    <button
                      className={button.secondary}
                      onClick={async () => {
                        await handleNetworkChange(option)
                      }}
                    >
                      Switch to Network
                    </button>
                  </li>
                )
              } else {
                return undefined
              }
            })}
          </ul>
        </>
      )}
    </div>
  )
}
