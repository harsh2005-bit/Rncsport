import { Metadata } from "next";
import { SEOLandingTemplate } from "@/components/seo-landing-template";

export const metadata: Metadata = {
  title: "Best Betting Site in India | JSR Sports Premium Access",
  description: "Looking for the best betting site in India? Discover JSR Sports for instant live cricket betting, fast UPI deposits, seamless withdrawals, and top-tier exchanges.",
  alternates: { canonical: "https://jsrsports.in/best-betting-site-india" },
  openGraph: {
    title: "Best Betting Site in India | JSR Sports",
    description: "Join JSR Sports for instant live cricket betting, fast UPI deposits, and immediate 24/7 account support in India.",
    url: "https://jsrsports.in/best-betting-site-india",
    images: [{ url: "/hero_premium.png" }],
  }
};

export default function BestBettingSite() {
  return (
    <SEOLandingTemplate
      title="Best Betting Site in India"
      subtitle="Ultimate Experience for Cricket & Casino"
      intro="For years, JSR Sports has served millions of players as the best betting site in India. We pride ourselves on absolute trust, transparent odds, and the fastest settlement times in the industry."
      contentSections={[
        {
          heading: "Why We Are the Best Betting Site in India",
          paragraphs: [
            "With thousands of matches and events happening daily, finding a reliable and secure platform is essential. Here at JSR Sports, we deliver the definitive betting experience with premium features specifically tailored for the Indian audience.",
            "Our platform is renowned for offering exclusive access to leading exchanges like All Panel and Go Exch. We completely bypass the cumbersome verification layers of traditional sites to get you playing instantly."
          ]
        },
        {
          heading: "Unmatched Support and Reliability",
          paragraphs: [
            "What makes us the best betting site in India isn't just our variety of cricket markets or our selection of live casino games—it is our unwavering commitment to our users through 24/7 dedicated WhatsApp support.",
            "Whether you need an immediate withdrawal during an ongoing match or simply need a deposit verified, our support executives resolve queries in under two minutes, leading to unparalleled user satisfaction."
          ]
        }
      ]}
    />
  );
}
