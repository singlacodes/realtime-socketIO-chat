import React from "react";
import SideBar from "../components/SideBar";
import MessageArea from "../components/MessageArea";
import getMessage from "../customHooks/getMessages";

function Home() {
  getMessage();

  return (
    <div className="flex h-full min-h-0 w-full overflow-hidden bg-ink-100">
      <SideBar />
      <MessageArea />
    </div>
  );
}

export default Home;
