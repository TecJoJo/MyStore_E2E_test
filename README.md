# MyStore E2E Test Setup

This project contains end-to-end (E2E) tests for my own MyStore application (under construction). Follow the steps below to set up and run the applications and execute the Cypress tests.

---

## Backend Setup

1. **Clone the Backend Repository:**
   ```sh
   git clone https://github.com/TecJoJo/MyStore_backend.git
   cd MyStore_backend
   ```
2. **Checkout the Required Branch:**
   ```sh
   git checkout temp/ProductsEndpointsProtectedForE2EDemo_220625
   ```
3. **Ensure .NET SDK and Runtime:**
   - Install [.NET 8 SDK and Runtime](https://dotnet.microsoft.com/en-us/download/dotnet/8.0) if not already installed.
4. **Build and Run the Backend:**
   ```sh
   dotnet build
   dotnet run
   ```
   The backend should now be running locally (default: `https://localhost:5001` or as configured).

---

## Frontend Setup

1. **Clone the Frontend Repository:**
   ```sh
   git clone https://github.com/TecJoJo/MyStore.git
   cd MyStore
   ```
2. **Checkout the Required Branch:**
   ```sh
   git checkout temp/ProductsfetchEndpointBecomeProtected_E2E_Demo_220625
   ```
3. **Ensure Node.js 20+ is Installed:**
   - Download from [nodejs.org](https://nodejs.org/)
4. **Install Dependencies:**
   ```sh
   npm install
   ```
5. **Start the Frontend:**
   ```sh
   npm start
   ```
   The frontend should now be running locally (default: `http://localhost:3000` or as configured).

---

## Cypress E2E Tests

1. **Ensure Node.js 20+ is Installed**
2. **Install Dependencies:**
   ```sh
   npm install
   ```
3. **Open Cypress Test Runner:**
   ```sh
   npm run open
   ```
   - This will launch the Cypress UI where you can run the E2E tests interactively.

---

## Notes

- Make sure both the backend and frontend servers are running before executing the Cypress tests.
- Adjust URLs or ports in the Cypress config if your local setup differs.

---

For any issues, please refer to the documentation in each repository or raise an issue.
