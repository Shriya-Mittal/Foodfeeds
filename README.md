# ZomaFeeds

ZomaFeeds is a full-stack food discovery and short-video application. Normal users can discover food partners, watch food Reels, like and save videos, comment, review food, place orders, and view order/payment history. Food partners can create a profile, upload food videos, view their uploaded content, delete their own videos, and log out securely.

## Features

### Normal users

- Register and log in with a normal-user account
- Optional profile-picture upload during registration
- Home page with a backend-fetched food-partner directory
- Food partner profiles with uploaded food videos
- Instagram-style Reels feed
- Like/unlike and save/unsave food videos
- Filled heart and bookmark indicators for active states
- Read and post comments with live comment counts
- Empty comment state: `There is no comment`
- Star ratings and reviews
- Food ordering with quantity and delivery address
- Dummy payment flow for testing
- Profile page with name, email, profile picture, order history, payment method, and order status
- Logout from the top-right of the profile page

### Food partners

- Register with business details and an optional profile picture
- Log in directly to the food-upload section
- Upload food videos with a name and description
- Upload progress state and duplicate-submit protection
- View uploaded videos on the partner profile
- Delete only videos owned by the logged-in partner
- Profile picture shown on partner profiles and the user home directory
- Logout from the top-right of the partner profile
- No normal-user Home, Reels, Save, Profile, order, or payment navigation

## Application Flows

### Normal-user flow

```text
Register/Login
      |
      v
Reels
      |
      +--> Home: food partner directory
      |       |
      |       +--> partner profile and uploaded videos
      |
      +--> Save: saved food videos
      |
      +--> Profile: details, order/payment history, logout
```

Normal-user navigation:

```text
Home | Reels | Save | Profile
```

### Food-partner flow

```text
Register/Login
      |
      v
Food upload section
      |
      v
Partner profile
      |
      +--> view uploaded videos
      +--> delete owned videos
      +--> logout
```

## Tech Stack

### Backend

- Node.js and Express
- MongoDB and Mongoose
- JWT and cookie-based authentication
- bcryptjs password hashing
- cookie-parser and CORS
- Multer for multipart uploads
- ImageKit for profile pictures and videos

### Frontend

- React
- Vite
- React Router DOM
- Axios
- CSS media queries for phone, tablet, and laptop layouts

## Project Structure

```text
ZomaFeeds/
├── backend/
│   ├── package.json
│   ├── server.js
│   └── src/
│       ├── app.js
│       ├── controllers/
│       │   ├── auth.controller.js
│       │   ├── comment.controller.js
│       │   ├── food.controller.js
│       │   ├── food-partner.controller.js
│       │   ├── order.controller.js
│       │   └── review.controller.js
│       ├── db/db.js
│       ├── middlewares/auth.middleware.js
│       ├── models/
│       │   ├── comment.model.js
│       │   ├── food.model.js
│       │   ├── foodpartner.model.js
│       │   ├── likes.model.js
│       │   ├── order.model.js
│       │   ├── review.model.js
│       │   ├── save.model.js
│       │   └── user.model.js
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── comment.routes.js
│       │   ├── food.routes.js
│       │   ├── food-partner.routes.js
│       │   ├── order.routes.js
│       │   └── review.routes.js
│       └── services/storage.service.js
├── frontend/
│   ├── .env
│   ├── package.json
│   └── src/
│       ├── App.jsx
│       ├── components/
│       │   ├── BottomNav.jsx
│       │   ├── CommentSection.jsx
│       │   ├── LogoutButton.jsx
│       │   ├── ReelFeed.jsx
│       │   └── ReviewSection.jsx
│       ├── config/api.js
│       ├── pages/auth/
│       ├── pages/food-partner/
│       ├── pages/general/
│       ├── routes/AppRoutes.jsx
│       └── styles/
└── README.md
```

## Environment Configuration

### Frontend

The backend host is centralized in [frontend/src/config/api.js](frontend/src/config/api.js). Frontend Axios calls use this value instead of hardcoded backend URLs.

Create [frontend/.env](frontend/.env):

```env
VITE_API_BASE_URL=http://localhost:3000
```

Restart Vite after changing this file.

### Backend

Create a `.env` file inside [backend](backend):

```env
MONGODB_URL=mongodb://localhost:27017/zomafeeds
JWT_SECRET=replace_with_a_long_random_secret
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id/
FRONTEND_URL=http://localhost:5173
```

MongoDB and ImageKit are required for normal operation. `FRONTEND_URL` must match the frontend origin allowed by CORS.

### Render deployment

Configure environment variables in the Render dashboard rather than relying on local `.env` files:

- Backend service: set `NODE_ENV=production`, `PORT` is supplied by Render, and set `FRONTEND_URL` to the deployed frontend origin.
- Frontend service: set `VITE_API_BASE_URL` to the deployed backend origin, for example `https://your-backend-service.onrender.com`.
- If the frontend and backend are served from the same Render origin, `VITE_API_BASE_URL` can use that same HTTPS origin.
- Redeploy the frontend after changing `VITE_API_BASE_URL`, because Vite embeds environment variables at build time.
- Both services must use HTTPS in production so the secure authentication cookie can be stored by the browser.

## Authentication and Authorization

Authentication uses a JWT stored in the `token` cookie. Axios requests send `withCredentials: true`.

- `authUserMiddleware` loads `req.user` and protects normal-user APIs.
- `authFoodPartnerMiddleware` loads `req.foodPartner` and protects partner APIs.
- `GET /api/auth/me` verifies the active session before protected frontend routes render.
- Frontend role storage is only a navigation hint; backend cookie authentication is authoritative.
- Logout clears the cookie, removes stored role data, replaces browser history, and redirects to registration.

## API Reference

The API base URL is normally `http://localhost:3000`.

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/auth/me` | Cookie | Return the active role and account |
| POST | `/api/auth/user/register` | Public | Register a user; accepts optional `profilePicture` multipart field |
| POST | `/api/auth/user/login` | Public | Log in a user |
| GET | `/api/auth/user/profile` | User | Get the current user's profile |
| GET | `/api/auth/user/logout` | User | Clear the user session |
| POST | `/api/auth/food-partner/register` | Public | Register a partner; accepts optional `profilePicture` multipart field |
| POST | `/api/auth/food-partner/login` | Public | Log in a food partner |
| GET | `/api/auth/food-partner/logout` | Partner | Clear the partner session |

### Food videos

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/food` | Partner | Upload a video using multipart field `mama` |
| GET | `/api/food` | User | Fetch food videos with computed comment counts |
| DELETE | `/api/food/:id` | Partner | Delete a video owned by the current partner |
| POST | `/api/food/like` | User | Like or unlike a video; returns `liked` |
| POST | `/api/food/save` | User | Save or unsave a video; returns `saved` |
| GET | `/api/food/save` | User | Fetch saved videos with comment counts |

### Food partners

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/food-partner` | User | List partners for the Home page |
| GET | `/api/food-partner/me` | Partner | Get the current partner and their uploaded videos |
| GET | `/api/food-partner/:id` | User | Get a partner profile and videos |

### Comments and reviews

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/comments` | User | Create a comment with `food` and `text` |
| GET | `/api/comments/:foodId` | User | Get all comments for a food video |
| DELETE | `/api/comments/:id` | User | Delete the current user's own comment |
| POST | `/api/reviews` | User | Create a 1-to-5 star review |
| GET | `/api/reviews/:foodId` | User | Get reviews and average rating |

### Orders and dummy payments

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/orders` | User | Create an order with food, quantity, and address |
| GET | `/api/orders/my` | User | Get the current user's order history |
| GET | `/api/orders/:id` | User | Get one owned order |
| PATCH | `/api/orders/:id/pay` | User | Mark an owned order as paid in the dummy flow |

The payment flow is for development/testing only. It does not charge money and does not connect to Razorpay, Stripe, or another provider.

## Frontend Routes

| Route | Screen | Role |
|---|---|---|
| `/` or `/register` | Registration choice | Public |
| `/user/register` | User registration | Public |
| `/user/login` | User login | Public |
| `/food-partner/register` | Partner registration | Public |
| `/food-partner/login` | Partner login | Public |
| `/home` | Food partner directory | User |
| `/reels` | Reels feed | User |
| `/saved` | Saved food videos | User |
| `/user-profile` | User profile and history | User |
| `/food-partner/:id` | Partner profile and videos | User |
| `/order/:foodId` | Order, review, and comment page | User |
| `/payment/:orderId` | Dummy payment page | User |
| `/create-food` | Food upload section | Food partner |
| `/profile` | Partner profile and video management | Food partner |

## Reels and Responsive Behavior

`ReelFeed.jsx` is shared by the main Reels and Saved screens. It provides:

- IntersectionObserver-based autoplay for visible videos
- Vertical snap scrolling on mobile
- Centered portrait reels with dark side space on laptops
- Like, save, and comment actions
- Filled heart/bookmark states after successful actions
- Top-right X control returning to Home
- Comment panel with loading, empty, list, submit, and close states
- Immediate comment-count updates after posting
- Store profile and Order Now links

Laptop screens use an Instagram-style dark viewer with a centered portrait reel and actions beside it. Phones and smaller tablets retain the full-screen reel experience and bottom navigation.

## Upload and Profile Media

Profile pictures and food videos use multipart form data. Multer reads the file into memory, `storage.service.js` uploads it to ImageKit, and the returned URL is stored in MongoDB.

Food ownership is stored through the `foodPartner` ObjectId on each food document. The delete endpoint checks both the food ID and the authenticated partner ID, preventing deletion of another partner's video.

After upload, `/profile` calls `/api/food-partner/me`, so newly uploaded videos appear from fresh database data without requiring a manual refresh.

## Installation and Running

### Install dependencies

```bash
cd ZomaFeeds/backend
npm install

cd ../frontend
npm install
```

### Start the backend

```bash
cd ZomaFeeds/backend
node server.js
```

Backend: `http://localhost:3000`

### Start the frontend

In a second terminal:

```bash
cd ZomaFeeds/frontend
npm run dev
```

Frontend: `http://localhost:5173`

### Build and lint

```bash
cd ZomaFeeds/frontend
npm run build
npm run lint
```

## Suggested Test Flows

### Normal user

1. Register or log in.
2. Confirm the app opens Reels.
3. Open Home and select a food partner.
4. Open comments, post a comment, and confirm the count changes.
5. Like and save a reel and confirm the icons fill.
6. Open Saved and verify comments and counts.
7. Place an order and complete dummy payment.
8. Open Profile and verify account and order/payment history.
9. Log out and confirm protected routes redirect to registration.

### Food partner

1. Register with a profile picture or log in.
2. Confirm the upload section opens without normal-user navigation.
3. Upload a video and wait for the upload state to finish.
4. Open the partner profile and verify the video and profile picture.
5. Delete an owned video and confirm it disappears.
6. Log out from the top-right profile control.

## Important Notes

- Do not commit backend `.env` files or production credentials.
- The frontend environment variable must use the Vite `VITE_` prefix.
- Cookies and CORS must be configured correctly when frontend and backend use different origins.
- Production deployments should use HTTPS and secure cookie settings.
- ImageKit must be configured before testing profile-picture or video uploads.
- The dummy payment flow is for development/testing only.

## Summary

ZomaFeeds combines food discovery, short-form video, social interactions, partner content management, ordering, and role-based authentication in one full-stack application. The backend owns authentication, authorization, storage, counts, and persistence, while the React frontend provides responsive mobile, tablet, and laptop experiences through reusable feed, navigation, profile, comment, review, order, and payment components.
