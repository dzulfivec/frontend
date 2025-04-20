import React from "react";
import "../styles/load.css"; // pastikan file css-nya dipisah atau inline jika pakai tailwind

const Loader = () => {
  return (
    <section className="loader">
      {[0, 1, 2, 3, 4].map((i) => (
        <div key={i} className="slider" style={{ "--i": i }} />
      ))}
    </section>
  );
};

export default Loader;
