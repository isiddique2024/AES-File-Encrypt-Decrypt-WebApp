from fastapi import FastAPI, HTTPException

valid_key_lengths = {32, 48, 64}

def check_file_greater_than_3mb(hex_string: str) -> bool:
    try:
        byte_data = bytes.fromhex(hex_string)
        return len(byte_data) >= 3 * 1024 * 1024
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid file input")