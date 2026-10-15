import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Users, 
  Shuffle, 
  Sparkles, 
  Play, 
  ShieldCheck, 
  Type, 
  Check, 
  Flag 
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { Player } from '../types/game';

interface PartyLobbyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PartyLobbyModal: React.FC<PartyLobbyModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { gameSettings, startNewGame, playSound } = useGame();

  const [isTeamMode, setIsTeamMode] = useState(false);
  const [largeTextMode, setLargeTextMode] = useState(false);
  const [selectedHouseRules, setSelectedHouseRules] = useState<string[]>([
    'Double dare allowed',
    'No phones except app'
  ]);
  const [teamA, setTeamA] = useState<Player[]>([]);
  const [teamB, setTeamB] = useState<Player[]>([]);

  if (!isOpen) return null;

  const currentPlayers = gameSettings.players;

  const handleShuffleTeams = () => {
    playSound('flip');
    const shuffled = [...currentPlayers].sort(() => Math.random() - 0.5);
    const mid = Math.ceil(shuffled.length / 2);
    setTeamA(shuffled.slice(0, mid));
    setTeamB(shuffled.slice(mid));
  };

  const toggleHouseRule = (rule: string) => {
    playSound('tap');
    setSelectedHouseRules(prev =>
      prev.includes(rule) ? prev.filter(r => r !== rule) : [...prev, rule]
    );
  };

  const handleStartParty = () => {
    playSound('tap');
    onClose();
    startNewGame({
      category: 'party',
      mode: 'mixed',
      rounds: 15,
    });
  };

  const HOUSE_RULES = [
    { id: 'Double dare allowed', desc: 'Pass a dare back with double intensity' },
    { id: 'Funny Penalty Pose', desc: '10s silly freeze if refusing a dare' },
    { id: 'No phones except app', desc: '100% focused group presence' },
    { id: 'Pass the Crown', desc: 'MVP wears imaginary crown every 5 rounds' },
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#302044]/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-sm bg-white border border-[#EAE1F0] rounded-3xl p-6 shadow-2xl relative text-left max-h-[88vh] overflow-y-auto no-scrollbar text-[#302044]"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎉</span>
              <h3 className="font-heading font-black text-xl">Party Lobby</h3>
            </div>
            <button
              onClick={() => {
                playSound('tap');
                onClose();
              }}
              className="p-1 rounded-full bg-[#F2EAFE] text-[#796D87] hover:text-[#302044]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="text-xs text-[#796D87] mb-4">
            Pass-the-phone group game mode. Gather everyone around the living room table!
          </p>

          {/* Mode Switch: Individual vs Team Battle */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#FFF9F5] rounded-full border border-[#EAE1F0] mb-4 text-center">
            <button
              type="button"
              onClick={() => {
                playSound('tap');
                setIsTeamMode(false);
              }}
              className={`py-2 rounded-full text-xs font-heading font-extrabold transition-all ${
                !isTeamMode
                  ? 'bg-[#753BDB] text-white shadow-sm'
                  : 'text-[#796D87] hover:text-[#302044]'
              }`}
            >
              Individual ({currentPlayers.length})
            </button>
            <button
              type="button"
              onClick={() => {
                playSound('tap');
                setIsTeamMode(true);
                if (teamA.length === 0) handleShuffleTeams();
              }}
              className={`py-2 rounded-full text-xs font-heading font-extrabold transition-all ${
                isTeamMode
                  ? 'bg-gradient-to-r from-[#F04491] to-[#753BDB] text-white shadow-sm'
                  : 'text-[#796D87] hover:text-[#302044]'
              }`}
            >
              Team Battle
            </button>
          </div>

          {/* Team Mode view */}
          {isTeamMode ? (
            <div className="space-y-3 mb-5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#796D87]">Team Rosters</span>
                <button
                  onClick={handleShuffleTeams}
                  className="font-bold text-[#753BDB] flex items-center gap-1 hover:underline"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Reshuffle Teams</span>
                </button>
              </div>

              {/* Team Pink */}
              <div className="p-3 rounded-2xl bg-[#F04491]/10 border border-[#F04491]/30">
                <div className="font-heading font-black text-xs text-[#F04491] mb-1.5 flex items-center gap-1.5">
                  <span>🌸 Team Bubblegum ({teamA.length})</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {teamA.map((p, idx) => (
                    <span key={`lobby-teamA-${p.id}-${idx}`} className="text-xs font-bold text-[#302044] bg-white px-2.5 py-1 rounded-full shadow-xs">
                      {p.avatar} {p.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Team Purple */}
              <div className="p-3 rounded-2xl bg-[#753BDB]/10 border border-[#753BDB]/30">
                <div className="font-heading font-black text-xs text-[#753BDB] mb-1.5 flex items-center gap-1.5">
                  <span>🔮 Team Grape ({teamB.length})</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {teamB.map((p, idx) => (
                    <span key={`lobby-teamB-${p.id}-${idx}`} className="text-xs font-bold text-[#302044] bg-white px-2.5 py-1 rounded-full shadow-xs">
                      {p.avatar} {p.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Individual Players Roster */
            <div className="mb-4">
              <span className="text-[11px] font-bold text-[#796D87] block mb-2">
                Participants in rotation:
              </span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {currentPlayers.map((p, idx) => (
                  <span
                    key={`lobby-roster-${p.id}-${idx}`}
                    className="inline-flex items-center gap-1 text-xs font-bold bg-[#FFF9F5] border border-[#EAE1F0] px-3 py-1.5 rounded-full"
                  >
                    <span>{p.avatar}</span>
                    <span>{p.name}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Party House Rules */}
          <div className="mb-5">
            <span className="text-xs font-heading font-extrabold text-[#796D87] uppercase tracking-wider block mb-2">
              Select House Rules
            </span>
            <div className="space-y-1.5 text-xs">
              {HOUSE_RULES.map(rule => {
                const isActive = selectedHouseRules.includes(rule.id);
                return (
                  <div
                    key={rule.id}
                    onClick={() => toggleHouseRule(rule.id)}
                    className={`p-2.5 rounded-2xl border cursor-pointer flex items-center justify-between transition-colors ${
                      isActive
                        ? 'bg-[#F2EAFE] border-[#753BDB] text-[#753BDB] font-bold'
                        : 'bg-[#FFF9F5] border-[#EAE1F0] text-[#302044]'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{rule.id}</div>
                      <div className="text-[10px] text-[#796D87]">{rule.desc}</div>
                    </div>
                    {isActive && <Check className="w-4 h-4 text-[#753BDB]" />}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Large-Text Party Mode Toggle */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FFF9F5] border border-[#EAE1F0] mb-5">
            <div className="flex items-center gap-2">
              <Type className="w-4 h-4 text-[#753BDB]" />
              <div>
                <div className="text-xs font-bold">Party Living Room Text</div>
                <div className="text-[10px] text-[#796D87]">Easy to read from across the couch</div>
              </div>
            </div>
            <button
              onClick={() => {
                playSound('tap');
                setLargeTextMode(!largeTextMode);
              }}
              className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                largeTextMode ? 'bg-[#753BDB]' : 'bg-[#EAE1F0]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  largeTextMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Start Party CTA */}
          <button
            onClick={handleStartParty}
            className="w-full py-4 rounded-full bg-gradient-to-r from-[#753BDB] via-[#F04491] to-[#FF7139] text-white font-heading font-black text-sm shadow-playful flex items-center justify-center gap-2 active:scale-98 transition-transform"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Launch Party Session</span>
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
