import { FaInstagram, FaXTwitter, FaSnapchat, FaTiktok, FaFacebookF, FaWhatsapp, FaEnvelope } from 'react-icons/fa6'

export const socialLinks = [
  { key: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/smdn.ksa/', Icon: FaInstagram },
  { key: 'x', label: 'X', url: 'https://x.com/smdnksa', Icon: FaXTwitter },
  { key: 'snapchat', label: 'Snapchat', url: 'https://snapchat.com/t/eJEGJY7M', Icon: FaSnapchat },
  { key: 'tiktok', label: 'TikTok', url: 'https://www.tiktok.com/@smdn.ksa', Icon: FaTiktok },
  { key: 'facebook', label: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61592403342115', Icon: FaFacebookF },
  { key: 'whatsapp', label: 'WhatsApp', url: 'https://wa.me/966555185657', Icon: FaWhatsapp },
  { key: 'email', label: 'Email', url: 'mailto:smdn.ksa@gmail.com', Icon: FaEnvelope }
]

// Builds the list from Strapi's Site Settings once loaded, falling back to the
// static URLs above per-field while `settings` is null (still loading) or a
// field wasn't set. An admin can hide a platform entirely by clearing its URL.
export function buildSocialLinks(settings) {
  if (!settings) return socialLinks

  const urlByKey = {
    instagram: settings.instagramUrl,
    x: settings.xUrl,
    snapchat: settings.snapchatUrl,
    tiktok: settings.tiktokUrl,
    facebook: settings.facebookUrl,
    whatsapp: settings.whatsappUrl,
    email: settings.email ? `mailto:${settings.email}` : undefined
  }

  return socialLinks
    .map((link) => {
      const override = urlByKey[link.key]
      const url = override === undefined ? link.url : override
      return url ? { ...link, url } : null
    })
    .filter(Boolean)
}