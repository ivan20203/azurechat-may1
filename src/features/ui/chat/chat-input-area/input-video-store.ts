import { proxy, useSnapshot } from "valtio";

class InputVideoState {
  videoUrl: string = "";

  Reset() {
    this.videoUrl = "";
  }

  async OnFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) { // Ensure the file is a video
      if (this.videoUrl) {
        URL.revokeObjectURL(this.videoUrl); // Clean up the previous video URL
      }
      const url = URL.createObjectURL(file);
      this.videoUrl = url;
    } else {
      this.Reset();  // Reset the videoUrl if no valid file is selected
    }
  }
}

export const InputVideoStore = proxy(new InputVideoState());

export const useInputVideo = () => {
  return useSnapshot(InputVideoStore, { sync: true });
};
