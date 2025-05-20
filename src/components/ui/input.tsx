import { clsx } from "clsx";
import * as React from "react";
import { TextInput, TextInputProps } from "react-native";

const Input = React.forwardRef<TextInput, TextInputProps>(
  ({ className, secureTextEntry, ...props }, ref) => {
    return (
      <TextInput
        className={clsx(
          "placeholder:text-muted-foreground dark:bg-input/30 border-input flex h-auto w-full min-w-0 rounded-md border bg-transparent px-3 py-4 text-base shadow-xs outline-none",
          "focus:border-ring focus:ring-ring/50 focus:ring-[3px] focus:border-0",
          className
        )}
        ref={ref}
        {...props}
        onChangeText={props.onChangeText}
        value={props.value}
        secureTextEntry={secureTextEntry}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };

