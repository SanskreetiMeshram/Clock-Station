import React, { useState } from 'react';
import { X, Mic, Sparkles, Volume2, Check, KeyRound, Trash2 } from 'lucide-react';
import {
  ELEVENLABS_VOICE_PRESETS,
  isLikelyElevenLabsKeyId,
} from '../../logic/speechUtils';
import {
  clearAudioCache,
  getVoiceSettings,
  saveVoiceSettings,
  type ElevenLabsModelId,
} from '../../services/elevenLabsTts';

export interface VoiceSettingsModalProps {
  isElevenLabsConfigured: boolean;
  lastError?: string | null;
  isSpeaking?: boolean;
  onTestVoice: (sampleText: string) => void;
  onClose: () => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
  isElevenLabsConfigured,
  lastError,
  isSpeaking = false,
  onTestVoice,
  onClose,
}) => {
  const initial = getVoiceSettings();
  const [apiKey, setApiKey] = useState(initial.apiKey);
  const [voiceId, setVoiceId] = useState(initial.voiceId);
  const [modelId, setModelId] = useState<ElevenLabsModelId>(initial.modelId);
  const [autoRead, setAutoRead] = useState(initial.autoRead);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (overrideKey?: string) => {
    const nextKey = overrideKey !== undefined ? overrideKey : apiKey;
    clearAudioCache();
    saveVoiceSettings({
      apiKey: nextKey.trim(),
      voiceId,
      modelId,
      autoRead,
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 1800);
  };

  const handleSaveAndTest = () => {
    handleSave();
    const chosenVoice = ELEVENLABS_VOICE_PRESETS.find((v) => v.id === voiceId);
    const voiceName = chosenVoice?.name || 'Station Master';
    onTestVoice(
      `All aboard! Hello, I am ${voiceName}. The next express train departs at 8:45.`
    );
  };

  const handleClearKey = () => {
    setApiKey('');
    handleSave('');
  };

  const enteredLooksLikeKeyId = isLikelyElevenLabsKeyId(apiKey);
  const readyForElevenLabs = Boolean(
    isElevenLabsConfigured || (apiKey.trim() && !enteredLooksLikeKeyId)
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm select-none"
      role="dialog"
      aria-modal="true"
      aria-label="ElevenLabs Realistic Voice Settings"
    >
      <div className="w-full max-w-lg bg-white rounded-3xl border-4 border-[#1B2A49] shadow-2xl p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-purple-100 rounded-2xl border-2 border-[#1B2A49] text-purple-700">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#1B2A49] font-display">
                Station Voice Studio
              </h2>
              <p className="text-xs font-bold text-slate-500">
                Powered by ElevenLabs Realistic Neural Speech
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 border-2 border-[#1B2A49] text-slate-700"
            aria-label="Close voice settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Banner */}
        <div
          className={`mb-4 p-3 rounded-2xl border-2 text-xs sm:text-sm font-bold flex items-start gap-2 ${
            readyForElevenLabs
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : 'bg-amber-50 border-amber-300 text-amber-900'
          }`}
        >
          <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            {readyForElevenLabs ? (
              <span>
                ElevenLabs realistic voice is ready! Prompts, hints, and cheers will speak naturally.
              </span>
            ) : (
              <span>
                Add your ElevenLabs secret API key (starts with <code>sk_</code>) below or set <code>ELEVENLABS_API_KEY</code> on the server to unlock ultra-realistic neural narration.
              </span>
            )}
          </div>
        </div>

        {lastError && (
          <div className="mb-4 p-3 rounded-2xl bg-red-50 border-2 border-red-300 text-xs font-bold text-red-800">
            ⚠️ {lastError}
          </div>
        )}

        {/* Voice Character Selection */}
        <div className="mb-4">
          <label className="block text-sm font-black text-[#1B2A49] mb-2">
            Choose Realistic Voice Character
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ELEVENLABS_VOICE_PRESETS.map((preset) => {
              const selected = preset.id === voiceId;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setVoiceId(preset.id)}
                  className={`p-3 rounded-2xl border-2 text-left transition-all ${
                    selected
                      ? 'bg-purple-50 border-[#8338EC] ring-2 ring-purple-300'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-black text-sm text-[#1B2A49]">{preset.name}</span>
                    {selected && <Check className="w-4 h-4 text-[#8338EC]" />}
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 block mt-0.5">
                    {preset.role}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Model Quality */}
        <div className="mb-4">
          <label className="block text-sm font-black text-[#1B2A49] mb-1.5">
            Speech Naturalness Model
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setModelId('eleven_multilingual_v2')}
              className={`px-3 py-2 rounded-xl border-2 text-xs font-black transition-all ${
                modelId === 'eleven_multilingual_v2'
                  ? 'bg-[#1B2A49] text-[#FFD23F] border-[#1B2A49]'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              Multilingual v2 (Most Realistic)
            </button>
            <button
              type="button"
              onClick={() => setModelId('eleven_flash_v2_5')}
              className={`px-3 py-2 rounded-xl border-2 text-xs font-black transition-all ${
                modelId === 'eleven_flash_v2_5'
                  ? 'bg-[#1B2A49] text-[#FFD23F] border-[#1B2A49]'
                  : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
            >
              Flash v2.5 (Ultra Fast)
            </button>
          </div>
        </div>

        {/* Optional Client API Key Input */}
        <div className="mb-4">
          <label
            htmlFor="elevenlabs-api-key"
            className="flex items-center gap-1.5 text-sm font-black text-[#1B2A49] mb-1.5"
          >
            <KeyRound className="w-4 h-4 text-amber-600" />
            <span>ElevenLabs Secret API Key (saved only in your browser)</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              id="elevenlabs-api-key"
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk_... (leave blank if configured on server)"
              className="flex-1 px-3 py-2 rounded-xl border-2 border-slate-300 focus:border-[#3A86FF] outline-none font-mono text-xs sm:text-sm text-[#1B2A49]"
            />
            {apiKey && (
              <button
                type="button"
                onClick={handleClearKey}
                className="p-2 rounded-xl bg-red-50 hover:bg-red-100 border-2 border-red-200 text-red-600"
                title="Clear saved key"
                aria-label="Clear saved ElevenLabs API key"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          {enteredLooksLikeKeyId && (
            <p className="mt-1.5 text-xs font-bold text-red-700">
              ⚠️ This looks like an ElevenLabs API Key ID (hex string). Please paste your secret key starting with <code>sk_</code> instead.
            </p>
          )}
        </div>

        {/* Auto-Read Toggle */}
        <label className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border-2 border-slate-200 mb-5 cursor-pointer">
          <div>
            <span className="block text-sm font-black text-[#1B2A49]">
              Auto-Announce Trains & Hints
            </span>
            <span className="block text-[11px] font-bold text-slate-500">
              Speaks train prompts & conductor tips automatically when unmuted
            </span>
          </div>
          <input
            type="checkbox"
            checked={autoRead}
            onChange={(e) => setAutoRead(e.target.checked)}
            className="w-5 h-5 accent-[#8338EC]"
          />
        </label>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t-2 border-slate-200">
          <button
            type="button"
            onClick={handleSaveAndTest}
            disabled={isSpeaking}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#8338EC] hover:bg-[#722ed1] text-white font-black text-sm border-2 border-[#1B2A49] shadow-chunky-sm active:translate-y-0.5 disabled:opacity-60"
          >
            <Volume2 className="w-4 h-4" />
            <span>{isSpeaking ? 'Speaking...' : 'Save & Test Voice'}</span>
          </button>

          <div className="flex items-center gap-2">
            {savedNotice && (
              <span className="text-xs font-black text-emerald-600">Saved!</span>
            )}
            <button
              type="button"
              onClick={() => {
                handleSave();
                onClose();
              }}
              className="px-5 py-2.5 rounded-2xl bg-[#3DDC84] hover:bg-[#34c776] text-[#1B2A49] font-black text-sm border-2 border-[#1B2A49] shadow-chunky-sm"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
