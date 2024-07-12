import React from "react";
import { signal, effect } from "@preact/signals-react";
import { Buffer } from "buffer";
import { api_service } from "../services/API";
import { fileTypeFromBuffer } from "file-type";

const fileDataDecrypt = signal();
const fileName = signal();
const mode = signal(2);
const key = signal("");
const iv = signal("");
const outputResponse = signal();
const loading = signal(false);

const DecryptPage = () => {
  const [, updateState] = React.useState();
  const force_update = React.useCallback(() => updateState({}), []);

  const handleFileChangeDecrypt = (event) => {
    event.preventDefault();
    if (event.target.files[0] === undefined) {
      // if you select a file then click cancel in the file directory it will error, this is to prevent that
      fileName.value = undefined;
      fileDataDecrypt.value = undefined;
      return;
    }
    console.log(`selected file to decrypt: ${event.target.files[0].name}`);
    fileName.value = event.target.files[0].name;
    fileDataDecrypt.value = event.target.files[0];
  };

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

    effect(() => {
      loading.value = true;
      force_update();
    });

    const byte_array = new Uint8Array(
      await fileDataDecrypt.value.arrayBuffer()
    );
    if (byte_array) {
      const hex = Array.from(byte_array)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

      const json_post_data = JSON.stringify({
        file_encrypted: hex,
        key: key,
        iv: iv,
        block_cipher_mode: mode,
      });

      var response = 0;
      try {
        response = await api_service.decrypt(json_post_data);
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Error status:", error.response.status);
          console.error("Error detail:", error.response.data.detail);
          outputResponse.value = "Error, " + error.response.data.detail;
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received:", error.request);
          outputResponse.value = "Error, " + error.request;
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error", error.message);
          outputResponse.value = "Error, " + error.message;
        }
        effect(() => {
          loading.value = false;
          force_update();
        });
        return;
      }

      console.log(response.data);

      const decrypted_hex = Uint8Array.from(
        Buffer.from(response.data.file_decrypted, "hex")
      );

      const file_type = await fileTypeFromBuffer(decrypted_hex);
      let file_ext = "bin";

      if (file_type) {
        file_ext = file_type.ext;
      }

      const decrypted_file = new Blob([decrypted_hex], {
        type: "application/octet-stream",
      });
      const url = URL.createObjectURL(decrypted_file);

      const link = document.createElement("a");
      link.href = url;
      link.download = `decrypted_file.${file_ext}`;
      document.body.appendChild(link);
      link.click();

      URL.revokeObjectURL(url);
      document.body.removeChild(link);

      outputResponse.value = "Successfully decrypted";
    }

    effect(() => {
      loading.value = false;
      force_update();
    });
  };

  return (
    <div className="flex-grow min-w-96">
      <div className="container p-20 flex flex-col items-center">
        <h1 className="heading">File Decryption</h1>
        <form onSubmit={handleDecrypt}>
          <div className="mb-4 flex flex-col w-72">
            <label className="label" htmlFor="fileInput">
              Select a File
            </label>
            <span className="label-text-alt text-right">
              Max File Size: 3 MB
            </span>
            <input
              type="file"
              id="fileInput"
              className="input-file bg-[#2A323C] "
              onInput={handleFileChangeDecrypt}
            />
            <div className="mt-4">
              <label className="label" htmlFor="mode">
                Block Cipher Mode
              </label>
              <div>
                <select
                  id="mode"
                  className="select"
                  value={mode}
                  onChange={(e) => (mode.value = parseInt(e.target.value))}
                >
                  {/* <option value={1}>ECB (Electronic Code Book)</option> */}
                  <option value={2}>CBC (Cipher-Block Chaining)</option>
                  <option value={3}>CFB (Cipher Feedback)</option>
                  <option value={5}>OFB (Output Feedback)</option>
                  {/* <option value={6}>CTR (Counter)</option> */}
                  {/* <option value={7}>OPENPGP (OpenPGP)</option> */}
                  {/* <option value={8}>CCM (Counter with CBC-MAC)</option> */}
                  <option value={9}>EAX</option>
                  {/* <option value={10}>SIV (Synthetic Initialization Vector)</option> */}
                  <option value={11}>GCM (Galois Counter Mode)</option>
                  {/* <option value={12}>OCB (Offset Code Book)</option> */}
                </select>
              </div>
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
          </div>
          <div className="mb-4 flex items-center flex-row justify-center">
            <button type="submit" className="button">
              Decrypt
            </button>
            {loading.value && (
              <span className="loading loading-spinner loading-lg ml-3"></span>
            )}
          </div>
        </form>
        <h2 className="text-2xl text-gray-300 mt-5 font-bold">Output:</h2>
        {
          <div className="skeleton">
            <pre className="output-text">Response: {outputResponse}</pre>
          </div>
        }
      </div>
    </div>
  );
};

export default DecryptPage;
