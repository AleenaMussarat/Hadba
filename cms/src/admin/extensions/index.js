import enMessages from './locales/en.json'
import arMessages from './locales/ar.json'

export default {
  register(app) {
    // Register custom translations for English and Arabic
    app.addLocaleData({
      data: {
        'en': enMessages,
        'ar': arMessages
      },
      isDefault: false
    })
  }
}
