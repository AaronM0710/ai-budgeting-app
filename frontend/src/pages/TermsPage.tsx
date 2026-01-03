/**
 * Terms of Service Page
 */

import React from 'react';
import { Link } from 'react-router-dom';
import './LegalPlain.css';

const TermsPage: React.FC = () => {
  return (
    <div className="legal-container">
      <div className="legal-card">
        <Link to="/home" className="back-link">← Back to Home</Link>

        <h1>Terms of Service</h1>
        <p className="last-updated">Last Updated: January 2, 2025</p>

        <div className="legal-content">
          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using Budget BOOM ("the Service," "we," "us," or "our"), you ("User," "you," or "your")
              agree to be bound by these Terms of Service ("Terms"). If you do not agree to all of these Terms,
              you may not access or use the Service. These Terms constitute a legally binding agreement between
              you and Budget BOOM.
            </p>
            <p>
              We reserve the right to modify these Terms at any time. Your continued use of the Service after
              any changes constitutes acceptance of the new Terms. We will make reasonable efforts to notify
              users of material changes via email or through the Service.
            </p>
          </section>

          <section>
            <h2>2. Description of Service</h2>
            <p>
              Budget BOOM is a personal finance management tool that allows users to upload bank statements,
              categorize transactions, and receive budget insights. The Service uses automated technology
              to analyze financial data and provide recommendations.
            </p>
            <p>
              <strong>THE SERVICE IS PROVIDED FOR INFORMATIONAL AND EDUCATIONAL PURPOSES ONLY. BUDGET BOOM
              DOES NOT PROVIDE FINANCIAL, INVESTMENT, TAX, LEGAL, OR ACCOUNTING ADVICE.</strong> Any information
              provided through the Service should not be considered as such. You should consult with qualified
              professionals for advice specific to your situation.
            </p>
          </section>

          <section>
            <h2>3. Eligibility</h2>
            <p>
              You must be at least 18 years old and have the legal capacity to enter into contracts to use this Service.
              By using the Service, you represent and warrant that you meet these requirements. If you are using
              the Service on behalf of an organization, you represent that you have authority to bind that organization
              to these Terms.
            </p>
          </section>

          <section>
            <h2>4. Account Registration and Security</h2>
            <p>
              To use certain features of the Service, you must create an account. You agree to:
            </p>
            <ul>
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security and confidentiality of your login credentials</li>
              <li>Notify us immediately of any unauthorized access to your account</li>
              <li>Accept responsibility for all activities that occur under your account</li>
            </ul>
            <p>
              We reserve the right to suspend or terminate accounts that contain inaccurate information or
              violate these Terms.
            </p>
          </section>

          <section>
            <h2>5. User Data and Bank Statements</h2>
            <p>
              By uploading bank statements or other financial documents to the Service, you represent and warrant that:
            </p>
            <ul>
              <li>You are the lawful owner of the account(s) reflected in the documents, or have explicit authorization from the owner</li>
              <li>The documents are authentic and have not been altered or falsified</li>
              <li>You have the right to share this information with us</li>
              <li>Your use of the Service does not violate any agreements with your financial institution(s)</li>
            </ul>
            <p>
              You retain ownership of all data you upload. By uploading data, you grant us a limited, non-exclusive
              license to process, analyze, and store your data solely for the purpose of providing the Service to you.
            </p>
          </section>

          <section>
            <h2>6. Prohibited Uses</h2>
            <p>You agree not to use the Service to:</p>
            <ul>
              <li>Violate any applicable laws, regulations, or third-party rights</li>
              <li>Upload fraudulent, falsified, or misleading financial documents</li>
              <li>Attempt to gain unauthorized access to the Service or its systems</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Use automated systems (bots, scrapers) to access the Service without permission</li>
              <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
              <li>Use the Service for money laundering or other illegal financial activities</li>
              <li>Upload malicious code, viruses, or harmful data</li>
              <li>Impersonate any person or entity</li>
              <li>Collect or harvest user data without authorization</li>
              <li>Use the Service for commercial purposes without our written consent</li>
            </ul>
          </section>

          <section>
            <h2>7. Intellectual Property</h2>
            <p>
              The Service, including its original content, features, functionality, design, logos, and trademarks,
              is owned by Budget BOOM and is protected by copyright, trademark, and other intellectual property laws.
              You may not copy, modify, distribute, sell, or lease any part of the Service without our prior
              written consent.
            </p>
            <p>
              You may not use our name, logo, or trademarks without our prior written permission.
            </p>
          </section>

          <section>
            <h2>8. Third-Party Services</h2>
            <p>
              The Service may contain links to or integrations with third-party websites, services, or applications.
              We are not responsible for the content, privacy practices, or practices of any third parties.
              Your use of third-party services is at your own risk and subject to their terms and conditions.
            </p>
          </section>

          <section>
            <h2>9. Disclaimer of Warranties</h2>
            <p>
              <strong>THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
              EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:</strong>
            </p>
            <ul>
              <li>IMPLIED WARRANTIES OF MERCHANTABILITY</li>
              <li>FITNESS FOR A PARTICULAR PURPOSE</li>
              <li>NON-INFRINGEMENT</li>
              <li>ACCURACY, RELIABILITY, OR COMPLETENESS OF CONTENT</li>
              <li>UNINTERRUPTED OR ERROR-FREE SERVICE</li>
              <li>SECURITY OF DATA TRANSMISSIONS</li>
            </ul>
            <p>
              We do not warrant that the Service will meet your requirements, that results obtained from using
              the Service will be accurate or reliable, or that any errors will be corrected.
            </p>
            <p>
              <strong>WE MAKE NO WARRANTY REGARDING THE ACCURACY OF ANY FINANCIAL CALCULATIONS, CATEGORIZATIONS,
              OR RECOMMENDATIONS PROVIDED BY THE SERVICE. YOU ARE SOLELY RESPONSIBLE FOR VERIFYING ALL
              INFORMATION AND MAKING YOUR OWN FINANCIAL DECISIONS.</strong>
            </p>
          </section>

          <section>
            <h2>10. Limitation of Liability</h2>
            <p>
              <strong>TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL BUDGET BOOM, ITS
              OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, PARTNERS, SUPPLIERS, OR AFFILIATES BE LIABLE FOR ANY:</strong>
            </p>
            <ul>
              <li>INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES</li>
              <li>LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES</li>
              <li>DAMAGES RESULTING FROM UNAUTHORIZED ACCESS TO OR USE OF OUR SERVERS OR YOUR DATA</li>
              <li>DAMAGES RESULTING FROM INTERRUPTION OR CESSATION OF THE SERVICE</li>
              <li>DAMAGES RESULTING FROM ANY BUGS, VIRUSES, OR OTHER HARMFUL CODE</li>
              <li>DAMAGES RESULTING FROM ANY CONTENT OR CONDUCT OF THIRD PARTIES</li>
              <li>DAMAGES RESULTING FROM YOUR RELIANCE ON ANY INFORMATION PROVIDED BY THE SERVICE</li>
              <li>FINANCIAL LOSSES RESULTING FROM DECISIONS MADE BASED ON SERVICE DATA OR RECOMMENDATIONS</li>
            </ul>
            <p>
              <strong>OUR TOTAL LIABILITY FOR ALL CLAIMS ARISING FROM OR RELATING TO THE SERVICE SHALL NOT
              EXCEED THE AMOUNT YOU PAID TO US, IF ANY, IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM,
              OR ONE HUNDRED DOLLARS ($100), WHICHEVER IS GREATER.</strong>
            </p>
            <p>
              Some jurisdictions do not allow the exclusion or limitation of certain damages. In such jurisdictions,
              our liability shall be limited to the maximum extent permitted by law.
            </p>
          </section>

          <section>
            <h2>11. Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless Budget BOOM and its officers, directors, employees,
              agents, partners, suppliers, and affiliates from and against any and all claims, damages, obligations,
              losses, liabilities, costs, or debt, and expenses (including attorney's fees) arising from:
            </p>
            <ul>
              <li>Your use of and access to the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party right, including intellectual property or privacy rights</li>
              <li>Any claim that your data caused damage to a third party</li>
              <li>Your violation of any applicable laws or regulations</li>
            </ul>
          </section>

          <section>
            <h2>12. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Service immediately, without prior notice
              or liability, for any reason, including but not limited to:
            </p>
            <ul>
              <li>Breach of these Terms</li>
              <li>Suspected fraudulent, abusive, or illegal activity</li>
              <li>Request by law enforcement or government agencies</li>
              <li>Discontinuation of the Service</li>
              <li>Extended periods of inactivity</li>
            </ul>
            <p>
              Upon termination, your right to use the Service will immediately cease. Provisions of these Terms
              that by their nature should survive termination shall survive, including ownership provisions,
              warranty disclaimers, indemnification, and limitations of liability.
            </p>
            <p>
              You may terminate your account at any time by contacting us. Upon termination, we will delete
              your account data in accordance with our Privacy Policy.
            </p>
          </section>

          <section>
            <h2>13. Dispute Resolution and Arbitration</h2>
            <p>
              <strong>PLEASE READ THIS SECTION CAREFULLY. IT AFFECTS YOUR LEGAL RIGHTS, INCLUDING YOUR RIGHT
              TO FILE A LAWSUIT IN COURT.</strong>
            </p>
            <p>
              Any dispute, controversy, or claim arising out of or relating to these Terms or the Service shall
              be resolved through binding arbitration, rather than in court, except that you may assert claims
              in small claims court if your claims qualify.
            </p>
            <p>
              <strong>CLASS ACTION WAIVER:</strong> YOU AND BUDGET BOOM AGREE THAT EACH MAY BRING CLAIMS AGAINST
              THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY
              PURPORTED CLASS OR REPRESENTATIVE PROCEEDING.
            </p>
            <p>
              Arbitration shall be conducted by the American Arbitration Association (AAA) under its Consumer
              Arbitration Rules. The arbitration shall take place in the United States, and judgment on the
              arbitration award may be entered in any court of competent jurisdiction.
            </p>
            <p>
              <strong>Opt-Out:</strong> You may opt out of this arbitration agreement by sending written notice
              to us within 30 days of first accepting these Terms. Your notice must include your name, address,
              email, and a clear statement that you wish to opt out of the arbitration agreement.
            </p>
          </section>

          <section>
            <h2>14. Governing Law</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the State of California,
              United States, without regard to its conflict of law provisions. Any legal action or proceeding
              not subject to arbitration shall be brought exclusively in the federal or state courts located
              in Los Angeles County, California.
            </p>
          </section>

          <section>
            <h2>15. Changes to Service</h2>
            <p>
              We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any
              time, with or without notice. We shall not be liable to you or any third party for any modification,
              suspension, or discontinuation of the Service.
            </p>
          </section>

          <section>
            <h2>16. Severability</h2>
            <p>
              If any provision of these Terms is found to be unenforceable or invalid, that provision shall be
              limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain
              in full force and effect.
            </p>
          </section>

          <section>
            <h2>17. Waiver</h2>
            <p>
              Our failure to enforce any right or provision of these Terms shall not constitute a waiver of
              such right or provision. Any waiver must be in writing and signed by us.
            </p>
          </section>

          <section>
            <h2>18. Entire Agreement</h2>
            <p>
              These Terms, together with our Privacy Policy, constitute the entire agreement between you and
              Budget BOOM regarding the Service and supersede all prior agreements, understandings, and
              communications, whether written or oral.
            </p>
          </section>

          <section>
            <h2>19. Assignment</h2>
            <p>
              You may not assign or transfer these Terms or your rights hereunder without our prior written consent.
              We may assign these Terms without restriction.
            </p>
          </section>

          <section>
            <h2>20. Contact Information</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
            </p>
            <p>
              <strong>Email:</strong> legal@budgetboom.io<br />
              <strong>Website:</strong> https://budgetboom.io
            </p>
          </section>

          <section>
            <h2>21. Electronic Communications</h2>
            <p>
              By using the Service, you consent to receive electronic communications from us. These communications
              may include notices about your account and information concerning or related to the Service. You
              agree that any notices, agreements, disclosures, or other communications that we send to you
              electronically will satisfy any legal communication requirements.
            </p>
          </section>

          <section>
            <h2>22. California Residents</h2>
            <p>
              If you are a California resident, you may have additional rights under the California Consumer
              Privacy Act (CCPA). Please see our Privacy Policy for more information.
            </p>
            <p>
              Under California Civil Code Section 1789.3, California users are entitled to the following consumer
              rights notice: The Service is provided by Budget BOOM. If you have a question or complaint regarding
              the Service, please contact us at the email address above. California residents may reach the
              Complaint Assistance Unit of the Division of Consumer Services of the California Department of
              Consumer Affairs by mail at 1625 North Market Blvd., Sacramento, CA 95834, or by telephone at
              (916) 445-1254 or (800) 952-5210.
            </p>
          </section>

          <section>
            <h2>23. International Users</h2>
            <p>
              The Service is controlled and operated from the United States. If you access the Service from
              outside the United States, you do so at your own risk and are responsible for compliance with
              local laws. We make no representation that the Service is appropriate or available in locations
              outside the United States.
            </p>
          </section>

          <section>
            <h2>24. Force Majeure</h2>
            <p>
              We shall not be liable for any failure or delay in performing our obligations where such failure
              or delay results from any cause beyond our reasonable control, including but not limited to
              natural disasters, war, terrorism, riots, embargoes, acts of civil or military authorities,
              fire, floods, accidents, strikes, or shortages of transportation, facilities, fuel, energy,
              labor, or materials.
            </p>
          </section>

          <section>
            <h2>25. Beta Services</h2>
            <p>
              We may offer certain features or services on a beta or early access basis. Such features are
              provided "as is" and may contain bugs or errors. We make no warranties regarding beta features
              and reserve the right to discontinue them at any time.
            </p>
          </section>
        </div>

        <div className="legal-footer">
          <p>By using Budget BOOM, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.</p>
          <Link to="/privacy" className="legal-link">View Privacy Policy →</Link>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
