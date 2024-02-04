import React from "react";
import { useTypewriter } from "react-simple-typewriter";
function Intro() {
  const [typeEffect] = useTypewriter({
    words: ["With Family", "With Friends", "With Closed One", "With All.."],
    loop: {},
    typeSpeed: 100,
    delaySpeed: 40,
  });
  return (
    <div className="lg:mt-14 lg:ml-8 mb-20 text-center">
      <h1 className="text-white font-semibold">Let's Connect</h1>
      <h2 className="text-orange-600 font-serif ml-20 ">{typeEffect}</h2>
    </div>
  );
}

export default Intro;
