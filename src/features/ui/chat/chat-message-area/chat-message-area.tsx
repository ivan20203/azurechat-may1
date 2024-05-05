"use client";
import { cn } from "@/ui/lib";
import {
  CheckIcon,
  ClipboardIcon,
  PocketKnife,
  UserCircle,
  Volume2,
  Pause
} from "lucide-react";
import { useEffect, useState,useRef } from "react";
import { Avatar, AvatarImage } from "../../avatar";
import { Button } from "../../button";
import {synthesizeSpeech, synthesizeSpeech2 } from "./tts";


export const ChatMessageArea = (props: {
  children?: React.ReactNode;
  profilePicture?: string | null;
  profileName?: string;
  role: "function" | "user" | "assistant" | "system" | "tool";
  onCopy: () => void;
}) => {
  const [isIconChecked, setIsIconChecked] = useState(false);
  const [isTTSmode, setTTSmode] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);


  const handleButtonClick = () => {
    props.onCopy();
    setIsIconChecked(true);
  };

  const playAudio2 = (base64AudioData:any) => {
    // Decode and play audio similar to your existing function
    const binaryString = window.atob(base64AudioData);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const audioBlob = new Blob([bytes.buffer], { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // Use the audioRef to control the audio
    const audio = new Audio(audioUrl);
    audioRef.current = audio;  // Set the audio object to the ref
    audio.play();

    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      setTTSmode(false); // Reset TTS mode after audio ends
    };
  };

  
  
  const handleTTSClick = async () => {
    if (isTTSmode) {
      // If already playing, stop and reset
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0; // Reset audio to start
        URL.revokeObjectURL(audioRef.current.src); // Clean up the object URL
      }
      setTTSmode(false);
    } else {
      if (!props.children || typeof props.children !== 'object' || !('props' in props.children)) {
        return;
      }

      const val = await synthesizeSpeech2(props.children.props.message.content);
      playAudio2(val);
      setTTSmode(true);
    }
  };

/*
  this allows you to pause in the middle. 
  problem is that you wont be able to do TTS on other 
  messages until the first paused message has ran through. 

  const handleTTSClick = async () => {
    if (isTTSmode) {
      // If already playing, just pause
      if (audioRef.current) {
        audioRef.current.pause();
        setTTSmode(false);
      }
    } else {
      if (audioRef.current) {
        // Resume the audio if it's already loaded
        audioRef.current.play();
        setTTSmode(true);
      } else {
        // Handle case where audio hasn't been loaded yet
        if (!props.children || typeof props.children !== 'object' || !('props' in props.children)) {
          return;
        }
        const val = await synthesizeSpeech(props.children.props.message.content);
        playAudio2(val);
        setTTSmode(true);
      }
    }
  };
  */



  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsIconChecked(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [isIconChecked]);

  let profile = null;

  switch (props.role) {
    case "assistant":
    case "user":
      if (props.profilePicture) {
        profile = (
          <Avatar>
            <AvatarImage src={props.profilePicture} />
          </Avatar>
        );
      } else {
        profile = (
          <UserCircle
            size={28}
            strokeWidth={1.4}
            className="text-muted-foreground"
          />
        );
      }
      break;
    case "tool":
    case "function":
      profile = (
        <PocketKnife
          size={28}
          strokeWidth={1.4}
          className="text-muted-foreground"
        />
      );
      break;
    default:
      break;
  }

  return (
    <div className="flex flex-col">
      <div className="h-7 flex items-center justify-between">
        <div className="flex gap-3">
          {profile}
          <div
            className={cn(
              "text-primary capitalize items-center flex",
              props.role === "function" || props.role === "tool"
                ? "text-muted-foreground text-sm"
                : ""
            )}
          >
            {props.profileName}
          </div>
        </div>
        <div className=" h-7 flex items-center justify-between">
          <div>
            <Button
              variant={"ghost"}
              size={"sm"}
              title="Speak content"
              className="justify-right flex"
              onClick={handleTTSClick}
            >
              {isTTSmode ? (
                <Pause size={16} />
              ) : (
                <Volume2 size={16} />
              )}
            </Button>
          </div>
          <div>
          <Button
              variant={"ghost"}
              size={"sm"}
              title="Copy text"
              className="justify-right flex"
              onClick={handleButtonClick}
            >
              {isIconChecked ? (
                <CheckIcon size={16} />
              ) : (
                <ClipboardIcon size={16} />
              )}
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 flex-1 px-10">
        <div className="prose prose-slate dark:prose-invert whitespace-break-spaces prose-p:leading-relaxed prose-pre:p-0 max-w-none">
          {props.children}
        </div>
      </div>
    </div>
  );
};



/** old code
 * 
 * 
 * //   const func = async () => {
//     const key = await create();
//     const region = await create2();

//     const speechConfig = sdk.SpeechConfig.fromSubscription(key, region);

//     speechConfig.speechSynthesisLanguage = "en-US"; 
//     speechConfig.speechSynthesisVoiceName = "en-US-DavisNeural";

//     const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig);
    
//     if(!props.children){
//       return;
//     }

//     console.log(props.children);
//     console.log(props);
//     const text = props.children.props.message.content;

//     speechSynthesizer.speakTextAsync(
//         text,
//         result => {
//             speechSynthesizer.close();
//             return result.audioData;

//         },
//         error => {
//             console.log(error);
//             speechSynthesizer.close();
//         });
// }
 * 
 * 
 *   const playAudio = (audioData) => {
    const audioBlob = new Blob([audioData], { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };
  };
 * 
  const func2 = async () => {
    const key = await create();
    const region = await create2();
    const speechConfig = sdk.SpeechConfig.fromSubscription(key, region);
    speechConfig.speechSynthesisLanguage = "en-US";
    speechConfig.speechSynthesisVoiceName = "en-US-DavisNeural";
    const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig);

    if (!props.children) {
      return;
    }

    const text = props.children.props.message.content;

    speechSynthesizer.speakTextAsync(
      text,
      result => {
        speechSynthesizer.close();
        
        //playAudio(result.audioData);
      },
      error => {
        console.log(error);
        speechSynthesizer.close();
      });
  }


 */