export interface Position {
  // Page index within the section
  page: number;
  // More than one row allows duplicates of the same item on different rows
  rows: number[];
  // More than one column allows duplicates of the same item on different columns
  cols: number[];
}
