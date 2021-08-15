import { Interface } from '@ethersproject/abi'
import { abi as XFATE_ABI } from './xfate-token.json'

const X_FATE_INTERFACE = new Interface(XFATE_ABI)

export default X_FATE_INTERFACE
export { XFATE_ABI, X_FATE_INTERFACE }
