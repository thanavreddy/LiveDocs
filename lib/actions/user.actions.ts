'use server';

import { clerkClient } from "@clerk/nextjs/server";
import { parseStringify } from "../utils";
import { liveblocks } from "../liveblocks";

export const getClerkUsers = async ({ userIds }: { userIds: string[] }) => {
  try {
    const { data } = await clerkClient.users.getUserList({
      emailAddresses: userIds, // ✅ Corrected field name
    });

    const users = data.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0]?.emailAddress, // ✅ Added optional chaining
      avatar: user.imageUrl,
    }));

    const sortedUsers = userIds
      .map((email) => users.find((user) => user.email === email))
      .filter(Boolean); // ✅ Prevents undefined values

    return parseStringify(sortedUsers);
  } catch (error) {
    console.error(`Error fetching users: ${error}`);
    return [];
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
