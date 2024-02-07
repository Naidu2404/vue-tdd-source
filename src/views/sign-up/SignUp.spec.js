import { render, screen, waitFor } from 'test/helper'
import SignUp from './SignUp.vue'
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { setupServer } from 'msw/node'
import { HttpResponse, http, delay } from 'msw'
import { i18n } from '@/locales'

let requestBody
let counter = 0

const server = setupServer(
  http.post(
    '/api/v1/users',
    /*handler function*/ async ({ request }) => {
      requestBody = await request.json()
      counter += 1
      return HttpResponse.json({ message: 'user create success' })
    }
  )
)

beforeEach(() => {
  counter = 0
  server.resetHandlers()
})

beforeAll(() => server.listen())
afterAll(() => server.close())

const setup = async () => {
  const { user, result } = render(SignUp)
  const usernameInput = screen.getByLabelText('Username')
  const emailInput = screen.getByLabelText('E-mail')
  const passwordInput = screen.getByLabelText('Password')
  const passwordRepeatInput = screen.getByLabelText('Password Repeat')
  // const usernameInput = screen.getByTestId('username')
  // const emailInput = screen.getByTestId('email')
  // const passwordInput = screen.getByTestId('password')
  // const passwordRepeatInput = screen.getByTestId('passwordRepeat')
  await user.type(usernameInput, 'user1')
  await user.type(emailInput, 'user1@mail.com')
  await user.type(passwordInput, 'P4ssword')
  await user.type(passwordRepeatInput, 'P4ssword')
  const button = screen.getByRole('button', { name: 'Sign Up' })
  // const button = screen.getByTestId('buttonSignUp')

  return {
    ...result,
    user,
    elements: {
      button,
      usernameInput,
      emailInput,
      passwordInput,
      passwordRepeatInput
    }
  }
}

describe('Sign Up', () => {
  it('has Sign Up header', () => {
    render(SignUp)
    const header = screen.getByRole('heading', { name: 'Sign Up' })
    expect(header).toBeInTheDocument()
  })
  it('has username input', () => {
    //we are rendering the whole component and named it as the container
    // const { container } = render(SignUp)
    //we are expecting a query selector(h1,h2,p,input) to be in the document
    // expect(container.querySelector('input')).toBeInTheDocument()

    //we can go for checking the placeholder text usimg the screen
    render(SignUp)
    // expect(screen.getByPlaceholderText('Username')).toBeInTheDocument()

    expect(screen.getByLabelText('Username')).toBeInTheDocument()
  })
  it('has email input', () => {
    render(SignUp)
    // expect(screen.getByPlaceholderText('E-mail')).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
  })
  it('has password input', () => {
    render(SignUp)
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })
  it('has password type for password input', () => {
    render(SignUp)
    //to check the presence of attribute type with value password
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password')
  })
  it('has password repeat input', () => {
    render(SignUp)
    expect(screen.getByLabelText('Password Repeat')).toBeInTheDocument()
  })
  it('has password type for password repeat input', () => {
    render(SignUp)
    //to check the presence of attribute type with value password
    expect(screen.getByLabelText('Password Repeat')).toHaveAttribute('type', 'password')
  })

  it('has Sign Up button', () => {
    render(SignUp)
    const button = screen.getByRole('button', { name: 'Sign Up' })
    expect(button).toBeInTheDocument()
  })

  it('disables the button initially', () => {
    render(SignUp)

    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeDisabled()
  })

  it('does not display spinner', () => {
    render(SignUp)
    expect(screen.queryByRole('status')).not.toBeInTheDocument()
  })

  describe('when passwords do not match', () => {
    it('displays error', async () => {
      const {
        user,
        elements: { passwordInput, passwordRepeatInput }
      } = await setup()

      await user.type(passwordInput, '124')
      await user.type(passwordRepeatInput, '356')

      expect(screen.getByText('Password mismatch')).toBeInTheDocument()
    })
  })

  //we need to test the disability of the button
  describe('when user sets same value for password inputs', () => {
    it('enables button', async () => {
      const {
        elements: { button }
      } = await setup()

      expect(button).toBeEnabled()
    })

    describe('when user submits the form', () => {
      it('sends username,email,password to the backend', async () => {
        const {
          user,
          elements: { button }
        } = await setup()

        await user.click(button)

        //
        await waitFor(() => {
          expect(requestBody).toEqual({
            username: 'user1',
            email: 'user1@mail.com',
            password: 'P4ssword'
          })
        })
      })

      describe.each([{ language: 'en' }])('when langauge is $language', ({ language }) => {
        it('sends expected language in accept language header', async () => {
          let acceptLanguage
          server.use(
            http.post('/api/v1/users', async ({ request }) => {
              acceptLanguage = request.headers.get('Accept-Language')
              await delay('infinite')
              return HttpResponse.json({})
            })
          )
          const {
            user,
            elements: { button }
          } = await setup()
          i18n.global.locale = language
          await user.click(button)
          await waitFor(() => {
            expect(acceptLanguage).toBe(language)
          })
        })
      })

      describe('when there is an ongoing api call', () => {
        it('does not allow clicking the button', async () => {
          const {
            user,
            elements: { button }
          } = await setup()

          await user.click(button)
          await user.click(button)

          //
          await waitFor(() => {
            expect(counter).toBe(1)
          })
        })
        it('displays spinner', async () => {
          server.use(
            http.post('/api/v1/users', async () => {
              await delay('infinite')
              return HttpResponse.json()
            })
          )
          const {
            user,
            elements: { button }
          } = await setup()

          await user.click(button)
          expect(screen.getByRole('status')).toBeInTheDocument()
        })
      })
      describe('when success response is received', () => {
        it('displays message received from backend', async () => {
          const {
            user,
            elements: { button }
          } = await setup()

          await user.click(button)

          const text = await screen.findByText('user create success')
          expect(text).toBeInTheDocument()
        })
        it('hides the signup form', async () => {
          const {
            user,
            elements: { button }
          } = await setup()

          const form = screen.getByTestId('form-sign-up')

          await user.click(button)
          await waitFor(() => {
            expect(form).not.toBeInTheDocument()
          })
        })
      })
      describe('when network failure occurs', () => {
        it('displays generic message', async () => {
          server.use(
            http.post('/api/v1/users', () => {
              return HttpResponse.error()
            })
          )
          const {
            user,
            elements: { button }
          } = await setup()

          await user.click(button)
          const text = await screen.findByText('Unexpected error occurred, please try again')
          expect(text).toBeInTheDocument()
        })

        it('hides spinner', async () => {
          server.use(
            http.post('/api/v1/users', () => {
              return HttpResponse.error()
            })
          )
          const {
            user,
            elements: { button }
          } = await setup()

          await user.click(button)
          await waitFor(() => {
            expect(screen.queryByRole('status')).not.toBeInTheDocument()
          })
        })

        describe('when user submits again', () => {
          it('hides error when api request in progress', async () => {
            let processedFirstRequest = false
            server.use(
              http.post('/api/v1/users', () => {
                if (!processedFirstRequest) {
                  processedFirstRequest = true
                  return HttpResponse.error()
                } else {
                  return HttpResponse.json({})
                }
              })
            )
            const {
              user,
              elements: { button }
            } = await setup()

            await user.click(button)
            const text = await screen.findByText('Unexpected error occurred, please try again')
            await user.click(button)
            await waitFor(() => {
              expect(text).not.toBeInTheDocument()
            })
          })
        })
      })

      describe.each([
        { field: 'username', message: 'username connot be null' },
        { field: 'email', message: 'E-mail cannot be null' },
        { field: 'password', message: 'Password cannot be null' }
      ])('when $field is invalid', ({ field, message }) => {
        it(`displays ${message}`, async () => {
          server.use(
            http.post('/api/v1/users', () => {
              return HttpResponse.json(
                {
                  validationErrors: {
                    [field]: message
                  }
                },
                { status: 400 }
              )
            })
          )
          const {
            user,
            elements: { button }
          } = await setup()

          await user.click(button)
          const error = await screen.findByText(message)
          expect(error).toBeInTheDocument()
        })

        it(`clears error after user updates ${field}`, async () => {
          server.use(
            http.post('/api/v1/users', () => {
              return HttpResponse.json(
                {
                  validationErrors: {
                    [field]: message
                  }
                },
                { status: 400 }
              )
            })
          )
          const { user, elements } = await setup()

          await user.click(elements.button)
          const error = await screen.findByText(message)
          await user.type(elements[`${field}Input`], 'updated')
          expect(error).not.toBeInTheDocument()
        })
      })
    })
  })
})
