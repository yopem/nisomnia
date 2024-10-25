export function getRandomNumber(min = 5, max = 10): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}
