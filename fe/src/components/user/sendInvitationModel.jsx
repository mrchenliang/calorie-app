import React, { useState } from "react";
import { Modal, Form, Message } from "semantic-ui-react";
import { usePromiseLazy } from "../../utils/index";
import { sendInvite } from "../../actions/user/sendInvite"

export const SendInvitationModel = ({ onClose, onInvitationSent }) => {
  const [friendName, setFriendName] = useState('');
  const [friendEmail, setFriendEmail] = useState('');
  const [isFriendNameError, setIsFriendNameError] = useState(false);
  const [isFriendEmailError, setIsFriendEmailError] = useState(false);

  const {
    execute: wrappedCreateInvitation,
    error,
    isLoading,
  } = usePromiseLazy(async () => {
    const invitation = await sendInvite({
      name: friendName,
      email: friendEmail,
    });

    return invitation;
  }, []);

  const handleSubmit = async () => {
    const friendNameError = friendName === undefined || friendName === "";
    if (friendNameError) setIsFriendNameError(true);

    const friendEmailError = friendEmail === undefined || !friendEmail.includes('@');
    if (friendEmailError) setIsFriendEmailError(true);

    if (!friendNameError && !friendEmailError) {
      const { result: invitation } = await wrappedCreateInvitation();

      if (invitation && onInvitationSent) {
        await onInvitationSent(invitation);
      }
    }
  };

  return (
    <Modal closeIcon size="small" onClose={() => onClose(false)} open>
      <Modal.Header>Invite a Friend</Modal.Header>
      <Modal.Content>
        {error && (
          <Message color="red">
            Failed to send invitation. {JSON.stringify(error)}
          </Message>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Input
            label="Friend's Name"
            placeholder="Name"
            value={friendName}
            onChange={(e) => {
              setIsFriendNameError(false);
              setFriendName(e.target.value)
            }}
            error={
              isFriendNameError && {
                content: "Please enter your friend's name",
                pointing: "below",
              }
            }
          />
          <Form.Input
            label="Friend's Email"
            placeholder="Email"
            type="email"
            value={friendEmail}
            onChange={(e) => {
              setIsFriendEmailError(false);
              setFriendEmail(e.target.value)
            }}
            error={
              isFriendEmailError && {
                content: "Please enter a valid email address",
                pointing: "below",
              }
            }
          />
          <Form.Button primary type="submit" loading={isLoading}>
            Send Invitation
          </Form.Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
};