import { JSXInternal } from "preact/src/jsx";

export function numberInputChangeHandler(callback: (value: number) => void) {
  return function (event: JSXInternal.TargetedEvent<HTMLInputElement>) {
    callback(Number((event.target as HTMLInputElement).value));
  };
}
