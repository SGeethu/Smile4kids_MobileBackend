# Smil4kids_MobileBackend

A Node.js backend for Smile4Kids mobile app, supporting user authentication, video/image upload (Cloudinary-ready), and password management.

---

## Installation

1. **Clone the repository:**
   ```
   git clone <repository-url>
   ```
2. **Navigate to the project directory:**
   ```
   cd Smil4kids_MobileBackend
   ```
3. **Install dependencies:**
   ```
   npm install
   ```

4. **Set up environment variables:**  
   Create a `.env` file in the root directory with your database and email credentials. Example:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=mobile_backend
   DB_PORT=3306

   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_email_password

   JWT_SECRET=your_jwt_secret
   ```

5. **(Optional) Configure Cloudinary:**  
   If using Cloudinary for uploads, create `cloudinaryConfig.js` and add your credentials.

---

## Database Setup

To initialize the database and tables, run:
```
node setup.js
```

---

## Usage

To start the application, run:
```
node app.js
```
The application will be running on [http://localhost:3000](http://localhost:3000).

---

## API Endpoints

### **Authentication**
- **POST /signup**: Register a new user
- **POST /login**: Login with email and password

### **Forgot Password**
- **POST /forgot/send-otp**: Send OTP to email
- **POST /forgot/verify-otp**: Verify OTP
- **POST /forgot/reset-password**: Reset password
- **POST /forgot/change-password**: Change password (authenticated)

### **User Profile**
- **POST /signup/update-profile**: Update user profile
- **GET /signup/profile?email_id=...**: Get user profile

### **Videos**
- **POST /videos/upload**: Upload a video and thumbnail (supports Cloudinary)
- **GET /videos/list**: Get all videos
- **GET /videos/by-category?language=...&level=...**: Get videos by language and level
- **GET /videos/list/:language/:level**: Get videos by language/level (e.g., `/videos/list/gujarati/junior`)

### **Images**
- **POST /api/images/upload**: Upload an image
- **GET /api/images**: Get all images

---

## Testing APIs

You can use [Insomnia](https://insomnia.rest/) or [Postman](https://www.postman.com/) to test the API endpoints.  
A ready-to-import Insomnia collection is provided as `insomnia_collection.json`.

---

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

---

## License

This project is licensed under the MIT License.
