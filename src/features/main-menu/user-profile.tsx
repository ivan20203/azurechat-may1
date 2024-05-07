"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/dropdown-menu";
import { menuIconProps } from "@/ui/menu";
import { CircleUserRound, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { ThemeToggle } from "./theme-toggle";
import { useState, useEffect } from 'react';

import {upsertProfileSettings} from "../chat-page/chat-services/chat-tts-setting"

// all voices are from : https://learn.microsoft.com/en-us/azure/ai-services/speech-service/language-support?tabs=tts

// const voiceToEmotions: {
//   [key: string]: string[];
// } = {
//   "en-US-AriaNeural": ["angry", "chat", "cheerful", "customerservice", "empathetic", "excited", "friendly", "hopeful", "narration-professional", "newscast-casual", "newscast-formal", "sad", "shouting", "terrified", "unfriendly", "whispering"],
//   "en-US-DavisNeural": ["angry", "chat", "cheerful", "excited", "friendly", "hopeful", "sad", "shouting", "terrified", "unfriendly", "whispering"],
//   "en-US-GuyNeural": ["angry", "cheerful", "excited", "friendly", "hopeful", "newscast", "sad", "shouting", "terrified", "unfriendly", "whispering"],
//   "en-US-JaneNeural": ["angry", "cheerful", "excited", "friendly", "hopeful", "sad", "shouting", "terrified", "unfriendly", "whispering"],
//   "en-US-JasonNeural": ["angry", "cheerful", "excited", "friendly", "hopeful", "sad", "shouting", "terrified", "unfriendly", "whispering"],
//   "en-US-JennyNeural": ["angry", "assistant", "chat", "cheerful", "customerservice", "excited", "friendly", "hopeful", "newscast", "sad", "shouting", "terrified", "unfriendly", "whispering"],
//   "en-US-NancyNeural": ["angry", "cheerful", "excited", "friendly", "hopeful", "sad", "shouting", "terrified", "unfriendly", "whispering"],
//   "en-US-SaraNeural": ["angry", "cheerful", "excited", "friendly", "hopeful", "sad", "shouting", "terrified", "unfriendly", "whispering"],
//   "en-US-TonyNeural": ["angry", "cheerful", "excited", "friendly", "hopeful", "sad", "shouting", "terrified", "unfriendly", "whispering"]
// };



const voiceToEmotions: { [key: string]: string[] } = {
  "de-DE-ConradNeural1": ["cheerful"],
  "en-GB-SoniaNeural": ["cheerful", "sad"],
  "en-US-AriaNeural": ["angry", "chat", "cheerful", "customerservice", "empathetic", "excited", "friendly", "hopeful", "narration-professional", "newscast-casual", "newscast-formal", "sad", "shouting", "terrified", "unfriendly", "whispering"],
  "en-US-DavisNeural": ["angry", "chat", "cheerful", "excited", "friendly", "hopeful", "sad", "shouting", "terrified", "unfriendly", "whispering"],
  "en-US-GuyNeural": ["angry", "cheerful", "excited", "friendly", "hopeful", "newscast", "sad", "shouting", "terrified", "unfriendly", "whispering"],
  "en-US-JaneNeural": ["angry", "cheerful", "excited", "friendly", "hopeful", "sad", "shouting", "terrified", "unfriendly", "whispering"],
  "en-US-JasonNeural": ["angry", "cheerful", "excited", "friendly", "hopeful", "sad", "shouting", "terrified", "unfriendly", "whispering"],
  "en-US-JennyNeural": ["angry", "assistant", "chat", "cheerful", "customerservice", "excited", "friendly", "hopeful", "newscast", "sad", "shouting", "terrified", "unfriendly", "whispering"],
  "en-US-NancyNeural": ["angry", "cheerful", "excited", "friendly", "hopeful", "sad", "shouting", "terrified", "unfriendly", "whispering"],
  "en-US-SaraNeural": ["angry", "cheerful", "excited", "friendly", "hopeful", "sad", "shouting", "terrified", "unfriendly", "whispering"],
  "en-US-TonyNeural": ["angry", "cheerful", "excited", "friendly", "hopeful", "sad", "shouting", "terrified", "unfriendly", "whispering"],
  "es-MX-JorgeNeural": ["chat", "cheerful"],
  "fr-FR-DeniseNeural": ["cheerful", "sad"],
  "fr-FR-HenriNeural": ["cheerful", "sad"],
  "it-IT-IsabellaNeural": ["chat", "cheerful"],
  "ja-JP-NanamiNeural": ["chat", "cheerful", "customerservice"],
  "pt-BR-FranciscaNeural": ["calm"],
  "zh-CN-XiaohanNeural": ["affectionate", "angry", "calm", "cheerful", "disgruntled", "embarrassed", "fearful", "gentle", "sad", "serious"],
  "zh-CN-XiaomengNeural": ["chat"],
  "zh-CN-XiaomoNeural": ["affectionate", "angry", "calm", "cheerful", "depressed", "disgruntled", "embarrassed", "envious", "fearful", "gentle", "sad", "serious"],
  "zh-CN-XiaoruiNeural": ["angry", "calm", "fearful", "sad"],
  "zh-CN-XiaoshuangNeural": ["chat"],
  "zh-CN-XiaoxiaoNeural": ["affectionate", "angry", "assistant", "calm", "chat", "chat-casual", "cheerful", "customerservice", "disgruntled", "fearful", "friendly", "gentle", "lyrical", "newscast", "poetry-reading", "sad", "serious", "sorry", "whisper"],
  "zh-CN-XiaoyiNeural": ["affectionate", "angry", "cheerful", "disgruntled", "embarrassed", "fearful", "gentle", "sad", "serious"],
  "zh-CN-XiaozhenNeural": ["angry", "cheerful", "disgruntled", "fearful", "sad", "serious"],
  "zh-CN-YunfengNeural": ["angry", "cheerful", "depressed", "disgruntled", "fearful", "sad", "serious"],
  "zh-CN-YunhaoNeural2": ["advertisement-upbeat"],
  "zh-CN-YunjianNeural3,4": ["angry", "cheerful", "depressed", "disgruntled", "documentary-narration", "narration-relaxed", "sad", "serious", "sports-commentary", "sports-commentary-excited"],
  "zh-CN-YunxiaNeural": ["angry", "calm", "cheerful", "fearful", "sad"],
  "zh-CN-YunxiNeural": ["angry", "assistant", "chat", "cheerful", "depressed", "disgruntled", "embarrassed", "fearful", "narration-relaxed", "newscast", "sad", "serious"],
  "zh-CN-YunyangNeural": ["customerservice", "narration-professional", "newscast-casual"],
  "zh-CN-YunyeNeural": ["angry", "calm", "cheerful", "disgruntled", "embarrassed", "fearful", "sad", "serious"],
  "zh-CN-YunzeNeural": ["angry", "calm", "cheerful", "depressed", "disgruntled", "documentary-narration", "fearful", "sad", "serious"]
};



export const UserProfile = () => {
  const { data: session } = useSession();

  const [speed, setSpeed] = useState('+0%');
  const [voice, setVoice] = useState('');
  const [emotion, setEmotion] = useState('');
  const [availableEmotions, setAvailableEmotions] = useState<string[]>([]);

  useEffect(() => {
    const emotions = voiceToEmotions[voice] || [];
    setAvailableEmotions(emotions);
  }, [voice]);
  

  const handleUpdateSettings = async () => {
    await upsertProfileSettings({
      ttsSpeed: speed,
      ttsVoice: voice,
      ttsEmotion: emotion
    });
    alert('TTS settings updated!');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {session?.user?.image ? (
          <Avatar>
            <AvatarImage src={session.user.image}  />
          </Avatar>
        ) : (
          <CircleUserRound {...menuIconProps} role="button" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium leading-none">{session?.user?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{session?.user?.email}</p>
            <p className="text-xs leading-none text-muted-foreground">{session?.user?.isAdmin ? "Admin" : ""}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium leading-none">Switch themes</p>
            <ThemeToggle />
          </div>
        </DropdownMenuLabel>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium leading-none">TTS Settings</p>
            <select className="text-sm" value={speed} onChange={(e) => setSpeed(e.target.value)}>
              {/* Speed options */}
              {["+0%", "+10%", "+30%", "+50%", "+60%", "+70%", "+85%", "+100%"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <select className="text-sm" value={voice} onChange={(e) => setVoice(e.target.value)}>
              <option value="">Select Voice</option>
              {Object.keys(voiceToEmotions).map(v => <option key={v} value={v}>{v}</option>)}
            </select>
            <select className="text-sm" value={emotion} onChange={(e) => setEmotion(e.target.value)}>
              <option value="">Select Emotion</option>
              {availableEmotions.map(e => <option key={e} value={e}>{e}</option>)}
            </select>
            <button onClick={handleUpdateSettings} className="mt-2">Update Settings</button>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex gap-2" onClick={() => signOut({ callbackUrl: "/" })}>
          <LogOut {...menuIconProps} size={18} />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
