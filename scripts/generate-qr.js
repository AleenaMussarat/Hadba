import QRCode from 'qrcode'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

// Placeholder domain — swap for the real production URL once hosting is finalized.
// Uses a hash route (HashRouter) so it works with zero server config on any host.
const MENU_URL = 'https://samdan.vercel.app/#/menu'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(__dirname, '..', 'print-assets')
mkdirSync(outDir, { recursive: true })

const outFile = path.join(outDir, 'menu-qr.png')

await QRCode.toFile(outFile, MENU_URL, {
  errorCorrectionLevel: 'H',
  width: 1200,
  margin: 2,
  color: {
    dark: '#120E0C',
    light: '#FFFFFF'
  }
})

console.log(`QR code for ${MENU_URL} written to ${outFile}`)
