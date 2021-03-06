import * as React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'

import { ApplicationState } from 'types/schema'

import {
  ALTO,
  CORNFLOWER,
  RIVERBED,
  DUSTYGRAY,
  SEAFOAM_LIGHT,
} from 'pages/shared/Colors'
import { BarGraph } from 'pages/shared/graphs/BarGraph'
import { Icon } from 'pages/shared/Icon'

import { lumensToStroops, stroopsToLumens } from 'helpers/lumens'

import {
  getNumberOfOpenHostChannels,
  getTotalChannelBalance,
} from 'state/channels'

const AvailableWrapper = styled.div`
  display: flex;
`
const BalanceContainer = styled.div`
  border-right: ${ALTO} 1px solid;
  padding-right: 50px;
  width: auto;
`
const Balance = styled.div`
  color: ${RIVERBED};
  font-family: 'Nitti Grotesk';
  font-size: 36px;
  font-weight: 700;
`
const GraphContainer = styled.div`
  flex-grow: 2;
  padding-left: 50px;
`
const Reserve = styled.div`
  color: ${DUSTYGRAY};
  font-family: 'Nitti Grotesk';
  font-size: 14px;
  font-weight: 700;
`
const LoadingIcon = styled(Icon)`
  font-size: 24px;
`

interface Props {
  channelBalance: number
  reserve: number
  walletBalance: number
}

export class WalletBalance extends React.Component<Props, {}> {
  public constructor(props: Props) {
    super(props)
  }

  private total() {
    return (
      this.props.walletBalance + this.props.channelBalance + this.props.reserve
    )
  }

  public render() {
    return (
      <AvailableWrapper>
        <BalanceContainer>
          <Balance>
            {stroopsToLumens(this.total(), { short: true })} XLM{' '}
            {this.total() === 0 && (
              <LoadingIcon className="fa-pulse" name="spinner" />
            )}
          </Balance>
          {!!this.props.reserve && (
            <Reserve>
              {stroopsToLumens(
                this.props.walletBalance + this.props.channelBalance,
                { short: true }
              )}{' '}
              XLM Available +{' '}
              {stroopsToLumens(this.props.reserve, { short: true })} XLM Reserve
            </Reserve>
          )}
        </BalanceContainer>
        <GraphContainer>
          <BarGraph
            leftLabel="Account"
            leftTooltip="This is the money that is<br>
              available in your wallet<br>
              account for spending in<br>
              an on-network transaction."
            leftAmount={this.props.walletBalance}
            rightAmount={this.props.channelBalance}
            rightLabel="Channels"
            rightTooltip="This is the total amount<br>
            that you have available<br>
            for spending across all<br>
            of your payment channels."
            leftColor={SEAFOAM_LIGHT}
            rightColor={CORNFLOWER}
          />
        </GraphContainer>
      </AvailableWrapper>
    )
  }
}

const mapStateToProps = (state: ApplicationState) => {
  const walletAccountExists = state.wallet.Balance !== 0
  const walletReserve = walletAccountExists ? lumensToStroops(1) : 0

  return {
    reserve:
      getNumberOfOpenHostChannels(state) * lumensToStroops(5.08) +
      walletReserve,
    walletBalance: state.wallet.Balance - walletReserve,
    channelBalance: getTotalChannelBalance(state),
  }
}
export const ConnectedWalletBalance = connect(
  mapStateToProps,
  {}
)(WalletBalance)
