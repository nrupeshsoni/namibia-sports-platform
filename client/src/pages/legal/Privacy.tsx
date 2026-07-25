import { Link } from "wouter";
import { LegalPageLayout } from "./LegalPageLayout";

/**
 * Public Privacy Policy for sports.com.na (Namibia Sports Platform).
 */
export default function Privacy() {
  return (
    <LegalPageLayout title="Privacy Policy" lastUpdated="25 July 2026">
      <p>
        This Privacy Policy explains how the <strong className="text-white">Namibia Sports Platform</strong>{" "}
        at <strong className="text-white">sports.com.na</strong> (“the Platform”, “we”, “us”) collects, uses,
        and shares personal information when you visit the site, create an account, subscribe to
        notifications, or appear in public sports content.
      </p>

      <h2>1. Who operates this Platform</h2>
      <p>
        The Platform is designed, hosted, and operated by{" "}
        <strong className="text-white">The Dome Technologies</strong> (
        <a href="https://thedome.com.na" target="_blank" rel="noopener noreferrer">
          thedome.com.na
        </a>
        ) and <strong className="text-white">Facilit8 Namibia</strong> (
        <a href="https://facilit8.com.na" target="_blank" rel="noopener noreferrer">
          facilit8.com.na
        </a>
        ) (together, the “Operators”).
      </p>
      <p>
        The Platform publishes information about Namibian sport, including federations, clubs, athletes,
        events, venues, news, and streams. It is a national sports information service — not a government
        website by default.
      </p>

      <h2>2. Data controller — honest status</h2>
      <div
        className="rounded-xl p-4 text-amber-100/90 text-sm"
        style={{
          background: "rgba(251, 191, 36, 0.08)",
          border: "1px solid rgba(251, 191, 36, 0.25)",
        }}
      >
        <p className="font-medium text-amber-200 mb-2">Placeholder — relationship to be confirmed</p>
        <p>
          Until a formal data-controller agreement is signed with the{" "}
          <strong>Namibia Sports Commission (NSC)</strong>, the Ministry of Sport, Youth and National
          Service, or another statutory body, the Operators act as the practical controllers of personal
          data processed through this Platform (account data, subscriptions, and content we store).
        </p>
        <p className="mt-2">
          If and when NSC (or another body) becomes the formal data controller, this section will be
          updated with the controller’s legal name, registration details, and contact point. Federation
          administrators who upload athlete or club data may also be independent controllers of the
          records they supply — we process that content to display it on the Platform.
        </p>
      </div>

      <h2>3. What we collect</h2>
      <ul>
        <li>
          <strong className="text-white">Account data:</strong> name, email address, password (stored by
          our authentication provider), and role/permissions if granted by an administrator.
        </li>
        <li>
          <strong className="text-white">Usage data:</strong> technical logs such as IP address, browser
          type, pages viewed, and approximate location derived from network metadata, used for security,
          debugging, and service reliability.
        </li>
        <li>
          <strong className="text-white">Subscription &amp; messaging data:</strong> if you opt in to
          WhatsApp or similar notifications, your phone number, preferred topics/federations, and
          delivery status.
        </li>
        <li>
          <strong className="text-white">Public sports content:</strong> athlete profiles, coach profiles,
          club and federation contacts, event details, media, and news that federations or administrators
          publish. Public athlete pages are intended to show sporting information; contact details and
          dates of birth are not shown on public athlete profiles by default.
        </li>
      </ul>

      <h2>4. Why we use personal data</h2>
      <ul>
        <li>Provide and improve the Platform (accounts, directories, search, federation sites).</li>
        <li>Authenticate users and enforce role-based access (e.g. federation admins).</li>
        <li>Send service messages (e.g. email confirmation) and, only with consent, marketing or
          WhatsApp updates about sport, events, or news.</li>
        <li>Publish legitimate public-interest sports information about athletes, clubs, and events.</li>
        <li>Protect the service (abuse prevention, security monitoring, legal compliance).</li>
      </ul>

      <h2>5. Athlete and sports personality data</h2>
      <p>
        Profiles of athletes, coaches, and officials may include names, photos, bios, club/federation
        affiliation, achievements, and similar sporting information. This content is typically supplied
        by federations, clubs, or administrators, or drawn from publicly available sources for directory
        purposes.
      </p>
      <p>
        If you are an athlete (or a parent/guardian of a minor athlete) and want a profile corrected,
        limited, or removed, contact us using the details below. We will work with the relevant federation
        where the record originated. We do not sell athlete contact lists.
      </p>

      <h2>6. WhatsApp and marketing consent</h2>
      <p>
        WhatsApp Business messages, SMS, email newsletters, or similar marketing/update channels are{" "}
        <strong className="text-white">opt-in only</strong>. Subscribing means you consent to receive the
        categories of messages you select (for example federation news or event reminders). You can
        unsubscribe at any time using the method described in the message or by contacting us. Account
        registration alone does <strong className="text-white">not</strong> enrol you in WhatsApp or
        marketing lists.
      </p>

      <h2>7. Sharing and processors</h2>
      <p>We use service providers to run the Platform, including:</p>
      <ul>
        <li>Cloud hosting and edge delivery (e.g. Cloudflare Workers).</li>
        <li>Database and authentication (Supabase / PostgreSQL).</li>
        <li>Optional AI assistance features (when enabled) via third-party AI APIs.</li>
        <li>WhatsApp Business API providers when that feature is enabled.</li>
      </ul>
      <p>
        We do not sell your personal information. We may disclose data if required by Namibian law or to
        protect rights, safety, or the integrity of the Platform.
      </p>

      <h2>8. Cookies and similar technologies</h2>
      <p>
        We do <strong className="text-white">not</strong> use advertising or third-party analytics cookies
        by default. Optional analytics (e.g. Umami) is only loaded if we enable it and, where required,
        after you consent.
      </p>
      <p>We use limited first-party storage so the Platform works as you expect:</p>
      <ul>
        <li>
          <strong className="text-white">Theme preference</strong> — stored in{" "}
          <code className="text-gray-300">localStorage</code> (<code className="text-gray-300">theme</code>)
          when you use the light/dark toggle.
        </li>
        <li>
          <strong className="text-white">UI preferences</strong> — e.g. dismissing this cookie notice or the
          install prompt may be remembered in <code className="text-gray-300">localStorage</code>; admin
          sidebar open/closed may use a first-party <code className="text-gray-300">sidebar_state</code>{" "}
          cookie.
        </li>
        <li>
          <strong className="text-white">Authentication</strong> — sessions use a Supabase JWT in the
          Authorization header (and Supabase Auth’s own browser storage), not an application session
          cookie controlled by this site’s UI.
        </li>
      </ul>
      <p>
        These essential preferences are required for basic site function and accessibility (e.g. remembering
        colour scheme). You can clear them via your browser settings.
      </p>

      <h2>9. Retention</h2>
      <p>
        Account data is kept while your account is active and for a reasonable period afterward for
        security and legal purposes. Subscription data is kept until you unsubscribe or the service ends.
        Published sports content may remain as part of the historical public record unless removed under
        this policy or by the content owner.
      </p>

      <h2>10. Your rights</h2>
      <p>Subject to applicable Namibian law (including data-protection legislation as it applies), you may:</p>
      <ul>
        <li>Request access to personal data we hold about you.</li>
        <li>Request correction of inaccurate data.</li>
        <li>Request deletion or restriction where we are not required to keep it.</li>
        <li>Withdraw consent for marketing/WhatsApp at any time.</li>
        <li>Object to certain processing of your personal data.</li>
      </ul>
      <p>
        To exercise these rights, email{" "}
        <a href="mailto:privacy@sports.com.na">privacy@sports.com.na</a> (or the Operators’ contacts
        below). We may need to verify your identity before acting on a request.
      </p>

      <h2>11. Children</h2>
      <p>
        The Platform is a general sports directory. Profiles of junior athletes should only be published
        by authorised federation/club administrators with appropriate authority. Parents or guardians who
        have concerns about a minor’s data should contact us immediately.
      </p>

      <h2>12. Contact</h2>
      <ul>
        <li>
          Platform privacy:{" "}
          <a href="mailto:privacy@sports.com.na">privacy@sports.com.na</a>
        </li>
        <li>
          The Dome Technologies:{" "}
          <a href="https://thedome.com.na" target="_blank" rel="noopener noreferrer">
            thedome.com.na
          </a>
        </li>
        <li>
          Facilit8 Namibia:{" "}
          <a href="https://facilit8.com.na" target="_blank" rel="noopener noreferrer">
            facilit8.com.na
          </a>
        </li>
      </ul>
      <p>
        See also our{" "}
        <Link href="/terms">
          <a>Terms of Use</a>
        </Link>
        .
      </p>
    </LegalPageLayout>
  );
}
