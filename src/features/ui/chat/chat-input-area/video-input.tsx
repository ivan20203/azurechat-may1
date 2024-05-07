import { Video as VideoIcon, X } from "lucide-react";
import { FC, useRef, useCallback } from "react";
import { Button } from "../../button";
import { InputVideoStore, useInputVideo } from "./input-video-store";

export const VideoInput: FC = () => {
  const { videoUrl } = useInputVideo();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const resetFileInput = useCallback(() => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl); // Revoke the object URL to free up memory
      InputVideoStore.Reset();
    }
  }, [videoUrl]);

  return (
    <div className="flex gap-2">
    {/* {videoUrl && videoUrl.length > 0 && (
      <div className="relative overflow-hidden rounded-md w-[35px] h-[35px]">
        <video src={videoUrl} width="35" height="35" controls />
        <button
          className="absolute right-1 top-1 bg-background/20 rounded-full p-[2px]"
          onClick={resetFileInput}
          aria-label="Remove video from chat input"
        >
          <X size={12} className="stroke-background" />
        </button>
      </div>
    )}
      <input
        type="file"
        accept="video/*"
        name="video"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => InputVideoStore.OnFileChange(e)}
      />
      <Button
        size="icon"
        variant="ghost"
        type="button"
        onClick={handleButtonClick}
        aria-label="Add a video to the chat input"
      >
        <VideoIcon size={16} />
      </Button> */}
    </div>
  );
};
