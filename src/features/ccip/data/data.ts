import chains from "../../../scripts/reference/chains.json"
import { utils } from "ethers"

interface CCIPTokenParams {
  type: string
  options: {
    address: string
    symbol: string
    decimals: number
    image: string
  }
}

interface CCIPToken {
  params: CCIPTokenParams
}

export interface CCIPNetworkOptions {
  name: string
  chainId: string
  icon: string
  BnM?: CCIPToken
  LnM?: CCIPToken
}

const CCIPTokenImage =
  "https://images.prismic.io/data-chain-link/86d5bc29-7511-49f5-bbd8-18a8ebc008b0_ccip-icon-white.png?auto=compress,format"

export const getchainByChainId = (chainId: string) => {
  return chains.find((chain) => utils.hexValue(chain.chainId) === chainId)
}

export const supportedNetworks: CCIPNetworkOptions[] = [
  {
    name: "Ethereum Mainnet",
    chainId: "0x1",
    icon: "/assets/chains/ethereum.svg",
  },
  {
    name: "Ethereum Sepolia",
    chainId: "0xaa36a7",
    icon: "/assets/chains/ethereum.svg",
    BnM: {
      params: {
        type: "ERC20",
        options: {
          address: "0xFd57b4ddBf88a4e07fF4e34C487b99af2Fe82a05",
          symbol: "CCIP-BnM",
          decimals: 18,
          image: CCIPTokenImage,
        },
      },
    },
    LnM: {
      params: {
        type: "ERC20",
        options: {
          address: "0x466D489b6d36E7E3b824ef491C225F5830E81cC1",
          symbol: "CCIP-LnM",
          decimals: 18,
          image: CCIPTokenImage,
        },
      },
    },
  },
  {
    name: "Optimism Mainnet",
    chainId: "0xa",
    icon: "/assets/chains/optimism.svg",
  },
  {
    name: "Optimism Goerli",
    chainId: "0x1a4",
    icon: "/assets/chains/optimism.svg",
    BnM: {
      params: {
        type: "ERC20",
        options: {
          address: "0xaBfE9D11A2f1D61990D1d253EC98B5Da00304F16",
          symbol: "CCIP-BnM",
          decimals: 18,
          image: CCIPTokenImage,
        },
      },
    },
  },
  {
    name: "Avalanche Mainnet",
    chainId: "0xa86a",
    icon: "/assets/chains/avalanche.svg",
  },
  {
    name: "Avalanche Fuji",
    chainId: "0xa869",
    icon: "/assets/chains/avalanche.svg",
    BnM: {
      params: {
        type: "ERC20",
        options: {
          address: "0xD21341536c5cF5EB1bcb58f6723cE26e8D8E90e4",
          symbol: "CCIP-BnM",
          decimals: 18,
          image: CCIPTokenImage,
        },
      },
    },
  },
  {
    name: "Polygon Mainnet",
    chainId: "0x89",
    icon: "/assets/chains/polygon.svg",
  },
  {
    name: "Polygon Mumbai",
    chainId: "0x13881",
    icon: "/assets/chains/polygon.svg",
    BnM: {
      params: {
        type: "ERC20",
        options: {
          address: "0xf1E3A5842EeEF51F2967b3F05D45DD4f4205FF40",
          symbol: "CCIP-BnM",
          decimals: 18,
          image: CCIPTokenImage,
        },
      },
    },
  },
  {
    name: "Arbitrum Goerli",
    chainId: "0x66eed",
    icon: "/assets/chains/arbitrum.svg",
    BnM: {
      params: {
        type: "ERC20",
        options: {
          address: "0x0579b4c1C8AcbfF13c6253f1B10d66896Bf399Ef",
          symbol: "CCIP-BnM",
          decimals: 18,
          image: CCIPTokenImage,
        },
      },
    },
  },
]
