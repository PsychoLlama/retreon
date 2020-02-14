export type ActionConstant = string | symbol;

// Return the type of the parameter, or void if none is accepted. Effects
// can't take more than one argument.
export type InputType<Effect extends Function> = Effect extends (
  input: infer Input,
) => any
  ? Input
  : void;

export type Action<Payload> = {
  type: ActionConstant;
  payload?: Payload;
  error?: boolean;
};

export interface ActionTypeCoercible {
  [Symbol.toPrimitive](hint: string): ActionConstant;
  toString(): ActionConstant;
}

export interface CoercibleAction<Args extends Array<any>, RetVal>
  extends ActionTypeCoercible {
  (...args: Args): RetVal;
}
