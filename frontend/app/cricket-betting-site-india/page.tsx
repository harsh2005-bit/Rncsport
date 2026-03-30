import { Metadata } from "next";
import { SEOLandingTemplate } from "@/components/seo-landing-template";

export const metadata: Metadata = {
  title: "Top Cricket Betting Site in India | JSR Sports",
  description: "Bet on IPL, international test series, and T20 matches with the top cricket betting site in India. Get high odds and instant ID approval on JSR Sports.",
  alternates: { canonical: "https://jsrsports.in/cricket-betting-site-india" },
  openGraph: {
    title: "Top Cricket Betting Site in India | JSR Sports",
    description: "Bet on IPL, international test series, and T20 matches with the top cricket betting site in India.",
    url: "https://jsrsports.in/cricket-betting-site-india",
    images: [{ url: "/hero_premium.png" }],
  }
};

export default function CricketBettingSite() {
  return (
    <SEOLandingTemplate
      title="Top Cricket Betting Site in India"
      subtitle="Live Odds • Official Exchanges • IPL Ready"
      intro="Join India's most passionate cricket betting community. With JSR Sports, step into a specialized cricket betting site in India featuring live metrics, unbeatable odds, and massive match coverages."
      contentSections={[
        {
          heading: "Unrivaled IPL and International Markets",
          paragraphs: [
            "The thrill of cricket is deeply embedded in India's culture. To match this enthusiasm, our cricket betting site provides comprehensive access to the biggest premier leagues globally including the IPL, Big Bash, and all major ICC events.",
            "We supply our users exclusively with official premium exchange IDs such as All Panel and 11xSports, known for featuring the finest live odds liquidity available."
          ]
        },
        {
          heading: "Session Betting and Live Fancy Market",
          paragraphs: [
            "A true cricket betting site in India is incomplete without a robust fancy market. Predict run rates, over-by-over milestones, and individual player outcomes in real-time. Our zero-delay platforms ensure your bets are placed instantly when the odds are at their absolute peak.",
            "With instant access to funds via our 24/7 dedicated operations channel, you'll never face an interruption during those crucial last-over moments."
          ]
        }
      ]}
    />
  );
}
