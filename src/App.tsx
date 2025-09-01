import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [output, setOutput] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const handleSplit = async () => {
    if (!file) return alert("Select a file first");

    try {
      // Read the file as ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const byteArray = new Uint8Array(arrayBuffer);

      // Invoke Rust command and send bytes
      const result = await invoke<string>("split_music_bytes", {
        fileName: file.name,
        fileBytes: Array.from(byteArray), // convert Uint8Array to number[]
      });

      setOutput(result);
    } catch (e) {
      console.error(e);
      alert("Failed to split audio: " + e);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Music & Voice Splitter</h1>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      <button onClick={handleSplit} style={{ marginLeft: 10 }}>
        Split
      </button>
      {output && <p>Output Folder: {output}</p>}
    </div>
  );
}

export default App;
