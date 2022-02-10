import { JSBI } from '@fatex-dao/sdk'

export function getEpochFromWeekIndex(weekIndex: JSBI): JSBI {
  if (JSBI.lessThan(weekIndex, JSBI.BigInt('13'))) {
    return JSBI.BigInt('0')
  } else if (JSBI.lessThan(weekIndex, JSBI.BigInt('29'))) {
    return JSBI.BigInt('1')
  } else {
    return JSBI.BigInt('2')
  }
}
