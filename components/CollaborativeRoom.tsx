"use client";
import { RoomProvider, ClientSideSuspense } from "@liveblocks/react";
import React, { ReactNode } from "react";
import Loader from "./Loader";
import {
  SignedOut,
  SignInButton,
  SignUpButton,
  SignedIn,
  UserButton,
} from "@clerk/nextjs";
import Header from "./Header";
import { Editor } from "./editor/Editor";
import ActiveCollaborators from "./ActiveCollaborators";

const CollaborativeRoot = ({roomId,roomMetadata}: CollaborativeRoomProps) => {
  return (
      <RoomProvider id={roomId}>
        <ClientSideSuspense fallback={<Loader />}>
          <div className="collaborative-room">
            <Header>
              <div className="flex w-fit items-center justify-center gap-2">
                <p className="document-title">Share</p>
              </div>
              <div className="flex w-full flex-1 justify-end gap-2 sm:gap-3">

                <ActiveCollaborators />
                <SignedOut>
                <SignInButton />
                <SignUpButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
              </div>
            </Header>
            <Editor />
          </div>
        </ClientSideSuspense>
      </RoomProvider>
    
  );
};

export default CollaborativeRoot;
