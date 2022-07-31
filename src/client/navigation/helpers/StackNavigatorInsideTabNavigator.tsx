import * as React from 'react';
import { View } from 'react-native';
import type { ChildrenPropsType } from 'src/client/utils/ChildrenPropsType';

/**
 * This is a workaround for an issue where screens inside a stack navigator
 * that is inside a tab navigator render a blank screen on every render except
 * the first render.
 *
 * Workaround from: https://github.com/software-mansion/react-native-screens/issues/1197#issuecomment-993682256
 */
export default function StackNavigatorInsideTabNavigator({
  children,
}: ChildrenPropsType): React.ReactElement {
  return (
    <View collapsable={false} style={{ flex: 1 }}>
      {children}
    </View>
  );
}
