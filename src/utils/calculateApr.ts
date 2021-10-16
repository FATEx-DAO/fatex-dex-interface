import { Fraction, JSBI, Price, TokenAmount } from '@fatex-dao/sdk'

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
    .divide('1000000000000000000')

  let apr: Fraction | undefined

  if (multiplied && valueOfTotalStakedAmountInPairCurrency.greaterThan('0')) {
    if (valueOfTotalStakedAmountInPairCurrency instanceof TokenAmount) {
      apr = multiplied.divide(valueOfTotalStakedAmountInPairCurrency)
    } else {
      apr = multiplied.divide(valueOfTotalStakedAmountInPairCurrency)
    }

    return apr
  }

  return new Fraction(JSBI.BigInt(0), JSBI.BigInt(1))
}
