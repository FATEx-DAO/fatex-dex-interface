import { Currency, Token, DEFAULT_CURRENCIES } from '@fatex-dao/sdk'
import { BASE_CURRENCY } from '../connectors'

export function currencyId(currency: Currency): string {
  if (currency && DEFAULT_CURRENCIES.includes(currency)) {
    return BASE_CURRENCY && BASE_CURRENCY.symbol ? BASE_CURRENCY.symbol : 'ETH'
  }
  if (currency instanceof Token) return currency.address
  throw new Error('invalid currency')
}
