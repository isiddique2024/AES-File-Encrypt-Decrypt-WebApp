import React from 'react';
import { signal, effect } from "@preact/signals-react";
import { Buffer } from 'buffer';
import {api_service} from "../services/API";
const fileDataEncrypt = signal();
const fileName = signal();
const mode = signal(2);
const keySize = signal(16);
const outputKey = signal();
const outputIV = signal();
const outputResponse = signal();
const loading = signal(false);

const EncryptPage = () => {

    const [, updateState] = React.useState();
    const force_update = React.useCallback(() => updateState({}), []);

    const handleFileChangeEncrypt = (event) => {
      event.preventDefault();
      if(event.target.files[0] === undefined){ // if you select a file then click cancel in the file directory it will error, this is to prevent that
        fileName.value = undefined;
        fileDataEncrypt.value = undefined;
        force_update();
        return;
      }
      console.log(`selected file to encrypt: ${event.target.files[0].name}`);
      fileName.value = event.target.files[0].name;
      fileDataEncrypt.value = event.target.files[0];
    };
    
    const handleEncrypt = async (event) => {
      event.preventDefault();

      if (!fileDataEncrypt.value) {
        alert(`invalid file input`);
        return;
      }

      effect(() =>{
        loading.value = true;
        force_update();
      })

      const file_bytes = new Uint8Array(await fileDataEncrypt.value.arrayBuffer());
      if(!file_bytes){
        alert(`invalid file input 2`);
        effect(() =>{
          loading.value = false;
          force_update();
        })
        return;
      }
      
      const hex = Array.from(file_bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
      // console.log(`byte array:\n ${file_bytes} \n\nhex:\n ${hex}`);
  
      const json_post_data = JSON.stringify({ 
        file_hex: hex, 
        key_size: keySize,
        block_cipher_mode: mode
      });

      var response = 0;
      try{
        response = await api_service.encrypt(json_post_data);
      } 
      catch (error) {
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error('Error status:', error.response.status);
            console.error('Error detail:', error.response.data.detail);
            outputResponse.value = "Error, " + error.response.data.detail;

        } else if (error.request) {
            // The request was made but no response was received
            console.error('No response received:', error.request);
            outputResponse.value = "Error, " + error.request;
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error('Error', error.message);
            outputResponse.value = "Error, " + error.message;
        }

        effect(() =>{
          loading.value = false;
          force_update();
        })

        return;
      }

      //console.log(response.data);

      const encrypted_file = Uint8Array.from(Buffer.from(response.data.file_encrypted, 'hex'));
      if(encrypted_file){
        const download = new Blob([encrypted_file], { type: "application/octet-stream;charset=utf-8" });
        const url = URL.createObjectURL(download);
        window.open(url);

        outputResponse.value = "Successfully encrypted"
        outputKey.value = response.data.key;
        outputIV.value = response.data.iv;

      }

      effect(() =>{
        loading.value = false;
        force_update();
      })

    };

    return (
        <div className="flex-grow min-w-96">
        <div className="container mx-auto p-20 bg-[#333b45] flex flex-col items-center">
        <h1 className="heading">File Encryption</h1>
        <form onSubmit={handleEncrypt}>
          <div className="mb-4 flex flex-col w-72">
            <label className="label" htmlFor="fileInput">
                Select a File
            </label>
            <span className="label-text-alt text-right">Max File Size: 3 MB</span>
            <input
                type="file"
                id="fileInput"
                className="input-file bg-[#2A323C] "
                onInput={handleFileChangeEncrypt}
            />
            </div>
            <div className="mb-4">
            <label className="label" htmlFor="mode">
                Block Cipher Mode
            </label>
              <div>
                <select
                    id="mode"
                    className="select"
                    value={mode}
                    onChange={(e) => mode.value = parseInt(e.target.value)}
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
            <div className="mb-4">
            <label className="label" htmlFor="keySize">
                Key Size
            </label>
              <div>
                <select
                    id="keySize"
                    className="select"
                    value={keySize}
                    onChange={(e) => keySize.value = parseInt(e.target.value)}
                >
                    <option value={16}>16 Bytes</option>
                    <option value={24}>24 Bytes</option>
                    <option value={32}>32 Bytes</option>
                </select>
              </div>
            </div>
            <div className="mb-4 flex items-center flex-row justify-center tooltip tooltip-right" data-tip="hello">
              <button type="submit" className="button">Encrypt</button>
              {loading.value && <span className="loading loading-spinner loading-lg ml-3"></span>}
            </div>
        </form>
        <h2 className="text-2xl text-gray-300 mt-5 font-bold ">Output:</h2>
        {outputKey && (
            <div className="skeleton"> 
              <pre className="output-text">Response: {outputResponse}</pre>
              <pre className="output-text">Key: {outputKey}</pre>
              <pre className="output-text">IV: {outputIV}</pre>
            </div>
        )}
        </div>
    </div>
    );
};

export default EncryptPage;