import * as React from 'react';
import { Text as ReactNativeText } from 'react-native';
import { useColor } from 'src/client/colors';

export type TextProps = ReactNativeText['props'];

export default function Text(props: TextProps) {
  const { style, ...otherProps } = props;
  const color = useColor('text');

  return <ReactNativeText style={[{ color }, style]} {...otherProps} />;
}
