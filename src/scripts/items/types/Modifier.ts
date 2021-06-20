/*
 * Charges have  spell + level + charges + maxCharges
 * Chance to cast have spell + level + chance
 * Others have value + param (optional)
 */
export interface Modifier {
  id: number;
  stat: string;
  priority: number;
  value?: number;
  param?: number;
  spell?: number;
  level?: number;
  charges?: number;
  maxCharges?: number;
  chance?: number;
}
