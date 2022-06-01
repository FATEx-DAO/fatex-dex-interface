import { JSBI } from '@fatex-dao/sdk'

export function getEpochFromWeekIndex(weekIndex: JSBI): JSBI {
  if (JSBI.lessThan(weekIndex, JSBI.BigInt('52'))) {
    return JSBI.BigInt('0')
  } else {
    return JSBI.BigInt('1')
  }
}
