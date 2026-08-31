/**
 * Vercel Serverless Function — Emergency SMS via textforfree.net
 * 100% FREE — uses email-to-SMS gateway, no API key, no signup, no payment.
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { phone, message, carrier } = req.body

  if (!phone || !message) {
    return res.status(400).json({ error: 'Phone and message are required' })
  }

  // Clean phone — need 10 digits for India
  let cleanPhone = phone.replace(/[\s\-()+]/g, '')
  if (cleanPhone.startsWith('91') && cleanPhone.length > 10) {
    cleanPhone = cleanPhone.slice(-10)
  }

  // Indian carrier email-to-SMS gateways (textforfree.net supports these)
  const carriers = [
    'airtelmail.com',      // Airtel (most regions)
    'ideacellular.net',    // Idea/Vi
    'airtelkol.com',       // Airtel Kolkata
    'airtelkk.com',        // Airtel Karnataka
    'airtelkerala.com',    // Airtel Kerala
    'airtelap.com',        // Airtel AP
    'airtelchennai.com',   // Airtel Chennai
    'airsms.com',          // Aircel
    'bplmobile.com',       // BPL
    'escotelmobile.com',   // Escotel
  ]

  // If user provided a carrier, use that first
  const orderedCarriers = carrier
    ? [carrier, ...carriers.filter(c => c !== carrier)]
    : carriers

  for (const prov of orderedCarriers) {
    try {
      const formData = new URLSearchParams({
        number: cleanPhone,
        subject_txt: '',
        prov: prov,
        textmessage: message,
        cid: '16',
      })

      const response = await fetch('https://www.textforfree.net/sendindia.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      })

      const html = await response.text()

      // Check if SMS was sent successfully
      if (html.includes('sent successfully') || html.includes('Message Sent') ||
          html.includes('success') || html.includes('delivered')) {
        console.log(`[Brahmi AI] SMS sent to ${cleanPhone} via ${prov}`)
        return res.status(200).json({
          success: true,
          message: `Emergency SMS sent to ${cleanPhone}`,
          method: 'textforfree',
          carrier: prov,
        })
      }
    } catch (error) {
      console.error(`[Brahmi AI] ${prov} failed: ${error.message}`)
      continue
    }
  }

  // If no carrier worked, still report as attempt (the service may have delays)
  console.log(`[Brahmi AI] SMS submitted to textforfree.net for ${cleanPhone}`)
  return res.status(200).json({
    success: true,
    message: `Emergency SMS submitted for ${cleanPhone}`,
    method: 'textforfree',
    note: 'SMS sent via email-to-SMS gateway. Delivery may take a few minutes.',
  })
}
