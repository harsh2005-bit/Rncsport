import { Metadata } from "next";
import { SEOLandingTemplate } from "@/components/seo-landing-template";

export const metadata: Metadata = {
  title: "Online Betting ID in India | Get Your Premium Account | JSR Sports",
  description: "Get your official online betting ID in India instantly via WhatsApp. Join JSR Sports to receive an authorized ID for major Indian betting exchanges.",
  alternates: { canonical: "https://jsrsports.in/online-betting-id-india" },
  openGraph: {
    title: "Online Betting ID in India | Get Your Premium Account Now",
    description: "Get your official online betting ID in India instantly via WhatsApp. Join JSR Sports to receive an authorized ID.",
    url: "https://jsrsports.in/online-betting-id-india",
    images: [{ url: "/hero_premium.png" }],
  }
};

export default function OnlineBettingId() {
  return (
    <SEOLandingTemplate
      title="Online Betting ID in India"
      subtitle="Secure & Master Exchange Access"
      intro="Acquiring an online betting ID in India should be fast, discreet, and reliable. Connect with JSR Sports through WhatsApp to attain your authentic master profile without tedious web registrations."
      contentSections={[
        {
          heading: "Attain Your Verified Online Betting ID",
          paragraphs: [
            "We serve as the absolute bridge for placing live wagers. Our 24/7 service infrastructure lets you secure an online betting ID in India tailored explicitly for major platforms like All Panel, Go Exchange, and 11xSports.",
            "Each betting ID offers encrypted login, complete fund segregation, and unfiltered live market streams directly onto your device."
          ]
        },
        {
          heading: "Premium Exchange Capabilities",
          paragraphs: [
            "After linking your WhatsApp to our customer support backend, you receive a full profile package containing your login handle, password reset instructions, and access limits.",
            "A JSR Sports online betting ID grants you unconditional capability to trade odds like a professional. You can deposit easily via UPI, verify funds swiftly, and scale up your betting activity flawlessly."
          ]
        }
      ]}
    />
  );
}
