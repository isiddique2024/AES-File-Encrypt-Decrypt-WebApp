from pydantic import BaseModel

class encrypt_base(BaseModel):
    file_hex: str
    key_size: int
    blocker_cipher_mode: int


class decrypt_base(BaseModel):
    file_encrypted: str
    key: str
    iv: str
    blocker_cipher_mode: int
