vi.mock('@/lib/http')

import { describe, expect } from 'vitest'
import { signUp } from './api'
import http from '@/lib/http'

describe('signUp', () => {
  it('calls axios with expected params', () => {
    const body = { key: 'value' }
    signUp(body)
    expect(http.post).toHaveBeenCalledWith('/api/v1/users', body)
  })
})
