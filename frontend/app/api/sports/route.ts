import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const generateOdds = (base: number) => (base + (Math.random() * 0.4 - 0.2)).toFixed(2);
  const generateScore = (max: number) => Math.floor(Math.random() * max);

  const ALL_MATCHES = [
    // Soccer
    { 
      id: 1, sport: "soccer", tab: "Live Matches", league: "Premier League", 
      team1: "Manchester City", team2: "Arsenal", 
      odds: [generateOdds(1.45), generateOdds(4.20), generateOdds(6.80)], 
      time: `Live ${60 + Math.floor(Math.random() * 20)}'`, 
      score: `${generateScore(3)} - ${generateScore(3)}` 
    },
    { 
      id: 2, sport: "soccer", tab: "Live Matches", league: "La Liga", 
      team1: "Real Madrid", team2: "Barcelona", 
      odds: [generateOdds(2.10), generateOdds(3.40), generateOdds(3.10)], 
      time: `Live ${10 + Math.floor(Math.random() * 30)}'`, 
      score: `${generateScore(2)} - ${generateScore(2)}` 
    },
    { id: 3, sport: "soccer", tab: "Upcoming", league: "Champions League", team1: "Bayern Munich", team2: "PSG", odds: ["1.85", "3.75", "4.00"], time: "Tomorrow 01:15", score: "0 - 0" },
    { id: 4, sport: "soccer", tab: "Top Leagues", league: "Serie A", team1: "Juventus", team2: "AC Milan", odds: ["2.50", "3.10", "2.80"], time: "Sat 20:45", score: "0 - 0" },
    
    // Cricket
    { 
      id: 5, sport: "cricket", tab: "Live Matches", league: "IPL", 
      team1: "CSK", team2: "MI", 
      odds: [generateOdds(1.90), "-", generateOdds(1.90)], 
      time: `Live 1${4 + Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 6)} Ov`, 
      score: `1${20 + generateScore(40)}/${2 + generateScore(3)}` 
    },
    { id: 6, sport: "cricket", tab: "Upcoming", league: "T20 World Cup", team1: "India", team2: "Australia", odds: ["1.75", "-", "2.10"], time: "Sun 19:30", score: "0/0" },

    // Tennis
    { 
      id: 7, sport: "tennis", tab: "Live Matches", league: "Wimbledon", 
      team1: "Alcaraz C.", team2: "Djokovic N.", 
      odds: [generateOdds(1.80), "-", generateOdds(2.05)], 
      time: "Live S2", 
      score: `${generateScore(2)} - ${generateScore(2)}` 
    },
    
    // Basketball
    { id: 8, sport: "basketball", tab: "Upcoming", league: "NBA", team1: "Lakers", team2: "Warriors", odds: ["2.10", "-", "1.75"], time: "Tomorrow 08:00", score: "0 - 0" },

    // Esports
    { 
      id: 9, sport: "esports", tab: "Live Matches", league: "CS:GO Major", 
      team1: "NAVI", team2: "FaZe", 
      odds: [generateOdds(1.65), "-", generateOdds(2.20)], 
      time: "Live Map 2", 
      score: `${generateScore(2)} - ${generateScore(2)}` 
    },
  ];

  return NextResponse.json(ALL_MATCHES);
}
