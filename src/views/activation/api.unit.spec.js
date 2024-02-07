vi.mock('@/lib/http')

import { describe, expect } from 'vitest'
import { activate } from './api'
import http from '@/lib/http'

describe('activate', () => {
  it('calls axios with expected params', () => {
    activate('123')
    expect(http.patch).toHaveBeenCalledWith('/api/v1/users/123/active')
  })
})
