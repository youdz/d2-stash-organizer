export type Modifier = { stat: string } & (
  | // Charge
  { spell: number; level: number; charges: number; maxCharges: number }
  // Chance to cast
  | { spell: number; level: number; chance: number }
  // Others
  | { value: number; param?: number }
);
