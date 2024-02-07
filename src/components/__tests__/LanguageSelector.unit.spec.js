vi.mock('vue-i18n')
import { render, screen } from '@testing-library/vue'
import LanguageSelector from '../LanguageSelector.vue'
import { describe, expect } from 'vitest'
import userEvent from '@testing-library/user-event'
import { useI18n } from 'vue-i18n'

const mockI18n = {
  locale: {
    value: 'en'
  }
}

vi.mocked(useI18n).mockReturnValue(mockI18n)

describe('Language Selector', () => {
  describe.each([{ language: 'tr' }, { language: 'en' }])(
    'when user select $language',
    ({ language }) => {
      it('displays  expected test', async () => {
        const user = userEvent.setup()

        const i18n = {
          locale: 'tr'
        }

        render(LanguageSelector, {
          global: {
            mocks: {
              $i18n: i18n
            }
          }
        })
        await user.click(screen.getByTestId(`language-${language}-selector`))
        // expect(i18n.locale).toBe(language)
        expect(mockI18n.locale.value).toBe(language)
      })

      it('stores language in localStorage', async () => {
        const mockSetItem = vi.spyOn(Storage.prototype, 'setItem')
        const user = userEvent.setup()
        const i18n = {
          locale: 'tr'
        }

        render(LanguageSelector, {
          global: {
            mocks: {
              $i18n: i18n
            }
          }
        })
        await user.click(screen.getByTestId(`language-${language}-selector`))
        expect(mockSetItem).toHaveBeenCalledWith('app-lang', language)
      })
    }
  )
})
