
"use server";
import "server-only";

import { userHashedId } from "@/features/auth-page/helpers";
import { ServerActionResponse } from "@/features/common/server-action-response";
import { uniqueId } from "@/features/common/util";
import { SqlQuerySpec } from "@azure/cosmos";
import { ConfigContainer } from "../../common/services/cosmos";

interface ProfileSettingsModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  settings: {
    ttsSpeed: string;
    ttsVoice: string;
    ttsEmotion: string;
    // Additional settings can be added here
  };
}

  

// Function to upsert user profile settings
export const upsertProfileSettings = async (
  settings: {
    ttsSpeed: string,
    ttsVoice: string,
    ttsEmotion: string
  }
): Promise<ServerActionResponse<ProfileSettingsModel>> => {
  try {
    const userId = await userHashedId(); // Get or generate the unique hashed user ID
    const now = new Date();
    const settingsToSave: ProfileSettingsModel = {
      id: userId,
      createdAt: now,
      updatedAt: now,
      settings: settings
    };

    const { resource } = await ConfigContainer().items.upsert<ProfileSettingsModel>(settingsToSave);

    if (resource) {
      return {
        status: "OK",
        response: resource,
      };
    }

    return {
      status: "ERROR",
      errors: [{ message: `Failed to upsert profile settings` }],
    };
  } catch (e) {
    return {
      status: "ERROR",
      errors: [{ message: `${e}` }],
    };
  }
};

// Function to retrieve user profile settings
export const getProfileSettings = async (): Promise<ServerActionResponse<ProfileSettingsModel>> => {
  try {
    const userId = await userHashedId(); // Ensure this matches how IDs are handled in upsert
    const querySpec: SqlQuerySpec = {
      query: "SELECT * FROM c WHERE c.id = @userId",
      parameters: [
        {
          name: "@userId",
          value: userId
        }
      ]
    };

    const { resources } = await ConfigContainer().items.query<ProfileSettingsModel>(querySpec).fetchAll();

    if (resources.length > 0) {
      return {
        status: "OK",
        response: resources[0],
      };
    }

    return {
      status: "OK",
        response: resources[0], // If no settings are found, return null
    };
  } catch (e) {
    return {
      status: "ERROR",
      errors: [{ message: `${e}` }],
    };
  }
};

