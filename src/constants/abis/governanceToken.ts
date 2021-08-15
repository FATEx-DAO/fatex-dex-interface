import { Interface } from '@ethersproject/abi'
import { abi as FATE_TOKEN_ABI } from './fate-token.json'

const FATE_TOKEN_INTERFACE = new Interface(FATE_TOKEN_ABI)

export default FATE_TOKEN_INTERFACE
export { FATE_TOKEN_ABI, FATE_TOKEN_INTERFACE }
