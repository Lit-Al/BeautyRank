import { declineNumberOfBalls } from './declineNumberOfBalls'; // импортируйте вашу функцию из файла, где она определена

describe('declineNumberOfBalls', () => {
    it('возвращает "балл" для 1, 21, 31, etc.', () => {
      expect(declineNumberOfBalls(1)).toBe('балл');
      expect(declineNumberOfBalls(21)).toBe('балл');
      expect(declineNumberOfBalls(31)).toBe('балл');
    });
  
    it('возвращает "балла" для 2-4, 22-24, 32-34, etc.', () => {
      expect(declineNumberOfBalls(2)).toBe('балла');
      expect(declineNumberOfBalls(3)).toBe('балла');
      expect(declineNumberOfBalls(4)).toBe('балла');
      expect(declineNumberOfBalls(22)).toBe('балла');
      expect(declineNumberOfBalls(23)).toBe('балла');
      expect(declineNumberOfBalls(24)).toBe('балла');
    });
  
    it('возвращает "баллов" для 0, 5-20, 25-30, 35-40, etc.', () => {
      expect(declineNumberOfBalls(0)).toBe('баллов');
      expect(declineNumberOfBalls(5)).toBe('баллов');
      expect(declineNumberOfBalls(10)).toBe('баллов');
      expect(declineNumberOfBalls(15)).toBe('баллов');
      expect(declineNumberOfBalls(20)).toBe('баллов');
      expect(declineNumberOfBalls(25)).toBe('баллов');
      expect(declineNumberOfBalls(30)).toBe('баллов');
      expect(declineNumberOfBalls(35)).toBe('баллов');
    });
  });