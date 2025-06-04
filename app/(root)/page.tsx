import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { RedirectToSignIn, SignedIn, UserButton } from "@clerk/nextjs";
import React from "react";
import Image from "next/image";
import AddDocumentBtn from "@/components/AddDocumentBtn";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getDocuments } from "@/lib/actions/room.actions";
import Link from "next/link";
import { dateConverter } from "@/lib/utils";
const page = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");
  const documents = await getDocuments(clerkUser.emailAddresses[0].emailAddress);
  console.log(documents)
  return (
    <main className="home-container ">
      <Header className="sticky left-0 top-0">
        <div className="flex items-center gap-2 lg:gap-4">
          Notification
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </Header>

      {documents.data.length > 0 ? (
        <div className="document-list-container">

          <div className="document-list-title">
            <h3 className="text-28-semibold">All Documents</h3>
            <AddDocumentBtn userId={clerkUser.id} email={clerkUser.emailAddresses[0].emailAddress}/>
           
          </div>
          <ul className="document-ul">
            {documents.data.map((document :any)=>(
              <li className="document-list-item" key={document.id}>
<Link href={`/documents/${document.id}`} className="flex flex-1 items-center gap-4" ><div className="hidden rounded-md bg-dark-500 p-2 sm:block ">
  
  <Image src="/assets/icons/doc.svg" alt={"file"} width={40} height={40}></Image>  </div>
  
  
  <div className="space-y-1 ">
    <p className="line-clamp-1 text-lg">{document.metadata.title}</p>
    <p className="text-sm font-light text-blue-100 ">Created about {dateConverter(document.createdAt)}</p></div></Link>
    {/* TODO: Delete button  */}

              </li>
            ))}

          </ul>
        </div>
      ) : (
        <div className="document-list-empty">
          <Image
            src="/assets/icons/doc.svg"
            alt="document"
            height={40}
            width={40}
            className="mx-auto"
          />

          <AddDocumentBtn
            userId={clerkUser.id}
            email={clerkUser.emailAddresses[0].emailAddress}
          />
        </div>
      )}
    </main>
  );
};

export default page;
