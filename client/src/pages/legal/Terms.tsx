import { Link } from "wouter";
import { LegalPageLayout } from "./LegalPageLayout";

/**
 * Public Terms of Use for sports.com.na (Namibia Sports Platform).
 */
export default function Terms() {
  return (
    <LegalPageLayout title="Terms of Use" lastUpdated="21 July 2026">
      <p>
        These Terms of Use govern access to and use of the{" "}
        <strong className="text-white">Namibia Sports Platform</strong> at{" "}
        <strong className="text-white">sports.com.na</strong> (“the Platform”). By using the Platform or
        creating an account, you agree to these Terms and our{" "}
        <Link href="/privacy">
          <a>Privacy Policy</a>
        </Link>
        .
      </p>

      <h2>1. Operator</h2>
      <p>
        The Platform is operated by <strong className="text-white">The Dome Technologies</strong> and{" "}
        <strong className="text-white">Facilit8 Namibia</strong> (the “Operators”). References to “we”,
        “us”, or “our” mean the Operators acting through sports.com.na.
      </p>
      <div
        className="rounded-xl p-4 text-amber-100/90 text-sm"
        style={{
          background: "rgba(251, 191, 36, 0.08)",
          border: "1px solid rgba(251, 191, 36, 0.25)",
        }}
      >
        <p className="font-medium text-amber-200 mb-2">Official status — to be confirmed</p>
        <p>
          The Platform aims to serve Namibian sport nationally. A formal endorsement, partnership, or
          data-controller arrangement with the <strong>Namibia Sports Commission (NSC)</strong> or other
          statutory bodies may be established later. Until that is documented in writing, the Operators
          remain responsible for operating this website and these Terms apply between you and the
          Operators — not automatically between you and NSC.
        </p>
      </div>

      <h2>2. What the Platform provides</h2>
      <p>
        The Platform offers directories and tools for federations, clubs, athletes, coaches, venues,
        events, news, maps, and related sports content. Features may change, be feature-flagged, or be
        unavailable without notice. Content is provided for information and community use; it is not
        legal, medical, or professional advice.
      </p>

      <h2>3. Accounts and acceptable use</h2>
      <ul>
        <li>Provide accurate registration details and keep your credentials secure.</li>
        <li>You are responsible for activity under your account.</li>
        <li>
          Do not attempt to access other users’ data, bypass security, scrape the service abusively, or
          disrupt the Platform.
        </li>
        <li>
          Federation and club administrators must only upload content they are authorised to publish and
          must respect athletes’ privacy and applicable law.
        </li>
        <li>Do not upload unlawful, defamatory, or infringing material.</li>
      </ul>

      <h2>4. Roles and permissions</h2>
      <p>
        Some capabilities (e.g. editing federation content) require an elevated role granted by a
        Platform administrator. Selecting a federation during registration does not by itself grant
        administrative rights. Misuse of elevated access may result in suspension.
      </p>

      <h2>5. Content ownership and licence</h2>
      <p>
        Federations, clubs, and other contributors retain ownership of content they supply, subject to
        any rights of the original authors or rights-holders. By submitting content, you grant the
        Operators a non-exclusive, worldwide licence to host, display, adapt for formatting, and
        distribute that content on the Platform and related promotional materials for Namibian sport.
      </p>
      <p>
        Public sports facts (results, fixtures, publicly known athlete achievements) may be curated for
        directory purposes. Report errors via the contact channels in the Privacy Policy.
      </p>

      <h2>6. Athlete and personal data</h2>
      <p>
        Use of personal data is described in the{" "}
        <Link href="/privacy">
          <a>Privacy Policy</a>
        </Link>
        . Administrators must not publish private contact details or sensitive personal data of athletes
        without a lawful basis and appropriate authority — especially for minors.
      </p>

      <h2>7. WhatsApp and marketing</h2>
      <p>
        Optional WhatsApp, email, or similar updates require separate opt-in consent. You may withdraw
        that consent at any time. Transactional messages needed to operate your account (e.g. email
        confirmation) may still be sent.
      </p>

      <h2>8. Third-party services and links</h2>
      <p>
        The Platform may embed or link to third-party services (video platforms, maps, social networks,
        federation websites). Those services have their own terms and privacy practices. We are not
        responsible for third-party content or outages.
      </p>

      <h2>9. Disclaimer of warranties</h2>
      <p>
        The Platform is provided “as is” and “as available”. To the fullest extent permitted by Namibian
        law, we disclaim warranties of merchantability, fitness for a particular purpose, and
        non-infringement. We do not warrant that content is complete, current, or error-free.
      </p>

      <h2>10. Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, the Operators are not liable for indirect, incidental,
        special, consequential, or punitive damages, or for loss of data, profits, or goodwill arising
        from your use of the Platform. Nothing in these Terms excludes liability that cannot be excluded
        under applicable law.
      </p>

      <h2>11. Suspension and termination</h2>
      <p>
        We may suspend or terminate access if you breach these Terms, create risk to other users, or if
        we must do so for legal or operational reasons. You may stop using the Platform at any time.
      </p>

      <h2>12. Changes</h2>
      <p>
        We may update these Terms from time to time. The “Last updated” date at the top will change when
        we do. Continued use after an update constitutes acceptance of the revised Terms for subsequent
        use. Material changes affecting registered users may also be highlighted on the Platform.
      </p>

      <h2>13. Governing law</h2>
      <p>
        These Terms are governed by the laws of the Republic of Namibia. Courts in Namibia have
        exclusive jurisdiction, subject to any mandatory consumer protections that apply.
      </p>

      <h2>14. Contact</h2>
      <ul>
        <li>
          Legal / terms:{" "}
          <a href="mailto:legal@sports.com.na">legal@sports.com.na</a>
        </li>
        <li>
          Privacy:{" "}
          <a href="mailto:privacy@sports.com.na">privacy@sports.com.na</a>
        </li>
        <li>
          Operators:{" "}
          <a href="https://thedome.com.na" target="_blank" rel="noopener noreferrer">
            The Dome Technologies
          </a>
          {" · "}
          <a href="https://facilit8.com.na" target="_blank" rel="noopener noreferrer">
            Facilit8 Namibia
          </a>
        </li>
      </ul>
    </LegalPageLayout>
  );
}
