"use client";

import Editor from "@monaco-editor/react";
import { useState, useEffect } from "react";

export default function IDE() {
  const [codeText, setCodeText] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [project, setProject] = useState(""); // State variable for the response message

  useEffect(() => {
    // Function to call the create project API
    const createProject = async () => {
      try {
        const response = await fetch("/api/createproject", {
          method: "GET", // Assuming it's a GET request, update as needed
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }

        const responseData = await response.json();
        setProject(responseData["id"]); // Update the state variable with the response data
        // Optionally update the state or do something with the response
      } catch (error) {
        console.error("Failed to create project:", error);
      }
    };

    createProject();
  }, []);

  const handleEditorChange = (value, event) => {
    setCodeText(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setResponseMessage(""); // Clear previous response message

    try {
      const response = await fetch("/api/createdeployment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code: codeText, project: project }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const responseData = await response.json(); // Assuming the response is in JSON format
      setResponseMessage(responseData.message); // Update the response message state
    } catch (error) {
      setResponseMessage(`Failed to deploy code: ${error}`);
    }
  };

  return (
    <div className="flex justify-center items-start pt-10 h-screen">
      <div className="w-full max-w-4xl p-4 border border-gray-200 rounded shadow-lg">
        <form action="#" onSubmit={handleSubmit}>
          <div className="border-b border-gray-200 focus-within:border-indigo-600">
            <label htmlFor="comment" className="sr-only">
              Add your code
            </label>
            <Editor
              height="50vh"
              defaultLanguage="javascript"
              defaultValue="// some comment"
              onChange={handleEditorChange}
            />
          </div>
          <div className="flex justify-between pt-2">
            <div className="flex items-center space-x-5"></div>
            <div className="flex-shrink-0">
              <button
                type="submit"
                className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Run
              </button>
            </div>
          </div>
        </form>
        {/* Tailwind element to show the response message */}
        {responseMessage && (
          <div className="mt-4 p-4 bg-blue-100 border border-blue-500 text-blue-700 rounded">
            <p>Response: {responseMessage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
