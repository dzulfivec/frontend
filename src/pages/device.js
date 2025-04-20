import axios from "axios";
import React, { useEffect, useState } from "react";
import animationData from "../styles/animationSuccess.json";
import Lottie from "react-lottie";
import Loader from "../component/features/loader";
const Device = () => {
  const [threadId, setThreadId] = useState("");
  const [isConnect, setIsConnect] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const email = localStorage.getItem("email");
  const [selectedChat, setSelectedChat] = useState(null);
  const [noAdmin, setNoAdmin] = useState("");
  const [apiKey, setApiKey] = useState(""); // Replace with your actual assistant ID
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
  };
  useEffect(() => {
    getAssistant(email);
  }, []);
  const fetchQRCode = (apiKey) => {
    console.log(qrCode);
    setLoading(true);
    setError(null);
    axios
      .post("https://apiassistant-mn76rlbdka-uc.a.run.app/auth/getQR", {
        apiKey,
      })
      .then((response) => {
        console.log(response.data);
        const data = response.data;
        if (data.results.state == "CONNECTED") {
          setIsConnect(true);
        } else {
          setIsConnect(false);

          if (
            data.results.qrString !== " - " ||
            data.results.qrString !== "-"
          ) {
            console.log(data.results.qrString);

            setQrCode(data.results.qrString); // Misal QR code ada di field qrCodeUrl
          } else {
            setQrCode(null);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load QR code");
        setLoading(false);
      });
  };
  const LogoutDevice = (apiKey) => {
    console.log(apiKey);
    setLoading(true);
    setError(null);
    axios
      .post("https://apiassistant-mn76rlbdka-uc.a.run.app/auth/logout-device", {
        apiKey,
      })
      .then((response) => {
        console.log(response.data);
        const data = response.data;
        setIsConnect(false);
        setLoading(false);
        setQrCode(null);
      })
      .catch((err) => {
        setError("Failed to load QR code");
        setLoading(false);
      });
  };
  const getAssistant = async (email) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://apiassistant-mn76rlbdka-uc.a.run.app/assistant/get-data/${email}`
      );
      const assistantData = await response.json();
      console.log(assistantData.data);
      if (response.ok) {
        console.log(" data:", assistantData);

        setNoAdmin(assistantData.data.no_whatsapp);
        setApiKey(assistantData.data.api_wa);
        setLoading(false);

        fetchQRCode(assistantData.data.api_wa);
      } else {
        throw new Error(assistantData.error);
      }
    } catch (error) {
      console.error("Error fetching assistant data:", error);
    }
  };
  return (
    <div className="bg-indigo-500 flex justify-center items-center w-full h-[100vh]">
      <div className="font-sans rounded-xl shadow-lg w-full max-w-4xl mx-auto text-center p-6 bg-white">
        {/* Header */}
        <div className="flex justify-center items-center mb-6">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="WhatsApp Logo"
            className="w-12 mr-2"
          />
          <span className="text-2xl font-bold text-indigo-600">
            DEVICE SETTING
          </span>
        </div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row justify-between bg-white p-8 rounded-lg shadow-md">
          {/* Instructions */}
          <div className="w-full  text-left mb-8 lg:mb-0 lg:pr-8">
            <h2 className="text-xl font-semibold mb-4">
              Tautkan WhatsApp Anda
            </h2>
            <ol className="list-decimal ml-6 space-y-3 text-lg leading-relaxed">
              <li>Buka WhatsApp di telepon Anda</li>
              <li>
                Ketuk <strong>Menu</strong>{" "}
                <span className="font-bold">&#8942;</span> di Android, atau{" "}
                <strong>Pengaturan</strong> <span>&#9881;</span> di iPhone
              </li>
              <li>
                Ketuk <strong>Perangkat tertaut</strong> lalu{" "}
                <strong>Tautkan perangkat</strong>
              </li>
              <li>Arahkan telepon Anda di layar ini untuk memindai kode QR</li>
            </ol>
          </div>

          {/* QR Code Section */}
          <div className="w-full lg:w-1/2 text-center">
            <div className="w-[22rem] h-[22rem] mx-auto border border-indigo-500 rounded-xl p-4 bg-white">
              {loading ? (
                <>
                  <div className="w-full flex justify-center items-center h-full flex-col gap-2">
                    <Loader />
                    <h3 className="text-base font-medium text-indigo-500 ">
                      Sedang Memuat QR
                    </h3>
                  </div>
                </>
              ) : (
                <>
                  {isConnect ? (
                    <>
                      <div className="w-full flex justify-center items-center h-full flex-col gap-2">
                        <Lottie
                          options={defaultOptions}
                          height={150}
                          width={150}
                        />
                        <h3 className="text-base font-medium text-indigo-500 ">
                          Perangkat Sudah Terkoneksi
                        </h3>
                      </div>
                    </>
                  ) : (
                    <>
                      {qrCode !== null ? (
                        <>
                          <img
                            src={qrCode}
                            alt="QR Code"
                            className="w-full h-full"
                          />
                        </>
                      ) : (
                        <>
                          <div className="w-full flex justify-center items-center h-full flex-col gap-2">
                            <h3 className="text-base font-medium text-indigo-600">
                              Perangkat Belum Teraktivasi
                            </h3>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </>
              )}

              {/* Ganti ini dengan QR code yang sesuai */}
            </div>
            <div className="w-full flex justify-center gap-4 items-center">
              <button
                onClick={() => {
                  fetchQRCode(apiKey);
                }}
                className="mt-6 py-2 px-6 bg-indigo-600 text-white rounded-lg hover:bg-indigo-100 hover:text-indigo-600 duration-300 border hover:border-indigo-600"
              >
                Refresh QR
              </button>
              {isConnect && (
                <>
                  <button
                    onClick={() => {
                      LogoutDevice(apiKey);
                    }}
                    className="mt-6 py-2 px-6 bg-red-600 text-white rounded-lg hover:bg-red-100 hover:text-red-600 duration-300 border hover:border-red-600"
                  >
                    Stop Device
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Device;
