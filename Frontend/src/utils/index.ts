export const jsonizeData = (piece: string) =>
  JSON.parse(piece.replace(/\n/g, ""));
