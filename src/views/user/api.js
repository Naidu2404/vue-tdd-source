import http from '@/lib/http'

export const getUserById = (id) => {
  return http.patch(`/api/v1/users/${id}`)
}
