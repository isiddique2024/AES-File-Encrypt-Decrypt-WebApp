from pydantic import BaseModel

class encrypt_base(BaseModel):
    file_hex: str
    key_size: int

class decrypt_base(BaseModel):
    file_encrypted: str
    key: str
    iv: str
