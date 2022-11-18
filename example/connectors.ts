import { AuthereumConnector } from '@web3-react/authereum-connector'
import { FortmaticConnector } from '@web3-react/fortmatic-connector'
import { FrameConnector } from '@web3-react/frame-connector'
import { InjectedConnector } from '@web3-react/injected-connector'
import { LatticeConnector } from '@web3-react/lattice-connector'
import { LedgerConnector } from '@web3-react/ledger-connector'
import { MagicConnector } from '@web3-react/magic-connector'
import { NetworkConnector } from '@web3-react/network-connector'
import { PortisConnector } from '@web3-react/portis-connector'
import { TorusConnector } from '@web3-react/torus-connector'
import { TrezorConnector } from '@web3-react/trezor-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { WalletLinkConnector } from '@web3-react/walletlink-connector'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { ConnectorUpdate } from '@web3-react/types'
import { AuthProvider, OreId } from "oreid-js"
import { WebPopup } from 'oreid-webpopup'
import Web3 from 'web3'
import { OreIdProvider, OreIdSigner, RPCProvider, OreIdHttpProvider } from '../packages/oreid-rpc'

const POLLING_INTERVAL = 12000
const RPC_URLS: { [chainId: number]: string } = {
  1: process.env.RPC_URL_1 as string,
  4: process.env.RPC_URL_4 as string
}

export const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 5, 42] })

export const network = new NetworkConnector({
  urls: { 1: RPC_URLS[1], 4: RPC_URLS[4] },
  defaultChainId: 1
})

export class OreIDConnector extends AbstractConnector {
  public oreId: OreId
  // public provider = new Web3.providers.HttpProvider('https://rpc.goerli.mudit.blog')
  // public oreIdSigner = new OreIdSigner()
  // public provider = new OreIdProvider('https://rpc.goerli.mudit.blog')
  public provider = new OreIdProvider('https://rpc.ankr.com/eth_goerli')
  
  public constructor() {
    const chainId = 4
    super({supportedChainIds: [chainId]})
    // this.httpProvider['signer'] = this.oreIdSigner
    // this.provider = this.httpProvider
  }
  public async activate(): Promise<ConnectorUpdate> {
    if (!this.oreId) {
      this.oreId = new OreId({
        appName: "ORE ID Sample App",
        appId: process.env.REACT_APP_OREID_APP_ID || 't_81af705b3f2045d5aa8c5389bec87944',
        oreIdUrl: "https://service.oreid.io",
        plugins: {
          popup: WebPopup(),
        },
      })
      await this.oreId.init().then(async () => {
        await this.oreId.popup.auth({
          provider: AuthProvider.Google,
        })
      })
    }
    const userData = await this.oreId.auth.user.getData()
      const signingAccount = userData.chainAccounts.find(
        (ca) => ca.chainNetwork === "eth_goerli"
      ) 

      return {provider: this.provider, chainId: 4, account: signingAccount.chainAccount}
  }
  public async getAccount(): Promise<string> {
    await this.oreId.init()
    let signingAccount: any
    await this.oreId.popup.auth(
      { provider: AuthProvider.Google }
  
    )
    .then(async () => {
      const userData = await this.oreId.auth.user.getData()
      signingAccount = userData.chainAccounts.find(
        (ca) => ca.chainNetwork === "eth_goerli"
      )
      // this.chainAccount = signingAccount.chainAccount
    })
    return signingAccount.chainAccount
   }
   public async getChainId(): Promise<string | number> {
     return 4
   }
   public async getProvider(): Promise<any> {
    return this.provider
   }
   public deactivate(): void {
     
   }
   public async close() {
    await this.oreId.logout()
    this.emitDeactivate()
   }
}

export const oreIDConnector = new OreIDConnector()
 

export const walletconnect = new WalletConnectConnector({
  rpc: RPC_URLS,
  chainId: 1,
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true
})

export const walletlink = new WalletLinkConnector({
  url: RPC_URLS[1],
  appName: 'web3-react example',
  supportedChainIds: [1, 3, 4, 5, 42, 10, 137, 69, 420, 80001]
})

export const ledger = new LedgerConnector({ chainId: 1, url: RPC_URLS[1], pollingInterval: POLLING_INTERVAL })

export const trezor = new TrezorConnector({
  chainId: 1,
  url: RPC_URLS[1],
  pollingInterval: POLLING_INTERVAL,
  manifestEmail: 'dummy@abc.xyz',
  manifestAppUrl: 'http://localhost:1234'
})

export const lattice = new LatticeConnector({
  chainId: 4,
  appName: 'web3-react',
  url: RPC_URLS[4]
})

export const frame = new FrameConnector({ supportedChainIds: [1] })

export const authereum = new AuthereumConnector({ chainId: 42 })

export const fortmatic = new FortmaticConnector({ apiKey: process.env.FORTMATIC_API_KEY as string, chainId: 4 })

export const magic = new MagicConnector({
  apiKey: process.env.MAGIC_API_KEY as string,
  chainId: 4,
  email: 'hello@example.org'
})

export const portis = new PortisConnector({ dAppId: process.env.PORTIS_DAPP_ID as string, networks: [1, 100] })

export const torus = new TorusConnector({ chainId: 1 })
