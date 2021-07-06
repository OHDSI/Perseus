import { ValidationService } from '@services/validation.service';

describe('ValidationService', () => {
  it('should validate Time', () => {
    const time = '12:10:01'
    const notTime = 'test'
    const service = new ValidationService()

    expect(service.validateInput('time', time)).toBe('')
    expect(service.validateInput('time', notTime)).toBe('Format must be HH:MM:SS')
  })
})
