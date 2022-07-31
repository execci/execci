import { ApolloError, useMutation } from '@apollo/client';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, ProgressBar } from 'react-native-paper';
import { useColor } from 'src/client/colors';
import { SuccessNotice } from 'src/client/components/SuccessNotice';
import Text from 'src/client/components/Text';
import { ErrorNotice } from 'src/client/error/ErrorNotice';
import { SEND_PASSWORD_RESET_EMAIL_MUTATION } from 'src/client/screens/LoginScreen';
import {
  SendPasswordResetEmail,
  SendPasswordResetEmailVariables,
} from 'src/client/screens/__generated__/SendPasswordResetEmail';
import { ResetPasswordLinkDetailsQuery_resetPasswordLinkDetails } from './__generated__/ResetPasswordLinkDetailsQuery';

type Props = {
  details:
    | ResetPasswordLinkDetailsQuery_resetPasswordLinkDetails
    | null
    | undefined;
  loading: boolean;
  error: ApolloError | undefined;
};

export default function PasswordResetLinkDetails({
  details,
  error,
  loading,
}: Props) {
  const errorColor = useColor('errorButtonBackground');
  const [
    runSendPasswordResetEmailMutation,
    sendPasswordResetEmailMutationState,
  ] = useMutation<SendPasswordResetEmail, SendPasswordResetEmailVariables>(
    SEND_PASSWORD_RESET_EMAIL_MUTATION,
  );
  const {
    data: sendPasswordResetEmailData,
    loading: sendPasswordResetEmailLoading,
    error: sendPasswordResetEmailError,
  } = sendPasswordResetEmailMutationState;

  if (loading) {
    return <ProgressBar indeterminate={true} visible={true} />;
  }
  if (error || details == null) {
    return (
      <ErrorNotice
        error={error}
        manualChange="Reset password"
        whenTryingToDoWhat="process this password reset link"
      />
    );
  }
  const { emailAddress, expiration_time, is_valid } = details;
  if (!is_valid) {
    return (
      <ErrorNotice
        error={
          new ApolloError({
            errorMessage:
              'This password reset link is invalid. Please go back and try again.',
          })
        }
        manualChange="Reset password"
        whenTryingToDoWhat="process this password reset link"
      />
    );
  }
  const expirationTime = new Date(expiration_time);
  const now = new Date();
  if (expirationTime < now) {
    return (
      <View style={[styles.container, { backgroundColor: errorColor }]}>
        <Text>
          This link is expired. Please use the button to request a new password
          reset link.
        </Text>
        <View style={{ margin: 16 }}>
          <Button
            disabled={sendPasswordResetEmailLoading}
            loading={sendPasswordResetEmailLoading}
            mode="contained"
            onPress={sendPasswordResetEmail}
          >
            Forgot Password
          </Button>
        </View>
        <SuccessNotice
          text={sendPasswordResetEmailData?.sendPasswordResetEmail}
        />
        <ErrorNotice
          error={sendPasswordResetEmailError}
          manualChange={'create a password reset link for ' + emailAddress}
          whenTryingToDoWhat="send you a password reset email"
        />
      </View>
    );
  }
  const msRemaining = expirationTime.getTime() - now.getTime();
  const secRemaining = msRemaining / 1000;
  const minRemaining = Math.max(Math.floor(secRemaining / 60), 1);

  return (
    <View style={[styles.container]}>
      <Text>
        Please enter a new password for {emailAddress}. This link will expire in{' '}
        {minRemaining} minute{minRemaining !== 1 ? 's' : ''}.
      </Text>
    </View>
  );

  async function sendPasswordResetEmail(): Promise<void> {
    await runSendPasswordResetEmailMutation({
      variables: { emailAddress },
    });
  }
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    borderRadius: 10,
    marginTop: 20,
    padding: 10,
  },
});
