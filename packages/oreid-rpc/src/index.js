import { __assign, __awaiter, __extends, __generator } from "tslib";
import { AuthProvider, ChainNetwork, OreId } from "oreid-js";
import Web3 from "web3";
import { BigNumber, Signer } from "ethers";
// import { useOreId } from "oreid-react"
// export class OreIdSigner extends Signer implements TypedDataSigner {
var OreIdSigner = /** @class */ (function (_super) {
    __extends(OreIdSigner, _super);
    function OreIdSigner() {
        var _this = _super.call(this) || this;
        _this.chainAccount = "None";
        _this.oreId = new OreId({
            appName: "ORE ID Sample App",
            appId: process.env.REACT_APP_OREID_APP_ID || 't_81af705b3f2045d5aa8c5389bec87944',
            oreIdUrl: "https://service.oreid.io",
            // plugins: {
            //   popup: WebPopup(),
            // },
        });
        return _this;
    }
    OreIdSigner.prototype.connect = function () {
        var _this = this;
        this.oreId.init().then(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.oreId.auth.user.getData()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
        return this;
    };
    OreIdSigner.prototype.getAddress = function () {
        return __awaiter(this, void 0, void 0, function () {
            var signingAccount;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.oreId.init()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.oreId.popup.auth({ provider: AuthProvider.Google })
                                .then(function () { return __awaiter(_this, void 0, void 0, function () {
                                var userData;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.oreId.auth.user.getData()];
                                        case 1:
                                            userData = _a.sent();
                                            signingAccount = userData.chainAccounts.find(function (ca) { return ca.chainNetwork === "eth_goerli"; });
                                            this.chainAccount = signingAccount.chainAccount;
                                            return [2 /*return*/];
                                    }
                                });
                            }); })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, signingAccount.chainAccount];
                }
            });
        });
    };
    OreIdSigner.prototype._signTypedData = function (domain, types, value) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, 'sorry'];
            });
        });
    };
    OreIdSigner.prototype.signMessage = function (message) {
        return __awaiter(this, void 0, void 0, function () {
            var txn_;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.oreId.createTransaction({
                            chainNetwork: ChainNetwork.EthGoerli,
                            chainAccount: this.chainAccount,
                            transaction: {
                                action: [
                                    { messaage: message.toString() }
                                ]
                            },
                            signOptions: {
                                broadcast: false,
                                returnSignedTransaction: true
                            }
                        })];
                    case 1:
                        txn_ = _a.sent();
                        return [2 /*return*/, JSON.stringify(txn_.data.signedTransaction) || "None"];
                }
            });
        });
    };
    OreIdSigner.prototype.sendTransaction = function (transaction) {
        return __awaiter(this, void 0, void 0, function () {
            var txn, txn_, result, transactionResponse;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        txn = {
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
                        };
                        return [4 /*yield*/, this.oreId.createTransaction({
                                chainNetwork: ChainNetwork.EthGoerli,
                                chainAccount: this.chainAccount,
                                transaction: transaction,
                                signOptions: {
                                    broadcast: true,
                                    returnSignedTransaction: true
                                }
                            })];
                    case 1:
                        txn_ = _a.sent();
                        return [4 /*yield*/, this.oreId.popup.sign({
                                transaction: txn_
                            })];
                    case 2:
                        result = _a.sent();
                        transactionResponse = __assign({ confirmations: 1, 
                            // from: txn.from || "None",
                            raw: result.signedTransaction, blockNumber: 0, blockHash: "None", timestamp: 0, wait: function () { return __awaiter(_this, void 0, void 0, function () {
                                var transactionReceipt;
                                return __generator(this, function (_a) {
                                    transactionReceipt = __assign({ status: 0, contractAddress: "", confirmations: 1, transactionIndex: 1, gasUsed: (1000), logsBloom: "", transactionHash: "", blockHash: "", logs: ["logs"], blockNumber: 1, cumulativeGasUsed: (1), effectiveGasPrice: (1), byzantium: false }, txn);
                                    return [2 /*return*/, transactionReceipt];
                                });
                            }); }, 
                            // nonce: txn.nonce || undefined,
                            hash: result.signedTransaction || "None" }, txn);
                        return [2 /*return*/, transactionResponse];
                }
            });
        });
    };
    OreIdSigner.prototype.signTransaction = function (transaction) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log(transaction);
                return [2 /*return*/, "None"];
            });
        });
    };
    return OreIdSigner;
}(Signer));
var OreIdProvider = /** @class */ (function () {
    function OreIdProvider(network) {
        this.httpProvider = new Web3(new Web3.providers.HttpProvider('https://rpc.goerli.mudit.blog'));
        // super()
        this.network = network;
    }
    OreIdProvider.prototype.getNetwork = function () {
        return __awaiter(this, void 0, void 0, function () {
            var network;
            return __generator(this, function (_a) {
                network = {
                    name: "OREID on " + this.network,
                    chainId: 4
                };
                return [2 /*return*/, network];
            });
        });
    };
    OreIdProvider.prototype.getGasPrice = function () {
        return __awaiter(this, void 0, void 0, function () {
            var gasPrice;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.httpProvider.eth.getGasPrice()];
                    case 1:
                        gasPrice = _a.sent();
                        return [2 /*return*/, new BigNumber(0x0, gasPrice)];
                }
            });
        });
    };
    OreIdProvider.prototype.getFeeData = function () {
        return __awaiter(this, void 0, void 0, function () {
            var feeData;
            return __generator(this, function (_a) {
                feeData = {
                    lastBaseFeePerGas: new BigNumber(1, "0x0"),
                    maxFeePerGas: null,
                    maxPriorityFeePerGas: null,
                    gasPrice: null
                };
                return [2 /*return*/, feeData];
            });
        });
    };
    OreIdProvider.prototype.getBlockNumber = function () {
        return __awaiter(this, void 0, void 0, function () {
            var blockNum;
            return __generator(this, function (_a) {
                blockNum = this.httpProvider.eth.getBlockNumber();
                return [2 /*return*/, blockNum];
            });
        });
    };
    return OreIdProvider;
}());
function RPCProvider() {
    var provider = new Web3.providers.HttpProvider('https://rpc.goerli.mudit.blog');
    // const signer = new Web
    // RPCSubprovider
    var signer = new OreIdSigner();
    // providerEngine.addProvider(signer)
    // providerEngine.provider.signer = new OreIdSigner(provider)
    // const wpConfig: WyvernConfig = {
    // }
    // const wp = new WyvernProtocol(provider, )
    provider.signer = signer;
    // provider.signer.connect()
    return provider;
}
export { OreIdSigner, OreIdProvider, RPCProvider };
//# sourceMappingURL=index.js.map