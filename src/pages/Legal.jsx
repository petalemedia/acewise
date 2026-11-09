import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { StudyTopbar } from '@/components/study/StudyTopbar'
import LegalLinks from '@/components/legal/LegalLinks'
import { CookieSettingsButton } from '@/components/legal/CookieConsent'
import '@/components/legal/legal.css'

const contact = <a href="mailto:petalemedia@gmail.com">petalemedia@gmail.com</a>
const pages = {
  privacy: { title: 'Privacy Policy', sections: [
    ['Who operates this website', <><strong>Revise It</strong> is operated by <strong>Petale Media</strong>, based in Denmark. Petale Media is responsible for the personal information described here. Contact us at {contact} with privacy questions or requests.</>],
    ['Information we use', 'When you create an account, we use your email address, chosen username and authentication information. We save your XP, daily streak, last visit date, question answers and attempts, completed notes, bookmarks and study location to provide your account and progress features. Guest progress and annotations are stored in your browser.'],
    ['Why we use it', 'We use account details and saved progress to provide the service you request (performance of our agreement with you). Technical security and diagnostic information is used to keep the service working and prevent abuse (our legitimate interests). Any future optional tracking that requires consent must be explained and enabled only after you agree.'],
    ['Services that receive information', <>Appwrite processes accounts, sessions and cloud progress for us. The current project endpoint is hosted in Appwrite’s Frankfurt region. Appwrite and our hosting provider may process connection information such as IP addresses, timestamps and browser details when serving the site or API. Fonts are hosted locally from our own server so no font requests are sent to external third parties. We do not sell personal information. See <a href="https://appwrite.io/privacy" target="_blank" rel="noreferrer">Appwrite’s privacy information</a>.</>],
    ['Storage and retention', 'Account data and saved progress are retained while your account is in use, unless you request deletion or a legal requirement requires retention. Browser progress stays until you clear it or your browser removes it. Cookie choices expire after 180 days. Session duration is controlled by the authentication service. Provider security logs and backups follow the relevant provider’s retention settings.'],
    ['Your choices and rights', <>You can request access, correction, deletion, restriction, portability or object to processing where applicable by emailing {contact}. You can withdraw optional cookie consent through Cookie settings. You can also complain to the Danish supervisory authority, <a href="https://www.datatilsynet.dk/english" target="_blank" rel="noreferrer">Datatilsynet</a>. We will assess and respond to requests under applicable data protection law.</>],
    ['Students and younger users', <>We aim to explain data use in clear language and collect only information needed for studying. If you are unsure whether you may create an account, ask a parent or guardian. Parents or guardians can contact {contact} about a child’s account. We do not use advertising profiles or behavioural advertising.</>],
    ['Updates', 'We may update this notice as the service changes. The revision date below identifies the current version. Material changes to how personal information is used will be explained on the website.'],
  ] },
  terms: { title: 'Terms of Use', sections: [
    ['Using Revise It', <>These terms cover the website operated by Petale Media in Denmark. Contact: {contact}. By using the website, you agree to use it responsibly and lawfully.</>],
    ['Accounts', 'Provide accurate account information, keep your password private and do not share access to another person’s account. You are responsible for activity under your account. Contact us if you suspect someone else has accessed it.'],
    ['Study resources', 'The website offers educational notes and practice resources. Coverage varies by subject; some resources are marked Coming soon. Resources may contain errors and are not a replacement for your teacher, official syllabus or examination-board guidance. We cannot promise a particular exam result.'],
    ['Acceptable use', 'Do not interfere with the service, attempt unauthorised access, misuse other people’s information, manipulate progress records or distribute material in breach of applicable rights. Access may be restricted where reasonably necessary to address misuse or protect users.'],
    ['Content and examination boards', 'Rights in examination material, names and marks remain with their respective owners. Use content for personal study only where permitted by the relevant rights holder. Revise It is independent and is not endorsed by or affiliated with Cambridge International or another examination board. Attribution or source links do not grant permission to redistribute material.'],
    ['Progress and availability', 'Saved progress depends on a working connection and the service being available. Browser-only data can be lost when storage is cleared. We take reasonable care but cannot guarantee uninterrupted availability or that content is error-free. Nothing in these terms excludes rights or liability that cannot lawfully be excluded.'],
    ['Changes and contact', <>Features and these terms may change as the website develops. Material changes will be communicated on the site. Contact {contact} about access, account closure or these terms. Applicable mandatory consumer rights remain unaffected.</>],
  ] },
  cookies: { title: 'Cookie Policy', sections: [
    ['Cookies and browser storage', 'Cookies and similar storage let the website remember information between visits. This includes local storage, which holds study information directly in your browser.'],
    ['Sign-in sessions', 'Appwrite uses secure session cookies for login and may use browser storage as a fallback when session cookies are blocked. These are necessary for account access. Signing out ends the current session; clearing browser data also removes local session information.'],
    ['Study storage', 'Keys beginning with chemistry-, biology-, physics- or study- store progress, answers, highlights, bookmarks, navigation settings, cloud-sync status and your choices. Some are stored separately for each account on shared devices. Session storage remembers temporary scroll positions. These support features you use and do not track you across websites.'],
    ['Your cookie choice', <><code>study-cookie-choice</code> remembers your choice for 180 days. You can change it any time using <CookieSettingsButton/>. Rejecting optional cookies does not block studying, sign-in or saving progress.</>],
    ['Optional technologies', 'No advertising cookies or optional analytics are currently installed. Allowing optional cookies records your preference only; it does not currently enable any additional tracking. We will update this policy and request a new choice before introducing different optional purposes. Fonts are self-hosted directly without third-party requests.'],
    ['Managing storage', 'Your browser settings let you view, block or delete cookies and local storage. Deleting study storage removes unsynced progress and annotations. Cloud progress can be restored when you sign in if it has successfully synced. Blocking essential storage may prevent sign-in or remembering progress.'],
  ] },
  contact: { title: 'Contact', sections: [
    ['Petale Media', <>Revise It is operated by Petale Media in Denmark. Email {contact} for account support, privacy requests, accessibility issues, copyright concerns or corrections to study resources.</>],
    ['Reporting a question', 'The Report an issue button currently flags a question in your own browser; it does not send a support message. To send a correction, email the topic, question number, source paper if available, and a description of the issue. Please do not include your password.'],
  ] },
}

export default function Legal({ page }) {
  const params = useParams()
  const content = pages[page || params.page] || pages.privacy
  return <div className="legal-page"><StudyTopbar home/><main className="legal-content"><Link className="legal-back" to="/"><ArrowLeft aria-hidden="true"/>Back to homepage</Link><h1>{content.title}</h1><p className="legal-updated">Last updated 8 November 2026</p>{content.sections.map(([heading, body]) => <section key={heading}><h2>{heading}</h2><p>{body}</p></section>)}</main><LegalLinks/></div>
}
