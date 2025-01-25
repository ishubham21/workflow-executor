import React from "react";
import { InitializeTaskDefinitions } from "./components/task/initializeDefinitions";
import { Toaster } from "./components/ui/toaster";
import { Navbar } from "./components/ui/nav";
import { AppRouter } from "./routes";

const App: React.FC = () => {
  return (
    <>
      <Toaster />
      <InitializeTaskDefinitions />
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <AppRouter />
      </div>
    </>
  );
};

export default App;
