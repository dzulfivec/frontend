import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import TableItems from "../component/table";
import DataTable from "../component/table";
import dayjs from "dayjs";
import "dayjs/locale/id";
import { DatePicker, Space } from "antd";
import io from "socket.io-client";
import Loader from "../component/loader";
import { data } from "autoprefixer";
const socket = io();

const dateFormatList = ["DD/MM/YYYY", "DD/MM/YY", "DD-MM-YYYY", "DD-MM-YY"];

function AISettings() {
  const isServer =
    new URLSearchParams(window.location.search).get("isServer") === "true";
  const hasInitialized = useRef(false);

  const [dataItems, setDataItems] = useState([]);
  const [isLoadData, setIsLoadData] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [tglAwal, setTglAwal] = useState(dayjs());
  const [tglAkhir, setTglAkhir] = useState(dayjs());
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [{ name: "General", key: "general" }];

  useEffect(() => {
    getItems();

    if (isServer) {
      socket.on("speak", handleSynthesize);
      // hasInitialized.current = true;
    }

    return () => socket.off("speak", handleSynthesize);
  }, [tglAwal, tglAkhir]);

  const getItems = async () => {
    setIsLoadData(true);
    try {
      const res = await fetch("http://26.24.162.89:5002/registration/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tgl_awal: tglAwal.format("YYYY-MM-DD"),
          tgl_akhir: tglAkhir.format("YYYY-MM-DD"),
          search_text: "",
        }),
      });

      const data = await res.json();

      setDataItems(data);
    } catch (error) {
      console.error("Gagal memuat data:", error);
    } finally {
      setIsLoadData(false);
    }
  };

  const convertName = async (text) => {
    try {
      const res = await fetch("http://26.24.162.89:5002/registration/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      const data = await res.json();
      return data.name;
    } catch (error) {
      console.error("Konversi nama gagal:", error);
      return null;
    }
  };

  const addCalledPatient = async (item) => {
    try {
      await fetch("http://26.24.162.89:5002/registration/add-list", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tanggal: item.tgl_registrasi,
          no_rawat: item.no_rawat,
        }),
      });
    } catch (error) {
      console.error("Gagal menyimpan data panggilan:", error);
    }
  };

  const handleSynthesize = async (text) => {
    if (typeof text !== "string" || !text.trim()) {
      console.warn("Teks tidak valid untuk TTS:", text);

      return;
    }

    const cleanedText = text.trim();

    if (!("speechSynthesis" in window)) {
      console.warn("Speech synthesis tidak didukung di browser ini.");
      return;
    }

    // Batalkan TTS sebelumnya jika sedang berbicara atau pending
    if (speechSynthesis.speaking || speechSynthesis.pending) {
      speechSynthesis.cancel();
      await new Promise((resolve) => setTimeout(resolve, 300)); // beri waktu cancel selesai
    }
    const audio = new Audio("/audio/ring.mp3");
    await audio.play();
    // Delay sebelum bicara
    await new Promise((resolve) => setTimeout(resolve, 6500));

    // Buat dan jalankan TTS
    const utterance = new SpeechSynthesisUtterance(cleanedText);
    utterance.lang = "id-ID";

    window.speechSynthesis.speak(utterance);

    console.log("TTS dijalankan dengan teks:", cleanedText);

    // Update tampilan atau data
    getItems();
  };

  const handleSpeak = async (item) => {
    const name = await convertName(item.nm_pasien);
    if (!name) return;

    const sentence = `Pasien atas nama ${name}, silakan menuju ke ruang periksa.`;
    const cleaned = String(sentence)
      .replace(/[\n\r]+/g, " ")
      .trim();
    console.log(item, "data");
    if (item.isDone == "Belum") {
      await addCalledPatient(item);
    }
    window.speechSynthesis.cancel(); // Cancel sebelumnya
    // Mainkan suara dingdong

    socket.emit("speak", cleaned);
    getItems();
  };

  const filtered = dataItems.filter(
    (item) =>
      item.nm_pasien.toLowerCase().includes(search.toLowerCase()) ||
      item.no_rawat.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-indigo-500 flex flex-col items-center p-8">
      <div className="w-[90%]  bg-white rounded-lg shadow-md p-6">
        {/* Title */}
        <div className="w-full flex justify-center items-center flex-col">
          <h1 className="text-2xl font-semibold mb-4">Registrasi Khanza</h1>
        </div>
        <div className="flex justify-around items-center border-b-2 border-grey-500 mt-4">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`relative group text-lg font-semibold px-4 py-2 
              ${activeTab === tab.key ? "text-indigo-600" : "text-gray-600"} 
              focus:outline-none transition duration-500`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.name}
              {activeTab === tab.key && (
                <span className="absolute inset-x-0 -bottom-0.5 h-1 bg-indigo-600 rounded-full animate-pulse"></span>
              )}
              <div
                className={`absolute inset-x-0 bottom-0 h-0.5 bg-indigo-300 
              transition-all duration-300 scale-x-0 group-hover:scale-x-100`}
              ></div>
            </button>
          ))}
        </div>
        <div className="flex mx-5 p-3 bg-indigo-500 rounded-lg gap-4 items-center mt-6">
          <div className="flex flex-col">
            <span className="text-sm font-semibold mb-1 text-white">
              Tanggal Awal
            </span>
            <DatePicker
              format="DD-MM-YYYY"
              value={tglAwal}
              onChange={(date) => setTglAwal(date)}
              allowClear={false}
            />
          </div>

          <div className="flex flex-col">
            <span className="text-sm font-semibold mb-1 text-white">
              Tanggal Akhir
            </span>
            <DatePicker
              format="DD-MM-YYYY"
              value={tglAkhir}
              onChange={(date) => setTglAkhir(date)}
              allowClear={false}
            />
          </div>

          <div className="flex flex-col">
            <button
              onClick={getItems}
              className="py-3 font-semibold px-12 flex justify-center items-end rounded-md bg-indigo-50 text-indigo-500 hover:bg-indigo-500 hover:text-indigo-50 border border-transparent hover:border-indigo-50 transition-all"
            >
              Refresh data
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {isLoadData == true ? (
          <>
            <div className="flex flex-col mt-12 justify-center items-center w-full gap-10">
              <Loader />
              <h4 className="text-lg text-indigo-500 ">
                Tunggu Bentar Yaa.....
              </h4>
            </div>
          </>
        ) : (
          <>
            <div className="mx-5 p-3 mt-6 bg-indigo-500 rounded-lg border border-indigo-500">
              {activeTab === "general" && (
                <div className="w-full flex justify-between gap-6 items-start">
                  <DataTable
                    columns={[
                      { key: "no_rawat", label: "No Rawat" },
                      { key: "nm_pasien", label: "Nama" },
                      { key: "nm_dokter", label: "Dokter" },
                      { key: "status_bayar", label: "Status Bayar" },
                      { key: "isDone", label: "Status Panggil" },
                    ]}
                    data={filtered}
                    searchValue={search}
                    onSearch={setSearch}
                    actions={[
                      {
                        label: "Panggil",
                        onClick: (item) => {
                          handleSpeak(item);
                        },
                      },
                      {
                        label: "Cetak Lab",
                        onClick: (item) => {
                          if (Array.isArray(item.listLab)) {
                            item.listLab.forEach((data) => {
                              const url = `http://26.196.180.244/khanza/hasilLab.php?id=${data.noorder}`;
                              window.open(url, "_blank");
                            });
                          }
                        },
                        // Perbaikan di sini
                        variant: (item) =>
                          Array.isArray(item.listLab) && item.listLab.length > 0
                            ? "bg-teal-500 text-teal-50 transition-all border-2 font-semibold border-transparent hover:bg-teal-50 hover:text-teal-700 hover:border-teal-600"
                            : "border-2 font-semibold bg-red-50 text-red-700 border-red-600",
                      },
                    ]}
                    currentPage={page}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AISettings;
