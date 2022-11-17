import { AuthProvider, ChainNetwork, OreId } from "oreid-js"
import Web3 from "web3"
import { Provider, TransactionResponse, TransactionReceipt, TransactionRequest, FeeData, BlockTag } from "@ethersproject/abstract-provider"
import { Deferrable } from "@ethersproject/properties"
import { BigNumber, Bytes, Signer } from "ethers"
import { WebPopup } from "oreid-webpopup"
import { Network } from "@ethersproject/networks"
// import { HttpProvider } from "web3-core"
import { TypedDataDomain, TypedDataField, TypedDataSigner } from "@ethersproject/abstract-signer"
import { HttpProvider } from 'web3-providers-http'
// import { useOreId } from "oreid-react"
import { JsonRpcProvider, JsonRpcSigner} from "@ethersproject/providers"
import { JsonRpcPayload, JsonRpcResponse } from "web3-core-helpers"
// import { RPCProvider } from "index.d copy"

class OreIdSigner extends JsonRpcSigner implements TypedDataSigner {
  public oreId: OreId
  public chainAccount: string = "None"
  // public provider: Provider = new OreIdProvider() as Provider

  constructor(provider: any) {
    super({}, provider)
    this.oreId = new OreId({
      appName: "ORE ID Sample App",
      appId: process.env.REACT_APP_OREID_APP_ID || 't_81af705b3f2045d5aa8c5389bec87944',
      oreIdUrl: "https://service.oreid.io"
      // plugins: {
      //   popup: WebPopup(),
      // },
    })
  }

public connect(provider: any): JsonRpcSigner {
  // this.oreId.init().then(async () => {
  //   await this.oreId.auth.user.getData()  
  // })
  provider.connect()
  return this
}
 async getAddress(): Promise<string> {
  await this.oreId.init()
  let signingAccount: any
  await this.oreId.popup.auth(
    { provider: AuthProvider.Google }

  )
  .then(async () => {
    const userData = await this.oreId.auth.user.getData()
    signingAccount = userData.chainAccounts.find(
			(ca: any) => ca.chainNetwork === "eth_goerli"
		)
    this.chainAccount = signingAccount.chainAccount
  })
  return signingAccount.chainAccount
 }

 async _signTypedData(domain: TypedDataDomain, types: Record<string, TypedDataField[]>, value: Record<string, any>): Promise<string> {
   return 'sorry'
 }

 async signMessage(message: string | Bytes): Promise<string> {
  const txn_ = await this.oreId.createTransaction({
    chainNetwork: ChainNetwork.EthGoerli,
    chainAccount: this.chainAccount,
    transaction: {
      action: [
        {messaage: message.toString() }
      ]
    },
    signOptions: {
      broadcast: false,
      returnSignedTransaction: true
    }

  })
  return JSON.stringify(txn_.data.signedTransaction) || "None"
 }

 async sendTransaction(transaction: any): Promise<TransactionResponse> {
  const txn = {
    from: transaction.from,
    to: transaction.to,
    nonce: transaction.nonce,

    gasLimit: transaction.gasLimit,
    gasPrice: transaction.gasPrice,

    data: transaction.data,
    value: transaction.value,
    chainId: transaction.chainId,

    type: transaction.type,
    accessList: transaction.accessList,

    maxPriorityFeePerGas: transaction.maxPriorityFeePerGas,
    maxFeePerGas: transaction.maxFeePerGas,

    customData: transaction.customData,
    ccipReadEnabled: transaction.ccipReadEnabled
  }
  
  const txn_ = await this.oreId.createTransaction({
    chainNetwork: ChainNetwork.EthGoerli,
    chainAccount: this.chainAccount,
    transaction: transaction,
    signOptions: {
      broadcast: true,
      returnSignedTransaction: true
    }

  })
  const result = await this.oreId.popup.sign({
    transaction: txn_
   })
   const transactionResponse: TransactionResponse = {
    confirmations: 1,
    // from: txn.from || "None",
    raw: result.signedTransaction,
    blockNumber: 0,
    blockHash: "None",
    timestamp: 0,
    wait: async (): Promise<TransactionReceipt> => { 
      const transactionReceipt: TransactionReceipt = {
        status: 0,
        contractAddress: "",
        confirmations: 1,
        transactionIndex: 1,
        gasUsed: (1000) as any,
        logsBloom: "",
        transactionHash: "",
        blockHash: "",
        logs: ["logs"] as any,
        blockNumber: 1,
        cumulativeGasUsed: (1) as any,
        effectiveGasPrice: (1) as any,
        byzantium: false,
        ...txn
      }
      return transactionReceipt
    },
    // nonce: txn.nonce || undefined,
    hash: result.signedTransaction || "None",
    ...txn
   }
return transactionResponse
 }

 async signTransaction(transaction: Deferrable<TransactionRequest>): Promise<string> {
  console.log(transaction) 
  return "None"
 }
}


// export class OreIdSigner extends Signer implements TypedDataSigner {

class OreIdProvider extends JsonRpcProvider {
    // public signer: JsonRpcSigner = new OreIdProvider().getSigner()
  public oreId: OreId
  public chainAccount: string = "None"
  public host: string
  public timeout: number = 180
  public connected: boolean = true
  public httpProvider: any
  // public rpcProvider = new JsonRpcProvider()
  public provider: JsonRpcProvider = new JsonRpcProvider('https://rpc.ankr.com/eth_goerli')

  constructor(url: string) {
    super(url)
    this.host = url
    // this.signer = new OreIdSigner(this.provider)
    this.oreId = new OreId({
      appName: "ORE ID Sample App",
      appId: process.env.REACT_APP_OREID_APP_ID || 't_81af705b3f2045d5aa8c5389bec87944',
      oreIdUrl: "https://service.oreid.io"
      // plugins: {
      //   popup: WebPopup(),
      // },
    })
    this.httpProvider = new Web3.providers.HttpProvider(url)
  }

  public disconnect(): boolean {
    return true
  } 
  public supportsSubscriptions(): boolean {
    return false
  }
  // public send(payload: JsonRpcPayload, callback?: ((error: Error | null, result: JsonRpcResponse | undefined) => void) | undefined): void {
  public async send(method: string, params: any[]): Promise<any> {
    // const sender = new Web3.providers.HttpProvider(this.host)
    const jsonrpc = this.host
    const payload: JsonRpcPayload = {
      jsonrpc,
      method,
      params
    }



    // interface ErrorResponse {
    //   error: Error | null,
    //   result?: JsonRpcResponse | undefined
    // }

    // class ErrorResponse1 implements ErrorResponse {
    //   public error: Error | null
    //   public result: JsonRpcResponse | undefined
    //   constructor(error: Error | null, result: JsonRpcResponse | undefined) {
    //     this.error = error
    //     this.result = result
    //   }
    // }
    // const
    const callback = (error: Error | null, result: JsonRpcResponse | undefined) => {
      // const name = "InternalServiceError"
      // const message = "This is an Error"
      // const error1: Error = new Error(message)
      console.log(error + String(result))
      // return new ErrorResponse1(null, undefined)
      return result
    }
    // const result: JsonRpcResponse = {
    //   jsonrpc: this.host,
    //   id: 1
    // }
    // const result = () => {
    //   const id = 4
    //     return [
    //     jsonrpc,
    //     id]
    //   }
    const sent = await this.httpProvider.send(method, params)
    // const sent = this.httpProvider.send(method, params)
    return sent
  }

public async connect(): Promise<JsonRpcSigner> {
  // this.oreId.init().then(async () => {
  //   await this.oreId.auth.user.getData()  
  // })
  // this.signer.connect()
  const signer = new OreIdSigner(this).connect(this)
  return signer
  // return signer.connect(this)
  // return this.signer
}


 async getAddress(): Promise<string> {
  await this.oreId.init()
  let signingAccount: any
  await this.oreId.popup.auth(
    { provider: AuthProvider.Google }

  )
  .then(async () => {
    const userData = await this.oreId.auth.user.getData()
    signingAccount = userData.chainAccounts.find(
			(ca: any) => ca.chainNetwork === "eth_goerli"
		)
    this.chainAccount = signingAccount.chainAccount
  })
  return signingAccount.chainAccount
 }

 async _signTypedData(domain: TypedDataDomain, types: Record<string, TypedDataField[]>, value: Record<string, any>): Promise<string> {
   return 'sorry'
 }

 async signMessage(message: string | Bytes): Promise<string> {
  const txn_ = await this.oreId.createTransaction({
    chainNetwork: ChainNetwork.EthGoerli,
    chainAccount: this.chainAccount,
    transaction: {
      action: [
        {messaage: message.toString() }
      ]
    },
    signOptions: {
      broadcast: false,
      returnSignedTransaction: true
    }

  })
  return JSON.stringify(txn_.data.signedTransaction) || "None"
 }

 async sendTransaction(transaction: any): Promise<TransactionResponse> {
  const txn = {
    from: transaction.from,
    to: transaction.to,
    nonce: transaction.nonce,

    gasLimit: transaction.gasLimit,
    gasPrice: transaction.gasPrice,

    data: transaction.data,
    value: transaction.value,
    chainId: transaction.chainId,

    type: transaction.type,
    accessList: transaction.accessList,

    maxPriorityFeePerGas: transaction.maxPriorityFeePerGas,
    maxFeePerGas: transaction.maxFeePerGas,

    customData: transaction.customData,
    ccipReadEnabled: transaction.ccipReadEnabled
  }
  
  const txn_ = await this.oreId.createTransaction({
    chainNetwork: ChainNetwork.EthGoerli,
    chainAccount: this.chainAccount,
    transaction: transaction,
    signOptions: {
      broadcast: true,
      returnSignedTransaction: true
    }

  })
  const result = await this.oreId.popup.sign({
    transaction: txn_
   })
   const transactionResponse: TransactionResponse = {
    confirmations: 1,
    // from: txn.from || "None",
    raw: result.signedTransaction,
    blockNumber: 0,
    blockHash: "None",
    timestamp: 0,
    wait: async (): Promise<TransactionReceipt> => { 
      const transactionReceipt: TransactionReceipt = {
        status: 0,
        contractAddress: "",
        confirmations: 1,
        transactionIndex: 1,
        gasUsed: (1000) as any,
        logsBloom: "",
        transactionHash: "",
        blockHash: "",
        logs: ["logs"] as any,
        blockNumber: 1,
        cumulativeGasUsed: (1) as any,
        effectiveGasPrice: (1) as any,
        byzantium: false,
        ...txn
      }
      return transactionReceipt
    },
    // nonce: txn.nonce || undefined,
    hash: result.signedTransaction || "None",
    ...txn
   }
return transactionResponse
 }

 async signTransaction(transaction: Deferrable<TransactionRequest>): Promise<string> {
  console.log(transaction) 
  return "None"
 }
}

// const httpProvider = new Web3.providers.HttpProvider
export class OreIdHttpProvider extends OreIdProvider {
    public network_url: string
    // public httpProvider = new Web3.providers.HttpProvider('https://rpc.goerli.mudit.blog')
  
    constructor(network_url: string) {
      super(network_url)
      this.network_url = network_url
    }
  
    public async getNetwork(): Promise<Network> {
      const network: Network = {
        name: `OREID on ${this.network_url}`,
        chainId: 4
     }  
     return network
    }
  
    public async getGasPrice(): Promise<BigNumber> {
      const gasPrice = await Web3.givenProvider.eth.getGasPrice()
      return new BigNumber(0x0 ,gasPrice)
    }
  
    public async getFeeData(): Promise<FeeData> {
      const feeData: FeeData = {
        lastBaseFeePerGas: new BigNumber(1,"0x0"),
        maxFeePerGas: null,
        maxPriorityFeePerGas : null,
        gasPrice: null
      }
      return feeData
    }
  
    public async getBlockNumber(): Promise<number> {
      const blockNum = Web3.givenProvider.eth.getBlockNumber()
      return blockNum
    }

    // public getSigner(): OreIdSigner {
    //   // const oreIdSigner = this.provider.getSigner()
    //   // const oreIdSigner = this.getSigner()
    //   // return oreIdSigner
    // }
  
    // public async getTransaction(transactionHash: string): Promise<TransactionResponse> {
      
    // }
  
    // public async getTransactionReceipt(transactionHash: string): Promise<TransactionReceipt> {
      
    // }
  
    // public async getBalance(addressOrName: string | Promise<string>, blockTag?: BlockTag | Promise<BlockTag> | undefined): Promise<BigNumber> {
      
    // }
  
    // public async call(transaction: Deferrable<TransactionRequest>, blockTag?: BlockTag | Promise<BlockTag> | undefined): Promise<string> {
      
    // }
  }
    

  // const jsonRpcProvider = new OreIdProvider('https://rpc.goerli.mudit.blog')





// function RPCProvider() {
//   // const provider: any = new Web3.providers.HttpProvider('https://rpc.goerli.mudit.blog')
//   // const signer = new Web
//   // RPCSubprovider
//   const provider: any = new OreIdProvider('https://rpc.goerli.mudit.blog')
//   await provider.connect()
//   // const signer = provider.getSigner()
//   // providerEngine.addProvider(signer)
//   // providerEngine.provider.signer = new OreIdSigner(provider)
  
//   // const wpConfig: WyvernConfig = {
    
//   // }
//   // const wp = new WyvernProtocol(provider, )
//   // provider.signer = signer.getSigner()
//   // provider.signer.connect()
//   return provider as Provider
// }

export { OreIdSigner, OreIdProvider }