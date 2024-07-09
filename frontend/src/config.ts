import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import {
  arbitrum,
  base,
  bob,
  bsc,
  linea,
  mainnet,
  optimism,
  polygon,
  scroll,
  taiko,
  zetachain,
  zkSync,
  zora,
} from 'viem/chains'
export const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'be31534cd579ae9767f95a996e86c169',
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    linea,
    zkSync,
    scroll,
    zora,
    taiko,
    bob,
    zetachain,
    bsc,
  ],
  ssr: true, // If your dApp uses server side rendering (SSR)
})
