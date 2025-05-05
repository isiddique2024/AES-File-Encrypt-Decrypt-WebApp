# AES File Encryption/Decryption Web Application

## A secure, browser-based file encryption and decryption service

**Live Demo**: [https://www.ryuauth.com/](https://www.ryuauth.com/)

## Overview

This project is a modern web application that provides AES (Advanced Encryption Standard) encryption and decryption services directly in your browser. Built with security and ease-of-use in mind, it allows you to protect sensitive files and text with military-grade encryption without requiring any downloads or installations.

## Key Features

- **AES Encryption**: Industry standard encryption algorithm with support for 128, 192, and 256-bit key sizes
- **Multiple Block Cipher Modes**: Support for various AES modes including CBC (Cipher Block Chaining)
- **Completely Stateless**: No user data, files, or encryption keys are ever stored on our servers
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Secure Key Management**: Generated encryption keys never leave your browser

## How It Works

1. **Encrypt Files**: Upload a file or enter text to be encrypted
2. **Choose Security Level**: Select your key size (128, 192, or 256-bit)
3. **Generate Keys**: Our system generates secure cryptographic keys
4. **Download Encrypted File**: Receive your encrypted data
5. **Secure Storage**: Save your encryption key in a safe place
6. **Decrypt When Needed**: Use the same key to decrypt your files later

## Local Development

If you want to run this web application locally or contribute to the project:

1. Clone the repository
2. Install Docker and Docker Compose
3. Run `docker-compose up` with the desired profile (http, dev, or production)
4. Access the application at http://localhost:80 (or https://localhost:443 for SSL)

## Docker Services

- **FastAPI Backend**: Python-based API for encryption/decryption logic
- **React Frontend**: User interface built with React and Tailwind CSS
- **NGINX**: Web server for serving the frontend and proxying API requests

## License

This project is open source and available under the MIT License.
