## TLE Eliminators Contest Tracker

Welcome to the **TLE Eliminators Contest Tracker** project by `Maanas Sehgal`! This project is designed to simplify the process of tracking competitive programming contests from popular platforms like LeetCode, CodeChef, and Codeforces. The platform allows users to view and track contests, automatically update solutions, and access contest discussions from YouTube. It provides an intuitive and responsive UI, supporting both light and dark themes, ensuring an enhanced experience for users.

## Table of Contents

1. [Introduction](#introduction)
2. [Video](#video)
3. [API Documentation](#api-documentation)
  - [GET `/leetcode`](#1-get-leetcode)
  - [GET `/codechef`](#2-get-codechef)
  - [GET `/codeforces`](#3-get-codeforces)
  - [GET `/contests`](#4-get-contests)
  - [GET `/search-contests`](#5-get-search-contests)
  - [GET `/upcoming-contests`](#6-get-upcoming-contests)
  - [GET `/update-all-contests`](#7-get-update-all-contests)
  - [GET `/delete`](#8-get-delete)
  - [GET `/update-solution-links`](#9-get-update-solution-links)
  - [GET `/get-pcd-videos`](#10-get-get-pcd-videos)
  - [POST `/update-contest-solution`](#11-post-update-contest-solution)
  - [GET `/trigger-update-all-contests`](#12-get-trigger-update-all-contests)
  - [GET `/trigger-update-solutions`](#13-get-trigger-update-solutions)
  - [GET `/trigger-all`](#14-get-trigger-all)

---

## Introduction

This project was developed as part of an assignment for **TLE Eliminators**. It serves as a platform to track and manage competitive programming contests across **LeetCode**, **CodeChef**, and **Codeforces**. The platform fetches real-time contest data, allows users to view problem solutions, and explore post-contest discussions. The solution videos are automatically updated every 12 hours using a cron job, ensuring all contest solutions remain up-to-date.

### Key Features:
- **Contest Tracker:** Track and manage upcoming, active, and past contests from multiple competitive programming platforms.
- **Solution Video Updates:** Automatically fetch and update solution videos for each contest using YouTube API and regex matching.
- **Post Contest Discussion:** View discussion videos with timestamps for each problem, enabling direct navigation to relevant solutions.
- **Admin Interface:** Admins can add or update YouTube solution links for each contest directly.

---

## Routes

### Home Page
- **Route:** `/`
- **Description:** The landing page, providing an overview and navigation to features such as contest tracking and post-contest discussions.

### Contest Tracker
- **Route:** `/contest-tracker`
- **Description:** Main route for tracking contests using **FullCalendar**. Displays:
  - **Upcoming Contests**, **Active Contests**, and **Past Contests**.
  - Users can bookmark contests, add them to Google Calendar, and search by platform.

### Post Contest Discussion
- **Route:** `/post-contest-discussion`
- **Description:** Displays solution videos for each problem in a contest. Videos are fetched from **TLE Eliminators’ YouTube playlists**, and users can search by problem name or contest title to find relevant solutions.

### Update Contest
- **Route:** `/update-contest`
- **Description:** Admin route for managing contest data, including adding or updating YouTube solution links, and validating links via YouTube API.

---

## Bonus Features

1. **Theme Switcher:** Toggle between **light** and **dark** themes.
2. **Automatic Video Updates:** The platform automatically fetches and updates video links for contests once a solution is uploaded on YouTube.
3. **Responsive Design:** The UI is responsive, ensuring compatibility across mobile, tablet, and desktop devices.
4. **Code Documentation:** All code is well-documented for easy understanding and contribution.

---

## Technologies Used

### This project uses the **MERN Stack** (MongoDB, Express, React, Node.js), TypeScript, and several other libraries:

### Frontend: **React**, **TypeScript**, **Zustand**, **FullCalendar**, **React Router**, **Axios**, **Framer Motion**, **React Icons**  
### Backend: **Node.js**, **Express**, **MongoDB**, **Mongoose**, **node-cron**, **Google APIs**, **Axios**  
### Utilities: **TypeScript**, **dotenv**, **nodemon**, **cors**

---

## Video

[Watch on YouTube](https://www.youtube.com/watch?v=HKN7FDA_IRo)

---

## API Documentation

### 1. `GET /leetcode`

Fetches past contests from Leetcode and saves them.

**Response**:

- `200 OK`: An array of saved Leetcode contests.

```json
{
  "status": "success",
  "data": [
    {
      "contestId": "weekly-contest-441",
      "contestName": "Weekly Contest 441",
      "platform": "leetcode",
      "contestStartDate": "2025-03-16T02:30:00.000Z",
      "contestEndDate": "2025-03-16T04:00:00.000Z",
      "contestDuration": 5400,
      "contestUrl": "https://leetcode.com/contest/weekly-contest-441",
      "_id": "67d7f2cec474364f7fdf6670",
      "__v": 0
    }
  ]
}
```

---

### 2. `GET /codechef`

Fetches past contests from Codechef and saves them.

**Response**:

- `200 OK`: An array of saved Codechef contests.

```json
{
  "status": "success",
  "data": [
    {
      "contestId": "START177",
      "contestName": "Starters 177 (Rated till 5 star)",
      "platform": "codechef",
      "contestStartDate": "2025-03-12T14:30:00.000Z",
      "contestEndDate": "2025-03-12T16:30:00.000Z",
      "contestDuration": 7200,
      "contestUrl": "https://www.codechef.com/START177",
      "_id": "67d7f2e8c474364f7fdf6741",
      "__v": 0
    }
  ]
}
```

---

### 3. `GET /codeforces`

Fetches past contests from Codeforces and saves them.

**Response**:

- `200 OK`: An array of saved Codeforces contests.

```json
{
  "status": "success",
  "data": [
    {
      "_id": "67d7f30bc474364f7fdf7e09",
      "contestId": "ICPC1",
      "contestName": "Codeforces Beta Round 1",
      "platform": "codeforces",
      "contestStartDate": "2010-02-19T12:00:00.000Z",
      "contestEndDate": "2010-02-19T14:00:00.000Z",
      "contestDuration": 7200,
      "contestUrl": "https://codeforces.com/contest/1"
    }
  ]
}
```

---

### 4. `GET /contests`

Fetches a list of contests based on filters such as `startDate`, `endDate`, `page`, and `limit`. Supports pagination.

**Query Parameters**:

- `startDate`: Filter contests starting from this date.
- `endDate`: Filter contests ending before this date.
- `page`: Page number for pagination.
- `limit`: Number of contests per page.

**Response**:

- `200 OK`: A list of contests with pagination metadata.

```json
{
  "status": "success",
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10,
    "totalPages": 1
  },
  "data": [
    {
      "_id": "67d7f30bc474364f7fdf7e09",
      "contestId": "ICPC1",
      "contestName": "Codeforces Beta Round 1",
      "platform": "codeforces",
      "contestStartDate": "2010-02-19T12:00:00.000Z",
      "contestEndDate": "2010-02-19T14:00:00.000Z",
      "contestDuration": 7200,
      "contestUrl": "https://codeforces.com/contest/1"
    }
  ]
}
```

---

### 5. `GET /search-contests`

Search for contests by query, platform, and pagination.

**Query Parameters**:

- `query`: The search term to filter contests.
- `platform`: Optional filter for contest platform.
- `page`: Page number for pagination.
- `limit`: Number of contests per page.

**Response**:

- `200 OK`: Search results for contests.

```json
{
  "status": "success",
  "data": [
    {
      "_id": "67d7f2fec474364f7fdf6fd5",
      "contestId": "ICPC2075",
      "contestName": "Educational Codeforces Round 176 (Rated for Div. 2)",
      "platform": "codeforces",
      "contestStartDate": "2025-03-17T14:35:00.000Z",
      "contestEndDate": "2025-03-17T16:35:00.000Z",
      "contestDuration": 7200,
      "contestUrl": "https://codeforces.com/contest/2075"
    }
  ]
}
```

---

### 6. `GET /upcoming-contests`

Fetches a list of upcoming contests.

**Response**:

- `200 OK`: A list of upcoming contests.

```json
{
  "status": "success",
  "data": [
    {
      "_id": "67d7f2fec474364f7fdf6fd5",
      "contestId": "ICPC2075",
      "contestName": "Educational Codeforces Round 176 (Rated for Div. 2)",
      "platform": "codeforces",
      "contestStartDate": "2025-03-17T14:35:00.000Z",
      "contestEndDate": "2025-03-17T16:35:00.000Z",
      "contestDuration": 7200,
      "contestUrl": "https://codeforces.com/contest/2075"
    }
  ]
}
```

---

### 7. `GET /update-all-contests`

Manually triggers an update to all contests.

**Response**:

- `200 OK`: Message confirming the update.

```json
{
  "status": "success",
  "message": "All contests updated successfully"
}
```

---

### 8. `GET /delete`

Deletes all contest data from the database (For testing purposes ONLY).

**Query Parameters**:

- `contestId`: The ID of the contest to delete.

**Response**:

- `200 OK`: Message confirming deletion.

```json
{
  "status": "success",
  "data": "All contests deleted"
}
```

---

### 9. `GET /update-solution-links`

Manually triggers the update of solution links.

**Response**:

- `200 OK`: Message confirming the update.

```json
{
  "status": "success",
  "message": "Solution links updated successfully"
}
```

---

### 10. `GET /get-pcd-videos`

Fetches a list of PCD videos.

**Response**:

- `200 OK`: A list of PCD videos.

```json
{
  "status": "success",
  "data": {
    "leetcodeVideos": [
      {
        "kind": "youtube#playlistItem",
        "etag": "kBFXpx2uZOenAKENNFkFUq3kUYs",
        "id": "UExjWHBrSTlBLVJaSTZGaHlkTnozSkJ0Xy1wX2kyNUNici4xM0YyM0RDNDE4REQ1NDA0",
        "snippet": {
          "publishedAt": "2025-03-15T16:55:36Z",
          "channelId": "UCqL-fzHtN3NQPbYqGymMbTA",
          "title": "Leetcode Weekly Contest 441 | Video Solutions - A to D | by Raghav Goel | TLE Eliminators",
          "description": "Here are the video solutions for problems A, B, C, D of Leetcode Weekly Contest 435."
        }
      }
    ]
  }
}
```

---

### 11. `POST /update-contest-solution`

Updates the solution link of a contest by contest ID.

**Body Parameters**:

- `contestId`: The ID of the contest.
- `youtubeUrl`: The YouTube URL for the solution video.

**Response**:

- `200 OK`: Message confirming the update.

```json
{
  "status": "success",
  "message": "Contest solution video updated successfully",
  "data": {
    "contestId": "1",
    "name": "Contest 1",
    "solution": {
      "title": "Solution Video Title",
      "url": "https://www.youtube.com/watch?v=xxxx",
      "thumbnail": "https://img.youtube.com/vi/xxxx/maxresdefault.jpg"
    }
  }
}
```

---

### 12. `GET /trigger-update-all-contests`

Manually triggers an update for all contests.

**Response**:

- `200 OK`: Message confirming the update.

```json
{
  "status": "success",
  "message": "Updated all contests successfully"
}
```

---

### 13. `GET /trigger-update-solutions`

Manually triggers an update for all solution links.

**Response**:

- `200 OK`: Message confirming the update.

```json
{
  "status": "success",
  "message": "Updated all solution links successfully"
}
```

### 14. `GET /trigger-all`

Manually triggers both an update for all contests and solution links.

**Response**:

- `200 OK`: Message confirming the updates.

```json
{
  "status": "success",
  "message": "Updated all contests and solution links successfully"
}
```