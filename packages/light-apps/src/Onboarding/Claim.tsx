// Copyright 2018-2019 @paritytech/substrate-light-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import QrSigner from '@parity/qr-signer';
import accounts from '@polkadot/ui-keyring/observable/accounts';
import { stringToHex } from '@polkadot/util';
import { Option, H160 } from '@polkadot/types';
import { BalanceOf, EthereumAddress } from '@polkadot/types/interfaces';
import { AppContext } from '@substrate/ui-common';
import { BoldText, CopyButton, ErrorText, FadedText, FlexSegment, Header, Loading, Margin, Message, Modal, SubHeader, StyledNavButton, StyledLinkButton, Stacked, StackedHorizontal, TextArea } from '@substrate/ui-components';
import { Either, left, right } from 'fp-ts/lib/Either';
import { fromNullable } from 'fp-ts/lib/Option';
import React, { useContext, useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { map, take } from 'rxjs/operators';
import Card from 'semantic-ui-react/dist/commonjs/views/Card';

interface Props extends RouteComponentProps {}

interface EthereumAddressPayload {
  address: string;
  chainId: number;
}

const validateEthereumAddress = (addr: string): Either<string, EthereumAddress> => {
  if (!addr || addr.length !== 42) {
    return left('Invalid Ethereum address.');
  } else {
    const eAddress = new H160(addr);
    return right(eAddress);
  }
};

export function Claim (props: Props) {
  const { history } = props;
  const { api } = useContext(AppContext);

  const [claim, setClaim] = useState();
  const [claimError, setClaimError] = useState();
  const [ethereumAddress, setEthereumAddress] = useState<EthereumAddress>();
  const [messageToSign, setMessageToSign] = useState<string>('');
  const [renderQr, setRenderQr] = useState<boolean>(true);
  const [scanSignature, setScanSignature] = useState<boolean>(false);
  const [signature, setSignature] = useState();

  useEffect(() => {
    const accountsSub = accounts.subject.pipe(map(Object.values)).subscribe(values => {
      const stash = values.filter(value =>
        fromNullable(value.json.meta.tags)
          .map(tags => tags.includes('stash'))
          .getOrElse(undefined)
      )[0];

      const _messageToSign = fromNullable(stash)
                            .map(stash => `Pay KSMs to the Kusama account: ${stash.json.address}`)
                            .getOrElse('');

      setMessageToSign(_messageToSign);
    });

    return () => accountsSub.unsubscribe();
  }, []);

  const handleSubmitClaim = (event: React.MouseEvent<HTMLElement>) => {
    if (!ethereumAddress) {
      setClaimError('Please set your Ethereum address to claim.');
      return;
    }

    const claimsSub = api.query.claims.claims<Option<BalanceOf>>(ethereumAddress.toHex())
      .pipe(take(1)).subscribe((claim) => {
        claim.isSome
          ? setClaim(claim.unwrap())
          : setClaimError('There is no claim associated with the provided Ethereum address. Please make sure you signed the above message with the same account as when you purchased your KSM and try again. If this problem persists, please raise an issue at https://riot.im/app/#/room/#KSMAClaims:polkadot.builders');

        claimsSub.unsubscribe();
      });
  };

  const handleScanSignature = (signature: any) => {
    setSignature(signature);
  };

  const handleSetEthereumAddress = (data: EthereumAddressPayload) => {
    if (!data) {
      setClaimError('invalid payload.');
      return;
    } else if (data.chainId !== 1) {
      setClaimError('You can only sign a claims transaction on the Ethereum Mainnet.');
      return;
    }

    const validate = validateEthereumAddress(data.address);

    validate.fold(
      (err: string) => setClaimError(err),
      (validAddress: EthereumAddress) => {
        setEthereumAddress(validAddress);
        setClaimError(undefined);
      }
    );
  };

  const renderCheckingClaim = () => {
    return (
      <Stacked>
        {
          claim
            ? <FadedText>Got claim!</FadedText>
            : <StackedHorizontal><FadedText>Checking claim... </FadedText><Loading active inline /></StackedHorizontal>
        }
      </Stacked>
    );
  };

  const renderStartClaim = () => {
    return (
      <React.Fragment>
        <StyledLinkButton onClick={() => setRenderQr(!renderQr)}>{renderQr ? 'Raw' : 'QR'} </StyledLinkButton>
          {
            renderQr
              ? renderWithQr()
              : renderWithRaw()
          }
          <ErrorText>{ claimError }</ErrorText>
      </React.Fragment>
    );
  };

  const renderWithRaw = () => {
    return (
      <Card.Group itemsPerRow={2} stackable>
        <Card raised>
          <Card.Header><Header>Sign Eth Transaction</Header></Card.Header>
          <Card.Content>
            <SubHeader>Copy the below string and sign an Ethereum transaction with the account you used during the pre-sale.</SubHeader>
            <Margin top />
            <FlexSegment width={'100%'}>
              {
                messageToSign && (
                    <React.Fragment>
                      <BoldText>{messageToSign}</BoldText>
                      <CopyButton value={messageToSign} />
                    </React.Fragment>
                  )
              }
            </FlexSegment>
          </Card.Content>
        </Card>
        <Card>
          <Card.Header><Header>Transaction Signature</Header></Card.Header>
            <Card.Content>
              <SubHeader>Paste the resulting signature object from the above transaction below:</SubHeader>
              <TextArea />
            </Card.Content>
        </Card>
      </Card.Group>
    );
  };

  const renderWithQr = () => {
    console.log('message to sign => ', messageToSign);
    console.log('address => ', ethereumAddress);
    return (
      <Card.Content centered>
        <Stacked>
          {
            !ethereumAddress
              ? <Stacked>
                  <FadedText> Scan your Ethereum account address below to unlock it. </FadedText>
                  <QrSigner scan={true} onScan={handleSetEthereumAddress} />
                </Stacked>
              : <React.Fragment>
                {
                  messageToSign &&
                    <React.Fragment>
                      <Message floating>
                        <FadedText>Scan the QR Code below to sign the following message.</FadedText>
                        <BoldText>{messageToSign}</BoldText>
                      </Message>
                      {
                        scanSignature
                          ? (<QrSigner onScan={handleScanSignature} scan={true} size={300}/>)
                          : (<QrSigner account={ethereumAddress.toHex()} data={stringToHex(messageToSign)} scan={false} size={300} />)
                      }
                    </React.Fragment>
                }
                </React.Fragment>
          }
          <StyledLinkButton onClick={() => setScanSignature(!scanSignature)}>{ scanSignature ? 'Show QR' : 'Scan Signature' }</StyledLinkButton>
        </Stacked>
      </Card.Content>
    );
  };

  return (
    <React.Fragment>
      <Modal.Content>
        {
          signature
            ? renderCheckingClaim()
            : renderStartClaim()
        }
      </Modal.Content>
      <Modal.Actions>
        <StackedHorizontal justifyContent='space-around'>
          <StyledLinkButton onClick={() => history.push('/onboarding/bond')}>Skip</StyledLinkButton>
          <StyledNavButton onClick={handleSubmitClaim}>Next</StyledNavButton>
        </StackedHorizontal>
      </Modal.Actions>
    </React.Fragment>
  );
}
