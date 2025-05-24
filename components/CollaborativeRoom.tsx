"use client";

import { RoomProvider, ClientSideSuspense } from "@liveblocks/react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import Loader from "./Loader";
import {
  SignedOut,
  SignInButton,
  SignUpButton,
  SignedIn,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Header from "./Header";
import { Editor } from "./editor/Editor";
import ActiveCollaborators from "./ActiveCollaborators";
import { Input } from "./ui/input";
import { updateDocument } from "@/lib/actions/room.actions";

const CollaborativeRoot = ({
  roomId,
  roomMetadata,
  users,
  currentUserType,
}: CollaborativeRoomProps) => {
  const { user } = useUser(); // ✅ Use Client-Side Hook
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documentTitle, setDocumentTitle] = useState(roomMetadata.title);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use the passed currentUserType prop instead of determining it dynamically

  const updateTitleHandler = async (roomId: string, documentTitle: string, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setLoading(true);
      try{
        if(documentTitle !== roomMetadata.title){
          const updatedDocument  = await updateDocument(roomId,documentTitle);
        }
      }
      catch(error){
        console.log(error)
      }
    setLoading(false)
    }

  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setEditing(false);
              updateDocument(roomId,documentTitle);
              console.log(roomMetadata)
      }
    };
    return () => {
      document.addEventListener("mousedown", handleClickOutside);
    };
  }, [roomId,documentTitle]);

  useEffect(()=>{
    if(editing && inputRef.current ){
      inputRef.current.focus();
    }
  },[editing])


  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<Loader />}>
        <div className="collaborative-room">
          <Header>
            <div ref={containerRef} className="flex w-fit items-center gap-2">
              {editing && !loading ? (
                <Input
                  type="text"
                  value={documentTitle}
                  ref={inputRef}
                  placeholder="Enter Title"
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  onKeyDown={updateTitleHandler}
                  disabled={!editing}
                  // ✅ Fixed typo
                  className="document-title-input"
                />
              ) : (
                <p className="document-title">{documentTitle}</p>
              )}

              {currentUserType === "editor" && !editing && (
                <Image
                  src={"/assets/icons/edit.svg"}
                  alt={"edit"}
                  width={24}
                  height={24}
                  onClick={() => setEditing(true)}
                  className="pointer"
                />
              )}

              {currentUserType !== "editor" && !editing && (
                <p className="view-only-tag">View only</p>
              )}

              {loading && <p className="text-sm text-gray-400">Saving...</p>}
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
