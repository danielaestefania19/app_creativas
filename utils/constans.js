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
  
  export const contractAddress = "0x677a069A880c85aD3BC2A9A98B34868B81ffD815";
  export const contractAddressRES4 = "0x711286b1a9Cd41AA5A4Ef8d3cC3112Ef6c7C59d0";
  export const contractAddressFracNft = "0x338F918223f40f2835e977bD42d51b0ac7a093f6";
  export const contractAddressReclamarFracRegistry = "0x2B6259650D3CcBE293cBb65d1e6b2C1e1De8f5B4";
  export const contractCodeObjFrac = "0x60806040523480156200001157600080fd5b5060405162000fbf38038062000fbf833981810160405281019062000037919062000250565b8133828173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16636352211e836040518263ffffffff1660e01b81526004016200008c9190620002a8565b602060405180830381865afa158015620000aa573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620000d09190620002c5565b73ffffffffffffffffffffffffffffffffffffffff1614620000f157600080fd5b84600160006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506000600260146101000a81548160ff021916908360028111156200019b576200019a620002f7565b5b0217905550505050505062000326565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000620001dd82620001b0565b9050919050565b620001ef81620001d0565b8114620001fb57600080fd5b50565b6000815190506200020f81620001e4565b92915050565b6000819050919050565b6200022a8162000215565b81146200023657600080fd5b50565b6000815190506200024a816200021f565b92915050565b600080604083850312156200026a5762000269620001ab565b5b60006200027a85828601620001fe565b92505060206200028d8582860162000239565b9150509250929050565b620002a28162000215565b82525050565b6000602082019050620002bf600083018462000297565b92915050565b600060208284031215620002de57620002dd620001ab565b5b6000620002ee84828501620001fe565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b610c8980620003366000396000f3fe6080604052600436106100865760003560e01c80638f84aa09116100595780638f84aa09146101285780639a725809146101535780639d76ea581461017e578063aad3ec96146101a9578063c89f2ce4146101d257610086565b8063047fc9aa1461008b57806323024408146100b65780634b43c6f9146100d25780635bf8633a146100fd575b600080fd5b34801561009757600080fd5b506100a06101fd565b6040516100ad9190610865565b60405180910390f35b6100d060048036038101906100cb91906108e3565b610203565b005b3480156100de57600080fd5b506100e76104df565b6040516100f49190610987565b60405180910390f35b34801561010957600080fd5b506101126104f6565b60405161011f91906109b1565b60405180910390f35b34801561013457600080fd5b5061013d61051c565b60405161014a91906109ed565b60405180910390f35b34801561015f57600080fd5b50610168610540565b6040516101759190610987565b60405180910390f35b34801561018a57600080fd5b50610193610553565b6040516101a091906109b1565b60405180910390f35b3480156101b557600080fd5b506101d060048036038101906101cb9190610a34565b610579565b005b3480156101de57600080fd5b506101e761081a565b6040516101f49190610865565b60405180910390f35b60045481565b600080600281111561021857610217610910565b5b600260149054906101000a900460ff16600281111561023a57610239610910565b5b1461024457600080fd5b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461029c57600080fd5b3460038190555081600260006101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff1602179055506001600260146101000a81548160ff0219169083600281111561030a57610309610910565b5b0217905550610398670de0b6b3a76400008373ffffffffffffffffffffffffffffffffffffffff166318160ddd6040518163ffffffff1660e01b8152600401602060405180830381865afa158015610366573d6000803e3d6000fd5b505050506040513d601f19601f8201168201806040525081019061038a9190610a89565b61082090919063ffffffff16565b6004819055507fb8fbc896aaf3402bc9e3197c5ef680f129d53be930035e2c0f7ac85244df0c1a6004546040516103cf9190610865565b60405180910390a17f825c94adc2d07d7054df3df363833d04745e4d5bbfbf6349d7d3aa0ba212731f600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1660405161042891906109b1565b60405180910390a17fd1928025d134c8c80a2236b6a0ae96292bcaf0717ea1ab4957e636787fe8bf356003546040516104619190610865565b60405180910390a17f09a3780ffd48bc4df9d4816a4c9a74f5e52518e90e2173034df5b0b140085ecc600260149054906101000a900460ff166040516104a79190610987565b60405180910390a17ff3a504f28a34fdf555994a3bdfd3dc29f822e8684a9ef01001afb738cc3cdd0a60405160405180910390a15050565b6000600260149054906101000a900460ff16905090565b600160009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600260149054906101000a900460ff1681565b600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b81600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16146105d457600080fd5b60006105f3670de0b6b3a764000060045461083690919063ffffffff16565b9050600061061e826106106003548761083690919063ffffffff16565b61082090919063ffffffff16565b905080471015610663576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161065a90610b39565b60405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff166108fc829081150290604051600060405180830381858888f193505050501580156106a9573d6000803e3d6000fd5b50600260009054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166379cc679033866040518363ffffffff1660e01b8152600401610707929190610b59565b600060405180830381600087803b15801561072157600080fd5b505af1158015610735573d6000803e3d6000fd5b505050507fd8138f8a3f377c5259ca548e70e4c2de94f129f5a11036a15b69513cba2b426a338260405161076a929190610b59565b60405180910390a160008573ffffffffffffffffffffffffffffffffffffffff166318160ddd6040518163ffffffff1660e01b8152600401602060405180830381865afa1580156107bf573d6000803e3d6000fd5b505050506040513d601f19601f820116820180604052508101906107e39190610a89565b036108135760028060146101000a81548160ff0219169083600281111561080d5761080c610910565b5b02179055505b5050505050565b60035481565b6000818361082e9190610be0565b905092915050565b600081836108449190610c11565b905092915050565b6000819050919050565b61085f8161084c565b82525050565b600060208201905061087a6000830184610856565b92915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006108b082610885565b9050919050565b6108c0816108a5565b81146108cb57600080fd5b50565b6000813590506108dd816108b7565b92915050565b6000602082840312156108f9576108f8610880565b5b6000610907848285016108ce565b91505092915050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b600381106109505761094f610910565b5b50565b60008190506109618261093f565b919050565b600061097182610953565b9050919050565b61098181610966565b82525050565b600060208201905061099c6000830184610978565b92915050565b6109ab816108a5565b82525050565b60006020820190506109c660008301846109a2565b92915050565b60006109d782610885565b9050919050565b6109e7816109cc565b82525050565b6000602082019050610a0260008301846109de565b92915050565b610a118161084c565b8114610a1c57600080fd5b50565b600081359050610a2e81610a08565b92915050565b60008060408385031215610a4b57610a4a610880565b5b6000610a59858286016108ce565b9250506020610a6a85828601610a1f565b9150509250929050565b600081519050610a8381610a08565b92915050565b600060208284031215610a9f57610a9e610880565b5b6000610aad84828501610a74565b91505092915050565b600082825260208201905092915050565b7f466f6e646f7320696e737566696369656e74657320656e20656c20636f6e747260008201527f61746f0000000000000000000000000000000000000000000000000000000000602082015250565b6000610b23602383610ab6565b9150610b2e82610ac7565b604082019050919050565b60006020820190508181036000830152610b5281610b16565b9050919050565b6000604082019050610b6e60008301856109a2565b610b7b6020830184610856565b9392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b6000610beb8261084c565b9150610bf68361084c565b925082610c0657610c05610b82565b5b828204905092915050565b6000610c1c8261084c565b9150610c278361084c565b9250828202610c358161084c565b91508282048414831517610c4c57610c4b610bb1565b5b509291505056fea264697066735822122015baed1008203903f4d474cdff3e9884edf5f004114b52c5a0cf8be0856c8ef164736f6c63430008130033";
