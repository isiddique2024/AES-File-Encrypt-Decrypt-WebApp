import React from "react";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { Buffer } from "buffer";
import { api_service } from "../services/API";
import { fileTypeFromBuffer } from "file-type";
import { FileUtility } from "../services/Utility";

const fileDataDecrypt = signal();
const fileName = signal();
const mode = signal(2);
const key = signal("");
const iv = signal("");
const outputResponse = signal();
const loading = signal(false);

const DecryptPage = () => {
  useSignals(); // makes components reactive

  const handleDecrypt = async (event) => {
    event.preventDefault();

    if (!fileDataDecrypt.value) {
      alert(`invalid file input`);
      return;
    }
    if (
      key.value.length !== 32 &&
      key.value.length !== 48 &&
      key.value.length !== 64
    ) {
      console.log(key.value.length);
      alert(`key length must be 32, 48, or 64 characters`);
      return;
    }

    if (!iv.value || iv.value.length !== 32) {
      alert(`iv length must be exactly 32 characters`);
      return;
    }

    loading.value = true;

    const hex = await FileUtility.fileToHex(fileDataDecrypt);

    const json_post_data = JSON.stringify({
      file_encrypted: hex,
      key: key.value,
      iv: iv.value,
      block_cipher_mode: mode.value,
    });

    const response = await api_service("decrypt", json_post_data);

    if (!response.success) {
      outputResponse.value = response.message;
      loading.value = false;
      return;
    }

    console.log(response.data);

    const decryptedHex = Uint8Array.from(
      Buffer.from(response.data.file_decrypted, "hex")
    );

    const fileType = await fileTypeFromBuffer(decryptedHex);
    let fileExtension = "bin";

    if (fileType) {
      fileExtension = fileType.ext;
    }

    FileUtility.downloadFileFromBuffer(
      decryptedHex,
      `decrypted_file.${fileExtension}`
    );

    outputResponse.value = "Successfully decrypted";

    loading.value = false;
  };

  return (
    <div className="flex-auto flex-col items-center justify-center">
      <div className="main-content flex-auto">
        <div className="container mx-auto p-4 bg-[#333b45] flex-auto flex-col justify-center items-center rounded-lg shadow-lg w-full">
          <h1 className="heading">File Decryption</h1>
          <form onSubmit={handleDecrypt} className="w-full">
            <div className="mb-4 flex flex-col items-center">
              <label className="label" htmlFor="fileInput">
                Select a File
              </label>
              <span className="text-gray-400 text-sm mb-2 block">
                Max File Size: 3 MB
              </span>
              <input
                type="file"
                id="fileInput"
                className="input-file"
                onInput={(event) =>
                  FileUtility.handleFileChange(event, fileName, fileDataDecrypt)
                }
              />
            </div>
            <div className="mb-4">
              <label className="label" htmlFor="mode">
                Block Cipher Mode
              </label>
              <select
                id="mode"
                className="select"
                value={mode}
                onChange={(e) => (mode.value = parseInt(e.target.value))}
              >
                <option value={2}>CBC (Cipher-Block Chaining)</option>
                <option value={3}>CFB (Cipher Feedback)</option>
                <option value={5}>OFB (Output Feedback)</option>
                <option value={9}>EAX</option>
                <option value={11}>GCM (Galois Counter Mode)</option>
              </select>
            </div>
            <div className="form-group mt-4 flex flex-col items-center">
              <label className="label" htmlFor="encryptionKey">
                Encryption Key
              </label>
              <input
                type="text"
                id="encryptionKey"
                placeholder="Type here"
                className="input w-full max-w-xs"
                required
                value={key}
                onChange={(e) => (key.value = e.target.value)}
              />
            </div>
            <div className="form-group flex flex-col items-center">
              <label className="label mt-4" htmlFor="iv">
                Initialization Vector (IV)
              </label>
              <input
                type="text"
                id="iv"
                placeholder="Type here"
                className="input w-full max-w-xs"
                required
                value={iv}
                onChange={(e) => (iv.value = e.target.value)}
              />
            </div>
            <div className="mt-4 flex items-center justify-center space-x-3">
              <button type="submit" className="button flex-shrink">
                Decrypt
              </button>
              {loading.value && (
                <span className="loading loading-spinner loading-lg"></span>
              )}
            </div>
          </form>
          <h2 className="text-2xl text-gray-300 mt-5 font-bold text-center">
            Output:
          </h2>
          {outputResponse.value && (
            <div className="output-container flex-shrink">
              <pre className="output-text">
                Response: {outputResponse.value}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DecryptPage;
