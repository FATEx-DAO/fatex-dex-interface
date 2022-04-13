import React, { useContext, useEffect, useMemo, useState } from 'react'
import styled, { ThemeContext } from 'styled-components/macro'
import { Fraction, PairType } from '@fatex-dao/sdk'

import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { HideSmall, TYPE } from '../../theme'
import Card from '../../components/Card'
import { RowBetween } from '../../components/Row'
import { AutoColumn } from '../../components/Column'

import { useActiveWeb3React } from '../../hooks'
import { usePairs } from '../../data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import { CardBGImage, CardNoise, CardSection, DataCard } from '../../components/earn/styled'
import Web3Status from '../../components/Web3Status'
import DoubleCurrencyLogo from '../../components/DoubleLogo'
import { useDeFiKingdomsMigrator, useSushiMigrator, useViperMigrator } from '../../hooks/useContract'
import { useTokenAllowance } from '../../data/Allowances'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { pairTypeToString, useMigrateLiquidityCallback } from '../../hooks/useMigrateLiquidityCallback'
import { useBurnActionHandlers } from '../../state/burn/hooks'
import { Field } from '../../state/burn/actions'

const PageWrapper = styled(AutoColumn)`
  max-width: 500px;
  width: 100%;
`

const VoteCard = styled(DataCard)`
  /*background: radial-gradient(76.02% 75.41% at 1.84% 0%, #777777 0%, #909090 100%);*/
  background: ${({ theme }) => theme.bg3};
  overflow: hidden;
`

const TitleRow = styled(RowBetween)`
  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-wrap: wrap;
    gap: 12px;
    width: 100%;
    flex-direction: column-reverse;
  `};
`

const EmptyProposals = styled.div`
  border: 1px solid ${({ theme }) => theme.text4};
  padding: 16px 12px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const WalletConnectWrapper = styled.div`
  width: 100%;
  max-width: 200px;
  margin: 10px auto;
`

const OtherLpPair = styled.div<{ selected: boolean }>`
  display: block;
  width: 100%;
  border: 3px solid ${({ theme, selected }) => (selected ? theme.text1 : theme.text3)};
  border-radius: 10px;
  padding: 20px 25px;
  margin-bottom: 10px;
  cursor: pointer;

  :hover {
    border: 3px solid ${({ theme }) => theme.text1};
  }
`

const PairIcons = styled.div`
  width: fit-content;
  display: inline-block;
  margin-right: 20px;
`

const PairName = styled.div`
  width: fit-content;
  display: inline-block;
`

const PairAmount = styled.div`
  width: fit-content;
  display: inline-block;
  float: right;
`

const SubmitMigration = styled.div`
  width: 100%;
`

const LPPairsWrapper = styled.div``

const MigrationSummary = styled.div`
  width: 100%;
  display: block;
  margin-bottom: 10px;
`

const MigrationLPName = styled.div`
  display: inline-block;
  vertical-align: top;
`

const MigrationAmount = styled.div`
  display: inline-block;
  vertical-align: top;
  float: right;
`

const MigrateButtonWrapper = styled.div``

const MigrateButton = styled.div<{ disabled?: boolean }>`
  text-align: center;
  display: block;
  width: 100%;
  border: 3px solid ${({ theme, disabled }) => (disabled ? theme.text3 : theme.text1)};
  border-radius: 10px;
  padding: 20px 25px;
  margin-bottom: 10px;
  cursor: ${({ disabled }) => (disabled ? 'auto' : 'pointer')};

  :hover {
    background-color: ${({ theme, disabled }) => (disabled ? 'none' : theme.text1)};
    ${({ theme, disabled }) => !disabled && `color: ${theme.text6};`}
  }
`

const SwapTabs = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
`

const SwapTab = styled.div<{ selected: boolean }>`
  width: 150px;
  padding: 12px 12px;
  border: 3px solid ${({ theme, selected }) => (selected ? theme.text1 : theme.text3)};
  background: none;
  color: ${({ theme }) => theme.text1};
  cursor: pointer;
  display: inline-block;
  text-align: center;
  border-radius: 8px;
  margin-top: 16px;

  :hover {
    border-color: ${({ theme }) => theme.text1};
  }
`

const SwapTabText = styled.span`
  display: inline-block;
  vertical-align: middle;
`

const pairTypes = [PairType.VIPER, PairType.SUSHI, PairType.DEFI_KINGDOM]

export default function Pool() {
  const theme = useContext(ThemeContext)
  const { account } = useActiveWeb3React()

  const [selectedPairIndex, setSelectedPairIndex] = useState<number | null>(null)
  const [unlocking, setUnlocking] = useState(false)
  const [migrating, setMigrating] = useState(false)
  const [selectedTabIndex, setSelectedTabIndex] = useState(0)

  const trackedTokenPairs = useTrackedTokenPairs()

  const sushiPairs = usePairs(trackedTokenPairs, PairType.SUSHI)
  const sushiLpTokens = useMemo(() => {
    return trackedTokenPairs.map(tokenPair => toV2LiquidityToken(tokenPair, PairType.SUSHI))
  }, [trackedTokenPairs])
  const [sushiBalances] = useTokenBalancesWithLoadingIndicator(account ?? undefined, sushiLpTokens)
  const sushiPairsWithBalances = useMemo(() => {
    return sushiPairs.filter(([, pair]) => pair && sushiBalances[pair.liquidityToken.address]?.greaterThan('0'))
  }, [sushiBalances, sushiPairs])
  const sushiMigratorContract = useSushiMigrator()

  const viperPairs = usePairs(trackedTokenPairs, PairType.VIPER)
  const viperLpTokens = useMemo(() => {
    return trackedTokenPairs.map(tokenPair => toV2LiquidityToken(tokenPair, PairType.VIPER))
  }, [trackedTokenPairs])
  const [viperBalances] = useTokenBalancesWithLoadingIndicator(account ?? undefined, viperLpTokens)
  const viperPairsWithBalances = useMemo(() => {
    return viperPairs.filter(([, pair]) => {
      return pair && viperBalances[pair.liquidityToken.address]?.greaterThan('0')
    })
  }, [viperBalances, viperPairs])
  const viperMigratorContract = useViperMigrator()

  const kingdomPairs = usePairs(trackedTokenPairs, PairType.DEFI_KINGDOM)
  const kingdomLpTokens = useMemo(() => {
    return trackedTokenPairs.map(tokenPair => toV2LiquidityToken(tokenPair, PairType.DEFI_KINGDOM))
  }, [trackedTokenPairs])
  const [kingdomBalances] = useTokenBalancesWithLoadingIndicator(account ?? undefined, kingdomLpTokens)
  const kingdomPairsWithBalances = useMemo(() => {
    return kingdomPairs.filter(([, pair]) => {
      return pair && kingdomBalances[pair.liquidityToken.address]?.greaterThan('0')
    })
  }, [kingdomBalances, kingdomPairs])
  const kingdomMigratorContract = useDeFiKingdomsMigrator()

  const selectedPairsToMigrate = useMemo(() => {
    if (selectedTabIndex === 0) {
      return viperPairsWithBalances
    } else if (selectedTabIndex == 1) {
      return sushiPairsWithBalances
    } else if (selectedTabIndex === 2) {
      return kingdomPairsWithBalances
    } else {
      console.error('invalid selectedTabIndex at selectedPairsToMigrate')
      return []
    }
  }, [selectedTabIndex, viperPairsWithBalances, sushiPairsWithBalances, kingdomPairsWithBalances])
  const selectedPairBalances = useMemo(() => {
    if (selectedTabIndex === 0) {
      return viperBalances
    } else if (selectedTabIndex === 1) {
      return sushiBalances
    } else if (selectedTabIndex === 2) {
      return kingdomBalances
    } else {
      console.error('invalid selectedTabIndex at selectedPairBalances')
      return {}
    }
  }, [selectedTabIndex, viperBalances, sushiBalances, kingdomBalances])
  const selectedPairsWithBalancesMap = useMemo(() => {
    if (selectedTabIndex === 0) {
      return viperPairsWithBalances
    } else if (selectedTabIndex === 1) {
      return sushiPairsWithBalances
    } else if (selectedTabIndex === 2) {
      return kingdomPairsWithBalances
    } else {
      console.error('invalid selectedTabIndex at selectedPairsToMigrate')
      return []
    }
  }, [selectedTabIndex, viperPairsWithBalances, sushiPairsWithBalances, kingdomPairsWithBalances])
  const selectedPair = useMemo(() => {
    if (typeof selectedPairIndex === 'number' && selectedPairIndex < selectedPairsToMigrate.length) {
      return selectedPairsToMigrate[selectedPairIndex][1]
    }
    return undefined
  }, [selectedPairIndex, selectedPairsToMigrate])
  const selectedPairBalance = useMemo(() => {
    if (selectedPair) {
      return selectedPairBalances[selectedPair.liquidityToken.address]
    }
    return undefined
  }, [selectedPair, selectedPairBalances])
  const selectedMigratorContract = useMemo(() => {
    if (selectedTabIndex === 0) {
      return viperMigratorContract
    } else if (selectedTabIndex === 1) {
      return sushiMigratorContract
    } else if (selectedTabIndex === 2) {
      return kingdomMigratorContract
    } else {
      console.error('invalid selectedTabIndex for selectedMigratorContract')
      return null
    }
  }, [selectedTabIndex, viperMigratorContract, sushiMigratorContract, kingdomMigratorContract])
  const allowance = useTokenAllowance(
    selectedPair?.liquidityToken,
    account ?? undefined,
    selectedMigratorContract?.address
  )
  const { onUserInput } = useBurnActionHandlers()

  useEffect(() => {
    setSelectedPairIndex(null)
  }, [selectedTabIndex])

  const [approvalState, promiseCallback] = useApproveCallback(selectedPairBalance, selectedMigratorContract?.address)
  useEffect(() => {
    setUnlocking(approvalState === ApprovalState.PENDING)
  }, [approvalState])

  const selectedPairType = useMemo(() => {
    if (selectedTabIndex === 0) {
      return PairType.VIPER
    } else if (selectedTabIndex === 1) {
      return PairType.SUSHI
    } else if (selectedTabIndex === 2) {
      return PairType.DEFI_KINGDOM
    } else {
      console.error('Invalid tab index, ', selectedTabIndex)
      return PairType.FATE
    }
  }, [selectedTabIndex])

  const migrateCallback = useMigrateLiquidityCallback(
    selectedPair ?? undefined,
    selectedPairType,
    selectedPairBalance,
    selectedMigratorContract ?? undefined
  )

  const onUnlock = () => {
    promiseCallback().catch(error => {
      console.error('Caught error while unlocking: ', error)
      setUnlocking(false)
    })
  }

  const onMigrate = () => {
    setMigrating(true)
    migrateCallback()
      .then(() => {
        setMigrating(false)
        setSelectedPairIndex(null)
      })
      .catch(error => {
        console.error('Migration Error: ', error)
        setMigrating(false)
      })
  }

  let migrationNames = ''
  for (let i = 0; i < pairTypes.length; i++) {
    if (i < pairTypes.length - 1) {
      migrationNames = migrationNames + pairTypeToString(pairTypes[i]) + ', '
    } else {
      migrationNames = migrationNames + 'or ' + pairTypeToString(pairTypes[i])
    }
  }
  return (
    <>
      <PageWrapper>
        <VoteCard>
          <CardBGImage />
          <CardNoise />
          <CardSection>
            <AutoColumn gap={'md'}>
              <RowBetween>
                <TYPE.white fontWeight={600}>Migrate Liquidity</TYPE.white>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={14}>
                  {`Migrate your ${migrationNames} LP tokens to FATEx LP tokens with just a couple of clicks.`}
                </TYPE.white>
              </RowBetween>
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </VoteCard>
        <AutoColumn gap={'lg'} justify={'center'}>
          <AutoColumn gap={'lg'} style={{ width: '100%' }}>
            <TitleRow style={{ marginTop: '1rem' }} padding={'0'}>
              <HideSmall>
                <TYPE.mediumHeader style={{ marginTop: '0.5rem', justifySelf: 'flex-start' }}>
                  Liquidity Source
                </TYPE.mediumHeader>
              </HideSmall>
            </TitleRow>
            <SwapTabs>
              {pairTypes.map((pairType, i) => {
                return (
                  <SwapTab
                    key={`swap-tab-${pairType}`}
                    onClick={() => setSelectedTabIndex(i)}
                    selected={selectedTabIndex === i}
                  >
                    <SwapTabText>{pairTypeToString(pairType)}</SwapTabText>
                  </SwapTab>
                )
              })}
            </SwapTabs>
            <TitleRow style={{ marginTop: '1rem' }} padding={'0'}>
              <HideSmall>
                <TYPE.mediumHeader style={{ marginTop: '0.5rem', justifySelf: 'flex-start' }}>
                  Your {pairTypeToString(pairTypes[selectedTabIndex])} Liquidity
                </TYPE.mediumHeader>
              </HideSmall>
            </TitleRow>

            {!account ? (
              <Card padding={'15px 40px'}>
                <TYPE.body color={theme.text3} textAlign={'center'}>
                  Connect to a wallet to view your LP tokens.
                </TYPE.body>
                <WalletConnectWrapper>
                  <Web3Status />
                </WalletConnectWrapper>
              </Card>
            ) : Object.values(selectedPairsWithBalancesMap).length > 0 ? (
              <LPPairsWrapper>
                {selectedPairsToMigrate.map(([, pair], index) => {
                  const balance = selectedPairBalances?.[pair?.liquidityToken.address ?? '']
                  return (
                    <OtherLpPair
                      key={index}
                      selected={selectedPairIndex === index}
                      onClick={() => {
                        onUserInput(Field.LIQUIDITY_PERCENT, '100')
                        setSelectedPairIndex(index)
                      }}
                    >
                      <PairIcons>
                        <DoubleCurrencyLogo currency0={pair?.token0} currency1={pair?.token1} size={24} />
                      </PairIcons>
                      <PairName>
                        {pair?.token0.symbol}-{pair?.token1.symbol}
                      </PairName>
                      <PairAmount>
                        {balance?.lessThan(new Fraction('1', '1000000')) ? '<0.000001' : balance?.toFixed(6) ?? '0'}
                      </PairAmount>
                    </OtherLpPair>
                  )
                })}
              </LPPairsWrapper>
            ) : (
              <EmptyProposals>
                <TYPE.body color={theme.text3} textAlign={'center'}>
                  No liquidity found.
                </TYPE.body>
              </EmptyProposals>
            )}
            {selectedPairsToMigrate.length > 0 && selectedPairIndex !== null && (
              <SubmitMigration>
                <MigrationSummary>
                  <MigrationLPName>
                    {selectedPair?.token0.symbol}-{selectedPair?.token1.symbol}
                  </MigrationLPName>
                  <MigrationAmount>{selectedPairBalance?.toFixed(6)}</MigrationAmount>
                </MigrationSummary>
                <MigrateButtonWrapper>
                  {selectedPairBalance?.lessThan(allowance || '0') ? (
                    migrating ? (
                      <MigrateButton disabled={true}>Migrating...</MigrateButton>
                    ) : (
                      <MigrateButton onClick={() => onMigrate()}>
                        Migrate {selectedPair?.token0.symbol}-{selectedPair?.token1.symbol} to FATEx
                      </MigrateButton>
                    )
                  ) : unlocking ? (
                    <MigrateButton disabled={true}>Unlocking...</MigrateButton>
                  ) : approvalState === ApprovalState.UNKNOWN ? (
                    <MigrateButton disabled={true}>Loading...</MigrateButton>
                  ) : (
                    <MigrateButton onClick={() => onUnlock()}>
                      Unlock {selectedPair?.token0.symbol}-{selectedPair?.token1.symbol}
                    </MigrateButton>
                  )}
                </MigrateButtonWrapper>
              </SubmitMigration>
            )}
          </AutoColumn>
        </AutoColumn>
      </PageWrapper>
    </>
  )
}
