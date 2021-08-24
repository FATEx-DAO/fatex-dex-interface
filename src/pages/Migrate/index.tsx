import React, { useContext, useEffect, useMemo, useState } from 'react'
import styled, { ThemeContext } from 'styled-components/macro'
import { PairType } from '@fatex-dao/sdk'

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
import { useSushiMigrator, useViperMigrator } from '../../hooks/useContract'
import { useTokenAllowance } from '../../data/Allowances'
import { ApprovalState, useApproveCallback } from '../../hooks/useApproveCallback'
import { useMigrateLiquidityCallback } from '../../hooks/useMigrateLiquidityCallback'

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

const ViperswapLPPair = styled.div<{ selected: boolean }>`
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
`

const SwapTab = styled.div<{ selected: boolean }>`
  width: 150px;
  padding: 15px 25px;
  border: 3px solid ${({ theme, selected }) => (selected ? theme.text1 : theme.text3)};
  background: none;
  color: ${({ theme }) => theme.text1};
  cursor: pointer;
  display: inline-block;
  text-align: center;
  border-radius: 8px;

  :hover {
    border-color: ${({ theme }) => theme.text1};
  }
`

const swapNames = ['Viperswap', 'Sushiswap']

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
  const [sushiBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    sushiLpTokens
  )
  const sushiPairsWithBalances = useMemo(() => {
    return sushiPairs.filter(([, pair]) =>
      pair && sushiBalances[pair.liquidityToken.address]?.greaterThan('0')
    )
  }, [sushiLpTokens])
  const sushiMigratorContract = useSushiMigrator()

  const viperPairs = usePairs(trackedTokenPairs, PairType.VIPER)
  const viperLpTokens = useMemo(() => {
    return trackedTokenPairs.map(tokenPair => toV2LiquidityToken(tokenPair, PairType.VIPER))
  }, [trackedTokenPairs])
  const [viperBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    viperLpTokens
  )
  const viperPairsWithBalances = useMemo(() => {
    return viperPairs.filter(([, pair]) =>
      pair && viperBalances[pair.liquidityToken.address]?.greaterThan('0')
    )
  }, [viperLpTokens])
  const viperMigratorContract = useViperMigrator()

  const selectedPairsToMigrate = useMemo(() => {
    if (selectedTabIndex === 0) {
      return viperPairsWithBalances
    } else {
      return sushiPairsWithBalances
    }
  }, [selectedTabIndex])
  const selectedPairsWithBalancesMap = useMemo(() => {
    if (selectedTabIndex === 0) {
      return viperBalances
    } else {
      return sushiBalances
    }
  }, [selectedTabIndex])
  const selectedPair = useMemo(() => {
    if (selectedPairIndex && selectedPairIndex < selectedPairsToMigrate.length) {
      return selectedPairsToMigrate[selectedPairIndex][1]
    }
    return null
  }, [selectedPairIndex, selectedPairsToMigrate])
  const selectedMigratorContract = useMemo(() => {
    if (selectedTabIndex === 0) {
      return viperMigratorContract
    } else {
      return sushiMigratorContract
    }
  }, [viperMigratorContract, sushiMigratorContract])
  const allowance = useTokenAllowance(selectedPair?.liquidityToken, account ?? undefined, selectedMigratorContract?.address)

  useEffect(() => {
    setSelectedPairIndex(null)
  }, [selectedTabIndex, sushiBalances, viperBalances])

  const [approvalState, promiseCallback] = useApproveCallback(
    selectedPairsWithBalancesMap[selectedPair?.liquidityToken.address ?? ''],
    selectedMigratorContract?.address
  )
  useEffect(() => {
    setUnlocking(approvalState === ApprovalState.PENDING)
  }, [approvalState])

  const selectedPairType = useMemo(() => {
    if (selectedTabIndex === 0) {
      return PairType.VIPER
    } else if (selectedTabIndex === 1) {
      return PairType.SUSHI
    } else {
      console.error('Invalid tab index, ', selectedTabIndex)
      return PairType.FATE
    }
  }, [selectedTabIndex])

  const migrateCallback = useMigrateLiquidityCallback(
    selectedPair ?? undefined,
    selectedPairType,
    selectedPairsWithBalancesMap[selectedPair?.liquidityToken.address ?? ''],
    selectedMigratorContract ?? undefined
  )

  const onUnlock = () => {
    promiseCallback()
      .catch(error => {
        console.error('Caught error while unlocking: ', error)
        setUnlocking(false)
      })
  }

  const onMigrate = () => {
    setMigrating(true)
    migrateCallback()
      .then(() => setMigrating(false))
      .catch(() => setMigrating(false))
  }

  return (
    <>
      <PageWrapper>
        <VoteCard>
          <CardBGImage />
          <CardNoise />
          <CardSection>
            <AutoColumn gap='md'>
              <RowBetween>
                <TYPE.white fontWeight={600}>Migrate Liquidity</TYPE.white>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={14}>
                  {`Migrate your Viper or Sushi LP tokens to FATEx LP tokens with just a couple of clicks.`}
                </TYPE.white>
              </RowBetween>
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </VoteCard>
        <AutoColumn gap='lg' justify='center'>
          <AutoColumn gap='lg' style={{ width: '100%' }}>
            <TitleRow style={{ marginTop: '1rem' }} padding={'0'}>
              <HideSmall>
                <TYPE.mediumHeader style={{ marginTop: '0.5rem', justifySelf: 'flex-start' }}>
                  Liquidity Source
                </TYPE.mediumHeader>
              </HideSmall>
            </TitleRow>
            <SwapTabs>
              <SwapTab onClick={() => setSelectedTabIndex(0)} selected={selectedTabIndex === 0}>
                {swapNames[0]}
              </SwapTab>
              <SwapTab onClick={() => setSelectedTabIndex(1)} selected={selectedTabIndex === 1}>
                {swapNames[1]}
              </SwapTab>
            </SwapTabs>
            <TitleRow style={{ marginTop: '1rem' }} padding={'0'}>
              <HideSmall>
                <TYPE.mediumHeader style={{ marginTop: '0.5rem', justifySelf: 'flex-start' }}>
                  Your {swapNames[selectedTabIndex]} Liquidity
                </TYPE.mediumHeader>
              </HideSmall>
            </TitleRow>

            {!account ? (
              <Card padding='15px 40px'>
                <TYPE.body color={theme.text3} textAlign='center'>
                  Connect to a wallet to view your LP tokens.
                </TYPE.body>
                <WalletConnectWrapper>
                  <Web3Status />
                </WalletConnectWrapper>
              </Card>
            ) : Object.values(selectedPairsWithBalancesMap).length > 0 ? (
              (
                <LPPairsWrapper>
                  {selectedPairsToMigrate.map(([, pair], index) => {
                    return (
                      <ViperswapLPPair
                        key={index}
                        selected={selectedPairIndex === index}
                        onClick={() => setSelectedPairIndex(index)}
                      >
                        <PairIcons>
                          <DoubleCurrencyLogo currency0={pair?.token0} currency1={pair?.token1} size={24} />
                        </PairIcons>
                        <PairName>
                          {pair?.token0.symbol}-{pair?.token1.symbol}
                        </PairName>
                        <PairAmount>{selectedPairsWithBalancesMap[pair?.liquidityToken.address ?? ''] ?? '0'}</PairAmount>
                      </ViperswapLPPair>
                    )
                  })}
                </LPPairsWrapper>
              )
            ) : (
              <EmptyProposals>
                <TYPE.body color={theme.text3} textAlign='center'>
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
                  <MigrationAmount>
                    {selectedPairsWithBalancesMap[selectedPair?.liquidityToken.address ?? '']?.toFixed(6)}
                  </MigrationAmount>
                </MigrationSummary>
                <MigrateButtonWrapper>
                  {selectedPairsWithBalancesMap[selectedPair?.liquidityToken.address ?? '']?.lessThan(allowance || '0') ? (
                    migrating ? (
                      <MigrateButton disabled={true}>Migrating...</MigrateButton>
                    ) : (
                      <MigrateButton onClick={() => onMigrate()}>
                        Migrate {selectedPair?.token0.symbol}-{selectedPair?.token1.symbol} to FATEx
                      </MigrateButton>
                    )
                  ) : unlocking ? (
                    <MigrateButton disabled={true}>Unlocking...</MigrateButton>
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
