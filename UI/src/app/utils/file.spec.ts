import { removeExtension } from '@utils/file'

describe('File util', () => {
  it('should remove extension from scan report', () => {
    const sourseName = removeExtension('mdcd_native_test.xlsx')
    expect(sourseName).toBe('mdcd_native_test')
  })
})
