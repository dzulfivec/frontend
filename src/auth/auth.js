import React, { useState } from "react";
import "../styles/button.css";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import HeroArea from "../component/features/wave";
import background from "../assets/bg2.jpg";

function Login() {
  const [email, setEmail] = useState("");
  const [isLogin, setisLogin] = useState(false);
  const [password, setPassword] = useState("");
  const [cabang, setCabang] = useState("");
  const navigate = useNavigate(); // Inisialisasi useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://apiprice-mn76rlbdka-uc.a.run.app/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: email,
          pass: password,
          cabang: cabang,
        }),
      });

      const data = await res.json();
      console.log(data);

      if (res.ok && data) {
        // If login is successful, set localStorage values
        sessionStorage.setItem("isLogin", "true");
        sessionStorage.setItem("cabang", cabang);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Authentication successful!",
        }).then(() => {
          window.location.href = "/";
        });
        console.log("Authentication successful:", data);
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: data.error || "Authentication failed.",
        });
        console.log(data.error || "Authentication failed.");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred. Please try again.",
      });
      console.error("Error during authentication:", err);
    }
  };
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center relative"
      style={{
        backgroundImage: `url('${background}')`,
      }}
    >
      <div
        data-aos="fade-up"
        className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg absolute z-[99]"
      >
        <h2 className="text-3xl font-bold text-center text-blue-600">
          CS AI Automation
        </h2>
        {isLogin == false ? (
          <>
            <p className="text-center text-gray-600">Welcome to Chat AI</p>
          </>
        ) : (
          <>
            <p className="text-center text-gray-600">
              Kirim Permintaan Password
            </p>
          </>
        )}
        <div className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm">
            <div>
              <h4 className="sr-only">Email</h4>
              <input
                name="email"
                type="email"
                required
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 bg-gray-100 border border-gray-300 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email"
              />
            </div>
            {isLogin == false && (
              <>
                <div className="mt-2">
                  <h4 className="sr-only">Password</h4>
                  <input
                    name="password"
                    type="password"
                    required
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    className="relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 bg-gray-100 border border-gray-300 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="Password"
                  />
                </div>
                <div className="mt-4">
                  <select
                    value={cabang}
                    onChange={(e) => setCabang(e.target.value)}
                    className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="" disabled hidden>
                      Pilih Cabang
                    </option>
                    <option value="Gading">Kosasih Gading</option>
                    <option value="Kemiling">Kosasih Kemiling</option>
                    <option value="Rajabasa">Kosasih Rajabasa</option>
                    <option value="Tirtayasa">Kosasih Tirtayasa</option>
                    <option value="Urip">Kosasih Urip</option>
                    <option value="Tugu">Kosasih Tugu</option>
                    <option value="Palapa">Kosasih Palapa</option>
                    <option value="Amanah">Kosasih Amanah</option>
                    <option value="Panjang">Kosasih Panjang</option>
                    <option value="Teluk">Kosasih Teluk</option>
                    <option value="GTSKemiling">GTS Kemiling</option>
                    <option value="GTSTirtayasa">GTS Tirtayasa</option>
                  </select>
                </div>
              </>
            )}
          </div>
          <div className="flex items-center justify-between">
            {isLogin == false ? (
              <>
                {/* <div className="text-sm">
                  <button
                    onClick={() => {
                      setisLogin(true);
                    }}
                    href="#"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Forgot your password?
                  </button>
                </div> */}
              </>
            ) : (
              <>
                <div className="text-sm">
                  <button
                    onClick={() => {
                      setisLogin(false);
                    }}
                    href="#"
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Sign In Again
                  </button>
                </div>
              </>
            )}
          </div>
          <div className="w-full flex justify-center">
            {isLogin == false ? (
              <>
                <button
                  className="button-login"
                  alt="Sign In"
                  onClick={handleSubmit}
                >
                  <i>S</i>
                  <i>i</i>
                  <i>g</i>
                  <i>n</i>
                  <i>&nbsp;</i>
                  <i>I</i>
                  <i>n</i>
                </button>
              </>
            ) : (
              <>
                <button className="button-forget">
                  <div class="svg-wrapper-1-forget">
                    <div class="svg-wrapper">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                      >
                        <path fill="none" d="M0 0h24v24H0z"></path>
                        <path
                          fill="currentColor"
                          d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                  <span>Kirim</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <HeroArea />
    </div>
  );
}

export default Login;
