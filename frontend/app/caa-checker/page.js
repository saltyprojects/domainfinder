import { StaticPage } from '../components/StaticPage';
import ToolSchema from '../components/ToolSchema';
import CaaCheckerTool from './CaaCheckerTool';

export const metadata = {
  title: 'CAA Record Checker — Check Certificate Authority Authorization | DomyDomains',
  description: 'Free CAA record checker. Look up Certificate Authority Authorization (CAA) DNS records for any domain. See which CAs are authorized to issue SSL/TLS certificates and get security recommendations.',
  keywords: 'CAA record checker, CAA record lookup, certificate authority authorization, CAA DNS record, check CAA records, SSL certificate authorization, CAA record generator, domain CAA check, DNS CAA lookup, certificate issuance policy',
  alternates: { canonical: '/caa-checker' },
  openGraph: {
    title: 'CAA Record Checker — Check Certificate Authority Authorization',
    description: 'Look up CAA DNS records for any domain. See which Certificate Authorities are authorized to issue SSL/TLS certificates and get security recommendations.',
    url: 'https://domydomains.com/caa-checker',
  },
};

export default function CaaCheckerPage() {
  return (
    <StaticPage>
      <ToolSchema
        name="CAA Record Checker"
        description="Check Certificate Authority Authorization (CAA) DNS records for any domain. See which CAs are authorized to issue SSL/TLS certificates, view the full domain hierarchy, and get security recommendations."
        url="/caa-checker"
      />

      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '16px' }}>
        CAA Record Checker
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#9ca3af', lineHeight: 1.7, marginBottom: '32px', maxWidth: '700px' }}>
        Look up Certificate Authority Authorization (CAA) records for any domain. See which CAs are authorized
        to issue SSL/TLS certificates, check the full domain hierarchy, and get actionable security recommendations.
      </p>

      <CaaCheckerTool />

      <section style={{ marginBottom: '48px', marginTop: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>What Are CAA Records?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Certificate Authority Authorization (CAA) is a DNS record type defined in <strong>RFC 8659</strong> that
          allows domain owners to specify which Certificate Authorities (CAs) are permitted to issue SSL/TLS
          certificates for their domain. When a CA receives a certificate request, it must check for CAA records
          before issuing — this is mandatory since September 2017.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          CAA records use DNS record type 257 and contain three components: a <strong>flag</strong> byte (0 or 128
          for critical), a <strong>tag</strong> (issue, issuewild, or iodef), and a <strong>value</strong> specifying
          the authorized CA&apos;s domain name. For example, <code style={{ color: '#a78bfa', background: 'rgba(139,92,246,0.1)', padding: '2px 6px', borderRadius: '4px' }}>0 issue &quot;letsencrypt.org&quot;</code> authorizes
          Let&apos;s Encrypt to issue standard certificates.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Understanding CAA Tag Types</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          There are three standard CAA tags, each serving a distinct purpose in your certificate issuance policy:
        </p>
        <ul style={{ color: '#ccc', lineHeight: 1.8, paddingLeft: '24px', marginBottom: '16px' }}>
          <li><strong>issue</strong> — Authorizes a CA to issue standard (non-wildcard) certificates. Use one record per authorized CA.</li>
          <li><strong>issuewild</strong> — Authorizes a CA to issue wildcard certificates (e.g., *.example.com). If absent, the &quot;issue&quot; tag applies to wildcards too.</li>
          <li><strong>iodef</strong> — Incident Object Description Exchange Format. Specifies a URL (mailto: or https:) where CAs report policy violations.</li>
        </ul>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          RFC 8657 introduced two additional tags: <strong>contactemail</strong> and <strong>contactphone</strong>,
          which provide domain administrator contact information to CAs for certificate validation purposes. While
          not yet widely adopted, these tags help CAs reach domain owners during the issuance process.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>How CAA Record Lookup Works</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          When a Certificate Authority receives a certificate request, it performs a CAA record lookup by walking up
          the domain hierarchy. For example, if you request a certificate for <code style={{ color: '#a78bfa', background: 'rgba(139,92,246,0.1)', padding: '2px 6px', borderRadius: '4px' }}>shop.example.com</code>,
          the CA checks: (1) shop.example.com, then (2) example.com, then (3) com. The first level that has CAA
          records determines the policy. If no CAA records exist at any level, the CA is free to issue.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Our tool replicates this exact process, querying Google&apos;s public DNS resolver to check CAA records at
          every level of the domain hierarchy. This gives you complete visibility into which policy applies and where
          it&apos;s defined — whether directly on your subdomain or inherited from a parent domain.
        </p>
      </section>

      <section style={{ marginBottom: '48px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '16px' }}>Why Should You Set Up CAA Records?</h2>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          Setting up CAA records is a free and effective security measure that protects your domain from unauthorized
          certificate issuance. Without CAA records, any of the hundreds of trusted CAs worldwide could issue a
          certificate for your domain — whether requested by you or an attacker. CAA records limit issuance to only
          the CAs you explicitly authorize, significantly reducing your attack surface.
        </p>
        <p style={{ color: '#ccc', lineHeight: 1.7, marginBottom: '16px' }}>
          CAA records are especially important for organizations with compliance requirements (PCI DSS, SOC 2),
          as they demonstrate active certificate management controls. They also help prevent accidental misissue —
          for example, if a team member tries to obtain a certificate from an unapproved CA, the request will be
          blocked automatically. Combined with Certificate Transparency (CT) logs and the iodef reporting tag, CAA
          gives you comprehensive oversight of certificate activity for your domains.
        </p>
      </section>
    </StaticPage>
  );
}
