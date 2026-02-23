# MusicShare

**MusicShare** is a web app built with **React** and **TypeScript** that connects to Spotify to fetch and display your music stats, recommendations, albums, playlists, and songs – all locally on your machine.

> **Note:** The backend is built in **.NET** by [kpustelak](https://github.com/kpustelak) and need to be hosted separately: [sharemusic backend](https://github.com/kpustelak/sharemusic). You need to run the backend locally to use the frontend.

## Tech Stack

* React
* TypeScript
* GSAP
* Redux
* TailwindCSS

## Features

Connect with Spotify to fetch:
* Your stats
* Recommendations based on your stats
* Your albums
* Your playlists
* Your songs

## Pages

* **Auth** – connect to Spotify (no account needed, only Spotify login)
* **Main Dashboard**
  * Featured section slider
  * Albums, songs, and artist recommendations
  * Top songs, albums, genres, artists
  * Recently played (beta)
* **Playlists** and **albums**
  * View all your playlists and albums
  * Dynamic search with debounce
* **Single playlist** and **single album**
  * Cover, author, duration, share button, download button (WIP)
  * Songs list
* **Create New** – create a new album (WIP)
* **Search Results**

## Work in Progess

- [ ] Adding playlists and songs to playlists
- [ ] Responsiveness in some areas
- [ ] Deleting songs from a playlist
- [ ] Listening history and currently playing song at the bottom

## Getting started

1. Clone this repo:
```Bash
git clone https://github.com/Asymphia/MusicShare.git
```
2. Install dependencies:
```Bash
npm install
```
3. Run the app:
```Bash
npm run dev
```
4. Make sure the backend is running locally.
