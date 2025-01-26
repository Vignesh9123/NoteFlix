# NoteFlix

[Access it live here](https://noteflix-v1.vercel.app)

NoteFlix is a YouTube library platform that allows users to organize and enhance their video-watching experience with advanced features such as note-taking, AI summarization, and playlist management.

## Features

- **AI Video Summarization:** Get AI-generated summaries of your videos.
- **Video Library:** Add YouTube videos to your personal library for easy access.
- **Custom Playlists:** Organize your videos by creating custom playlists.
- **Rich Text Notes with Timestamps:** Add detailed notes with timestamps to videos for better tracking.
- **Favorite Videos:** Star your favorite videos to view them in a separate section.
- **Search and Add Videos:** Search YouTube directly from the site and add videos to your library.
- **Explore Section:** Discover videos similar to your starred ones.

## Tech Stack

- **Frontend:** Next.js
- **API Integration:** YouTube Data API V3
- **Authentication:** Firebase

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Vignesh9123/NoteFlix.git
   ```

2. Navigate to the project directory:
   ```bash
   cd NoteFlix
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Create a `.env.local` file and add the required environment variables:
   ```env
   NEXT_PUBLIC_MONGODB_URI=MONGODB_URI
   NEXT_PUBLIC_JWT_SECRET=JWT_SECRET
   NEXT_PUBLIC_YOUTUBE_API_KEY=youtube_api_key
   NEXT_PUBLIC_YOUTUBE_API_URL=https://www.googleapis.com/youtube/v3/search
   NEXT_PUBLIC_DEEPGRAM_API_KEY=deepgram_api_key - # Optional (Required if using its respective endpoint)
   NEXT_PUBLIC_GEMINI_API_KEY=gemini_api_key
   NEXT_PUBLIC_FIREBASE_API_KEY=firebase_api_key
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=firebase_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=firebase_app_id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=firebase_measurement_id
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open your browser and visit `http://localhost:3000`.

## Usage

1. Sign in using your Google account.
2. Search for YouTube videos and add them to your library.
3. Create playlists and categorize your videos.
4. Take notes with timestamps while watching videos.
5. Star your favorite videos and explore similar content.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-branch
   ```
3. Make your changes and commit:
   ```bash
   git commit -m "Add new feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-branch
   ```
5. Create a Pull Request.

## License

This project is licensed under the MIT License.

## Contact

For any inquiries, reach out via email at `vignesh.d9123@gmail.com` or open an issue on GitHub.

---

Enjoy using NoteFlix!

