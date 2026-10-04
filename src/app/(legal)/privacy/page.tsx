import type { Metadata } from 'next';
import Link from 'next/link';
import styles from '../legal.module.css';

export const metadata: Metadata = {
  title: 'Privacy Policy — WBH Skin',
  description: 'How Wholesale Beauty Hub (WBH Skin) collects, uses and protects your personal data.',
};

const CONTACT_EMAIL = 'info@wholesalebeautyhub.co.uk';

export default function PrivacyPolicyPage() {
  return (
    <article>
      <h1>Privacy Policy</h1>
      <p className={styles.updated}>Last updated: 4 October 2026</p>

      <p>
        This Privacy Policy explains how Wholesale Beauty Hub (&ldquo;WBH&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;)
        collects, uses and protects your personal data when you use WBH Skin, our AI-powered skin analysis
        platform (the &ldquo;Service&rdquo;). We are the data controller for the personal data described here
        and we process it in line with the UK General Data Protection Regulation (UK GDPR) and the Data
        Protection Act 2018.
      </p>

      <h2>1. Information we collect</h2>

      <h3>Account information</h3>
      <p>
        When you create an account we collect your first and last name, email address and password (stored
        in encrypted form). You may also add a phone number, skin type and profile photo.
      </p>

      <h3>Information from Google or Apple sign-in</h3>
      <p>
        If you choose to sign in with Google or Apple, we receive your name, email address and, where
        available, your profile picture from that provider. We use this only to create and sign you in to
        your account. We do not receive your Google or Apple password and we do not access your contacts,
        files, calendar or any other data in those accounts.
      </p>

      <h3>Skin scan images and results</h3>
      <p>
        When you use the skin scanner, you take or upload photos of your face or skin. We use these images to
        generate an AI skin analysis, which may include detected skin concerns, severity, a skin type
        estimate, a skin score and suggested ingredients or products. We store your images and results in
        your account so you can view your scan history.
      </p>
      <p>
        Because skin images and analysis can reveal information about your health, we treat them as special
        category data and only process them with your explicit consent, which you give before each scan. We
        do not use your images to identify you, and we do not create facial recognition templates.
      </p>

      <h3>Consultation bookings</h3>
      <p>
        If you book a consultation, we collect the date and time you choose, the specialist you select, and
        any notes you add.
      </p>

      <h3>Event registrations</h3>
      <p>
        If you register for a WBH event, we collect your name, email address and, if you provide them, your
        phone number, age range, city, skin concerns and a description of those concerns.
      </p>

      <h3>Technical information</h3>
      <p>
        We automatically collect limited technical data needed to run the Service securely, such as your
        browser type, device information and authentication cookies.
      </p>

      <h2>2. How we use your information</h2>
      <ul>
        <li>To create and manage your account and sign you in.</li>
        <li>To analyse your skin images and show you results and recommendations.</li>
        <li>To keep your scan history so you can track changes over time.</li>
        <li>To arrange consultations and send booking confirmations.</li>
        <li>To manage event registrations and send related information.</li>
        <li>To send you skincare and product recommendations prepared by our team.</li>
        <li>To respond to your enquiries and provide customer support.</li>
        <li>To keep the Service secure, prevent misuse and meet our legal obligations.</li>
      </ul>

      <h2>3. Our legal bases</h2>
      <ul>
        <li><strong>Contract:</strong> to provide the account, scans and bookings you ask for.</li>
        <li><strong>Explicit consent:</strong> to process your skin images and analysis results. You can withdraw consent at any time by deleting your scans or your account.</li>
        <li><strong>Consent:</strong> for non-essential cookies and marketing messages.</li>
        <li><strong>Legitimate interests:</strong> to keep the Service secure and improve it.</li>
        <li><strong>Legal obligation:</strong> where the law requires us to keep or disclose information.</li>
      </ul>

      <h2>4. Google user data</h2>
      <div className={styles.callout}>
        <p style={{ marginBottom: 0 }}>
          WBH Skin&rsquo;s use and transfer of information received from Google APIs will adhere to the{' '}
          <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer">
            Google API Services User Data Policy
          </a>
          , including the Limited Use requirements. We use the basic profile information Google shares (name,
          email address and profile picture) only to sign you in and personalise your account. We do not sell
          it, use it for advertising, or share it with anyone except as needed to run the Service.
        </p>
      </div>

      <h2>5. Who we share your information with</h2>
      <p>We do <strong>not</strong> sell your personal data. We share it only with:</p>
      <ul>
        <li><strong>Supabase:</strong> hosts our database, file storage and sign-in system.</li>
        <li><strong>Google (Gemini API):</strong> processes your skin images to produce the AI analysis.</li>
        <li><strong>Resend:</strong> sends our emails, such as booking confirmations and recommendations.</li>
        <li><strong>Google and Apple:</strong> when you choose to sign in with them.</li>
        <li><strong>Our hosting provider:</strong> runs the website and app.</li>
        <li><strong>Skincare specialists:</strong> only the information relevant to a consultation you book with them.</li>
        <li><strong>Authorities:</strong> where we are legally required to do so.</li>
      </ul>
      <p>
        Our service providers process data only on our instructions and under data protection agreements.
      </p>

      <h2>6. International transfers</h2>
      <p>
        Some of our service providers may process data outside the UK. Where this happens we make sure
        appropriate safeguards are in place, such as the UK International Data Transfer Agreement or the UK
        Addendum to the EU Standard Contractual Clauses.
      </p>

      <h2>7. How long we keep your data</h2>
      <ul>
        <li>Account information is kept for as long as your account is active.</li>
        <li>Scan images and results are kept until you delete them or delete your account. You can delete individual scans or your whole scan history in the app at any time.</li>
        <li>When you delete your account, we remove your personal data within 30 days, unless we must keep some of it to meet a legal obligation.</li>
        <li>We may keep anonymised statistics that cannot identify you.</li>
      </ul>

      <h2>8. How we protect your data</h2>
      <p>
        Data is encrypted in transit and at rest. Scan images are stored in private storage and can only be
        viewed through short-lived secure links. Access to personal data is limited to authorised staff who
        need it.
      </p>

      <h2>9. Cookies</h2>
      <p>
        We use essential cookies to keep you signed in and to remember your preferences, including your
        cookie choice. These are needed for the Service to work. We ask for your consent before using any
        non-essential cookies, and you can change your choice at any time by clearing your browser data.
      </p>

      <h2>10. Your rights</h2>
      <p>Under UK data protection law you have the right to:</p>
      <ul>
        <li>access the personal data we hold about you;</li>
        <li>correct inaccurate data;</li>
        <li>have your data deleted;</li>
        <li>restrict or object to how we use it;</li>
        <li>receive a copy of your data in a portable format;</li>
        <li>withdraw consent at any time, without affecting processing that happened before.</li>
      </ul>
      <p>
        To use any of these rights, email us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We
        will respond within one month. If you are unhappy with how we handle your data, you can complain to
        the Information Commissioner&rsquo;s Office (ICO) at{' '}
        <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer">ico.org.uk</a>.
      </p>

      <h2>11. Children</h2>
      <p>
        The Service is not intended for anyone under 16. We do not knowingly collect personal data from
        children. If you believe a child has given us their data, please contact us and we will delete it.
      </p>

      <h2>12. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. We will post the new version on this page and change
        the &ldquo;Last updated&rdquo; date. If the changes are significant, we will let you know by email or in
        the app.
      </p>

      <h2>13. Contact us</h2>
      <p>
        Wholesale Beauty Hub<br />
        Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
      </p>
      <p>
        See also our <Link href="/terms">Terms of Service</Link>.
      </p>
    </article>
  );
}
