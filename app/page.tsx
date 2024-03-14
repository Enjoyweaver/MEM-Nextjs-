"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

function Home() {
  const [count, setCount] = useState<number>(0);
  const [name, setName] = useState("");
  const [caller, setCaller] = useState("");
  const [signature, setSignature] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const readState = async () => {
    await fetch("/api")
      .then((res) => res.json())
      .then((obj) => setCount(obj.data.count));
  };

  useEffect(() => {
    readState();
  }, [count]);

  const handleState = async (fn: string) => {
    const response = await fetch("/api", {
      method: "POST",
      body: JSON.stringify({
        function: fn,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setCount(data.count);
    }
  };

  const handleRegister = async () => {
    if (!name || !caller || !signature) {
      setErrorMessage("All fields are required");
      return;
    }

    const response = await fetch("/api", {
      method: "POST",
      body: JSON.stringify({
        function: "register",
        input: { name, caller, signature },
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setErrorMessage("");
      // Handle success
    } else {
      setErrorMessage("Failed to register. Please try again.");
    }
  };

  return (
    <div className="main">
      <span>
        <img src="./mem-logo-v2.svg" alt="mem" width="50" height="50" />
        <h1 className="text-2xl">MEM</h1>
      </span>
      <div className="flex flex-col items-center text-black gap-2">
        Count: {count}
        <button
          type="button"
          className="btn btn-blue outline rounded-sm px-2"
          onClick={() => handleState("increment")}
        >
          Increment
        </button>
        <button
          type="button"
          className="btn btn-blue outline rounded-sm px-2"
          onClick={() => handleState("decrement")}
        >
          Decrement
        </button>
      </div>
      <br />
      <br />
      <div className="flex flex-col items-center text-black gap-2">
        <div>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Caller"
            value={caller}
            onChange={(e) => setCaller(e.target.value)}
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Signature"
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="btn btn-blue outline rounded-sm px-2"
          onClick={handleRegister}
        >
          Register
        </button>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </div>
    </div>
  );
}

export default dynamic(() => Promise.resolve(Home), {
  ssr: false,
});
