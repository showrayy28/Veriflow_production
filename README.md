# Veriflow

**Veriflow** is a Blockchain-based Blue Carbon MRV system with a React Native frontend and Node.js backend. It ensures transparent, tamper-proof measurement, reporting, and verification of carbon credits.

---

## 🗂️ Project Structure

Veriflow
├── backend/ # Node.js backend (API, database)
├── veriflow_app/ # React Native frontend app
├── .gitignore
├── README.md
└── package-lock.json



## ⚙️ Tech Stack

| Layer      | Technology / Tools                         |
|------------|-------------------------------------------|
| Backend    | Node.js, Express.js, MongoDB, JWT         |
| Frontend   | React Native (Expo), React Navigation, Axios/Fetch, AsyncStorage |
| Blockchain | Ethereum / Hyperledger (for secure logging) |
| Dev Tools  | Git & GitHub, VS Code, `.env` for config |

---

## 🚀 Features

- **Blockchain Logging:** Secure, tamper-proof logging of plantation & MRV data  
- **User Authentication:** JWT-based login system  
- **Plantation Management:** Add, update, and monitor plantations  
- **Carbon MRV System:** Track carbon credits with blockchain verification  
- **Mobile App:** Cross-platform React Native app with Expo  

---

## 💻 Installation

### 1️⃣ Backend

```bash
cd backend
npm install
Create a .env file:

env
Copy code
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_jwt_secret
Start the backend server:

bash
Copy code
npm start
Server will run on http://localhost:5000.

2️⃣ Frontend (React Native App)
bash
Copy code
cd veriflow_app
npm install
npm start
Scan the QR code using Expo Go on your mobile device, or run it on an emulator.


🤝 Contributing
Fork the repository

Create your feature branch: git checkout -b feature-name

Commit your changes: git commit -m "Add some feature"

Push to the branch: git push origin feature-name

Open a Pull Request

📄 License
This project is licensed under the MIT License. See the LICENSE file for details.

📌 Notes
Ensure node_modules and .env are not pushed to GitHub

Use .gitignore to avoid committing unnecessary files (e.g., node_modules/, build/, .expo/)

Make sure MongoDB is running and .env variables are set correctly before starting the server
