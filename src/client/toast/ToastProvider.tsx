import * as React from 'react';
import { LayoutChangeEvent, Linking, StyleSheet, View } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { CenteredOnScreen } from 'src/client/components/CenteredOnScreen';
import { createEmailLink } from 'src/client/email_link/createEmailLink';
import { uploadErrorReport } from 'src/client/error/uploadErrorReport';
import useErrorReport from 'src/client/error/useErrorReport';
import { useStore } from 'src/client/store';
import { ErrorToastStore } from 'src/client/toast/ErrorToastStore';
import ToastStore from 'src/client/toast/ToastStore';
import { ChildrenPropsType } from 'src/client/utils/ChildrenPropsType';
import { uniques } from 'src/shared/utils/uniques';

type ErrorReportState =
  | 'SendingReport'
  | 'NeedsManualSend'
  | 'Sent'
  | 'ThankYou'
  | undefined;

export default function ToastProvider({
  children,
}: ChildrenPropsType): React.ReactElement {
  const toastContext = useStore(ToastStore);
  const { errors } = useStore(ErrorToastStore);
  const errorReport = useErrorReport(errors.map(({ error }) => error));
  const uniqueMessages = uniques(errors.map(({ message }) => message));
  const errorMessage =
    uniqueMessages.length === 0
      ? 'Unknown Error'
      : uniqueMessages.length === 1
      ? uniqueMessages[0]
      : `${uniqueMessages.length} errors`;
  const [errorReportState, setErrorReportState] =
    React.useState<ErrorReportState>();
  const [height, setHeight] = React.useState<number>(0);

  return (
    <>
      {children}
      <CenteredOnScreen>
        <View style={styles.snackbar}>
          <Snackbar
            action={
              toastContext?.undo != null
                ? {
                    label: 'Undo',
                    onPress: toastContext?.undo,
                  }
                : toastContext?.retry != null
                ? {
                    label: 'Retry',
                    onPress: toastContext?.retry,
                  }
                : undefined
            }
            onDismiss={() => {
              ToastStore.update(undefined);
            }}
            onLayout={onLayout}
            visible={toastContext != null}
          >
            {toastContext?.message ?? ''}
          </Snackbar>
        </View>
      </CenteredOnScreen>
      <CenteredOnScreen>
        <View style={[styles.snackbar, { bottom: 80 + 20 + height }]}>
          <Snackbar
            action={
              errorReportState === 'SendingReport'
                ? undefined
                : errorReportState === 'NeedsManualSend'
                ? {
                    label: 'Send',
                    onPress: sendManualReport,
                  }
                : errorReportState === 'Sent'
                ? {
                    label: 'Dimiss',
                    onPress: dismiss,
                  }
                : errorReportState === 'ThankYou'
                ? {
                    label: 'Thank you',
                    onPress: dismiss,
                  }
                : {
                    label: 'Report',
                    onPress: reportError,
                  }
            }
            duration={
              errorReportState === 'Sent' || errorReportState === 'ThankYou'
                ? undefined
                : Infinity
            }
            onDismiss={
              errorReportState === 'Sent' || errorReportState === 'ThankYou'
                ? dismiss
                : () => {
                    // Do nothing
                  }
            }
            visible={!!errors.length || !!errorReportState}
          >
            {errorReportState === 'SendingReport'
              ? 'Sending report...'
              : errorReportState === 'NeedsManualSend'
              ? 'Unable to report automatically. Please press the button to send a pre-written email.'
              : errorReportState === 'Sent'
              ? 'Successfully uploaded error report'
              : errorReportState === 'ThankYou'
              ? 'Thank you'
              : errorMessage}
          </Snackbar>
        </View>
      </CenteredOnScreen>
    </>
  );

  function onLayout(e: LayoutChangeEvent): void {
    setHeight(e.nativeEvent.layout.height);
  }

  async function reportError(): Promise<void> {
    setErrorReportState('SendingReport');
    const { uploadedSuccessfully } = await uploadErrorReport(
      errorReport.rawDebugInfo,
    );
    if (uploadedSuccessfully) {
      ErrorToastStore.update({ errors: [] });
      setErrorReportState('Sent');
    } else {
      setErrorReportState('NeedsManualSend');
    }
  }

  function dismiss(): void {
    ErrorToastStore.update({ errors: [] });
    setErrorReportState(undefined);
  }

  async function sendManualReport(): Promise<void> {
    Linking.openURL(
      createEmailLink({
        body: [`Details: ${errorReport.rawDebugInfo}`],
        emailUser: 'report.an.error',
        subject: `Error Report`,
      }),
    );
    setErrorReportState('ThankYou');
  }
}

const styles = StyleSheet.create({
  snackbar: {
    bottom: 80,
    elevation: 1,
    flex: 1,
    flexDirection: 'column-reverse',
    left: 0,
    minWidth: '100%',
    position: 'absolute',
  },
});
