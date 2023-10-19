export type ReactChangeHtmlEvent = React.ChangeEvent<{ value: string }>;

export type DispatchState<T> = React.Dispatch<React.SetStateAction<T>>;

export const onValueChanged = <T>(
  key: keyof T,
  value: ReactChangeHtmlEvent | unknown,
  setFormValue: DispatchState<T>
) =>
  setFormValue((pv: T) => ({
    ...pv,
    [key]: (value as ReactChangeHtmlEvent)?.target?.value ?? value,
  }));
