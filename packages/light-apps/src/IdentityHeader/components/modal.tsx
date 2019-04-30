
import { Dropdown, FadedText, Icon, Input, Margin, Modal, Stacked, StackedHorizontal, StyledLinkButton, WithSpaceAround, WithSpaceBetween } from '@substrate/ui-components';

// Modal components
const renderBackupConfirmationModal = (
    backupCurrentAccount: () => void,
    backupModalOpen: boolean,
    closeBackupModal: () => void,
    inputPassword: string,
    onChangeInputPassword: (event: React.ChangeEvent<HTMLInputElement>) => void,
    openBackupModal: () => void
) => {
    return (
        <Modal closeOnDimmerClick closeOnEscape open={backupModalOpen} trigger={<Dropdown.Item icon='arrow alternate circle down' onClick={openBackupModal} text='Backup Account' />}>
            <WithSpaceAround>
                <Modal.SubHeader> Please Confirm You Want to Backup this Account </Modal.SubHeader>
                <FadedText>By pressing confirm you will be downloading a JSON keyfile that can later be used to unlock your account. </FadedText>
                <Modal.Actions>
                    <Stacked>
                        <FadedText> Please encrypt your account first with the account's password. </FadedText>
                        <Input onChange={onChangeInputPassword} type='password' value={inputPassword} />
                        <StackedHorizontal>
                            <WithSpaceBetween>
                                <StyledLinkButton onClick={closeBackupModal}><Icon name='remove' color='red' /> <FadedText>Cancel</FadedText></StyledLinkButton>
                                <StyledLinkButton onClick={backupCurrentAccount}><Icon name='checkmark' color='green' /> <FadedText>Confirm Backup</FadedText></StyledLinkButton>
                            </WithSpaceBetween>
                        </StackedHorizontal>
                    </Stacked>
                </Modal.Actions>
            </WithSpaceAround>
        </Modal>
    );
};

const renderForgetConfirmationModal = (
    closeForgetModal: () => void,
    forgetCurrentAccount: () => void,
    forgetModalOpen: boolean,
    openForgetModal: () => void
) => {
    return (
        <Modal closeOnDimmerClick={true} closeOnEscape={true} open={forgetModalOpen} trigger={<Dropdown.Item icon='trash' onClick={openForgetModal} text='Forget Account' />}>
            <WithSpaceAround>
                <Stacked>
                    <Modal.SubHeader> Please Confirm You Want to Forget this Account </Modal.SubHeader>
                    <b>By pressing confirm, you will be removing this account from your Saved Accounts. </b>
                    <Margin top />
                    <FadedText> You can restore this later from your mnemonic phrase or json backup file. </FadedText>
                    <Modal.Actions>
                        <StackedHorizontal>
                            <StyledLinkButton onClick={closeForgetModal}><Icon name='remove' color='red' /> <FadedText> Cancel </FadedText> </StyledLinkButton>
                            <StyledLinkButton onClick={forgetCurrentAccount}><Icon name='checkmark' color='green' /> <FadedText> Confirm Forget </FadedText> </StyledLinkButton>
                        </StackedHorizontal>
                    </Modal.Actions>
                </Stacked>
            </WithSpaceAround>
        </Modal>
    );
};

const renderRenameModal = (
    closeRenameModal: () => void,
    inputName: string,
    onChangeInputName: (event: React.ChangeEvent<HTMLInputElement>) => void,
    openRenameModal: () => void,
    renameCurrentAccount: () => void,
    renameModalOpen: boolean
) => {
    return (
        <Modal closeOnDimmerClick closeOnEscape open={renameModalOpen} trigger={<Dropdown.Item icon='edit' onClick={openRenameModal} text='Rename Account' />}>
            <WithSpaceAround>
                <Stacked>
                    <Modal.SubHeader>Rename account</Modal.SubHeader>
                    <FadedText>Please enter the new name of the account.</FadedText>
                    <Modal.Actions>
                        <Stacked>
                            <FadedText>Account name</FadedText>
                            <Input onChange={onChangeInputName} type='text' value={inputName} />
                            <StackedHorizontal>
                                <WithSpaceBetween>
                                    <StyledLinkButton onClick={closeRenameModal}><Icon name='remove' color='red' /> <FadedText>Cancel</FadedText></StyledLinkButton>
                                    <StyledLinkButton onClick={renameCurrentAccount}><Icon name='checkmark' color='green' /> <FadedText>Rename</FadedText></StyledLinkButton>
                                </WithSpaceBetween>
                            </StackedHorizontal>
                        </Stacked>
                    </Modal.Actions>
                </Stacked>
            </WithSpaceAround>
        </Modal>
    );
};

export {
    renderBackupConfirmationModal,
    renderForgetConfirmationModal,
    renderRenameModal
};
