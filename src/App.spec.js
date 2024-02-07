vi.mock('@/views/activation/Activation.vue')
vi.mock('@/views/user/User.vue')
vi.mock('@/views/home/components/UserList.vue')

import { render, router, screen, waitFor } from 'test/helper'
import { describe, expect } from 'vitest'
import App from './App.vue'

import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

let logoutCounter = 0

const server = setupServer(
  http.post('/api/v1/auth', () => {
    return HttpResponse.json({ id: 1, username: 'user1', email: 'user1@mail.com', image: null })
  }),
  http.post('/api/v1/logout', () => {
    logoutCounter += 1
    return HttpResponse.json({})
  })
)

beforeEach(() => {
  logoutCounter = 0
  server.resetHandlers()
})

beforeAll(() => server.listen())

afterAll(() => server.close())

const setup = async (path) => {
  router.push(path)
  await router.isReady()
  return render(App)
}

describe('Routing', () => {
  describe.each([
    { path: '/', pageId: 'home-page' },
    { path: '/signup', pageId: 'signup-page' },
    { path: '/activation/123', pageId: 'activation-page' },
    { path: '/activation/456', pageId: 'activation-page' },
    { path: '/password-reset/request', pageId: 'password-reset-request-page' },
    { path: '/password-reset/set', pageId: 'password-reset-set-page' },
    { path: '/user/1', pageId: 'user-page' },
    { path: '/user/2', pageId: 'user-page' },
    { path: '/login', pageId: 'login-page' }
  ])('when path is $path', ({ path, pageId }) => {
    it(`displays ${pageId}`, async () => {
      await setup(path)
      const page = screen.queryByTestId(pageId)
      expect(page).toBeInTheDocument()
    })
  })

  describe.each([
    { initialPath: '/', clickingTo: 'link-signup-page', visiblePage: 'signup-page' },
    { initialPath: '/signup', clickingTo: 'link-home-page', visiblePage: 'home-page' },
    { initialPath: '/', clickingTo: 'link-login-page', visiblePage: 'login-page' }
  ])('when path is $initialPath', ({ initialPath, clickingTo, visiblePage }) => {
    describe(`when user clicks ${clickingTo}`, () => {
      it(`displays ${visiblePage}`, async () => {
        const { user } = await setup(initialPath)
        const link = screen.queryByTestId(clickingTo)
        await user.click(link)
        await waitFor(() => {
          expect(screen.queryByTestId(visiblePage)).toBeInTheDocument()
        })
      })
    })
  })

  describe('when user is at the home page', () => {
    describe('when user clicks the username in the users list', () => {
      it('displays user page', async () => {
        const { user } = await setup('/')
        const link = await screen.findByText('test user')
        await user.click(link)
        await waitFor(() => {
          expect(screen.queryByTestId('user-page')).toBeInTheDocument()
        })
      })
    })
  })

  describe('when user is at login page', () => {
    describe('when user clicks forgot passord link', () => {
      it('displays password reset request page page', async () => {
        const { user } = await setup('/login')
        const link = await screen.findByText('Forgot password?')
        await user.click(link)
        await waitFor(() => {
          expect(screen.queryByTestId('password-reset-request-page')).toBeInTheDocument()
        })
      })
    })
  })

  describe('when logging successful', () => {
    const setupLoggedIn = async () => {
      const { user } = await setup('/login')
      await user.type(screen.getByLabelText('E-mail'), 'user1@mail.com')
      await user.type(screen.getByLabelText('Password'), 'P4ssword')
      await user.click(screen.getByRole('button', { name: 'Login' }))
      await screen.findByTestId('home-page')
      return { user }
    }

    it('navigates to home page', async () => {
      const { user } = await setup('/login')
      await user.type(screen.getByLabelText('E-mail'), 'user1@mail.com')
      await user.type(screen.getByLabelText('Password'), 'P4ssword')
      await user.click(screen.getByRole('button', { name: 'Login' }))
      await waitFor(() => {
        expect(screen.queryByTestId('home-page')).toBeInTheDocument()
      })
    })

    it('hides Login and Sign Up links', async () => {
      await setupLoggedIn()
      expect(screen.queryByTestId('link-signup-page')).not.toBeInTheDocument()
      expect(screen.queryByTestId('link-login-page')).not.toBeInTheDocument()
    })

    describe('when user clicks my profile', () => {
      it('displays user page', async () => {
        const { user } = await setupLoggedIn()
        await user.click(screen.queryByTestId('link-my-profile'))
        await screen.findByTestId('user-page')
        expect(router.currentRoute.value.path).toBe('/user/1')
      })
    })

    it('stores logged in state in local storage', async () => {
      await setupLoggedIn()
      const state = JSON.parse(localStorage.getItem('auth'))
      expect(state.id).toBe(1)
      expect(state.username).toBe('user1')
    })
  })

  describe('when local storage has auth data', () => {
    beforeEach(() => {
      localStorage.setItem(
        'auth',
        JSON.stringify({
          id: 1,
          username: 'user1',
          email: 'user1@mail.com'
        })
      )
    })
    it('displays logged in layout', async () => {
      await setup('/')
      expect(screen.queryByTestId('link-signup-page')).not.toBeInTheDocument()
      expect(screen.queryByTestId('link-login-page')).not.toBeInTheDocument()
      expect(screen.queryByTestId('link-my-profile')).toBeInTheDocument()
    })

    describe('when user clicks logout', () => {
      it('displays login and signup links', async () => {
        const { user } = await setup('/')
        await user.click(screen.queryByTestId('link-logout'))
        expect(screen.queryByTestId('link-signup-page')).toBeInTheDocument()
        expect(screen.queryByTestId('link-login-page')).toBeInTheDocument()
        expect(screen.queryByTestId('link-my-profile')).not.toBeInTheDocument()
      })

      it('sends logout request to server', async () => {
        const { user } = await setup('/')
        await user.click(screen.queryByTestId('link-logout'))
        await waitFor(() => {
          expect(logoutCounter).toBe(1)
        })
      })
    })
  })
})
