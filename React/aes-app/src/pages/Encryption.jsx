import React from "react";
import { signal } from "@preact/signals-react";
import { useSignals } from "@preact/signals-react/runtime";
import { Buffer } from "buffer";
import { api_service } from "../services/API";
import { FileUtility } from "../services/Utility";
import OutputComponent from "../components/Output"
const fileDataEncrypt = signal();
const fileName = signal();
const mode = signal(2);
const keySize = signal(16);
const outputKey = signal();
const outputIV = signal();
const outputResponse = signal();
const loading = signal(false);

const EncryptPage = () => {
  useSignals(); // makes components reactive

  const handleEncrypt = async (event) => {
    event.preventDefault();

    if (!fileDataEncrypt.value) {
      alert(`Invalid file input`);
      return;
    }

    loading.value = true;

    const hex = await FileUtility.fileToHex(fileDataEncrypt);

    const json_post_data = JSON.stringify({
      file_hex: hex,
      key_size: keySize.value,
      block_cipher_mode: mode.value,
    });

    const response = await api_service("encrypt", json_post_data);

    if (!response.success) {
      outputResponse.value = response.message;
      loading.value = false;
      return;
    }

    const encryptedHex = Uint8Array.from(
      Buffer.from(response.data.file_encrypted, "hex")
    );

    FileUtility.downloadFileFromBuffer(encryptedHex, "encrypted_file.bin");

    outputResponse.value = "Successfully encrypted";
    outputKey.value = response.data.key;
    outputIV.value = response.data.iv;

    loading.value = false;
  };

  return (
    <div className="max-w-lg flex-auto flex-col items-center justify-center">
      <div className="main-content flex-auto">
        <div className="container mx-auto p-4 bg-[#333b45] flex-auto flex-col justify-center items-center rounded-lg shadow-lg w-full">
          <h1 className="heading">File Encryption</h1>
          <form onSubmit={handleEncrypt} className="w-full">
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
                  FileUtility.handleFileChange(event, fileName, fileDataEncrypt)
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
            <div className="mb-4">
              <label className="label" htmlFor="keySize">
                Key Size
              </label>
              <select
                id="keySize"
                className="select"
                value={keySize}
                onChange={(e) => (keySize.value = parseInt(e.target.value))}
              >
                <option value={16}>16 Bytes</option>
                <option value={24}>24 Bytes</option>
                <option value={32}>32 Bytes</option>
              </select>
            </div>
            <div className="mb-4 flex items-center justify-center space-x-3">
              <button type="submit" className="button flex-shrink">
                Encrypt
              </button>
              {loading.value && (
                <span className="loading loading-spinner loading-lg"></span>
              )}
            </div>
          </form>
        </div>
      </div>
      <OutputComponent
        outputResponse={outputResponse}
        Key={outputKey}
        IV={outputIV}
      />
    </div>
  );
};

export default EncryptPage;
