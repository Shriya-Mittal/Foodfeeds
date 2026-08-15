# ZomaFeeds

ZomaFeeds is a full-stack food discovery and short-video app where users can view food videos, like them, save them, and food partners can register, log in, and upload food content.

This project contains:
- a Node.js + Express backend
- a MongoDB database
- a React + Vite frontend
- JWT-based authentication with cookies
- video uploads via ImageKit
- a reels-style social feed UI

---

## 1. Project Overview

The app is designed around a simple flow:

1. User or food partner registers/logs in.
2. Food partners upload food videos with a name and description.
3. Users browse the home feed and interact with food posts.
4. Users can like and save food items.
5. Each food partner has a profile page showing their uploaded food items.

---

## 2. Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT for authentication
- Cookie-based auth
- Multer for file upload handling
- ImageKit for media storage
- CORS for cross-origin request handling

### Frontend
- React
- Vite
- React Router DOM
- Axios for API calls

---

## 3. Project Structure

```text
ZomaFeeds/
├── backend/
│   ├── package.json
│   ├── server.js
│   └── src/
│       ├── app.js
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── food.controller.js
│       │   └── food-partner.controller.js
│       ├── db/
│       │   └── db.js
│       ├── middlewares/
│       │   └── auth.middleware.js
│       ├── models/
│       │   ├── food.model.js
│       │   ├── foodpartner.model.js
│       │   ├── likes.model.js
│       │   ├── save.model.js
│       │   └── user.model.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── food.routes.js
│       │   └── food-partner.routes.js
│       └── services/
│           └── storage.service.js
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── eslint.config.js
│   ├── public/
│   └── src/
│       ├── App.jsx
│       ├── App.css
│       ├── main.jsx
│       ├── assets/
│       ├── components/
│       │   ├── BottomNav.jsx
│       │   └── ReelFeed.jsx
│       ├── pages/
│       │   ├── auth/
│       │   │   ├── ChooseRegister.jsx
│       │   │   ├── FoodPartnerLogin.jsx
│       │   │   ├── FoodPartnerRegister.jsx
│       │   │   ├── UserLogin.jsx
│       │   │   └── UserRegister.jsx
│       │   ├── food-partner/
│       │   │   ├── CreateFood.jsx
│       │   │   └── Profile.jsx
│       │   └── general/
│       │       ├── Home.jsx
│       │       └── Saved.jsx
│       ├── routes/
│       │   └── AppRoutes.jsx
│       └── styles/
│           ├── auth-shared.css
│           ├── bottom-nav.css
│           ├── create-food.css
│           ├── profile.css
│           ├── reels.css
│           └── theme.css
├── testcase/
├── vdeos/
└── README.md
```

---

## 4. File-by-File Explanation

### Backend

#### [backend/server.js](backend/server.js)
Starts the application.
- Loads environment variables using dotenv.
- Imports the Express app from [backend/src/app.js](backend/src/app.js).
- Connects MongoDB through [backend/src/db/db.js](backend/src/db/db.js).
- Starts the API server on port 3000.

#### [backend/src/app.js](backend/src/app.js)
Main Express server config.
- Enables CORS for the frontend at http://localhost:5173.
- Uses cookie-parser to read JWT cookies.
- Parses JSON requests.
- Mounts the API routes:
  - /api/auth
  - /api/food
  - /api/food-partner

#### [backend/src/db/db.js](backend/src/db/db.js)
Responsible for MongoDB connection.
- Reads MONGODB_URL from the environment.
- Connects to the database with Mongoose.

#### [backend/src/routes/auth.routes.js](backend/src/routes/auth.routes.js)
Handles all authentication routes.

Routes:
- POST /api/auth/user/register
- POST /api/auth/user/login
- GET /api/auth/user/logout
- POST /api/auth/food-partner/register
- POST /api/auth/food-partner/login
- GET /api/auth/food-partner/logout

These route handlers are connected to the auth controller.

#### [backend/src/routes/food.routes.js](backend/src/routes/food.routes.js)
Handles food-related operations.

Routes:
- POST /api/food/ - creates food item (food partner only)
- GET /api/food/ - fetches all food items (logged-in user)
- POST /api/food/like - toggle like for a food item
- POST /api/food/save - toggle save for a food item
- GET /api/food/save - fetch saved food items for current user

This route also uses multer to upload a video file.

#### [backend/src/routes/food-partner.routes.js](backend/src/routes/food-partner.routes.js)
Routes related to food partner profiles.

Route:
- GET /api/food-partner/:id - fetch a food partner profile and their food items

#### [backend/src/controllers/auth.controller.js](backend/src/controllers/auth.controller.js)
Contains authentication logic.
- registerUser()
- loginUser()
- logoutUser()
- registerFoodPartner()
- loginFoodPartner()
- logoutFoodPartner()

This file:
- checks whether the user/partner already exists
- hashes passwords using bcrypt
- creates JWT token
- sets cookie token on successful login/register
- sends the user/food partner data back to the client

#### [backend/src/controllers/food.controller.js](backend/src/controllers/food.controller.js)
Handles all food feed operations.
- createFood(): uploads a video and saves a new food item
- getFoodItems(): fetches all food items
- likeFood(): toggles like status for a user
- saveFood(): toggles save status for a user
- getSaveFood(): gets all saved items for the current user

It also updates likeCount and savesCount in the food collection.

#### [backend/src/controllers/food-partner.controller.js](backend/src/controllers/food-partner.controller.js)
Gets a specific food partner and the list of food items uploaded by that food partner.

#### [backend/src/middlewares/auth.middleware.js](backend/src/middlewares/auth.middleware.js)
This file verifies the JWT in the token cookie.
- authFoodPartnerMiddleware(): validates food partner auth
- authUserMiddleware(): validates regular user auth

If the token is invalid or missing, it responds with 401.

#### [backend/src/models/user.model.js](backend/src/models/user.model.js)
Defines the user schema.
Fields:
- fullName
- email
- password
- timestamps

#### [backend/src/models/foodpartner.model.js](backend/src/models/foodpartner.model.js)
Defines the food partner schema.
Fields:
- name
- contactName
- phone
- address
- email
- password

#### [backend/src/models/food.model.js](backend/src/models/food.model.js)
Defines the food item schema.
Fields:
- name
- video
- description
- foodPartner
- likeCount
- savesCount

#### [backend/src/models/save.model.js](backend/src/models/save.model.js)
Tracks saved foods per user.
- user
- food
- timestamps

#### [backend/src/models/likes.model.js](backend/src/models/likes.model.js)
Tracks likes for each food item per user.
- user
- food
- timestamps

#### [backend/src/services/storage.service.js](backend/src/services/storage.service.js)
Handles file upload using ImageKit.
- uploadFile(file, fileName)
- sends the uploaded file to ImageKit and returns the uploaded URL

---

### Frontend

#### [frontend/src/App.jsx](frontend/src/App.jsx)
Main app root.
- Loads global CSS.
- Renders the router via [frontend/src/routes/AppRoutes.jsx](frontend/src/routes/AppRoutes.jsx).

#### [frontend/src/routes/AppRoutes.jsx](frontend/src/routes/AppRoutes.jsx)
Defines all application routes.

Routes:
- /
- /register
- /user/register
- /user/login
- /food-partner/register
- /food-partner/login
- /home
- /profile
- /saved
- /create-food
- /food-partner/:id

#### [frontend/src/components/ReelFeed.jsx](frontend/src/components/ReelFeed.jsx)
Reusable reels-style video feed component.
- plays visible videos automatically using IntersectionObserver
- supports like and save buttons
- renders each item with title/description and a store link

#### [frontend/src/components/BottomNav.jsx](frontend/src/components/BottomNav.jsx)
Bottom navigation bar for the mobile-style app.
- Home
- Saved

#### [frontend/src/pages/auth/ChooseRegister.jsx](frontend/src/pages/auth/ChooseRegister.jsx)
Landing/auth selection page.
- lets the user choose between user signup and food partner signup

#### [frontend/src/pages/auth/UserRegister.jsx](frontend/src/pages/auth/UserRegister.jsx)
User registration form.

#### [frontend/src/pages/auth/UserLogin.jsx](frontend/src/pages/auth/UserLogin.jsx)
User login form.

#### [frontend/src/pages/auth/FoodPartnerRegister.jsx](frontend/src/pages/auth/FoodPartnerRegister.jsx)
Food partner registration form.

#### [frontend/src/pages/auth/FoodPartnerLogin.jsx](frontend/src/pages/auth/FoodPartnerLogin.jsx)
Food partner login form.

#### [frontend/src/pages/general/Home.jsx](frontend/src/pages/general/Home.jsx)
Shows the reels feed on the home screen.
- calls GET /api/food
- loads all food items
- sends like and save requests to the backend

#### [frontend/src/pages/general/Saved.jsx](frontend/src/pages/general/Saved.jsx)
Shows the saved items page.
- calls GET /api/food/save
- renders saved food videos in a reels feed

#### [frontend/src/pages/food-partner/CreateFood.jsx](frontend/src/pages/food-partner/CreateFood.jsx)
Food partner upload page.
- selects a video file
- uploads the video to the backend
- sends name + description + video to POST /api/food

#### [frontend/src/pages/food-partner/Profile.jsx](frontend/src/pages/food-partner/Profile.jsx)
Displays a food partner profile and their uploaded food items.
- calls GET /api/food-partner/:id
- shows store name/address and food videos

---

## 5. API Routes Summary

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/auth/user/register | Register a normal user |
| POST | /api/auth/user/login | Login a normal user |
| GET | /api/auth/user/logout | Logout a normal user |
| POST | /api/auth/food-partner/register | Register a food partner |
| POST | /api/auth/food-partner/login | Login a food partner |
| GET | /api/auth/food-partner/logout | Logout a food partner |

### Food

| Method | Endpoint | Description |
|---|---|---|
| POST | /api/food/ | Create a food post (requires food partner auth) |
| GET | /api/food/ | Get all food items |
| POST | /api/food/like | Like or unlike a food item |
| POST | /api/food/save | Save or unsave a food item |
| GET | /api/food/save | Get saved food items for current user |

### Food Partner

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/food-partner/:id | Get food partner profile and uploaded food items |

---

## 6. Environment Setup

Create a `.env` file inside the [backend](backend) folder.

Example:

```env
MONGODB_URL=mongodb://localhost:27017/zomafeeds
JWT_SECRET=your_jwt_secret_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id/
```

Important:
- MongoDB must be running locally or you must provide a valid MongoDB connection string.
- ImageKit keys are required because food upload uses [backend/src/services/storage.service.js](backend/src/services/storage.service.js).

---

## 7. Setup Instructions

### 1. Install backend dependencies

```bash
cd ZomaFeeds/backend
npm install
```

### 2. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 3. Start the backend

```bash
cd ../backend
node server.js
```

The backend will run on:
- http://localhost:3000

### 4. Start the frontend

```bash
cd ../frontend
npm run dev
```

The frontend will run on:
- http://localhost:5173

---

## 8. How to Run the Full Project

Open two terminals:

### Terminal 1 - Backend
```bash
cd ZomaFeeds/backend
node server.js
```

### Terminal 2 - Frontend
```bash
cd ZomaFeeds/frontend
npm run dev
```

Then open:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

---

## 9. Typical User Flow

### User journey
1. Register as a user.
2. Login with email and password.
3. Visit home feed.
4. Browse videos.
5. Like or save content.
6. Check saved content from the bottom navigation.

### Food partner journey
1. Register as a food partner.
2. Login as food partner.
3. Upload a food video.
4. Add a name and description.
5. Go to profile page to see uploaded items.

---

## 10. Notes and Important Points

- Frontend CORS is configured for localhost:5173 in [backend/src/app.js](backend/src/app.js).
- Auth uses cookies, so the frontend must send requests with credentials enabled.
- The app relies on MongoDB models for users, food partners, likes, and saves.
- The backend only starts successfully when the environment variables are configured correctly.
- Food uploads depend on ImageKit, so a valid ImageKit account is required.

---

## 11. Common Commands

### Backend
```bash
cd ZomaFeeds/backend
npm install
node server.js
```

### Frontend
```bash
cd ZomaFeeds/frontend
npm install
npm run dev
npm run build
```

---

## 12. Summary

ZomaFeeds is a social food-video application where:
- users can discover food content
- food partners can publish and manage their food posts
- likes, saves, and profiles are all connected to MongoDB
- the frontend is a React single-page app using React Router
- the backend is a REST API secured with JWT cookies

This project is a good example of a full-stack food app with authentication, media upload, social interactions, and profile-based content display.

---

If you want, I can also create a more polished version of this README with screenshots, architecture diagram text, and a contributor setup section.
