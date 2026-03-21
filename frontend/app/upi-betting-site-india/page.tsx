import { Metadata } from "next";
import { SEOLandingTemplate } from "@/components/seo-landing-template";

export const metadata: Metadata = {
  title: "UPI Betting Site India | Secure & Instant Deposits | JSR Sports",
  description: "Experience lightning-fast transactions with the leading UPI betting site in India. Instant ID creation, rapid payouts, and seamless deposits on JSR Sports.",
  alternates: { canonical: "https://jsrsports.in/upi-betting-site-india" },
  openGraph: {
    title: "UPI Betting Site India | Instant UPI Deposits",
    description: "Experience lightning-fast transactions with the leading UPI betting site in India. JSR Sports offers unparalleled reliability for UPI users.",
    url: "https://jsrsports.in/upi-betting-site-india",
    images: [{ url: "/hero_premium.png" }],
  }
};

export default function UPIBettingSite() {
  return (
    <SEOLandingTemplate
      title="India's Premium UPI Betting Site"
      subtitle="Instant Deposits • Instant Withdrawals"
      intro="Say goodbye to delayed payments and bank transfer hassles. As the foremost UPI betting site in India, JSR Sports guarantees seamless Google Pay, PhonePe, and PayTM integration for your gaming needs."
      contentSections={[
        {
          heading: "Instant Verification via UPI",
          paragraphs: [
            "We understand that in the fast-paced world of live sports betting, every second counts. As a top-rated UPI betting site in India, our infrastructure supports instantaneous confirmation of your deposits without hidden processing fees.",
            "Just request a deposit address, transfer securely via your trusted UPI app, and send us the screenshot. Your balance reflects in your exchange id immediately, allowing you to catch the most lucrative odds on time."
          ]
        },
        {
          heading: "Robust Transaction Security",
          paragraphs: [
            "Your funds are your ultimate priority. By relying entirely on India's secured UPI backend systems, our payment gateways encrypt and verify transfers safely. Enjoy absolute peace of mind when depositing or requesting withdrawals.",
            "Choose a UPI betting platform that prioritizes customer trust above all, minimizing downtimes and fully avoiding unverified third-party merchant handlers."
          ]
        }
      ]}
    />
  );
}
