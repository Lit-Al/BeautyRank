export const declineNumberOfBalls = (number: number) =>
  number % 10 === 1 && number % 100 !== 11
    ? 'балл'
    : number % 10 >= 2 &&
      number % 10 <= 4 &&
      (number % 100 < 10 || number % 100 >= 20)
    ? 'балла'
    : 'баллов';
