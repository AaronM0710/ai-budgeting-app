/**
 * Privacy Policy Page
 */

import React from 'react';
import { Link } from 'react-router-dom';
import './LegalPlain.css';

const PrivacyPage: React.FC = () => {
  return (
    <div className="legal-container">
      <div className="legal-card">
        <Link to="/home" className="back-link">← Back to Home</Link>

        <h1>Privacy Policy</h1>
        <p className="last-updated">Last Updated: January 2, 2025</p>

        <div className="legal-content">
          <section>
            <h2>1. Introduction</h2>
            <p>
              Budget BOOM ("we," "us," "our," or "the Service") is committed to protecting your privacy.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information
              when you use our Service. Please read this policy carefully.
            </p>
            <p>
              By accessing or using the Service, you consent to the collection, use, and disclosure of
              your information as described in this Privacy Policy. If you do not agree with our policies
              and practices, do not use the Service.
            </p>
          </section>

          <section>
            <h2>2. Information We Collect</h2>

            <h3>2.1 Information You Provide Directly</h3>
            <ul>
              <li><strong>Account Information:</strong> Email address, password (encrypted), first name, last name</li>
              <li><strong>Financial Documents:</strong> Bank statements, transaction records, and other financial documents you upload</li>
              <li><strong>Transaction Data:</strong> Transaction dates, descriptions, amounts, and categories extracted from your documents</li>
              <li><strong>Communications:</strong> Information you provide when contacting us for support</li>
              <li><strong>Waitlist Information:</strong> Email address, name, and referral source when joining our waitlist</li>
            </ul>

            <h3>2.2 Information Collected Automatically</h3>
            <ul>
              <li><strong>Device Information:</strong> Browser type, operating system, device type, screen resolution</li>
              <li><strong>Usage Data:</strong> Pages visited, features used, time spent on the Service, clickstream data</li>
              <li><strong>Log Data:</strong> IP address, access times, referring URLs, error logs</li>
              <li><strong>Cookies and Similar Technologies:</strong> Session identifiers, preferences, authentication tokens</li>
            </ul>

            <h3>2.3 Information from Third Parties</h3>
            <p>
              We may receive information about you from third-party services if you choose to link them
              to your account, or from analytics providers that help us understand Service usage.
            </p>
          </section>

          <section>
            <h2>3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Provide, maintain, and improve the Service</li>
              <li>Process and categorize your financial transactions</li>
              <li>Generate budget insights and recommendations</li>
              <li>Create and manage your account</li>
              <li>Authenticate your identity and secure your account</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Send you service-related communications (account verification, security alerts, updates)</li>
              <li>Send marketing communications (with your consent, where required)</li>
              <li>Analyze usage patterns to improve user experience</li>
              <li>Detect, prevent, and address fraud, security issues, and technical problems</li>
              <li>Comply with legal obligations</li>
              <li>Enforce our Terms of Service</li>
            </ul>
          </section>

          <section>
            <h2>4. How We Share Your Information</h2>
            <p>
              <strong>We do not sell, rent, or trade your personal information to third parties for their
              marketing purposes.</strong> We may share your information in the following circumstances:
            </p>

            <h3>4.1 Service Providers</h3>
            <p>
              We may share information with third-party vendors who perform services on our behalf, such as:
            </p>
            <ul>
              <li>Cloud hosting and data storage (e.g., Vercel, Supabase)</li>
              <li>Analytics services</li>
              <li>Email delivery services</li>
              <li>Customer support tools</li>
            </ul>
            <p>
              These providers are contractually obligated to protect your information and use it only
              for the purposes we specify.
            </p>

            <h3>4.2 Legal Requirements</h3>
            <p>We may disclose your information if required to do so by law or in response to:</p>
            <ul>
              <li>Subpoenas, court orders, or other legal processes</li>
              <li>Requests from law enforcement or government agencies</li>
              <li>To protect our rights, property, or safety, or that of our users or others</li>
              <li>To investigate potential violations of our Terms of Service</li>
            </ul>

            <h3>4.3 Business Transfers</h3>
            <p>
              If we are involved in a merger, acquisition, bankruptcy, or sale of assets, your information
              may be transferred as part of that transaction. We will notify you via email and/or prominent
              notice on the Service of any change in ownership.
            </p>

            <h3>4.4 With Your Consent</h3>
            <p>
              We may share your information for other purposes with your explicit consent.
            </p>

            <h3>4.5 Aggregated or De-identified Data</h3>
            <p>
              We may share aggregated or de-identified information that cannot reasonably be used to
              identify you for research, marketing, analytics, and other purposes.
            </p>
          </section>

          <section>
            <h2>5. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your information,
              including:
            </p>
            <ul>
              <li><strong>Encryption:</strong> Data is encrypted in transit (TLS/SSL) and at rest</li>
              <li><strong>Password Security:</strong> Passwords are hashed using bcrypt with strong salt rounds</li>
              <li><strong>Access Controls:</strong> Access to user data is restricted to authorized personnel</li>
              <li><strong>Secure Infrastructure:</strong> We use reputable cloud providers with strong security practices</li>
              <li><strong>Regular Security Reviews:</strong> We periodically review and update our security practices</li>
            </ul>
            <p>
              <strong>However, no method of transmission over the Internet or electronic storage is 100%
              secure.</strong> While we strive to protect your information, we cannot guarantee absolute security.
              You are responsible for maintaining the security of your account credentials.
            </p>
          </section>

          <section>
            <h2>6. Data Retention</h2>
            <p>We retain your information for as long as necessary to:</p>
            <ul>
              <li>Provide the Service to you</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes and enforce agreements</li>
              <li>Maintain business records for legitimate purposes</li>
            </ul>
            <p>
              When you delete your account, we will delete or anonymize your personal information within
              90 days, except where we are required to retain it for legal, regulatory, or legitimate
              business purposes. Certain data may be retained in backups for a limited period.
            </p>
          </section>

          <section>
            <h2>7. Your Rights and Choices</h2>
            <p>Depending on your location, you may have the following rights:</p>

            <h3>7.1 Access and Portability</h3>
            <p>
              You can request a copy of the personal information we hold about you in a structured,
              commonly used format.
            </p>

            <h3>7.2 Correction</h3>
            <p>
              You can request that we correct inaccurate or incomplete personal information.
            </p>

            <h3>7.3 Deletion</h3>
            <p>
              You can request that we delete your personal information, subject to certain exceptions
              (e.g., legal obligations, ongoing disputes).
            </p>

            <h3>7.4 Opt-Out of Marketing</h3>
            <p>
              You can opt out of marketing communications by clicking the "unsubscribe" link in emails
              or contacting us directly.
            </p>

            <h3>7.5 Cookie Preferences</h3>
            <p>
              You can manage cookie preferences through your browser settings. Note that disabling
              certain cookies may affect Service functionality.
            </p>

            <h3>7.6 Do Not Track</h3>
            <p>
              We do not currently respond to "Do Not Track" browser signals. We will update this policy
              if we change this practice.
            </p>

            <p>
              To exercise any of these rights, please contact us at privacy@budgetboom.io. We will respond
              to your request within 30 days (or as required by applicable law).
            </p>
          </section>

          <section>
            <h2>8. Cookies and Tracking Technologies</h2>
            <p>We use cookies and similar technologies for:</p>
            <ul>
              <li><strong>Essential Cookies:</strong> Required for the Service to function (authentication, security)</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences and settings</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how you use the Service</li>
            </ul>
            <p>
              You can control cookies through your browser settings. Most browsers allow you to block
              or delete cookies. However, blocking essential cookies may prevent you from using the Service.
            </p>
          </section>

          <section>
            <h2>9. Children's Privacy</h2>
            <p>
              The Service is not intended for children under 18 years of age. We do not knowingly collect
              personal information from children under 18. If we discover that we have collected information
              from a child under 18, we will delete it promptly. If you believe we may have information
              from or about a child under 18, please contact us.
            </p>
          </section>

          <section>
            <h2>10. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your country
              of residence, including the United States. These countries may have data protection laws
              that differ from your country.
            </p>
            <p>
              By using the Service, you consent to the transfer of your information to the United States
              and other countries. We take steps to ensure your information receives adequate protection
              in accordance with this Privacy Policy.
            </p>
          </section>

          <section>
            <h2>11. California Privacy Rights (CCPA)</h2>
            <p>
              If you are a California resident, you have additional rights under the California Consumer
              Privacy Act (CCPA):
            </p>
            <ul>
              <li><strong>Right to Know:</strong> You can request information about the categories and specific
              pieces of personal information we have collected, the sources of collection, the purposes
              for collection, and the categories of third parties with whom we share information.</li>
              <li><strong>Right to Delete:</strong> You can request deletion of your personal information,
              subject to certain exceptions.</li>
              <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for
              exercising your CCPA rights.</li>
              <li><strong>Right to Opt-Out of Sale:</strong> We do not sell your personal information.
              If this changes, we will provide a "Do Not Sell My Personal Information" link.</li>
            </ul>
            <p>
              To exercise your CCPA rights, contact us at privacy@budgetboom.io. You may designate an
              authorized agent to make a request on your behalf.
            </p>

            <h3>Categories of Personal Information Collected (Last 12 Months)</h3>
            <ul>
              <li>Identifiers (email, name, IP address)</li>
              <li>Financial information (transaction data from uploaded statements)</li>
              <li>Internet activity (usage data, browsing history on our Service)</li>
              <li>Geolocation data (derived from IP address)</li>
              <li>Inferences (spending patterns, budget recommendations)</li>
            </ul>
          </section>

          <section>
            <h2>12. European Privacy Rights (GDPR)</h2>
            <p>
              If you are located in the European Economic Area (EEA), United Kingdom, or Switzerland,
              you have additional rights under the General Data Protection Regulation (GDPR):
            </p>
            <ul>
              <li><strong>Legal Basis:</strong> We process your data based on consent, contract performance,
              legitimate interests, or legal obligations.</li>
              <li><strong>Right to Access:</strong> Request access to your personal data.</li>
              <li><strong>Right to Rectification:</strong> Request correction of inaccurate data.</li>
              <li><strong>Right to Erasure:</strong> Request deletion of your data ("right to be forgotten").</li>
              <li><strong>Right to Restrict Processing:</strong> Request limitation of processing.</li>
              <li><strong>Right to Data Portability:</strong> Receive your data in a portable format.</li>
              <li><strong>Right to Object:</strong> Object to processing based on legitimate interests.</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time.</li>
              <li><strong>Right to Lodge a Complaint:</strong> File a complaint with your local supervisory authority.</li>
            </ul>
            <p>
              To exercise these rights, contact us at privacy@budgetboom.io.
            </p>
          </section>

          <section>
            <h2>13. Nevada Privacy Rights</h2>
            <p>
              Nevada residents may submit a request directing us not to sell their personal information.
              We do not currently sell personal information as defined under Nevada law. If this changes,
              Nevada residents may submit opt-out requests to privacy@budgetboom.io.
            </p>
          </section>

          <section>
            <h2>14. Virginia Privacy Rights (VCDPA)</h2>
            <p>
              Virginia residents have rights under the Virginia Consumer Data Protection Act, including
              the right to access, correct, delete, and obtain a copy of their personal data, and the
              right to opt out of targeted advertising and sales. Contact us at privacy@budgetboom.io
              to exercise these rights.
            </p>
          </section>

          <section>
            <h2>15. Third-Party Links and Services</h2>
            <p>
              The Service may contain links to third-party websites or services. We are not responsible
              for the privacy practices of these third parties. We encourage you to review their privacy
              policies before providing any information.
            </p>
          </section>

          <section>
            <h2>16. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes
              by posting the new policy on this page and updating the "Last Updated" date. For significant
              changes, we may also notify you via email.
            </p>
            <p>
              Your continued use of the Service after any changes constitutes acceptance of the updated
              Privacy Policy. We encourage you to review this policy periodically.
            </p>
          </section>

          <section>
            <h2>17. Data Breach Notification</h2>
            <p>
              In the event of a data breach that affects your personal information, we will notify you
              and any applicable regulatory authorities as required by law. Notification will include
              the nature of the breach, types of data affected, and steps you can take to protect yourself.
            </p>
          </section>

          <section>
            <h2>18. Automated Decision-Making</h2>
            <p>
              Our Service uses automated technology to categorize transactions and generate budget
              recommendations. These automated processes do not make decisions that significantly affect
              your legal rights. All financial decisions remain entirely your responsibility.
            </p>
            <p>
              You can request human review of automated categorizations by contacting us.
            </p>
          </section>

          <section>
            <h2>19. Financial Data Handling</h2>
            <p>
              We take extra precautions with your financial data:
            </p>
            <ul>
              <li>Bank statements are processed and the original files are deleted after extraction</li>
              <li>We do not store bank account numbers, routing numbers, or full card numbers</li>
              <li>Transaction data is stored in encrypted form</li>
              <li>We do not have access to your bank accounts or the ability to initiate transactions</li>
              <li>Uploaded documents are processed in isolated, secure environments</li>
            </ul>
          </section>

          <section>
            <h2>20. Contact Us</h2>
            <p>
              If you have any questions, concerns, or requests regarding this Privacy Policy or our
              data practices, please contact us at:
            </p>
            <p>
              <strong>Email:</strong> privacy@budgetboom.io<br />
              <strong>Legal Inquiries:</strong> legal@budgetboom.io<br />
              <strong>Website:</strong> https://budgetboom.io
            </p>
            <p>
              We will respond to your inquiry within 30 days.
            </p>
          </section>
        </div>

        <div className="legal-footer">
          <p>By using Budget BOOM, you acknowledge that you have read and understood this Privacy Policy.</p>
          <Link to="/terms" className="legal-link">View Terms of Service →</Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
