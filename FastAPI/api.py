import models

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware


from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.util import get_ipaddr


from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from Crypto.Random import get_random_bytes

from hashlib import sha3_256


import utils
server = FastAPI()

origins = ["*"]
server.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# rate limiting
#limiter = Limiter(key_func=get_ipaddr)
#server.state.limiter = limiter
#server.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


@server.get("/")
async def root():
    return {"test" : "hi"}

@server.post("/api/encrypt/")
#@limiter.limit("1/10second")
async def encrypt_file(request: Request, param: models.encrypt_base):
    if len(param.file_hex) == 0:
        raise HTTPException(status_code=400, detail="Invalid file length")
    
    if utils.check_file_greater_than_3mb(param.file_hex):
        raise HTTPException(status_code=400, detail="File length greater than 3mb")

    if param.key_size not in AES.key_size:
        raise HTTPException(status_code=400, detail="Invalid key length")

    try:
        key = get_random_bytes(param.key_size)
        if param.key_size == 32:
            key = sha3_256(get_random_bytes(param.key_size)).digest()
        
        block_size = AES.block_size
        iv = get_random_bytes(block_size)

        data_to_encrypt = param.file_hex

        encrypt_obj = AES.new(key, param.blocker_cipher_mode, iv) # AES.MODE_CBC (2)
        file_encrypted = iv + encrypt_obj.encrypt(pad(data_to_encrypt.encode('utf-8'), block_size))
        
        file_b64_return = file_encrypted.hex()
        key_hex = key.hex()
        iv_hex = iv.hex()
    except ValueError as e:
        raise HTTPException(status_code=500, detail="Encryption failed") from e

    return {
        "file_encrypted": file_b64_return,
        "key": key_hex,
        "iv": iv_hex
    }


@server.post("/api/decrypt/")
#@limiter.limit("1/second")
async def decrypt_file(request: Request, param: models.decrypt_base):
    if len(param.file_encrypted) == 0:
        raise HTTPException(status_code=404, detail="Invalid file input")
    
    if utils.check_file_greater_than_3mb(param.file_encrypted):
        raise HTTPException(status_code=400, detail="File size must not be greater than 3mb")
    
    if len(param.key) not in utils.valid_key_lengths:
        raise HTTPException(status_code=400, detail="Key length must be 32, 48, or 64 characters")
        
    if len(param.iv) != 32:
        raise HTTPException(status_code=400, detail="IV length must be exactly 32 characters")

    try:
        file = bytes.fromhex(param.file_encrypted)
        key = bytes.fromhex(param.key)
        iv = bytes.fromhex(param.iv)
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid file input") from e

    try:
        data_to_decrypt = file[AES.block_size:]
        decrypt_obj = AES.new(key, param.blocker_cipher_mode, iv)
        decrypted_data = unpad(decrypt_obj.decrypt(data_to_decrypt), AES.block_size)
        file_b64_return = decrypted_data.decode('utf-8')
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Decryption failed") from e

    return {
        "file_decrypted": file_b64_return
    }