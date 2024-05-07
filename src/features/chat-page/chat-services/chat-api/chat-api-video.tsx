
// // Import necessary libraries
// import axios from 'axios';

// // Configuration constants
// const GPT_4V_ENDPOINT = "https://ai-austrailiaeast885147613407.openai.azure.com/openai/deployments/gpt-4/extensions/chat/completions?api-version=2023-07-01-preview";
// const GPT_4V_KEY = "Azure openAI GPT-4V key";
// const VISION_API_ENDPOINT = "https://aust-east.cognitiveservices.azure.com/computervision";
// const VISION_API_KEY = "Azure Computer Vision API key";
// const VIDEO_FILE_SAS_URL = "SAS URL to the video file";  // This should be dynamically provided
// const VIDEO_INDEX_NAME = "Unique Index Name";            // Consider generating this dynamically or managing lifecycle
// const VIDEO_DOCUMENT_ID = "AOAIChatDocument";

// // TypeScript interfaces for better type checking
// interface IVideoProcessProps {
//   chatThread: any; // Define more specific types based on your application
//   userMessage: string;
//   video: string; // This should be a URL or path to the video file
//   signal: AbortSignal;
// }

// async function createVideoIndex(visionApiKey: string, indexName: string): Promise<any> {
//     const url = `${VISION_API_ENDPOINT}/computervision/retrieval/indexes/${indexName}?api-version=2023-05-01-preview`;
//     const headers = { "Ocp-Apim-Subscription-Key": visionApiKey, "Content-Type": "application/json" };
//     const data = {
//         "features": [{ "name": "vision", "domain": "surveillance" }]
//     };
//     return axios.put(url, data, { headers });
// }

// async function addVideoToIndex(visionApiKey: string, indexName: string, videoUrl: string, videoId: string): Promise<any> {
//     const url = `${VISION_API_ENDPOINT}/computervision/retrieval/indexes/${indexName}/ingestions/my-ingestion?api-version=2023-05-01-preview`;
//     const headers = { "Ocp-Apim-Subscription-Key": visionApiKey, "Content-Type": "application/json" };
//     const data = { 'videos': [{ 'mode': 'add', 'documentId': videoId, 'documentUrl': videoUrl }] };
//     return axios.put(url, data, { headers });
// }

// async function waitForIngestionCompletion(visionApiKey: string, indexName: string, maxRetries: number = 30): Promise<boolean> {
//     const url = `${VISION_API_ENDPOINT}/computervision/retrieval/indexes/${indexName}/ingestions?api-version=2023-05-01-preview`;
//     const headers = { "Ocp-Apim-Subscription-Key": visionApiKey };
//     let retries = 0;
//     while (retries < maxRetries) {
//         await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
//         const response = await axios.get(url, { headers });
//         if (response.data['value'][0]['state'] === 'Completed') {
//             return true;
//         } else if (response.data['value'][0]['state'] === 'Failed') {
//             return false;
//         }
//         retries++;
//     }
//     return false;
// }

// export async function handleVideoInput(props: IVideoProcessProps): Promise<any> {
//     try {
//         // Step 1: Create an Index
//         let response = await createVideoIndex(VISION_API_KEY, VIDEO_INDEX_NAME);
//         console.log('Index creation:', response.status, response.data);

//         // Step 2: Add a video file to the index
//         response = await addVideoToIndex(VISION_API_KEY, VIDEO_INDEX_NAME, props.video, VIDEO_DOCUMENT_ID);
//         console.log('Video addition:', response.status, response.data);

//         // Step 3: Wait for ingestion to complete
//         const ingestionComplete = await waitForIngestionCompletion(VISION_API_KEY, VIDEO_INDEX_NAME);
//         if (!ingestionComplete) {
//             throw new Error('Video ingestion did not complete successfully.');
//         }

//         // Step 4: Chat with GPT-4V using the processed video information
//         const chatResponse = await axios.post(GPT_4V_ENDPOINT, {
//             dataSources: [{
//                 type: "AzureComputerVisionVideoIndex",
//                 parameters: {
//                     computerVisionBaseUrl: `${VISION_API_ENDPOINT}/computervision`,
//                     computerVisionApiKey: VISION_API_KEY,
//                     indexName: VIDEO_INDEX_NAME,
//                     videoUrls: [props.video]
//                 }
//             }],
//             enhancements: { video: { enabled: true } },
//             messages: [{ role: "system", content: "You are an AI assistant that helps people find information." }, { role: "user", content: props.userMessage }],
//             temperature: 0.7, top_p: 0.95, max_tokens: 800
//         }, {
//             headers: { "Content-Type": "application/json", "api-key": GPT_4V_KEY }
//         });

//         return chatResponse.data;
//     } catch (error) {
//         console.error('Failed to process video input:', error);
//         throw error;
//     }
// }

// Example call to handleVideoInput when `chatType` is "video"


/**
 * "use server"
// Import necessary libraries
import axios from 'axios';

import { OpenAIVisionInstance } from "@/features/common/services/openai";
import { ChatCompletionStreamingRunner } from "openai/resources/beta/chat/completions";


// Configuration constants
const GPT_4V_ENDPOINT = "https://ai-austrailiaeast885147613407.openai.azure.com/openai/deployments/gpt-4/extensions/chat/completions?api-version=2023-07-01-preview";
const GPT_4V_KEY = "Azure openAI GPT-4V key";
const VISION_API_ENDPOINT = "https://aust-east.cognitiveservices.azure.com/computervision";
const VISION_API_KEY = "Azure Computer Vision API key";

const VIDEO_FILE_SAS_URL = "SAS URL to the video file";  // This should be dynamically provided
const VIDEO_INDEX_NAME = "Unique Index Name";            // Consider generating this dynamically or managing lifecycle
const VIDEO_DOCUMENT_ID = "AOAIChatDocument";

// TypeScript interfaces for better type checking
interface IVideoProcessProps {
  chatThread: any; // Define more specific types based on your application
  userMessage: string;
  video: string; // This should be a URL or path to the video file
  signal: AbortSignal;
}

async function createVideoIndex(visionApiKey: string, indexName: string): Promise<any> {
    const url = `${VISION_API_ENDPOINT}/computervision/retrieval/indexes/${indexName}?api-version=2023-05-01-preview`;
    const headers = { "Ocp-Apim-Subscription-Key": visionApiKey, "Content-Type": "application/json" };
    const data = {
        "features": [{ "name": "vision", "domain": "surveillance" }]
    };
    return axios.put(url, data, { headers });
}

async function addVideoToIndex(visionApiKey: string, indexName: string, videoUrl: string, videoId: string): Promise<any> {
    const url = `${VISION_API_ENDPOINT}/computervision/retrieval/indexes/${indexName}/ingestions/my-ingestion?api-version=2023-05-01-preview`;
    const headers = { "Ocp-Apim-Subscription-Key": visionApiKey, "Content-Type": "application/json" };
    const data = { 'videos': [{ 'mode': 'add', 'documentId': videoId, 'documentUrl': videoUrl }] };
    return axios.put(url, data, { headers });
}

async function waitForIngestionCompletion(visionApiKey: string, indexName: string, maxRetries: number = 30): Promise<boolean> {
    const url = `${VISION_API_ENDPOINT}/computervision/retrieval/indexes/${indexName}/ingestions?api-version=2023-05-01-preview`;
    const headers = { "Ocp-Apim-Subscription-Key": visionApiKey };
    let retries = 0;
    while (retries < maxRetries) {
        await new Promise(resolve => setTimeout(resolve, 10000)); // Wait 10 seconds
        const response = await axios.get(url, { headers });
        if (response.data['value'][0]['state'] === 'Completed') {
            return true;
        } else if (response.data['value'][0]['state'] === 'Failed') {
            return false;
        }
        retries++;
    }
    return false;
}

export async function handleVideoInput(props: IVideoProcessProps): Promise<ChatCompletionStreamingRunner> {
    try {
        // Index Creation
        const indexResponse = await createVideoIndex(VISION_API_KEY, VIDEO_INDEX_NAME);
        console.log('Index creation:', indexResponse.status, indexResponse.data);

        // Add Video to Index
        const addResponse = await addVideoToIndex(VISION_API_KEY, VIDEO_INDEX_NAME, props.video, VIDEO_DOCUMENT_ID);
        console.log('Video addition:', addResponse.status, addResponse.data);

        // Wait for Ingestion to Complete
        const ingestionComplete = await waitForIngestionCompletion(VISION_API_KEY, VIDEO_INDEX_NAME);
        if (!ingestionComplete) {
            throw new Error('Video ingestion did not complete successfully.');
        }

        // Generate and stream the chat response
        const stream = new ReadableStream({
            async start(controller) {
                try {
                    const chatResponse = await axios.post(GPT_4V_ENDPOINT, {
                        dataSources: [{
                            type: "AzureComputerVisionVideoIndex",
                            parameters: {
                                computerVisionBaseUrl: `${VISION_API_ENDPOINT}/computervision`,
                                computerVisionApiKey: VISION_API_KEY,
                                indexName: VIDEO_INDEX_NAME,
                                videoUrls: [props.video]
                            }
                        }],
                        enhancements: { video: { enabled: true } },
                        messages: [
                            { role: "system", content: "You are an AI assistant that helps people find information based on video input." },
                            { role: "user", content: props.userMessage }
                        ],
                        temperature: 0.7,
                        top_p: 0.95,
                        max_tokens: 800
                    }, {
                        headers: { "Content-Type": "application/json", "api-key": GPT_4V_KEY }
                    });

                    if (chatResponse.data) {
                        controller.enqueue(chatResponse.data);
                    }
                    controller.close();
                } catch (error) {
                    console.error('Error during streaming chat response:', error);
                    controller.error(error);
                }
            }
        });

        return ChatCompletionStreamingRunner.fromReadableStream(stream);
    } catch (error) {
        console.error('Failed to process video input:', error);
        throw error;
    }
}


 */