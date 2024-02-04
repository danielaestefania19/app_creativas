// utils/constants.js
export const BITFINITY_CHAIN = {
    id: 355113,
    name: "Bitfinity Network",
    network: "Bitfinity Network",
    nativeCurrency: {
      name: "BitFinity",
      symbol: "BFT",
      decimals: 18,
    },
    rpcUrls: {
      public: { http: ["https://testnet.bitfinity.network"] },
      default: { http: ["https://testnet.bitfinity.network"] },
    },
    //blockExplorerUrls: []
  };
  
  export const contractAddress = "0xC857A67BE079E3Dd24Da216532Bd6fF07e77714a";
  export const contractAddressRES4 = "0x99FFBEDcD8BE748B0FD720CFf9952aC59ed11208";
  export const contractAddressFracNft = "0xB8FEdAd8789aC1705e3134B6072E7CdF078f3342";
  export const contractAddressCardCrypay = "0xce439260528314a6A4BaeCCc3d4ADDb86d7A1957"
  export const contractAddressReclamarFracRegistry = "0x2B6259650D3CcBE293cBb65d1e6b2C1e1De8f5B4";
  export const contractCodeObjFrac = "0x608080604052346100b5576040816107d9803803809161001f8285610104565b8339810103126100b55760206100348261013d565b9101516040516331a9108f60e11b815260048101919091526001600160a01b0391821691602082602481865afa9182156100f8576000926100ba575b50339116036100b557600180546001600160a01b0319908116909217905560008054909116331790556002805460ff60a01b1916905560405161068790816101528239f35b600080fd5b90916020823d82116100f0575b816100d460209383610104565b810103126100ed57506100e69061013d565b9038610070565b80fd5b3d91506100c7565b6040513d6000823e3d90fd5b601f909101601f19168101906001600160401b0382119082101761012757604052565b634e487b7160e01b600052604160045260246000fd5b51906001600160a01b03821682036100b55756fe608060408181526004918236101561001657600080fd5b600092833560e01c918263047fc9aa146105835750816323024408146103b15781634b43c6f9146103325781635bf8633a146103885781638f84aa09146103605781639a725809146103325781639d76ea5814610309578163aad3ec96146100a9575063c89f2ce41461008857600080fd5b346100a557816003193601126100a5576020906003549051908152f35b5080fd5b9050346103055781600319360112610305576100c361059e565b6002546001600160a01b03918216919060249081359083168403610301578454670de0b6b3a7640000908181029181830414901517156102ef576003548083029083820414831517156102dd5781156102cb57049283471061027d57908792918380868015610273575b8280929181923390f115610269576002541690813b1561026557839161016891895195868094819363079cc67960e41b8352338d8401610616565b03925af1801561025b5761021e575b50509060008051602061063283398151915261019b60209386519182913383610616565b0390a183516318160ddd60e01b815292839182905afa918215610215575082916101df575b50156101c95780f35b6002805460ff60a01b1916600160a11b17905580f35b90506020813d821161020d575b816101f9602093836105dd565b810103126102085751386101c0565b600080fd5b3d91506101ec565b513d84823e3d90fd5b9195916001600160401b03821161024a575084529360008051602061063283398151915261019b610177565b634e487b7160e01b83526041855282fd5b86513d89823e3d90fd5b8380fd5b87513d85823e3d90fd5b6108fc915061012d565b865162461bcd60e51b81526020818801526023818501527f466f6e646f7320696e737566696369656e74657320656e20656c20636f6e747260448201526261746f60e81b6064820152608490fd5b634e487b7160e01b8952601287528389fd5b634e487b7160e01b8952601187528389fd5b634e487b7160e01b8852601186528288fd5b8680fd5b8280fd5b5050346100a557816003193601126100a55760025490516001600160a01b039091168152602090f35b5050346100a557816003193601126100a55761035c9060ff60025460a01c169051918291826105b4565b0390f35b5050346100a557816003193601126100a557905490516001600160a01b039091168152602090f35b5050346100a557816003193601126100a55760015490516001600160a01b039091168152602090f35b916020915036600319018213610265576103c961059e565b916002549260ff8460a01c1660038110156105705761056c5785546001600160a01b0391908216330361030157346003556001600160a81b0319909416938116938417600160a01b17600281905583516318160ddd60e01b815295909483908790839082905afa958615610562578796610529575b50827f825c94adc2d07d7054df3df363833d04745e4d5bbfbf6349d7d3aa0ba212731f8160ff9796947fb8fbc896aaf3402bc9e3197c5ef680f129d53be930035e2c0f7ac85244df0c1a6104ff977fd1928025d134c8c80a2236b6a0ae96292bcaf0717ea1ab4957e636787fe8bf3596670de0b6b3a76400007f09a3780ffd48bc4df9d4816a4c9a74f5e52518e90e2173034df5b0b140085ecc9d048091558851908152a185519088168152a18251348152a15192839260a01c16826105b4565b0390a17ff3a504f28a34fdf555994a3bdfd3dc29f822e8684a9ef01001afb738cc3cdd0a8180a180f35b9295509392908583813d811161055b575b61054481836105dd565b81010312610301579151949293909291908261043e565b503d61053a565b84513d89823e3d90fd5b8580fd5b634e487b7160e01b875260218652602487fd5b84913461030557826003193601126103055760209250548152f35b600435906001600160a01b038216820361020857565b9190602083019260038210156105c75752565b634e487b7160e01b600052602160045260246000fd5b601f909101601f19168101906001600160401b0382119082101761060057604052565b634e487b7160e01b600052604160045260246000fd5b6001600160a01b03909116815260208101919091526040019056fed8138f8a3f377c5259ca548e70e4c2de94f129f5a11036a15b69513cba2b426aa26469706673582212201e7fb195c9694a45833a229e675550595d44a08514bb86158e54b4c2b00cd07c64736f6c63430008130033";
  export const contractCodeObjCrypay = "0x60803461007f57601f6107fa38819003918201601f19168301916001600160401b038311848410176100845780849260209460405283398101031261007f57516001600160a01b0381169081900361007f5760018060a01b0319338160005416176000556000600255600154161760015560405161075f908161009b8239f35b600080fd5b634e487b7160e01b600052604160045260246000fdfe6080604081815260049182361015610022575b505050361561002057600080fd5b005b600090813560e01c9081630937e68a146104e4575080631a75f20f146104bc578063278ecde1146104225780635c622a0e146103bc578063971d852f1461031c578063b02d84c1146102f3578063c290d6911461023f578063dddcb15e146101035763e75722300361001257346101005760203660031901126101005781908335815260036020522060ff600182015416156100c45760209250549051908152f35b815162461bcd60e51b8152602081850152601660248201527514185e5b595b9d08191bd95cc81b9bdd08195e1a5cdd60521b6044820152606490fd5b80fd5b50903461023b578060031936011261023b5781546001600160a01b0390843590602435906101349084163314610652565b61013d82610639565b1580610232575b156101df57835190606082016001600160401b038111838210176101cc578594939260ff926001926101a498528152602081019582875280820194898652895260036020528820905181550193511660ff198454161783555116906106ac565b60025460001981146101b95760010160025580f35b506011602492634e487b7160e01b835252fd5b634e487b7160e01b875260418852602487fd5b835162461bcd60e51b8152602081880152602760248201527f5061796d656e7420616c726561647920657869737473206f72207072696365206044820152666973207a65726f60c81b6064820152608490fd5b50801515610144565b5080fd5b5082602036600319011261023b578035825260036020528282206001810191825491600160ff84161490816102e8575b501561028d575060ff1916600217815561028a9033906106ac565b80f35b608490602086519162461bcd60e51b8352820152602f60248201527f5061796d656e74206e6f7420696e697469616c697a6564206f7220696e636f7260448201526e1c9958dd081d985b1d59481cd95b9d608a1b6064820152fd5b90505434148661026f565b50903461023b578160031936011261023b5760015490516001600160a01b039091168152602090f35b5091346103b85760203660031901126103b85782546001600160a01b0391906103489083163314610652565b358352600360205282808080858120948554908115908115806103a7575b61036f906106d1565b6001541690839061039e575bf11561039357600101805460ff191660031790555080f35b5051903d90823e3d90fd5b506108fc61037b565b50600188015460ff16600214610366565b8280fd5b5034610100576020928360031936011261023b57836103dc849235610535565b82519382859384528251928382860152825b84811061040c57505050828201840152601f01601f19168101030190f35b81810183015188820188015287955082016103ee565b5091346103b85760203660031901126103b85782546001600160a01b03929061044e9084163314610652565b8135845260036020528380808084812080549060018215918215806104ac575b610477906106d1565b0198895460081c169083906104a3575bf11561049a5750815460ff191617905580f35b513d84823e3d90fd5b506108fc610487565b508082015460ff1660021461046e565b503461010057602036600319011261010057506104db60209235610639565b90519015158152f35b90503461023b578160031936011261023b576020906002548152f35b60408051919082016001600160401b0381118382101761051f57604052565b634e487b7160e01b600052604160045260246000fd5b60005260206003815260ff600160406000200154168015610623576001811461060857600281146105ec57600381146105cb576004146105ac576064906040519062461bcd60e51b825260048201526016602482015275496e76616c6964207061796d656e742073746174757360501b6044820152fd5b671499599d5b99195960c21b6105c0610500565b916008835282015290565b506810dbdb5c1b195d195960ba1b6105e1610500565b916009835282015290565b506314185a5960e21b6105fd610500565b916004835282015290565b50624e657760e81b610618610500565b916003835282015290565b50684e6f7445786973747360b81b6105e1610500565b600052600360205260ff60016040600020015416151590565b1561065957565b60405162461bcd60e51b815260206004820152602560248201527f4f6e6c7920746865206f776e65722063616e2063616c6c20746869732066756e60448201526431ba34b7b760d91b6064820152608490fd5b8054610100600160a81b03191660089290921b610100600160a81b0316919091179055565b156106d857565b60405162461bcd60e51b815260206004820152602360248201527f5061796d656e74206e6f7420696e697469616c697a6564206f72206e6f742070604482015262185a5960ea1b6064820152608490fdfea2646970667358221220d8e621269df662b4ac371ceff3ce9f9d656fc5fa0ab4579f60fdd8f926d314f264736f6c63430008130033"