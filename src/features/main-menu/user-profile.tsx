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
import { useState } from 'react';

import {upsertProfileSettings} from "../chat-page/chat-services/chat-tts-setting"

export const UserProfile = () => {
  const { data: session } = useSession();

  const [speed, setSpeed] = useState('+0%');
  const [voice, setVoice] = useState('');
  const [emotion, setEmotion] = useState('');

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
          <Avatar className="">
            <AvatarImage
              src={session?.user?.image!}
              alt={session?.user?.name!}
            />
          </Avatar>
        ) : (
          <CircleUserRound {...menuIconProps} role="button" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium leading-none">
              {session?.user?.name}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session?.user?.email}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {session?.user?.isAdmin ? "Admin" : ""}
            </p>
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
      <option value="+0%">+0%</option>
      <option value="+10%">+10%</option>
      <option value="+30%">+30%</option>
      <option value="+50%">+50%</option>
      <option value="+60%">+60%</option>
      <option value="+70%">+70%</option>
      <option value="+85%">+85%</option>
      <option value="+100%">+100%</option>
    </select>
    <select className="text-sm" value={voice} onChange={(e) => setVoice(e.target.value)}>
      <option value="">Select Voice</option>
      <option value="en-US-DavisNeural">en-US-DavisNeural</option>
      <option value="en-US-JennyNeural">en-US-JennyNeural</option>
      <option value="en-US-AriaNeural">en-US-AriaNeural</option>
      <option value="en-US-GuyNeural">en-US-GuyNeural</option>
    </select>
    <select className="text-sm" value={emotion} onChange={(e) => setEmotion(e.target.value)}>
      <option value="">Select Emotion</option>
      <option value="Cheerful">Cheerful</option>
      <option value="Sad">Sad</option>
      <option value="Excited">Terrified</option>
    </select>
    <button onClick={handleUpdateSettings} className="mt-2">Update Settings</button>
  </div>
</DropdownMenuLabel>


        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex gap-2"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOut {...menuIconProps} size={18} />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
