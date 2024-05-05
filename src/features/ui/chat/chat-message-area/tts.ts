'use server'
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

export async function synthesizeSpeech(text:any) {
  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION;
  const speechConfig = sdk.SpeechConfig.fromSubscription(key, region);
  speechConfig.speechSynthesisLanguage = "en-US";
  speechConfig.speechSynthesisVoiceName = "en-US-DavisNeural";
  const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig);

  if (!text) {
    throw new Error("No text provided for synthesis.");
  }

  return new Promise((resolve, reject) => {
    speechSynthesizer.speakTextAsync(
      text,
      result => {
        speechSynthesizer.close();
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          const audioBase64 = Buffer.from(result.audioData).toString('base64');
          resolve(audioBase64);
        } else if (result.reason === sdk.ResultReason.Canceled) {
          const cancellation = sdk.CancellationDetails.fromResult(result);
          reject(`Speech synthesis canceled: ${cancellation.reason}`);
        }
      },
      error => {
        speechSynthesizer.close();
        reject(error);
      }
    );
  });
}

//speed = 

export async function synthesizeSpeech2(text:any, emotion = 'sad', speed = '+80%', voice = 'en-US-DavisNeural') {
  const key = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION;
  const speechConfig = sdk.SpeechConfig.fromSubscription(key, region);
  speechConfig.speechSynthesisLanguage = "en-US";
  speechConfig.speechSynthesisVoiceName = voice;
  const speechSynthesizer = new sdk.SpeechSynthesizer(speechConfig);

  if (!text) {
    throw new Error("No text provided for synthesis.");
  }

  // Construct SSML with custom emotion and speed
  const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xml:lang="en-US">
    <voice name="${speechConfig.speechSynthesisVoiceName}">
      <prosody rate="${speed}">
        <mstts:express-as style="${emotion}">
          ${text}
        </mstts:express-as>
      </prosody>
    </voice>
  </speak>`;

  return new Promise((resolve, reject) => {
    speechSynthesizer.speakSsmlAsync(
      ssml,
      result => {
        speechSynthesizer.close();
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          const audioBase64 = Buffer.from(result.audioData).toString('base64');
          resolve(audioBase64);
        } else if (result.reason === sdk.ResultReason.Canceled) {
          const cancellation = sdk.CancellationDetails.fromResult(result);
          reject(`Speech synthesis canceled: ${cancellation.reason}`);
        }
      },
      error => {
        speechSynthesizer.close();
        reject(error);
      }
    );
  });
}






// export async function create() {
//   const key = process.env.AZURE_SPEECH_KEY;
//   const region = process.env.AZURE_SPEECH_REGION;

//   return key;

// }

// export async function create2() {
//   const key = process.env.AZURE_SPEECH_KEY;
//   const region = process.env.AZURE_SPEECH_REGION;

//   return region;

// }
