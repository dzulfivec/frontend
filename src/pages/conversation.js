import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import Loader from "../component/features/loader";
import dayjs from "dayjs";
import animationData from "../styles/animationSuccess.json";
import Lottie from "react-lottie";
const Conversation = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [noAdmin, setNoAdmin] = useState("");
  const [no_pelanggan, setNoPelanggan] = useState("");
  const [loading, setLoading] = useState(false);
  const [assistantData, setAssistantData] = useState({});
  const [threadData, setThreadData] = useState([]);
  const [listMessage, setListMessage] = useState([]);
  const [threadId, setThreadId] = useState("");
  const [statusKet, setStatusKet] = useState("Sedang Memuat Data");
  const [isData, setIsData] = useState(false);
  const [assistantId, setAssistantId] = useState(""); // Replace with your actual assistant ID
  const [message, setMessage] = useState(""); // Replace with your actual assistant ID
  const [lastMessage, setLastMessage] = useState(""); // Replace with your actual assistant ID
  const email = localStorage.getItem("email");

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
  };
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

        setNoAdmin(assistantData.data.no_whatsapp);
        setAssistantId(assistantData.data.assistance_id);
        getThread(assistantData.data.no_whatsapp);
      } else {
        throw new Error(assistantData.error);
      }
    } catch (error) {
      console.error("Error fetching assistant data:", error);
    }
  };

  const getThread = async (no_wa) => {
    try {
      setLoading(true); // Set loading true sebelum request dimulai
      const response = await axios.get(
        `https://apiassistant-mn76rlbdka-uc.a.run.app/conversation/get-thread/${no_wa}`
      );

      console.log("Instructions:", response.data.data);
      const data = response.data.data;

      const formatLastSeen = (lastSeen) => {
        const lastSeenDate = dayjs(lastSeen);
        const today = dayjs();

        // Cek apakah lastSeen adalah hari ini
        const isToday = lastSeenDate.isSame(today, "day");

        if (isToday) {
          // Pisahkan string dan ambil jam dan menit dari format ISO
          const timeString = lastSeen.split("T")[1]; // Ambil bagian waktu dari string
          const [hours, minutes] = timeString.split(":"); // Pisahkan jam dan menit
          return `${hours}:${minutes}`; // Tampilkan jam dan menit
        } else {
          // Tampilkan tanggal dalam format Indonesia
          return lastSeenDate.format("DD MMMM YYYY");
        }
      };

      if (data) {
        const newData = data.map((item) => ({
          id: item.threadid,
          name: item.name_customer,
          number: item.whatsapp_number,
          timestamp: item.lastUpdates ?? item.timestamp,
          lastSeen: formatLastSeen(item.lastUpdates ?? item.timestamp),
        }));
        const sortAData = sortByDatetimeDesc(newData);
        setThreadData(sortAData);
        setIsData(true);
        console.log(sortAData);
      }

      setLoading(false); // Set loading false setelah request selesai
    } catch (err) {
      console.log(err.response ? err.response.data.message : err.message);
      setLoading(false); // Set loading false jika terjadi error
    }
  };

  const groupMessagesByDate = (messages) => {
    // Gunakan reduce untuk mengelompokkan pesan berdasarkan tanggal
    const groupedMessages = messages.reduce((acc, message) => {
      // Cek apakah sudah ada grup dengan tanggal yang sama
      const existingGroup = acc.find(
        (group) => group.tanggal === message.tanggal
      );

      if (existingGroup) {
        // Jika ada, tambahkan pesan ke array data yang ada
        existingGroup.data.push(message);
      } else {
        // Jika tidak ada, buat grup baru dengan properti tanggal dan array data
        acc.push({
          tanggal: message.tanggal,
          data: [message],
        });
      }

      return acc;
    }, []);

    // Sortir data di setiap grup berdasarkan jam
    groupedMessages.forEach((group) => {
      group.data.sort((a, b) => {
        // Sortir berdasarkan jam secara ascending
        return a.jam.localeCompare(b.jam);
      });
    });

    // Kembalikan hasil akhir
    return groupedMessages;
  };

  // Contoh penggunaan di dalam getMessage
  const getMessage = async (thread) => {
    setStatusKet("Sedang Memuat Data");
    try {
      const response = await axios.get(
        `https://apiassistant-mn76rlbdka-uc.a.run.app/conversation/get-messages/${thread}`
      );
      console.log("message", response.data.data);
      const data = response.data.data;

      if (response.data.data) {
        // Kelompokkan pesan berdasarkan tanggal dan sortir berdasarkan jam
        const groupedMessages = groupMessagesByDate(data);
        setListMessage(groupedMessages);
        const last = data[data.length - 1];
        console.log("grup", groupedMessages);
        setLastMessage(last.text);
        console.log(last, "Last");
      }
      setThreadId(thread);
      setLoading(false);
    } catch (err) {
      console.log(err.response ? err.response.data.message : err.message);
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    setLoading(true);
    setStatusKet("Sedang Mengirim Pesan");
    const data = {
      message: message,
      reply_to_message: `Chat Pelanggan : ${lastMessage}.\n\n Nama Pelanggan : ${selectedChat}\n\nNo Wa Pelanggan : ${no_pelanggan}\n\nNo Wa Admin : ${noAdmin}`,
    };
    console.log(data);
    try {
      const response = await axios.post(
        "https://apireplychat-mn76rlbdka-uc.a.run.app/webhook",
        {
          message: message,
          reply_to_message: `Chat Pelanggan : ${lastMessage}.\n\n Nama Pelanggan : ${selectedChat}\n\nNo Wa Pelanggan : ${no_pelanggan}\n\nNo Wa Admin : ${noAdmin}`,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      await handleUpdateThread();
      // Memeriksa jika status respons adalah 'success'
      if (response.data.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Pesan berhasil dikirim!",
        });
        setMessage("");
        getMessage(threadId); // Panggil ulang untuk refresh daftar pesan
        console.log("Response:", response.data);
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Gagal mengirim pesan. Silakan coba lagi.",
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      Swal.fire({
        icon: "error",
        title: "Terjadi Kesalahan",
        text: "Terjadi kesalahan. Silakan coba lagi.",
      });
    }
  };
  const handleUpdateThread = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5009/conversation/updateThread",
        {
          scan_number: noAdmin,
          contact_name: no_pelanggan,
        }
      );

      // Set the response message from the server
      console.log(response.data.status);
    } catch (error) {
      if (error.response) {
        // Jika ada error dari server, tampilkan pesan error
        console.log(error.response.data.message);
      } else {
        console.log("Error: Could not update thread.");
      }
    }
  };
  const sortByDatetimeDesc = (dataArray) => {
    return dataArray.sort((a, b) => {
      // Konversi properti datetime ke timestamp menggunakan Date.parse()
      const dateA = Date.parse(a.timestamp);
      const dateB = Date.parse(b.timestamp);

      // Sortir secara descending (terbesar ke terkecil)
      return dateB - dateA;
    });
  };
  const convertToIndonesianDate = (dateString) => {
    // Pecah tanggal dari format DD/MM/YYYY
    const [day, month, year] = dateString.split("/");

    // Daftar nama bulan dalam bahasa Indonesia
    const monthNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    // Ambil nama bulan berdasarkan indeks bulan
    const monthName = monthNames[parseInt(month) - 1];

    // Bentuk tanggal baru dalam bahasa Indonesia
    return `${day} ${monthName} ${year}`;
  };
  return (
    <div className="min-h-screen bg-indigo-500 flex  justify-center items-start p-8">
      <div className="w-[90%] flex justify-between items-start bg-white rounded-lg shadow-md p-6">
        {/* Sidebar */}
        <div className="w-1/3 bg-white border-r rounded-xl border-gray-300 border-l border-l-slate-300 ">
          <div className="flex items-center rounded-tl-xl rounded-tr-xl justify-between p-2 bg-indigo-600 text-white">
            <h1 className="text-xl font-bold">Chats</h1>
            <button className="bg-white text-indigo-600 p-2 rounded-full">
              +
            </button>
          </div>
          <div className="mt-4 max-h-[38rem] overflow-y-scroll">
            {!isData ? (
              <>
                <div className=" bg-white w-full h-full flex justify-center items-center flex-col gap-8">
                  <Loader />
                  <h4 className="text-base font-medium">Sedang Memuat Data</h4>
                </div>
              </>
            ) : (
              <>
                {threadData.map((contact, index) => (
                  <div
                    key={index}
                    onClick={() => {
                      getMessage(contact.id);
                      setSelectedChat(contact.name);
                      setNoPelanggan(contact.number);
                    }}
                    className={`p-4 flex justify-between items-center cursor-pointer hover:bg-indigo-50 duration-300 ${
                      selectedChat === contact.name ? "bg-indigo-50" : ""
                    }`}
                  >
                    <div>
                      <h3 className="font-medium">{contact.name}</h3>
                      <p className="text-gray-600 text-sm">{contact.number}</p>
                    </div>
                    <span className="text-xs">{contact.lastSeen}</span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="w-2/3 bg-indigo-200 h-[42rem] flex flex-col justify-end border-t border-t-slate-300 ">
          {/* Header */}
          <div className="p-4 py-2 border-b bg-white border-gray-300">
            <h2 className="font-medium text-base">
              {selectedChat || "Select a contact"}
            </h2>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4  overflow-y-scroll ">
            {loading ? (
              <>
                <div className=" bg-white w-full h-full flex justify-center items-center flex-col gap-8">
                  <Loader />
                  <h4 className="text-base font-medium">{statusKet}</h4>
                </div>
              </>
            ) : (
              <>
                {listMessage.map((message, index) => (
                  <div className="w-full flex flex-col justify-start items-center gap-4">
                    <div className="rounded-xl text-white text-sm font-normal p-2 px-8 bg-indigo-400">
                      {convertToIndonesianDate(message.tanggal)}
                    </div>
                    <div className="w-full flex flex-col ">
                      {message.data.map((item) => (
                        <div
                          key={index}
                          className={`mb-4 flex flex-col justify-between ${
                            item.fromMe === true
                              ? "text-right items-end"
                              : "text-left  items-start"
                          }`}
                        >
                          <p
                            className={`inline-block p-2  rounded-lg w-[80%] ${
                              item.fromMe === true
                                ? "bg-indigo-500 text-white"
                                : "bg-white text-black"
                            }`}
                          >
                            {item.text}
                          </p>
                          <div className="text-xs font-medium text-indigo-500 mt-2 bg-white rounded-md flex justify-center items-center w-10 px-2 p-1">
                            {item.jam}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 border rounded-md shadow-md bg-white border-gray-300 flex items-center">
            <input
              type="text"
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              placeholder="Send a message"
              className="w-full p-2 border rounded-lg"
            />
            <button
              onClick={handleSendMessage}
              className="ml-4 p-2 bg-indigo-500 text-white rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
