import { i18n } from '@/locales'
// import { vi } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'
expect.extend(matchers)

vi.resetModules()

afterEach(() => {
  i18n.global.locale = 'en'
})
