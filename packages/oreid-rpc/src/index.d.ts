import { OreId } from "oreid-js";
import Web3 from "web3";
import { Provider, TransactionResponse, TransactionRequest, FeeData } from "@ethersproject/abstract-provider";
import { Deferrable } from "@ethersproject/properties";
import { BigNumber, Bytes, Signer } from "ethers";
import { Network } from "@ethersproject/networks";
import { TypedDataDomain, TypedDataField, TypedDataSigner } from "@ethersproject/abstract-signer";
declare class OreIdSigner extends Signer implements TypedDataSigner {
    oreId: OreId;
    chainAccount: string;
    constructor();
    connect(): Signer;
    getAddress(): Promise<string>;
    _signTypedData(domain: TypedDataDomain, types: Record<string, TypedDataField[]>, value: Record<string, any>): Promise<string>;
    signMessage(message: string | Bytes): Promise<string>;
    sendTransaction(transaction: any): Promise<TransactionResponse>;
    signTransaction(transaction: Deferrable<TransactionRequest>): Promise<string>;
}
declare class OreIdProvider {
    network: string;
    httpProvider: Web3;
    constructor(network: string);
    getNetwork(): Promise<Network>;
    getGasPrice(): Promise<BigNumber>;
    getFeeData(): Promise<FeeData>;
    getBlockNumber(): Promise<number>;
}
declare function RPCProvider(): Provider;
export { OreIdSigner, OreIdProvider, RPCProvider };
