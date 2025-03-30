import CollaborativeRoom from '@/components/CollaborativeRoom';
import { Editor } from '@/components/editor/Editor';
import Header from '@/components/Header';
import { SignedOut, SignInButton, SignUpButton, SignedIn, UserButton } from '@clerk/nextjs';
import React from 'react'

const Document = () => {
  return (
    <CollaborativeRoom/>
  )
}

export default Document;