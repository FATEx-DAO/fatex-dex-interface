import { Price, Fraction, TokenAmount, JSBI } from '@fatex-dao/sdk'
import { utils } from 'ethers'

export default function calculateApr(
  govTokenWethPrice: Price | undefined,
  baseBlockRewards: TokenAmount,
  blocksPerYear: JSBI,
  poolShare: Fraction,
  valueOfTotalStakedAmountInPairCurrency: TokenAmount | Fraction
): Fraction | undefined {
  const multiplied = govTokenWethPrice?.raw
    .multiply(baseBlockRewards.raw)
    .multiply(blocksPerYear.toString())
    .multiply(poolShare)

  let apr: Fraction | undefined

  if (multiplied && valueOfTotalStakedAmountInPairCurrency.greaterThan('0')) {
    if (valueOfTotalStakedAmountInPairCurrency instanceof TokenAmount) {
      apr = multiplied.divide(valueOfTotalStakedAmountInPairCurrency?.raw)
    } else {
      // Somehow a Fraction/Fraction division has to be further divided by 1 ETH to get the correct number?
      apr = multiplied.divide(valueOfTotalStakedAmountInPairCurrency).divide(utils.parseEther('1').toString())
    }

    return apr
  }

  return new Fraction(JSBI.BigInt(0), JSBI.BigInt(1))
}
