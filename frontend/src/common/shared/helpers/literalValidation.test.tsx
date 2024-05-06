import { literalValidation } from './literalValidation';

describe('literalValidation', () => {
  it('возвращает true для строки с небуквенными символами', () => {
    expect(literalValidation('test123')).toBe(true);
  });

  it('возвращает false для строки с только буквенными символами', () => {
    expect(literalValidation('test')).toBe(false);
  });

  it('возвращает false для пустой строки', () => {
    expect(literalValidation('')).toBe(false);
  });

  it('возвращает true для строки с пробелами', () => {
    expect(literalValidation('test string')).toBe(true);
  });
});
