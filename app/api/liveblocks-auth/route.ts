import { liveblocks } from "@/lib/liveblocks";
import { getUserColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  // Get the current user from Clerk
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id, firstName, lastName, emailAddresses, imageUrl } = clerkUser;

  // Construct the user object
  const user = {
    id,
    info: {
      id,
      name: `${firstName ?? ""} ${lastName ?? ""}`.trim(),
      email: emailAddresses[0].emailAddress,
      avatar: imageUrl,
      color: getUserColor(id),
    },
  };

  try {
    // Get the room from the request body (this might be undefined for some requests)
    let room: string | undefined;
    
    try {
      const requestBody = await request.json();
      room = requestBody.room;
    } catch (error) {
      // If there's no request body or it's malformed, room will be undefined
      console.log("No request body or malformed JSON");
    }

    // Prepare the session
    const session = liveblocks.prepareSession(user.id, {
      userInfo: user.info,
    });

    // If a specific room is requested, grant access to it
    if (room && typeof room === 'string') {
      session.allow(room, session.FULL_ACCESS);
    } else {
      // If no specific room, you might want to allow access to all rooms
      // or handle this case differently based on your requirements
      session.allow("*", session.FULL_ACCESS);
    }

    // Authorize and return the session
    const { status, body } = await session.authorize();
    return new Response(body, { status });
  } catch (error) {
    console.error("Error preparing Liveblocks session:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}