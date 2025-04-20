import React, { useEffect, useState } from "react";
import OpenAI from "openai";
import axios from "axios";

import Swal from "sweetalert2";
function Instructions() {
  const [instructions, setInstructions] = useState("");
  const [name, setName] = useState("");
  const [model, setModel] = useState("gpt-4o-mini");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [assistantData, setAssistantData] = useState({});
  const [assistantId, setAssistantId] = useState(""); // Replace with your actual assistant ID
  const [nama, setNama] = useState(""); // Replace with your actual assistant ID
  const email = localStorage.getItem("email");

  useEffect(() => {
    getAssistant(email);
  }, []);

  const getAssistant = async (email) => {
    try {
      const response = await fetch(
        `https://apiassistant-mn76rlbdka-uc.a.run.app/assistant/get-data/${email}`
      );
      const assistantData = await response.json();
      console.log(assistantData.data);
      if (response.ok) {
        console.log(" data:", assistantData);
        setNama(assistantData.data.nama_bisnis);
        setName(assistantData.data.nama_admin);
        setAssistantId(assistantData.data.assistance_id);
        await getAssistantData(assistantData.data.assistance_id);
      } else {
        throw new Error(assistantData.error);
      }
    } catch (error) {
      console.error("Error fetching assistant data:", error);
    }
  };
  const getAssistantData = async (assistantId) => {
    try {
      const response = await fetch(
        `https://apiassistant-mn76rlbdka-uc.a.run.app/assistant/get-assistant/${assistantId}`
      );
      const assistantData = await response.json();
      console.log(assistantData.data);
      if (response.ok) {
        console.log("Assistant data:", assistantData);
        setAssistantData(assistantData.data);
        setInstructions(assistantData.data.instructions);
      } else {
        throw new Error(assistantData.error);
      }
    } catch (error) {
      console.error("Error fetching assistant data:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        "https://apiassistant-mn76rlbdka-uc.a.run.app/assistant/update-assistant",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            instructions,
            name,
            tools: [{ type: "file_search" }],
            model,
            assistantId,
          }),
        }
      );

      const myUpdatedAssistant = await response.json();

      if (response.ok) {
        console.log("Successfully updated assistant");
        setResponse(myUpdatedAssistant);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Assistant updated successfully!",
        });
      } else {
        throw new Error(myUpdatedAssistant.error);
      }
    } catch (error) {
      console.error("Error updating assistant:", error);
      setResponse({ error: error.message });
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to update assistant: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLogin");
    localStorage.removeItem("email");
    window.location.href = "/";
  };
  return (
    <div>
      <div className="w-full h-[100vh]  relative flex justify-center items-start overflow-y-scroll ">
        <div className="absolute  w-full h-full flex justify-start items-start z-[-9]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#595fd1"
              fill-opacity="1"
              d="M0,224L48,234.7C96,245,192,267,288,272C384,277,480,267,576,224C672,181,768,107,864,90.7C960,75,1056,117,1152,117.3C1248,117,1344,75,1392,53.3L1440,32L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            ></path>
          </svg>
        </div>
        <div className="mt-[5rem] z-[99] flex justify-start items-center gap-4 p-6 w-[70%] h-[105%] rounded-xl bg-white shadow-xl flex-col mb-10">
          <div className="w-full flex justify-between">
            <div className="w-[97%] flex justify-center items-center ">
              <h4 className="font-medium text-3xl ">AI Assistant {nama}</h4>
            </div>
            <div class="group relative">
              <button onClick={handleLogout}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="2rem"
                  height="2rem"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="black"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    class=" hover:scale-125 duration-200 hover:stroke-blue-500"
                    d="M12 21a9 9 0 1 0-9-9c0 1.488.36 2.891 1 4.127L3 21l4.873-1c1.236.64 2.64 1 4.127 1m-2-11l4 4m-4 0l4-4"
                  />
                </svg>
              </button>
              <span
                class="absolute -top-14 left-[50%] -translate-x-[50%] 
  z-99 origin-left scale-0 px-3 rounded-lg border 
  border-gray-300 bg-white py-2 text-sm font-bold
  shadow-md transition-all duration-300 ease-in-out 
  group-hover:scale-100"
              >
                Logout<span></span>
              </span>
            </div>
          </div>{" "}
          <h4 className="font-medium text-xl ">Instructions AI</h4>
          <div className="w-full ">
            <textarea
              required
              value={instructions}
              onChange={(e) => {
                setInstructions(e.target.value);
                // Adjust the height dynamically
                e.target.style.height = "auto"; // Reset height to calculate new height
                e.target.style.height = `${e.target.scrollHeight}px`; // Set new height based on scroll height
              }}
              className="relative block w-full px-3 py-2 min-h-[25rem] max-h-[30rem] text-gray-900 placeholder-gray-500 bg-gray-50 border border-violet-600 rounded-xl mt-6 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm flex-wrap text-wrap"
              placeholder="Instructions"
            />
          </div>
          <button
            class="button-main mt-5"
            disabled={loading}
            onClick={handleSubmit}
          >
            {loading ? "Updating..." : "Update Instructions"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Instructions;
