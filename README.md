# FATEx Interface

[![Lint](https://github.com/FATEx-DAO/fatex-dex-interface/workflows/Lint/badge.svg)](https://github.com/FATEx-DAO/fatex-dex-interface/actions?query=workflow%3ALint)
[![Tests](https://github.com/FATEx-DAO/fatex-dex-interface/workflows/Tests/badge.svg)](https://github.com/FATEx-DAO/fatex-dex-interface/actions?query=workflow%3ATests)
[![Styled With Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)

An open source interface for Uniswap -- a protocol for decentralized exchange of Ethereum tokens.

- Website: [fatex.io](https://fatex.io/)
- Interface: [app.fatex.io](https://app.fatex.io)
- Docs: [fatex.io/docs/](https://fatex.io/docs/)
- Twitter: [@FATExDAO](https://twitter.com/FATExDAO)
- Reddit: [/r/FATEx](https://www.reddit.com/r/FATEx/)
- Whitepaper: [Link](https://fatexdao.gitbook.io/fatexdao/)

## Accessing the FATEx Interface

To access the FATEx Interface, use an IPFS fatex-dex link from the
[latest release](https://github.com/FATEx-DAO/fatex-dex-interface/releases/latest), 
or visit [app.fatex.io](https://app.fatex.io).

## Listing a token

Please see the
[@fatex-dao/default-token-list](https://github.com/FATEx-DAO/default-token-list) 
repository.

## Development

### Install Dependencies

```bash
yarn
```

### Run

```bash
yarn start
```

### Configuring the environment (optional)

To have the interface default to a different network when a wallet is not connected:

1. Make a copy of `.env` named `.env.local`
2. Change `REACT_APP_NETWORK_ID` to `"{YOUR_NETWORK_ID}"`
3. Change `REACT_APP_NETWORK_URL` to e.g. `"https://{YOUR_NETWORK_ID}.infura.io/v3/{YOUR_INFURA_KEY}"` 

Note that the interface only works on testnets where both 
[Uniswap V2](https://github.com/FATEx-DAO/sushiswap/blob/master/contracts/uniswap-v2/UniswapV2Factory.sol) and 
[multicall](https://github.com/FATEx-DAO/sushiswap/blob/master/contracts/utils/Multicall.sol) are deployed.
The interface will not work on other networks.

## Contributions

**Please open all pull requests against the `main` branch.** 
CI checks will run against all PRs.
