'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer, Activity, Trophy, Star, AlertTriangle } from "lucide-react";
import type { Fighter } from '@/lib/api';
import { BackgroundPattern } from '@/components/fight/background-pattern';
import { SpotlightEffects } from '@/components/fight/SpotlightEffects';
import { Notifications } from '@/components/fight/Notifications';
import { HeaderBanner } from '@/components/fight/HeaderBanner';
import { FighterShowcase } from '@/components/fight/FighterShowcase';
import { VsSection } from '@/components/fight/VsSection';
import { TimerProgress } from '@/components/fight/TimerProgress';
import { FighterStats } from '@/components/fight/FighterStats';
import { CommentarySection } from '@/components/fight/CommentarySection';
import { FightHistory } from '@/components/fight/FightHistory';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link'

interface FightStats {
  name: string;
  strikes: number;
  significant: number;
  takedowns: number;
  takedownAttempts: number;
  control: string;
  health: number;
  energy: number;
}

interface RoundData {
  fighter1Stats: FightStats;
  fighter2Stats: FightStats;
  commentary: string[];
}

interface SelectedFighters {
  fighter1: Fighter;
  fighter2: Fighter;
  isDreamMode: boolean;
}

// Fight actions and events for more dynamic commentary
const strikeTypes = [
  'jab', 'cross', 'hook', 'uppercut', 'leg kick', 'body kick', 
  'head kick', 'elbow', 'knee', 'spinning back fist', 'superman punch'
];

const bodyTargets = ['head', 'body', 'leg', 'liver', 'ribs', 'jaw', 'temple'];
const fighterReactions = ['wobbled', 'stunned', 'unfazed', 'hurt', 'dazed', 'rocked'];
const commentaryPhrases = [
  'What a shot!', 'Incredible technique!', 'That one hurt!',
  'Beautiful timing!', 'The crowd is going wild!', 'Textbook execution!',
  'That might have changed the fight!', 'Both fighters showing heart!'
];

export default function FightPage() {
  const [selectedFighters, setSelectedFighters] = useState<SelectedFighters | null>(null);
  const [isSimulating, setIsSimulating] = useState(true);
  const [currentRound, setCurrentRound] = useState(1);
  const [timeLeft, setTimeLeft] = useState(5);
  const [roundProgress, setRoundProgress] = useState(0);
  const [isTitleFight] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);
  const [showWinner, setShowWinner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [aiCommentary, setAiCommentary] = useState<string[]>([]);
  const [roundByRoundData, setRoundByRoundData] = useState<RoundData[]>([]);
  const totalRounds = isTitleFight ? 5 : 3;

  const [roundData, setRoundData] = useState<RoundData>({
    fighter1Stats: { 
      name: "", 
      strikes: 0, 
      significant: 0, 
      takedowns: 0, 
      takedownAttempts: 0,
      control: "0:00", 
      health: 100, 
      energy: 100 
    },
    fighter2Stats: { 
      name: "", 
      strikes: 0, 
      significant: 0, 
      takedowns: 0, 
      takedownAttempts: 0,
      control: "0:00", 
      health: 100, 
      energy: 100 
    },
    commentary: []
  });

  useEffect(() => {
    const stored = localStorage.getItem('selectedFighters');
    if (stored) {
      const fighters = JSON.parse(stored);
      setSelectedFighters(fighters);
      setRoundData(prev => ({
        ...prev,
        fighter1Stats: { ...prev.fighter1Stats, name: fighters.fighter1.name },
        fighter2Stats: { ...prev.fighter2Stats, name: fighters.fighter2.name }
      }));
      
      // If we're in AI simulation mode, generate initial round predictions
      if (fighters.isDreamMode) {
        simulateEntireFightWithAI(fighters).catch(error => {
          console.error("AI simulation error:", error);
          setApiError("AI simulation failed. Falling back to standard simulation.");
        });
      }
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    // Only run the timer-based simulation if we're not in AI mode
    if (selectedFighters && !selectedFighters.isDreamMode && isSimulating && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 1;
          setRoundProgress(((5 - newTime) / 5) * 100);
          if (newTime % 2 === 0) simulateAction();
          return newTime;
        });
      }, 500);
    } else if (timeLeft === 0 && !selectedFighters?.isDreamMode) {
      // Standard simulation round end logic
      if (currentRound < totalRounds) {
        setTimeout(() => {
          // Store the current round data
          setRoundByRoundData(prev => [...prev, roundData]);
          // Set up the next round
          setCurrentRound(prev => prev + 1);
          setTimeLeft(5);
          setRoundProgress(0);
        }, 3000);
      } else {
        setIsSimulating(false);
        setRoundByRoundData(prev => [...prev, roundData]);
        determineFightWinner();
      }
    }
    
    return () => clearInterval(timer);
  }, [isSimulating, timeLeft, currentRound, totalRounds, selectedFighters]);

  // AI-powered simulation of the entire fight
  const simulateEntireFightWithAI = async (fighters: SelectedFighters) => {
    setIsLoading(true);
    try {
      // Prepare the prompt with fighter details
      const prompt = `
You are an expert MMA fight simulator. Simulate a ${totalRounds}-round MMA fight between two fighters with the following stats:

Fighter 1: ${fighters.fighter1.name}
- Weight class: ${fighters.fighter1.weightClass || "Unknown"}
- Style: ${fighters.fighter1.style || "Mixed"}
- Record: ${fighters.fighter1.record || "Unknown"}
- Notable skills: ${fighters.fighter1.skills || "All-around fighter"}

Fighter 2: ${fighters.fighter2.name}
- Weight class: ${fighters.fighter2.weightClass || "Unknown"}
- Style: ${fighters.fighter2.style || "Mixed"}
- Record: ${fighters.fighter2.record || "Unknown"}
- Notable skills: ${fighters.fighter2.skills || "All-around fighter"}

For each round, provide the following stats:
1. Total strikes for each fighter
2. Significant strikes for each fighter
3. Takedowns landed/attempted for each fighter
4. Ground control time (in minutes:seconds)
5. Fighter health percentage (100% is fresh, lower means more damage taken)
6. Fighter energy/cardio percentage
7. Brief commentary on what happened in the round

Also determine an overall winner at the end and explain the decision (KO, submission, or judge's decision).

Format the response as a valid JSON object with this structure:
{
  "rounds": [{
    "round": 1,
    "fighter1Stats": {
      "strikes": number,
      "significant": number,
      "takedowns": number,
      "takedownAttempts": number,
      "control": "string (mm:ss)",
      "health": number,
      "energy": number
    },
    "fighter2Stats": {
      "strikes": number,
      "significant": number,
      "takedowns": number,
      "takedownAttempts": number,
      "control": "string (mm:ss)",
      "health": number,
      "energy": number
    },
    "commentary": "string"
  },
  ...more rounds...
  ],
  "winner": "fighter name",
  "winMethod": "string (KO, TKO, Submission, Split Decision, Unanimous Decision)",
  "fightSummary": "string"
}
`;

      // Call to OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer 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`
        },
        body: JSON.stringify({
          model: "gpt-4-turbo",
          messages: [
            { role: "system", content: "You are an expert MMA fight simulation AI. Generate realistic MMA fight simulations with appropriate statistics. Always respond with valid JSON objects only." },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || 'Unknown API error');
      }
      
      // Parse the JSON content from the response
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error('No content in response');
      
      // Parse the fight data
      const fightData = JSON.parse(content);
      
      // Implement the AI-simulated fight progression
      displayAISimulatedFight(fightData);
      
    } catch (error) {
      console.error('API Error:', error);
      setApiError(`AI simulation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Fall back to manual simulation
      setIsSimulating(true);
    } finally {
      setIsLoading(false);
    }
  };
  
  const displayAISimulatedFight = (fightData: any) => {
    // Extract the round-by-round data
    const rounds = fightData.rounds || [];
    
    // Update the winner information for later use
    setWinner(fightData.winner);
    
    // Set up an automated display of the fight round by round
    let currentRoundIndex = 0;
    
    const displayNextRound = () => {
      if (currentRoundIndex >= rounds.length) {
        // End of fight - show the winner
        setIsSimulating(false);
        setShowWinner(true);
        return;
      }
      
      const roundInfo = rounds[currentRoundIndex];
      
      // Update the current round number
      setCurrentRound(roundInfo.round);
      
      // Update the round data display
      setRoundData({
        fighter1Stats: roundInfo.fighter1Stats,
        fighter2Stats: roundInfo.fighter2Stats,
        commentary: [roundInfo.commentary]
      });
      
      // Store this round's data
      setRoundByRoundData(prev => [...prev, {
        fighter1Stats: roundInfo.fighter1Stats,
        fighter2Stats: roundInfo.fighter2Stats,
        commentary: [roundInfo.commentary]
      }]);
      
      // Start the round progress animation
      let progress = 0;
      const progressInterval = setInterval(() => {
        progress += 1;
        setRoundProgress(progress);
        setTimeLeft(10 - Math.floor((progress / 100) * 10));
        
        if (progress >= 100) {
          clearInterval(progressInterval);
          currentRoundIndex++;
          
          // Wait a bit before showing the next round
          setTimeout(displayNextRound, 3000);
        }
      }, 100);
    };
    
    // Start displaying the fight
    displayNextRound();
  };

  const generateRandomCommentary = (fighter: string, isAttacker: boolean, isSignificant: boolean) => {
    const strikeType = strikeTypes[Math.floor(Math.random() * strikeTypes.length)];
    const target = bodyTargets[Math.floor(Math.random() * bodyTargets.length)];
    const reaction = fighterReactions[Math.floor(Math.random() * fighterReactions.length)];
    const phrase = commentaryPhrases[Math.floor(Math.random() * commentaryPhrases.length)];
    
    if (isAttacker) {
      return isSignificant 
        ? `🎙️ ${fighter} lands a devastating ${strikeType} to the ${target}! ${phrase}`
        : `🎙️ ${fighter} connects with a ${strikeType} to the ${target}.`;
    } else {
      return isSignificant 
        ? `🎙️ ${fighter} is ${reaction} after taking that shot! ${phrase}`
        : `🎙️ ${fighter} defends but still takes some damage.`;
    }
  };

  const simulateTakedown = (attacker: string, defender: string) => {
    const success = Math.random() > 0.7; // 30% success rate
    if (success) {
      return `🎙️ ${attacker} secures a takedown and moves to ground control!`;
    } else {
      return `🎙️ ${attacker} shoots for a takedown, but ${defender} defends well.`;
    }
  };

  // Main fight simulation logic for non-AI mode
  const simulateAction = () => {
    if (!selectedFighters) return;
    
    setRoundData(prev => {
      const newData = { ...prev };
      const f1 = selectedFighters.fighter1;
      const f2 = selectedFighters.fighter2;
      
      // Factor in fighter attributes for more realistic simulation
      const f1Power = f1.power || 70;
      const f2Power = f2.power || 70;
      const f1Speed = f1.speed || 70;
      const f2Speed = f2.speed || 70;
      const f1Wrestling = f1.wrestling || 70;
      const f2Wrestling = f1.wrestling || 70;
      
      // Determine who's initiating the action
      const attackerAdv = (f1Speed - f2Speed) / 100; // Speed advantage affects who attacks
      const initiativeChance = 0.5 + attackerAdv;
      const fighter1Attacking = Math.random() < initiativeChance;
      
      // Determine action type (strike or takedown attempt)
      const actionType = Math.random();
      let commentary = "";
      
      if (actionType > 0.85) { // Takedown attempt (15% chance)
        if (fighter1Attacking) {
          newData.fighter1Stats.takedownAttempts += 1;
          
          // Success based on wrestling skill difference
          const takedownSuccess = Math.random() < (0.3 + ((f1Wrestling - f2Wrestling) / 200));
          if (takedownSuccess) {
            newData.fighter1Stats.takedowns += 1;
            newData.fighter2Stats.energy -= 8;
            newData.fighter2Stats.health -= 3;
            
            // Calculate control time
            const controlSecs = Math.floor(Math.random() * 30) + 15;
            const mins = Math.floor(controlSecs / 60);
            const secs = controlSecs % 60;
            const currentControl = newData.fighter1Stats.control.split(':');
            const currentMins = parseInt(currentControl[0]);
            const currentSecs = parseInt(currentControl[1]);
            const totalSecs = (currentMins * 60 + currentSecs) + controlSecs;
            const newMins = Math.floor(totalSecs / 60);
            const newSecs = totalSecs % 60;
            newData.fighter1Stats.control = `${newMins}:${newSecs < 10 ? '0' + newSecs : newSecs}`;
            
            commentary = `🎙️ ${f1.name} takes ${f2.name} down! Now working from top position.`;
          } else {
            newData.fighter1Stats.energy -= 5;
            commentary = `🎙️ ${f1.name} shoots for a takedown, but ${f2.name} defends well.`;
          }
        } else {
          newData.fighter2Stats.takedownAttempts += 1;
          
          // Success based on wrestling skill difference
          const takedownSuccess = Math.random() < (0.3 + ((f2Wrestling - f1Wrestling) / 200));
          if (takedownSuccess) {
            newData.fighter2Stats.takedowns += 1;
            newData.fighter1Stats.energy -= 8;
            newData.fighter1Stats.health -= 3;
            
            // Calculate control time
            const controlSecs = Math.floor(Math.random() * 30) + 15;
            const mins = Math.floor(controlSecs / 60);
            const secs = controlSecs % 60;
            const currentControl = newData.fighter2Stats.control.split(':');
            const currentMins = parseInt(currentControl[0]);
            const currentSecs = parseInt(currentControl[1]);
            const totalSecs = (currentMins * 60 + currentSecs) + controlSecs;
            const newMins = Math.floor(totalSecs / 60);
            const newSecs = totalSecs % 60;
            newData.fighter2Stats.control = `${newMins}:${newSecs < 10 ? '0' + newSecs : newSecs}`;
            
            commentary = `🎙️ ${f2.name} secures a strong takedown on ${f1.name}!`;
          } else {
            newData.fighter2Stats.energy -= 5;
            commentary = `🎙️ ${f2.name} attempts a takedown, but ${f1.name} sprawls to defend.`;
          }
        }
      } else { // Strike exchange
        if (fighter1Attacking) {
          newData.fighter1Stats.strikes += 1;
          
          // Significant strike calculation based on power
          const powerFactor = f1Power / 100;
          const isSignificant = Math.random() < (0.3 * powerFactor);
          if (isSignificant) {
            newData.fighter1Stats.significant += 1;
            newData.fighter2Stats.health -= 5 + Math.floor(f1Power / 20);
            newData.fighter1Stats.energy -= 2;
            commentary = generateRandomCommentary(f1.name, true, true);
          } else {
            newData.fighter2Stats.health -= 1 + Math.floor(f1Power / 30);
            newData.fighter1Stats.energy -= 1;
            commentary = generateRandomCommentary(f1.name, true, false);
          }
        } else {
          newData.fighter2Stats.strikes += 1;
          
          // Significant strike calculation based on power
          const powerFactor = f2Power / 100;
          const isSignificant = Math.random() < (0.3 * powerFactor);
          if (isSignificant) {
            newData.fighter2Stats.significant += 1;
            newData.fighter1Stats.health -= 5 + Math.floor(f2Power / 20);
            newData.fighter2Stats.energy -= 2;
            commentary = generateRandomCommentary(f2.name, true, true);
          } else {
            newData.fighter1Stats.health -= 1 + Math.floor(f2Power / 30);
            newData.fighter2Stats.energy -= 1;
            commentary = generateRandomCommentary(f2.name, true, false);
          }
        }
      }
      
      // Check for KO or TKO
      if (newData.fighter1Stats.health <= 0) {
        setWinner(selectedFighters.fighter2.name);
        setShowWinner(true);
        setIsSimulating(false);
        commentary = `🎙️ IT'S ALL OVER! ${selectedFighters.fighter2.name} KNOCKS OUT ${selectedFighters.fighter1.name}!`;
      } else if (newData.fighter2Stats.health <= 0) {
        setWinner(selectedFighters.fighter1.name);
        setShowWinner(true);
        setIsSimulating(false);
        commentary = `🎙️ IT'S ALL OVER! ${selectedFighters.fighter1.name} KNOCKS OUT ${selectedFighters.fighter2.name}!`;
      }
      
      // Energy recovery over time (slight recovery each cycle)
      newData.fighter1Stats.energy = Math.min(100, newData.fighter1Stats.energy + 0.5);
      newData.fighter2Stats.energy = Math.min(100, newData.fighter2Stats.energy + 0.5);
      
      // Ensure health doesn't go below 0
      newData.fighter1Stats.health = Math.max(0, newData.fighter1Stats.health);
      newData.fighter2Stats.health = Math.max(0, newData.fighter2Stats.health);
      
      // Add commentary
      newData.commentary.unshift(commentary);
      newData.commentary = newData.commentary.slice(0, 3);
      
      return newData;
    });
  };

  const determineFightWinner = () => {
    if (!selectedFighters) return;
    
    // If we already have a winner from a KO or from AI simulation, don't recalculate
    if (winner) {
      setShowWinner(true);
      return;
    }
    
    // Calculate scores based on round-by-round data
    // This is a better approach than just using the final round stats
    const allRounds = [...roundByRoundData, roundData]; // Include current round
    
    // Initialize scores
    let f1TotalScore = 0;
    let f2TotalScore = 0;
    
    // Calculate round-by-round scoring (10-point must system)
    allRounds.forEach(round => {
      // Base score: 10 points to start
      let f1RoundScore = 10;
      let f2RoundScore = 10;
      
      // Compare striking
      const strikeDiff = (round.fighter1Stats.strikes + (round.fighter1Stats.significant * 2)) - 
                         (round.fighter2Stats.strikes + (round.fighter2Stats.significant * 2));
      
      // Compare grappling
      const f1ControlParts = round.fighter1Stats.control.split(':');
      const f1ControlSecs = parseInt(f1ControlParts[0]) * 60 + parseInt(f1ControlParts[1]);
      
      const f2ControlParts = round.fighter2Stats.control.split(':');
      const f2ControlSecs = parseInt(f2ControlParts[0]) * 60 + parseInt(f2ControlParts[1]);
      
      const grapplingDiff = (round.fighter1Stats.takedowns * 5 + f1ControlSecs/10) - 
                           (round.fighter2Stats.takedowns * 5 + f2ControlSecs/10);
      
      // Calculate damage difference
      const damageDiff = round.fighter1Stats.health - round.fighter2Stats.health;
      
      // Combine factors with weights
      const totalDiff = strikeDiff*0.4 + grapplingDiff*0.3 + damageDiff*0.3;
      
      // Adjust round score based on dominance
      // A difference of 30+ points is a 10-8 round
      if (totalDiff > 30) {
        f2RoundScore = 8; // Fighter 1 dominated
      } else if (totalDiff > 15) {
        f2RoundScore = 9; // Fighter 1 clearly won
      } else if (totalDiff < -30) {
        f1RoundScore = 8; // Fighter 2 dominated
      } else if (totalDiff < -15) {
        f1RoundScore = 9; // Fighter 2 clearly won
      }
      // Otherwise it's a 10-10 round
      
      // Add to total scores
      f1TotalScore += f1RoundScore;
      f2TotalScore += f2RoundScore;
    });
    
    // Determine winner based on total scores
    let winnerName;
    if (f1TotalScore > f2TotalScore) {
      winnerName = selectedFighters.fighter1.name;
    } else if (f2TotalScore > f1TotalScore) {
      winnerName = selectedFighters.fighter2.name;
    } else {
      winnerName = "Draw"; // In case of a draw
    }
    
    setWinner(winnerName);
    setShowWinner(true);
  };

  if (!selectedFighters) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No fighters selected</h1>
          <p>Please return to the home page and select fighters.</p>
        </div>
      </div>
    );
  }

  return (
     <>
    <Navbar />
    <div className="relative min-h-screen bg-gradient-to-b from-purple-900 via-blue-900 to-black text-white overflow-hidden">
          
       

      <BackgroundPattern />
      <SpotlightEffects />
      <div className="mt-10 relative z-10 container mx-auto p-4">
        <div className="text-center py-8">

        <nav className="text-sm text-gray-400 mb-6">
  <ol className="list-reset flex items-center space-x-2">
    <li>
      <Link href="/" className="hover:underline text-white">Home</Link>
    </li>
    <li>/</li>
    <li>
      <Link href="/fight-simulator-ai" className="hover:underline text-white">UFC Fight Simulator</Link>
    </li>
    <li>/</li>
    <li className="text-[#E50914] font-semibold truncate max-w-[200px]">
      {selectedFighters.fighter1.name} vs {selectedFighters.fighter2.name}
    </li>
  </ol>
</nav>


          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-pink-500 to-purple-400 uppercase tracking-widest animate-pulse">
            UFC FIGHT SIMULATOR
            {selectedFighters.isDreamMode && (
              <span className="ml-2 text-sm bg-black text-cyan-500 px-2 py-1 rounded-md animate-bounce">
                AI MODE
              </span>
            )}
          </h1>
        </div>
        <Notifications apiError={apiError} isLoading={isLoading} />
        <div className="max-w-6xl mx-auto bg-black border-2 border-indigo-600 rounded-lg shadow-2xl overflow-hidden">
          <HeaderBanner isTitleFight={isTitleFight} />

          {/* Fighter showcase */}
          <div className="grid grid-cols-3 gap-4 p-6 bg-gradient-to-b from-black to-indigo-950 relative">
            <FighterShowcase fighter={selectedFighters.fighter1} position="left" />
            <VsSection currentRound={currentRound} totalRounds={totalRounds} />
            <FighterShowcase fighter={selectedFighters.fighter2} position="right" />
          </div>

          {/* Timer and round progress */}
          <TimerProgress
            timeLeft={timeLeft}
            totalRounds={totalRounds}
            currentRound={currentRound}
            roundProgress={roundProgress}
          />

          {/* Fighter stats grid with center status */}
          <div className="grid grid-cols-3 gap-8 p-6 bg-gradient-to-b from-purple-950 to-black">
            <FighterStats
              name={selectedFighters.fighter1.name}
              stats={roundData.fighter1Stats}
              position="left"
            />

            {/* Center simulating/round indicator */}
            <div className="flex flex-col items-center justify-center">
              {isSimulating ? (
                <div className="text-center animate-pulse">
                  <div className="w-16 h-16 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                  <div className="text-pink-400 font-bold">SIMULATING...</div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-xl font-bold text-white">
                    {showWinner ? 'FIGHT OVER' : `ROUND ${currentRound}`}
                  </div>
                </div>
              )}

              {showWinner && (
                <div className="mt-4 transform scale-105 transition-all duration-1000 text-center">
                  <div className="bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 px-6 py-4 rounded-lg shadow-2xl border-2 border-pink-400">
                    <span className="text-3xl font-black text-white block mb-1">WINNER</span>
                    <span className="text-2xl font-bold text-white">{winner}</span>
                  </div>
                </div>
              )}
            </div>

            <FighterStats
              name={selectedFighters.fighter2.name}
              stats={roundData.fighter2Stats}
              position="right"
            />
          </div>

          {/* Live commentary under progress */}
          <CommentarySection
            roundData={roundData}
            isSimulating={isSimulating}
            showWinner={showWinner}
            currentRound={currentRound}
            winner={winner}
            onRematch={() => window.location.reload()}
            onNew={() => {
              localStorage.removeItem('selectedFighters');
              window.location.href = '/';
            }}
          />

          {/* Fight history */}
          <FightHistory
            roundByRoundData={roundByRoundData}
            fighters={{
              fighter1Name: selectedFighters.fighter1.name,
              fighter2Name: selectedFighters.fighter2.name
            }}
          />
        </div>
      </div>
    </div>
    </>
  );
}