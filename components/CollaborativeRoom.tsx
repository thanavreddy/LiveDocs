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

const CollaborativeRoot = () => {
  return (
    <div>
      <RoomProvider id="my-room">
        <ClientSideSuspense fallback={<Loader />}>
          <div className="collaborative-room">
            <Header>
              <div className="flex w-fit items-center justify-center gap-2">
                <p className="document-title">Share</p>
              </div>
              <SignedOut>
                <SignInButton />
                <SignUpButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </Header>
            <Editor />
          </div>
        </ClientSideSuspense>
      </RoomProvider>
    </div>
  );
};

export default CollaborativeRoot;
