import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import PunycodeConverter from './PunycodeConverter';

export const metadata = {
  title: 'Punycode & IDN Converter — Convert Internationalized Domain Names | DomyDomains',
  description: 'Free Punycode and IDN converter tool. Convert internationalized domain names between Unicode and ASCII Punycode encoding. Supports all scripts including Chinese, Arabic, Cyrillic, Japanese, Korean, and more.',
  keywords: 'punycode converter, IDN converter, internationalized domain name, punycode to unicode, unicode to punycode, xn-- domain, punycode decoder, punycode encoder, IDN domain checker, domain name encoding',
  alternates: { canonical: '/punycode-converter' },
  openGraph: {
    title: 'Punycode & IDN Converter — Convert Internationalized Domain Names',
    description: 'Convert internationalized domain names between Unicode and ASCII Punycode encoding. Supports Chinese, Arabic, Cyrillic, Japanese, Korean, and all Unicode scripts.',
    url: 'https://domydomains.com/punycode-converter',
  },
};

export default function PunycodeConverterPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="Punycode IDN Converter"
        description="Convert internationalized domain names between Unicode and ASCII Punycode encoding. Supports all Unicode scripts including Chinese, Arabic, Cyrillic, Japanese, Korean, and more."
        url="/punycode-converter"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        Punycode &amp; IDN Converter
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Convert internationalized domain names (IDNs) between human-readable Unicode and
        machine-encoded Punycode (xn--) format. Supports every Unicode script — all client-side, instant, and free.
      </p>

      <PunycodeConverter />

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Is Punycode?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.8, marginBottom: '16px' }}>
          Punycode is an encoding standard defined in RFC 3492 that represents Unicode characters using the
          limited ASCII character set allowed in domain names. Because the Domain Name System (DNS) was
          originally designed to handle only ASCII characters (letters a–z, digits 0–9, and hyphens), a
          special encoding was needed to support domain names in languages like Chinese, Arabic, Russian,
          Hindi, Japanese, and Korean. Punycode provides that bridge, converting non-ASCII labels into
          ASCII-compatible encoding (ACE) strings prefixed with &quot;xn--&quot;.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.8, marginBottom: '16px' }}>
          For example, the German domain <strong>münchen.de</strong> (Munich) becomes <strong>xn--mnchen-3ya.de</strong> in
          Punycode. The Chinese domain <strong>中文.com</strong> becomes <strong>xn--fiq228c.com</strong>. This
          encoding happens transparently in your browser — when you type an internationalized domain name, your
          browser automatically converts it to Punycode before sending the DNS query.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Are Internationalized Domain Names (IDNs)?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.8, marginBottom: '16px' }}>
          Internationalized Domain Names (IDNs) are domain names that contain characters outside the traditional
          ASCII range. They allow people to register and use domain names in their native language and script.
          IDNs are governed by the IDNA (Internationalizing Domain Names in Applications) standard, which defines
          the rules for converting between the Unicode form that users see and the Punycode form used in DNS.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.8, marginBottom: '16px' }}>
          IDNs were introduced to make the internet more accessible to non-English speakers. With over 4 billion
          internet users worldwide and hundreds of writing systems, the ability to use domain names in native
          scripts is essential. Many country-code TLDs now support IDN registrations, and there are even
          internationalized top-level domains like .рф (Russia), .中国 (China), and .السعودية (Saudi Arabia).
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Why Convert Between Punycode and Unicode?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.8, marginBottom: '16px' }}>
          There are several practical reasons to convert between Punycode and Unicode. Domain administrators
          need to verify that their IDN domains resolve correctly by checking the Punycode representation.
          Security researchers use Punycode analysis to detect homograph attacks — where visually similar
          characters from different scripts are used to create deceptive domain names (for example, using
          Cyrillic &quot;а&quot; instead of Latin &quot;a&quot;). Web developers working with international content need to
          understand how browsers handle IDN encoding.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.8, marginBottom: '16px' }}>
          Our converter runs entirely in your browser using a pure JavaScript implementation of the RFC 3492
          algorithm. No data is sent to any server. It automatically detects whether your input is Unicode
          or Punycode and converts accordingly, with a detailed character breakdown showing each code point
          and its encoding. This makes it an essential tool for anyone working with internationalized domains.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Supported Scripts and Languages</h2>
        <p style={{ color: '#ccc', lineHeight: 1.8, marginBottom: '16px' }}>
          This Punycode converter supports every Unicode script, including but not limited to: Latin with
          diacritics (French, German, Spanish, Portuguese, Vietnamese), Cyrillic (Russian, Ukrainian, Bulgarian),
          Chinese (Simplified and Traditional), Japanese (Hiragana, Katakana, Kanji), Korean (Hangul), Arabic,
          Hebrew, Thai, Hindi (Devanagari), Tamil, Greek, Georgian, Armenian, and Ethiopic. If it&apos;s in
          Unicode, our tool can convert it.
        </p>
      </section>
    </StaticPage>
  );
}
