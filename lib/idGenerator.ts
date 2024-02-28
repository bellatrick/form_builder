export function idGenerator(): string {
  const randomNumber = Math.floor(Math.random() * 10000) + 1;
  return randomNumber.toString();
}

