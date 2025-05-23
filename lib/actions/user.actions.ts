'use server';

import { clerkClient } from "@clerk/nextjs/server";
import { parseStringify } from "../utils";
import { liveblocks } from "../liveblocks";

export const getClerkUsers = async ({ userIds }: { userIds: string[] }) => {
  try {
    // Get a paginated list of all users
    const allUsers = await clerkClient.users.getUserList();
    
    // Note: userIds are actually email addresses from room.usersAccesses
    const matchedUsers = allUsers.filter((user: any) => 
      user.emailAddresses.some((email: any) => 
        userIds.includes(email.emailAddress)
      )
    );    const users = matchedUsers.filter(Boolean).map((user: any) => ({
      id: user!.id,
      name: `${user!.firstName ?? ""} ${user!.lastName ?? ""}`.trim(),
      email: user!.emailAddresses[0].emailAddress,
      avatar: user!.imageUrl,
    }));

    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    return []; // Prevents crashing when calling .map on result
  }
};

export const getDocumentUsers = async ({ roomId, currentUser, text }: { roomId: string, currentUser: string, text: string }) => {
  try {
    const room = await liveblocks.getRoom(roomId);

    const users = room?.usersAccesses
      ? Object.keys(room.usersAccesses).filter((email) => email !== currentUser)
      : [];

    if (text?.length) { // ✅ Fix: Check for undefined text
      const lowerCaseText = text.toLowerCase();
      const filteredUsers = users.filter((email: string) => email.toLowerCase().includes(lowerCaseText));
      return parseStringify(filteredUsers);
    }

    return parseStringify(users);
  } catch (error) {
    console.error(`Error fetching document users: ${error}`);
    return [];
  }
};
