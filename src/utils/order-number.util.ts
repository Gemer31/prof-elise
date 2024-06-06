export function generateRandomNumber(chars: 6 | 9): number {
  return Math.floor(Math.random() * (chars === 6 ? 1000000 : 1000000000));
}