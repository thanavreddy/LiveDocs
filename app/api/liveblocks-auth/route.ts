import { liveblocks } from "@/lib/liveblocks";
import { getUserColor } from "@/lib/utils";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function POST(request: Request) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id, firstName, lastName, emailAddresses, imageUrl } = clerkUser;
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

  // Get the room from the request body
  const { room } = await request.json();

  // Prepare the session and allow access to the requested room
  const session = liveblocks.prepareSession(user.id, {
    userInfo: user.info,
  });

  // Grant full access to the specific room
  session.allow(room, session.FULL_ACCESS);

  // Authorize and return the session
  const { status, body } = await session.authorize();
  return new Response(body, { status });
}