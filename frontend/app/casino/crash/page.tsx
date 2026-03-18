"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/lib/use-socket";
import { motion } from "framer-motion";
import { ArrowLeft, Rocket, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CrashPage() {
  const router = useRouter();
  const socket = useSocket();
  const [multiplier, setMultiplier] = useState(1.0);
  const [isCrashed, setIsCrashed] = useState(false);
  const [gameState, setGameState] = useState<"idle" | "playing" | "crashed">("idle");
  const [betAmount, setBetAmount] = useState("10.00");
  const [hasBet, setHasBet] = useState(false);
  const [dummyPlayers, setDummyPlayers] = useState<{id: number, username: string, bet: string}[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  
  // Array to store history of multiplier points for drawing the curve
  const pointsRef = useRef<{x: number, y: number}[]>([]);
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    // Generate some dummy players on mount to avoid impurity issues during render
    const players = Array.from({length: 5}).map((_, i) => ({
      id: i,
      username: `User${Math.floor(Math.random() * 9000) + 1000}`,
      bet: (Math.random() * 100).toFixed(2)
    }));
    setDummyPlayers(players);
  }, []);

  useEffect(() => {
    if (!socket) return;
    
    // Drawing the curve locally to the effect so we don't need to add it to dependencies
    const drawCurve = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const width = canvas.width;
      const height = canvas.height;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < height; i += 40) {
        ctx.moveTo(0, i);
        ctx.lineTo(width, i);
      }
      for (let i = 0; i < width; i += 40) {
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
      }
      ctx.stroke();

      const points = pointsRef.current;
      if (points.length < 2) {
          if (gameState === "playing") {
               animationRef.current = requestAnimationFrame(drawCurve);
          }
          return;
      }

      const maxElapsed = Math.max(5000, points[points.length - 1].x); 
      const maxMult = Math.max(2.0, points[points.length - 1].y);

      const padding = 20;
      const graphWidth = width - padding * 2;
      const graphHeight = height - padding * 2;

      const mapX = (x: number) => padding + (x / maxElapsed) * graphWidth;
      const mapY = (y: number) => height - padding - ((y - 1) / (maxMult - 1)) * graphHeight;

      ctx.beginPath();
      ctx.moveTo(mapX(points[0].x), mapY(points[0].y));
      for (let i = 1; i < points.length; i++) {
        ctx.lineTo(mapX(points[i].x), mapY(points[i].y));
      }

      ctx.strokeStyle = isCrashed ? "#ef4444" : "#00e701"; 
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();

      ctx.lineTo(mapX(points[points.length - 1].x), height - padding);
      ctx.lineTo(mapX(points[0].x), height - padding);
      ctx.closePath();
      
      const gradient = ctx.createLinearGradient(0, mapY(points[points.length-1].y), 0, height);
      gradient.addColorStop(0, isCrashed ? "rgba(239, 68, 68, 0.2)" : "rgba(0, 231, 1, 0.2)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = gradient;
      ctx.fill();

      const endX = mapX(points[points.length - 1].x);
      const endY = mapY(points[points.length - 1].y);
      
      ctx.beginPath();
      ctx.arc(endX, endY, 6, 0, Math.PI * 2);
      ctx.fillStyle = isCrashed ? "#ef4444" : "#ffffff";
      ctx.fill();

      if (gameState === "playing") {
        animationRef.current = requestAnimationFrame(drawCurve);
      }
    };

    socket.on("connect", () => {
      console.log("Connected to game server");
      socket.emit("joinGame", "crash");
    });

    socket.on("gameStarted", () => {
      setMultiplier(1.0);
      setIsCrashed(false);
      setGameState("playing");
      pointsRef.current = [];
      startTimeRef.current = Date.now();
      
      // Start drawing
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      drawCurve();
    });

    socket.on("crashUpdate", (data: { multiplier: number }) => {
      setMultiplier(data.multiplier);
      
      // Add point to draw later
      const elapsed = Date.now() - startTimeRef.current;
      pointsRef.current.push({ x: elapsed, y: data.multiplier });
    });

    socket.on("gameCrashed", (data: { multiplier: number }) => {
      setMultiplier(data.multiplier);
      setIsCrashed(true);
      setGameState("crashed");
      setHasBet(false);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      drawCurve(); // Final draw
    });

    return () => {
      socket.emit("leaveGame", "crash");
      socket.off("connect");
      socket.off("gameStarted");
      socket.off("crashUpdate");
      socket.off("gameCrashed");
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [socket, gameState, isCrashed]);

  const handlePlaceBet = () => {
    // Implement API call to place bet
    setHasBet(true);
    // In a real app, you'd send this to the backend
  };

  const handleCashout = () => {
    // Implement API call to cashout
    setHasBet(false);
  };


  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-20">
      <button 
        onClick={() => router.back()}
        className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Casino
      </button>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Side: Game UI */}
        <div className="flex-1 bg-secondary/20 border border-border rounded-3xl p-6 flex flex-col items-center justify-center relative min-h-[500px] overflow-hidden">
          
          {/* Canvas for the curve */}
          <canvas 
            ref={canvasRef} 
            width={800} 
            height={500} 
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          />

          {/* Central Multiplier Display */}
          <div className="relative z-10 flex flex-col items-center">
            <motion.div 
              key={multiplier}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className={cn(
                "text-8xl font-black tabular-nums tracking-tighter",
                isCrashed ? "text-red-500" : "text-white"
              )}
            >
              {multiplier.toFixed(2)}x
            </motion.div>
            
            {isCrashed && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center bg-red-500/10 text-red-500 px-4 py-2 rounded-xl border border-red-500/20 font-bold uppercase tracking-widest text-sm"
              >
                <AlertCircle className="w-5 h-5 mr-2" /> Crashed
              </motion.div>
            )}
            
            {gameState === "idle" && (
                <div className="mt-4 text-muted-foreground font-medium animate-pulse">
                    Waiting for next game to start...
                </div>
            )}
          </div>
        </div>

        {/* Right Side: Bet Controls */}
        <div className="w-full lg:w-[350px] space-y-4">
          <div className="bg-secondary/30 border border-border rounded-2xl p-6 space-y-6">
            <h3 className="font-black text-xl flex items-center gap-2">
                <Rocket className="w-5 h-5 text-primary" /> Crash
            </h3>

            <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Bet Amount</label>
                <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                <input 
                    type="number" 
                    value={betAmount}
                    onChange={(e) => setBetAmount(e.target.value)}
                    disabled={gameState === "playing"}
                    className="w-full bg-background border border-border rounded-xl py-4 pl-8 pr-4 text-xl font-black focus:outline-none focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
                />
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {["1/2", "x2", "+10", "Max"].map((opt) => (
                    <button key={opt} disabled={gameState === "playing"} className="py-2 bg-background border border-border rounded-xl text-xs font-black hover:border-primary transition-all disabled:opacity-50">{opt}</button>
                    ))}
                </div>
            </div>

            {gameState === "playing" && hasBet ? (
                <button 
                    onClick={handleCashout}
                    className="w-full bg-yellow-500 text-yellow-950 font-black py-4 rounded-xl hover:brightness-110 transition-all shadow-lg shadow-yellow-500/20 text-xl"
                >
                    Cashout {(parseFloat(betAmount) * multiplier).toFixed(2)}
                </button>
            ) : (
                <a 
                    href="https://wa.me/447735378047"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center flex items-center justify-center bg-primary text-primary-foreground font-black py-4 rounded-xl hover:brightness-110 transition-all glow-primary shadow-xl shadow-primary/20 text-xl"
                >
                    Contact Support to Bet
                </a>
            )}

          </div>

          <div className="bg-secondary/20 border border-border rounded-2xl p-4 max-h-[300px] overflow-y-auto">
             <h4 className="text-xs font-bold uppercase text-muted-foreground mb-4 sticky top-0 bg-secondary/80 backdrop-blur-sm p-1 rounded">Players</h4>
             <div className="space-y-2">
                {dummyPlayers.map((player) => (
                    <div key={player.id} className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-secondary/50">
                        <span className="font-medium">{player.username}</span>
                        <span className="font-black text-primary">₹{player.bet}</span>
                    </div>
                ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
