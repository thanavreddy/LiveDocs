'use server'
import { nanoid } from "nanoid";
import { liveblocks } from "../liveblocks";
import { revalidatePath } from "next/cache";
import { parseStringify } from "../utils";

export const createDocument = async ({
  userId,
  email,
}: CreateDocumentParams) => {
  const roomId = nanoid();
  try {
    const metadata = {
      creatorId: userId,
      email,
      title: "Untitled",
    };
    const usersAccesses: RoomAccesses = {
      [email]: ["room:write"],
    };
    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: ["room:write"], //only for the time being
    });
    revalidatePath('/');

    return parseStringify(room)
  } catch (error) {
    console.log(`error occured while creating a room ${error}`);
  }
};


export const getDocument = async({roomId, userId}: {roomId: string, userId: string}) => {
  try {
    const room = await liveblocks.getRoom(roomId);
    
    if (!room) {
      throw new Error("Room not found");
    }
    
    // Check if the user has access by email
    // The issue is likely here - we need to compare with all possible formats
    const hasAccess = Object.keys(room.usersAccesses || {}).some(accessKey => 
      accessKey.toLowerCase() === userId.toLowerCase()
    );

    if (!hasAccess) {
      console.log("Access denied. Available keys:", Object.keys(room.usersAccesses || {}));
      console.log("User requesting access:", userId);
      throw new Error("You do not have access to this room");
    }

    return parseStringify(room);
  } catch (error) {
    console.error(`Error occurred while getting the room: ${error}`);
    return null; // Return null instead of undefined
  }
}