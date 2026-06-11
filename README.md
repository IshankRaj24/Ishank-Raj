# Birthday Adventure

A responsive single-page birthday surprise built with React, TypeScript, Tailwind CSS, Framer Motion, and shadcn-style UI components.

## Customize

Edit `src/data/adventureData.ts` to change:

- Friend name and your name
- Friendship start date
- Memories, quiz answers, treasure clues, wheel reasons, gifts, gallery images
- Secret easter egg note

Music is muted by default. The included player generates soft ambient notes from the playlist choices, so it works without audio files. If you prefer real songs, add audio files to `public/music/` and wire those paths into the player.

## Run Locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The app is ready to deploy on Vercel as a standard Vite project.
