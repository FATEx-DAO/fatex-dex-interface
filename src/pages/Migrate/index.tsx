import React, { useContext, useMemo, useState, useEffect } from 'react'
import styled, { ThemeContext } from 'styled-components/macro'
import { Pair } from '@venomswap/sdk'

import { useTokenBalancesWithLoadingIndicator } from '../../state/wallet/hooks'
import { ExternalLink, TYPE, HideSmall } from '../../theme'
import Card from '../../components/Card'
import { RowBetween } from '../../components/Row'
//import { ButtonPrimary, ButtonSecondary } from '../../components/Button'
import { AutoColumn } from '../../components/Column'

import { useActiveWeb3React } from '../../hooks'
import { usePairs } from '../../data/Reserves'
import { toV2LiquidityToken, useTrackedTokenPairs } from '../../state/user/hooks'
import { CardSection, DataCard, CardNoise, CardBGImage } from '../../components/earn/styled'
import { Dots } from '../../components/swap/styleds'
import Web3Status from '../../components/Web3Status'
import DoubleCurrencyLogo from '../../components/DoubleLogo'

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
  border 3px solid ${({ theme, selected }) => (selected ? theme.text1 : theme.text3)};
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
  border 3px solid ${({ theme, disabled }) => (disabled ? theme.text3 : theme.text1)};
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
  border 3px solid ${({ theme, selected }) => (selected ? theme.text1 : theme.text3)};
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

  const [selectedLPPair, setSelectedLPPair] = useState<number | null>(null)
  const [selectedLPUnlocked, setSelectedLPUnlocked] = useState(false)
  const [unlocking, setUnlocking] = useState(false)
  const [migrating, setMigrating] = useState(false)
  const [selectedSwap, setSelectedSwap] = useState(0)

  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map(tokens => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map(tpwlt => tpwlt.liquidityToken), [
    tokenPairsWithLiquidityTokens
  ])
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some(V2Pair => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  if (allV2PairsWithLiquidity) {
    console.log('V2PAIRS LOADED') //TODO -remove
  }

  const userViperswapLPTokens = [
    {
      primary: 'ONE',
      secondary: 'USDC',
      amount: '420.69'
    },
    {
      primary: 'ONE',
      secondary: 'DAI',
      amount: '69.420'
    }
  ]

  const userSushiswapLPTokens = [
    {
      primary: 'ONE',
      secondary: 'USDC',
      amount: '111.11'
    },
    {
      primary: 'ONE',
      secondary: 'DAI',
      amount: '222.22'
    }
  ]

  useEffect(() => {
    setSelectedLPUnlocked(false) //TODO - Corey: When an LP Pair is selected, check allowance and appropriately set this
  }, [selectedLPPair])

  const onUnlock = () => {
    setUnlocking(true) //TODO - Corey: Begin unlock transaction, when completed use callback to set state to reflect unlock
    console.log('unlock')
  }

  const onMigrate = () => {
    setMigrating(true) //TODO - Corey: Begin migrate transaction, when completed use callback to set state to reflect migrate
    console.log('migrate')
  }

  return (
    <>
      <PageWrapper>
        <VoteCard>
          <CardBGImage />
          <CardNoise />
          <CardSection>
            <AutoColumn gap="md">
              <RowBetween>
                <TYPE.white fontWeight={600}>Migrate Liquidity</TYPE.white>
              </RowBetween>
              <RowBetween>
                <TYPE.white fontSize={14}>
                  {`Migrate your LP tokens to FATExDEX LP tokens with just a couple of clicks.`}
                </TYPE.white>
              </RowBetween>
              <ExternalLink
                style={{ color: 'white', textDecoration: 'underline' }}
                target="_blank"
                href="https://uniswap.org/docs/v2/core-concepts/pools/"
              >
                <TYPE.white fontSize={14}>Read more about migrating liquidity</TYPE.white>
              </ExternalLink>
            </AutoColumn>
          </CardSection>
          <CardBGImage />
          <CardNoise />
        </VoteCard>
        <AutoColumn gap="lg" justify="center">
          <AutoColumn gap="lg" style={{ width: '100%' }}>
            <TitleRow style={{ marginTop: '1rem' }} padding={'0'}>
              <HideSmall>
                <TYPE.mediumHeader style={{ marginTop: '0.5rem', justifySelf: 'flex-start' }}>
                  Liquidity Source
                </TYPE.mediumHeader>
              </HideSmall>
            </TitleRow>
            <SwapTabs>
              <SwapTab onClick={() => setSelectedSwap(0)} selected={selectedSwap === 0}>
                {swapNames[0]}
              </SwapTab>
              <SwapTab onClick={() => setSelectedSwap(1)} selected={selectedSwap === 1}>
                {swapNames[1]}
              </SwapTab>
            </SwapTabs>
            <TitleRow style={{ marginTop: '1rem' }} padding={'0'}>
              <HideSmall>
                <TYPE.mediumHeader style={{ marginTop: '0.5rem', justifySelf: 'flex-start' }}>
                  Your {swapNames[selectedSwap]} Liquidity
                </TYPE.mediumHeader>
              </HideSmall>
            </TitleRow>

            {!account ? (
              <Card padding="15px 40px">
                <TYPE.body color={theme.text3} textAlign="center">
                  Connect to a wallet to view your LP tokens.
                </TYPE.body>
                <WalletConnectWrapper>
                  <Web3Status />
                </WalletConnectWrapper>
              </Card>
            ) : v2IsLoading ? (
              <EmptyProposals>
                <TYPE.body color={theme.text3} textAlign="center">
                  <Dots>Loading</Dots>
                </TYPE.body>
              </EmptyProposals>
            ) : /*allV2PairsWithLiquidity?.length > 0*/ userViperswapLPTokens.length > 0 ? (
              <LPPairsWrapper>
                {(selectedSwap === 0 ? userViperswapLPTokens : userSushiswapLPTokens).map((pair, index) => (
                  <ViperswapLPPair
                    key={index}
                    selected={selectedLPPair === index}
                    onClick={() => setSelectedLPPair(index)}
                  >
                    <PairIcons>
                      {/* TODO - Corey: when you have the currency objects, use them here for the icons */}
                      <DoubleCurrencyLogo currency0={undefined} currency1={undefined} size={24} />
                    </PairIcons>
                    <PairName>
                      {pair.primary}-{pair.secondary}
                    </PairName>
                    <PairAmount>{pair.amount}</PairAmount>
                  </ViperswapLPPair>
                ))}
              </LPPairsWrapper>
            ) : (
              <EmptyProposals>
                <TYPE.body color={theme.text3} textAlign="center">
                  No liquidity found.
                </TYPE.body>
              </EmptyProposals>
            )}
            {userViperswapLPTokens.length > 0 && selectedLPPair !== null && (
              <SubmitMigration>
                <MigrationSummary>
                  <MigrationLPName>
                    {userViperswapLPTokens[selectedLPPair].primary}-{userViperswapLPTokens[selectedLPPair].secondary}
                  </MigrationLPName>
                  <MigrationAmount>{userViperswapLPTokens[selectedLPPair].amount}</MigrationAmount>
                </MigrationSummary>
                <MigrateButtonWrapper>
                  {selectedLPUnlocked ? (
                    migrating ? (
                      <MigrateButton disabled={true}>Migrating...</MigrateButton>
                    ) : (
                      <MigrateButton onClick={() => onMigrate()}>
                        Migrate {userViperswapLPTokens[selectedLPPair].primary}-
                        {userViperswapLPTokens[selectedLPPair].secondary}
                      </MigrateButton>
                    )
                  ) : unlocking ? (
                    <MigrateButton disabled={true}>Unlocking...</MigrateButton>
                  ) : (
                    <MigrateButton onClick={() => onUnlock()}>
                      Unlock {userViperswapLPTokens[selectedLPPair].primary}-
                      {userViperswapLPTokens[selectedLPPair].secondary}
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
