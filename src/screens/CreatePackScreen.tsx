import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Sparkles, 
  Check, 
  HelpCircle, 
  Flame, 
  Layers, 
  Palette, 
  BookOpen, 
  Eye, 
  ArrowUp, 
  ArrowDown, 
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { CATEGORIES } from '../data/categories';
import { CategoryId, IntensityLevel, PromptType, Pack } from '../types/game';
import { HeaderBar } from '../components/HeaderBar';

interface DraftPrompt {
  id: string;
  type: PromptType;
  text: string;
  intensity: IntensityLevel;
  hint?: string;
}

export const CreatePackScreen: React.FC = () => {
  const { createPack, packs, playSound, setActiveTab, setCurrentScreen } = useGame();

  const [activeTab, setStudioTab] = useState<'create' | 'drafts' | 'published'>('create');

  // Pack metadata
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CategoryId>('friends');
  const [language, setLanguage] = useState('English');
  const [minPlayers, setMinPlayers] = useState(2);
  const [maxPlayers, setMaxPlayers] = useState(10);

  // Cover designer
  const [selectedGradient, setSelectedGradient] = useState('from-[#753BDB] to-[#F04491]');
  const [selectedSticker, setSelectedSticker] = useState('🎉');

  // Prompts list
  const [prompts, setPrompts] = useState<DraftPrompt[]>([
    {
      id: '1',
      type: 'truth',
      text: 'What is the funniest rumor you have ever heard about yourself?',
      intensity: 'funny',
      hint: 'Even if it was completely made up!'
    },
    {
      id: '2',
      type: 'dare',
      text: 'Talk in an accent chosen by the player to your right for 2 full turns.',
      intensity: 'funny',
      hint: 'Commit to the accent with full energy.'
    }
  ]);

  // Current prompt input
  const [newPromptText, setNewPromptText] = useState('');
  const [newPromptType, setNewPromptType] = useState<PromptType>('truth');
  const [newPromptIntensity, setNewPromptIntensity] = useState<IntensityLevel>('funny');
  const [newPromptHint, setNewPromptHint] = useState('');

  // Alerts & Modals
  const [errorNotice, setErrorNotice] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [showPublishReview, setShowPublishReview] = useState(false);
  const [guidelinesAccepted, setGuidelinesAccepted] = useState(false);

  // Gradient presets
  const GRADIENT_PRESETS = [
    { id: 'brand', label: 'Brand', value: 'from-[#753BDB] to-[#F04491]' },
    { id: 'truth', label: 'Truth', value: 'from-[#F04491] to-[#FF7139]' },
    { id: 'dare', label: 'Dare', value: 'from-[#FF7139] to-[#FFD447]' },
    { id: 'dream', label: 'Dream', value: 'from-[#48BDEB] to-[#753BDB]' },
    { id: 'party', label: 'Party', value: 'from-[#FF7139] via-[#FFD447] to-[#F04491]' },
    { id: 'playful', label: 'Playful', value: 'from-[#753BDB] via-[#48BDEB] to-[#F04491]' },
  ];

  const STICKER_PRESETS = ['🎉', '🔥', '💖', '🌙', '⚡', '🥑', '👑', '🎯', '🍕', '🦄'];

  const handleAddPrompt = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = newPromptText.trim();
    if (!clean) return;

    if (prompts.some(p => p.text.toLowerCase() === clean.toLowerCase())) {
      setErrorNotice('This prompt already exists in your deck!');
      setTimeout(() => setErrorNotice(null), 2500);
      return;
    }

    playSound('tap');
    const newP: DraftPrompt = {
      id: `p-${Date.now()}`,
      type: newPromptType,
      text: clean,
      intensity: newPromptIntensity,
      hint: newPromptHint.trim() || undefined
    };

    setPrompts(prev => [...prev, newP]);
    setNewPromptText('');
    setNewPromptHint('');
  };

  const handleDuplicatePrompt = (p: DraftPrompt) => {
    playSound('tap');
    const dup: DraftPrompt = {
      ...p,
      id: `p-${Date.now()}`,
      text: `${p.text} (Copy)`
    };
    setPrompts(prev => [...prev, dup]);
  };

  const handleDeletePrompt = (id: string) => {
    playSound('skip');
    setPrompts(prev => prev.filter(p => p.id !== id));
  };

  const handleMovePrompt = (index: number, dir: 'up' | 'down') => {
    playSound('tap');
    const target = dir === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= prompts.length) return;
    const next = [...prompts];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    setPrompts(next);
  };

  const handlePublishClick = () => {
    if (!title.trim()) {
      setErrorNotice('Please provide a title for your pack.');
      return;
    }
    if (prompts.length < 2) {
      setErrorNotice('Please add at least 2 questions or dares before publishing.');
      return;
    }
    setErrorNotice(null);
    setShowPublishReview(true);
  };

  const handleConfirmPublish = () => {
    if (!guidelinesAccepted) {
      setErrorNotice('You must acknowledge community guidelines.');
      return;
    }

    const truths = prompts.filter(p => p.type === 'truth').map(p => p.text);
    const dares = prompts.filter(p => p.type === 'dare').map(p => p.text);

    createPack(
      title.trim(),
      description.trim() || 'A custom crafted pack of truths and dares by our community.',
      category,
      truths,
      dares
    );

    setShowPublishReview(false);
    setSuccessNotice(`Pack "${title}" published successfully!`);
    playSound('complete');

    setTimeout(() => {
      setSuccessNotice(null);
      setStudioTab('published');
    }, 1500);
  };

  const myCustomPacks = packs.filter(p => !!p.isCustom);

  return (
    <div className="min-h-screen bg-[#FFF9F5] text-[#302044] pb-28 max-w-lg mx-auto">
      <HeaderBar title="Creator Studio" showSoundToggle />

      <div className="px-4 py-3 space-y-4 text-left">
        {/* Studio Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-full border border-[#EAE1F0] shadow-sm">
          {[
            { id: 'create', label: 'Deck Builder' },
            { id: 'published', label: `My Packs (${myCustomPacks.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                playSound('tap');
                setStudioTab(tab.id as 'create' | 'published');
              }}
              className={`flex-1 py-2 rounded-full font-heading font-extrabold text-xs transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-[#753BDB] to-[#F04491] text-white shadow-sm'
                  : 'text-[#796D87] hover:text-[#302044]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Notices */}
        {errorNotice && (
          <div className="p-3 rounded-2xl bg-[#E95757]/10 border border-[#E95757] text-xs font-bold text-[#E95757] text-center">
            {errorNotice}
          </div>
        )}
        {successNotice && (
          <div className="p-3 rounded-2xl bg-[#36B77A]/15 border border-[#36B77A] text-xs font-bold text-[#36B77A] text-center flex items-center justify-center gap-2">
            <Check className="w-4 h-4" />
            <span>{successNotice}</span>
          </div>
        )}

        {/* TAB 1: DECK BUILDER */}
        {activeTab === 'create' && (
          <div className="space-y-5">
            {/* 1. Live Cover Preview & Designer (Prompt 10) */}
            <div className="p-5 rounded-3xl bg-white border border-[#EAE1F0] shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#796D87] flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#753BDB]" />
                  <span>Cover Designer</span>
                </span>
                <span className="text-[11px] text-[#753BDB] font-bold">Live Preview</span>
              </div>

              {/* Cover Card Live Preview */}
              <div
                className={`w-full rounded-3xl p-5 bg-gradient-to-br ${selectedGradient} text-white shadow-md flex items-center justify-between relative overflow-hidden`}
              >
                <div>
                  <div className="text-3xl mb-2 bg-black/20 p-2 rounded-2xl w-fit">
                    {selectedSticker}
                  </div>
                  <h3 className="font-heading font-black text-xl leading-tight">
                    {title || 'Untitled Custom Pack'}
                  </h3>
                  <span className="text-[11px] text-white/80 font-bold">
                    {CATEGORIES[category]?.name} · {prompts.length} Prompts
                  </span>
                </div>
              </div>

              {/* Gradient Selector */}
              <div>
                <label className="block text-[11px] font-bold text-[#796D87] mb-1.5">
                  Choose Cover Gradient
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {GRADIENT_PRESETS.map(g => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => {
                        playSound('tap');
                        setSelectedGradient(g.value);
                      }}
                      className={`h-8 rounded-xl bg-gradient-to-br ${g.value} transition-all ${
                        selectedGradient === g.value ? 'ring-2 ring-[#753BDB] scale-110 shadow-sm' : ''
                      }`}
                      title={g.label}
                    />
                  ))}
                </div>
              </div>

              {/* Sticker Selector */}
              <div>
                <label className="block text-[11px] font-bold text-[#796D87] mb-1.5">
                  Choose Sticker Icon
                </label>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
                  {STICKER_PRESETS.map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        playSound('tap');
                        setSelectedSticker(st);
                      }}
                      className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center shrink-0 border transition-all ${
                        selectedSticker === st
                          ? 'bg-[#F2EAFE] border-[#753BDB] scale-110 shadow-sm'
                          : 'bg-[#FFF9F5] border-[#EAE1F0]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. Metadata Info Form */}
            <div className="p-5 rounded-3xl bg-white border border-[#EAE1F0] shadow-card space-y-3.5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#796D87] mb-1">
                  Pack Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Road Trip Shenanigans, High School Reunion"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F5] border border-[#EAE1F0] text-xs text-[#302044] focus:outline-none focus:border-[#753BDB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#796D87] mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="What makes this pack fun and who is it meant for?"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F5] border border-[#EAE1F0] text-xs text-[#302044] focus:outline-none focus:border-[#753BDB] resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#796D87] mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as CategoryId)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF9F5] border border-[#EAE1F0] text-xs font-bold text-[#302044] focus:outline-none"
                  >
                    {Object.values(CATEGORIES).map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#796D87] mb-1">
                    Language
                  </label>
                  <select
                    value={language}
                    onChange={e => setLanguage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#FFF9F5] border border-[#EAE1F0] text-xs font-bold text-[#302044] focus:outline-none"
                  >
                    <option value="English">English</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="German">German</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Add Prompt Section */}
            <div className="p-5 rounded-3xl bg-white border border-[#EAE1F0] shadow-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#796D87]">
                  Add Card ({prompts.length} Added)
                </span>
                <div className="flex items-center gap-1 p-0.5 bg-[#FFF9F5] rounded-full border border-[#EAE1F0]">
                  <button
                    type="button"
                    onClick={() => {
                      playSound('tap');
                      setNewPromptType('truth');
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                      newPromptType === 'truth'
                        ? 'bg-[#F04491] text-white shadow-sm'
                        : 'text-[#796D87]'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Truth</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      playSound('tap');
                      setNewPromptType('dare');
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                      newPromptType === 'dare'
                        ? 'bg-[#FF7139] text-white shadow-sm'
                        : 'text-[#796D87]'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Dare</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddPrompt} className="space-y-2">
                <textarea
                  rows={2}
                  placeholder={
                    newPromptType === 'truth'
                      ? 'Type truth question...'
                      : 'Type dare challenge...'
                  }
                  value={newPromptText}
                  onChange={e => setNewPromptText(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#FFF9F5] border border-[#EAE1F0] text-xs text-[#302044] placeholder-[#796D87]/60 focus:outline-none focus:border-[#753BDB] resize-none"
                />

                <input
                  type="text"
                  placeholder="Optional hint or instruction (e.g., Don't look away!)"
                  value={newPromptHint}
                  onChange={e => setNewPromptHint(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#FFF9F5] border border-[#EAE1F0] text-xs text-[#302044] placeholder-[#796D87]/60 focus:outline-none focus:border-[#753BDB]"
                />

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-full bg-[#753BDB] text-white font-heading font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-98 transition-transform"
                >
                  <Plus className="w-4 h-4 text-[#FFD447]" />
                  <span>Add to Deck</span>
                </button>
              </form>
            </div>

            {/* 4. Cards List (Reorder, Duplicate, Delete) */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#796D87]">
                Deck Prompts ({prompts.length})
              </h4>

              {prompts.map((p, idx) => (
                <div
                  key={p.id}
                  className="p-3 rounded-2xl bg-white border border-[#EAE1F0] shadow-sm flex items-start justify-between gap-2"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-md ${
                          p.type === 'truth'
                            ? 'bg-[#F04491]/15 text-[#F04491]'
                            : 'bg-[#FF7139]/15 text-[#FF7139]'
                        }`}
                      >
                        {p.type}
                      </span>
                      <span className="text-[10px] text-[#796D87]">#{idx + 1}</span>
                    </div>
                    <p className="text-xs font-bold text-[#302044] leading-snug">
                      "{p.text}"
                    </p>
                    {p.hint && (
                      <p className="text-[10px] text-[#796D87] mt-0.5 italic">
                        💡 {p.hint}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0 pt-1">
                    <button
                      onClick={() => handleMovePrompt(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1 text-[#796D87] hover:text-[#302044] disabled:opacity-20"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMovePrompt(idx, 'down')}
                      disabled={idx === prompts.length - 1}
                      className="p-1 text-[#796D87] hover:text-[#302044] disabled:opacity-20"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDuplicatePrompt(p)}
                      className="p-1 text-[#796D87] hover:text-[#753BDB]"
                      title="Duplicate prompt"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeletePrompt(p.id)}
                      className="p-1 text-[#796D87] hover:text-[#E95757]"
                      title="Delete prompt"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Publish Action Button */}
            <button
              onClick={handlePublishClick}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#753BDB] to-[#F04491] text-white font-heading font-extrabold text-sm shadow-playful flex items-center justify-center gap-2 active:scale-98 transition-transform"
            >
              <Sparkles className="w-4 h-4 text-[#FFD447]" />
              <span>Publish Pack ({prompts.length} Prompts)</span>
            </button>
          </div>
        )}

        {/* TAB 2: MY PUBLISHED PACKS */}
        {activeTab === 'published' && (
          <div className="space-y-3">
            {myCustomPacks.length === 0 ? (
              <div className="text-center py-12 px-4 rounded-3xl bg-white border border-[#EAE1F0] shadow-card">
                <Layers className="w-8 h-8 mx-auto mb-2 text-[#753BDB]" />
                <h5 className="font-heading font-extrabold text-sm text-[#302044] mb-1">
                  No published packs yet
                </h5>
                <p className="text-xs text-[#796D87] mb-4">
                  Create and publish your first custom deck to see it here and play with it!
                </p>
                <button
                  onClick={() => setStudioTab('create')}
                  className="py-2.5 px-5 rounded-full bg-[#753BDB] text-white font-heading font-bold text-xs"
                >
                  Start Building Deck
                </button>
              </div>
            ) : (
              myCustomPacks.map(pack => (
                <div
                  key={pack.id}
                  className="p-4 rounded-3xl bg-white border border-[#EAE1F0] shadow-card flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${pack.coverGradient} flex items-center justify-center text-white text-2xl shadow-sm`}
                    >
                      {pack.coverSticker || '🎉'}
                    </div>
                    <div>
                      <h5 className="font-heading font-black text-sm text-[#302044]">
                        {pack.title}
                      </h5>
                      <span className="text-[11px] text-[#796D87]">
                        {pack.promptCount} Prompts · Published Locally
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-bold text-[#36B77A] bg-[#36B77A]/15 px-3 py-1 rounded-full">
                    Active
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Publish Review Modal (Prompt 10) */}
      {showPublishReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#302044]/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl text-left max-h-[85vh] overflow-y-auto no-scrollbar">
            <h3 className="font-heading font-black text-xl text-[#302044] mb-1">
              Publishing Review
            </h3>
            <p className="text-xs text-[#796D87] mb-4">
              Your pack will be saved locally and immediately available in Explore and Gameplay.
            </p>

            {/* Summary card */}
            <div
              className={`w-full rounded-2xl p-4 bg-gradient-to-br ${selectedGradient} text-white mb-4`}
            >
              <div className="text-2xl mb-1">{selectedSticker}</div>
              <h4 className="font-heading font-black text-base">{title}</h4>
              <span className="text-[11px] text-white/90">
                {CATEGORIES[category]?.name} · {prompts.length} Prompts
              </span>
            </div>

            <label className="flex items-start gap-2.5 text-xs text-[#796D87] mb-5 cursor-pointer">
              <input
                type="checkbox"
                checked={guidelinesAccepted}
                onChange={e => setGuidelinesAccepted(e.target.checked)}
                className="mt-0.5 accent-[#753BDB]"
              />
              <span>
                I confirm these prompts follow community guidelines and do not contain hate speech or non-consensual harassment.
              </span>
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowPublishReview(false)}
                className="py-3 rounded-full bg-[#FFF9F5] border border-[#EAE1F0] text-[#796D87] font-heading font-bold text-xs"
              >
                Back to Edit
              </button>
              <button
                onClick={handleConfirmPublish}
                className="py-3 rounded-full bg-gradient-to-r from-[#753BDB] to-[#F04491] text-white font-heading font-black text-xs shadow-md"
              >
                Confirm Publish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
