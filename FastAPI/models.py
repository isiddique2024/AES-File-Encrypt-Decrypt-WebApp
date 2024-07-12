from pydantic import BaseModel, Field
from typing import Literal

class encrypt_base(BaseModel):
    file_hex: str = Field(..., description="Hex of the file to encrypt")
    key_size: Literal[16, 24, 32] = Field(..., description="Key size in bytes")
    block_cipher_mode: int = Field(..., description="Block cipher mode (example: AES.MODE_CBC)")

class decrypt_base(BaseModel):
    file_encrypted: str = Field(..., description="Hex of the encrypted file")
    key: str = Field(..., description="Hex of the encryption key")
    iv: str = Field(..., description="Hex of the initialization vector")
    block_cipher_mode: int = Field(..., description="Block cipher mode (example: AES.MODE_CBC)")
