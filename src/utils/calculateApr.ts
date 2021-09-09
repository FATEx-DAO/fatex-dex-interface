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
      if (valueOfTotalStakedAmountInPairCurrency.greaterThan(multiplied)) {
        apr = new Fraction(valueOfTotalStakedAmountInPairCurrency.raw)
          .subtract(multiplied)
          .divide(valueOfTotalStakedAmountInPairCurrency)
      } else {
        apr = multiplied.subtract(valueOfTotalStakedAmountInPairCurrency).divide(valueOfTotalStakedAmountInPairCurrency)
      }
    } else {
      if (valueOfTotalStakedAmountInPairCurrency.greaterThan(multiplied)) {
        apr = multiplied.divide(valueOfTotalStakedAmountInPairCurrency)
      } else {
        apr = multiplied.subtract(valueOfTotalStakedAmountInPairCurrency).divide(valueOfTotalStakedAmountInPairCurrency)
      }
    }

    return apr
  }

  return new Fraction(JSBI.BigInt(0), JSBI.BigInt(1))
}
