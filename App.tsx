import { AnimatePresence, motion } from "framer-motion";
import {
  Cake,
  Gift,
  Heart,
  KeyRound,
  Lock,
  Moon,
  Music,
  Pause,
  Play,
  RotateCw,
  Sparkles,
  Star,
  Smile,
  Volume2,
  VolumeX,
} from "lucide-react";
import { KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  friend,
  gallery,
  gifts,
  memories,
  personalizedMessage,
  playlist,
  puzzleWords,
  quizQuestions,
  treasureObjects,
  wheelReasons,
} from "@/data/adventureData";
import { useCountdown } from "@/hooks/useCountdown";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn, shuffle } from "@/lib/utils";

type ProgressState = {
  stage: number;
  openedMemories: string[];
  quizCorrect: number[];
  treasuresFound: string[];
  puzzleSolved: boolean;
  wheelSpun: boolean;
  openedGifts: string[];
  vaultUnlocked: boolean;
};

const initialProgress: ProgressState = {
  stage: 1,
  openedMemories: [],
  quizCorrect: [],
  treasuresFound: [],
  puzzleSolved: false,
  wheelSpun: false,
  openedGifts: [],
  vaultUnlocked: false,
};

const stageTitles = [
  "Welcome",
  "Memories",
  "Quiz",
  "Treasure",
  "Puzzle",
  "Reasons",
  "Gifts",
  "Vault",
];

const iconMap = { Teddy: Smile, Cake, Moon, Gift, Heart };

export default function App() {
  const [progress, setProgress] = useLocalStorage<ProgressState>("birthday-adventure-progress", initialProgress);
  const [loaded, setLoaded] = useState(true);
  const [secretClicks, setSecretClicks] = useState(0);
  const [secretOpen, setSecretOpen] = useState(false);
  const finalReady =
    progress.openedMemories.length === memories.length &&
    progress.quizCorrect.length === quizQuestions.length &&
    progress.treasuresFound.length === treasureObjects.length &&
    progress.puzzleSolved &&
    progress.wheelSpun &&
    progress.openedGifts.length === gifts.length;

  useEffect(() => {
    const timer = window.setTimeout(() => setLoaded(false), 900);
    return () => window.clearTimeout(timer);
  }, []);

  function update(next: Partial<ProgressState>) {
    setProgress((current) => ({ ...current, ...next }));
  }

  function unlockStage(stage: number) {
    setProgress((current) => ({ ...current, stage: Math.max(current.stage, stage) }));
    window.setTimeout(() => document.getElementById(`stage-${stage}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }

  function logoClick() {
    const next = secretClicks + 1;
    setSecretClicks(next);
    if (next >= 5) {
      setSecretOpen(true);
      setSecretClicks(0);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden">
      <AnimatePresence>{loaded ? <LoadingScreen /> : null}</AnimatePresence>
      <FloatingElements />
      <Header progress={progress} onLogoClick={logoClick} />
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-20 pt-24 sm:px-6 lg:px-8">
        <StageShell id="stage-1" eyebrow="Stage 1" title="Welcome Gate" locked={false}>
          <WelcomeGate onBegin={() => unlockStage(2)} />
        </StageShell>

        <StageShell id="stage-2" eyebrow="Stage 2" title="Memory Timeline" locked={progress.stage < 2}>
          <MemoryTimeline progress={progress} update={update} onContinue={() => unlockStage(3)} />
        </StageShell>

        <StageShell id="stage-3" eyebrow="Stage 3" title="Friendship Quiz" locked={progress.stage < 3}>
          <FriendshipQuiz progress={progress} update={update} onContinue={() => unlockStage(4)} />
        </StageShell>

        <StageShell id="stage-4" eyebrow="Stage 4" title="Treasure Hunt" locked={progress.stage < 4}>
          <TreasureHunt progress={progress} update={update} onContinue={() => unlockStage(5)} />
        </StageShell>

        <StageShell id="stage-5" eyebrow="Stage 5" title="Secret Message Puzzle" locked={progress.stage < 5}>
          <SecretPuzzle progress={progress} update={update} onContinue={() => unlockStage(6)} />
        </StageShell>

        <StageShell id="stage-6" eyebrow="Stage 6" title="Reasons Why You're Amazing" locked={progress.stage < 6}>
          <ReasonsWheel progress={progress} update={update} onContinue={() => unlockStage(7)} />
        </StageShell>

        <StageShell id="stage-7" eyebrow="Stage 7" title="Birthday Gift Boxes" locked={progress.stage < 7}>
          <GiftBoxes progress={progress} update={update} onContinue={() => unlockStage(8)} />
        </StageShell>

        <StageShell id="stage-8" eyebrow="Stage 8" title="The Final Vault" locked={progress.stage < 8}>
          <FinalVault ready={finalReady} progress={progress} update={update} />
        </StageShell>

        <Extras />
        <PersonalizedMessage />
      </div>
      <MusicPlayer />
      <Dialog open={secretOpen} onOpenChange={setSecretOpen} title="Congratulations, you found the hidden message ❤️">
        <p className="text-lg leading-8">{friend.secretNote}</p>
      </Dialog>
    </main>
  );
}

function Header({ progress, onLogoClick }: { progress: ProgressState; onLogoClick: () => void }) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-white/60 bg-white/55 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <button onClick={onLogoClick} className="flex items-center gap-2 rounded-full px-2 py-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary" aria-label="Birthday Adventure logo">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-pink-400 text-white shadow-glow">
            <Sparkles className="h-5 w-5" />
          </span>
          <span>
            <span className="block font-display text-xl leading-5 text-violet-900">Birthday Adventure</span>
            <span className="text-xs text-violet-700">for {friend.friendName}</span>
          </span>
        </button>
        <nav className="hidden items-center gap-2 md:flex" aria-label="Adventure progress">
          {stageTitles.map((title, index) => (
            <a key={title} href={`#stage-${index + 1}`} className={cn("rounded-full px-3 py-1 text-xs font-semibold transition", progress.stage >= index + 1 ? "bg-white/80 text-violet-800" : "text-violet-500")}>
              {index + 1}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}

function StageShell({ id, eyebrow, title, locked, children }: { id: string; eyebrow: string; title: string; locked: boolean; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <div className={cn("relative rounded-[2rem] border border-white/65 bg-white/32 p-4 shadow-soft backdrop-blur-md sm:p-6", locked && "min-h-72")}>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-pink-500">{eyebrow}</p>
            <h2 className="font-display text-3xl text-violet-950 sm:text-4xl">{title}</h2>
          </div>
        </div>
        {locked ? (
          <div className="grid min-h-56 place-items-center rounded-3xl border border-dashed border-violet-200 bg-white/35 text-center">
            <div>
              <Lock className="mx-auto mb-3 h-8 w-8 text-pink-400" />
              <p className="font-semibold text-violet-800">This part unlocks when the previous surprise is complete.</p>
            </div>
          </div>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

function WelcomeGate({ onBegin }: { onBegin: () => void }) {
  return (
    <div className="grid min-h-[70vh] place-items-center text-center">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
        <p className="mb-5 font-script text-4xl text-pink-500 sm:text-6xl">Hey {friend.friendName} ❤️</p>
        <h1 className="font-display text-4xl leading-tight text-violet-950 sm:text-6xl">Today isn't just a birthday...</h1>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-violet-800">It's a small adventure made especially for you.</p>
        <Button className="mt-8" size="lg" onClick={onBegin}>
          <Sparkles className="h-5 w-5" /> Begin the Adventure
        </Button>
      </motion.div>
    </div>
  );
}

function MemoryTimeline({ progress, update, onContinue }: { progress: ProgressState; update: (next: Partial<ProgressState>) => void; onContinue: () => void }) {
  const complete = progress.openedMemories.length === memories.length;

  function openMemory(id: string) {
    if (!progress.openedMemories.includes(id)) update({ openedMemories: [...progress.openedMemories, id] });
  }

  return (
    <>
      <div className="flex snap-x gap-4 overflow-x-auto pb-5">
        {memories.map((memory) => {
          const opened = progress.openedMemories.includes(memory.id);
          return (
            <button key={memory.id} onClick={() => openMemory(memory.id)} className="perspective min-w-[270px] snap-center text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:min-w-[320px]" aria-pressed={opened}>
              <motion.div className={cn("preserve-3d relative h-80 rounded-lg transition-transform duration-700", opened && "rotate-y-180")}>
                <Card className="backface-hidden absolute inset-0 overflow-hidden">
                  <img src={memory.image} alt="" className="h-40 w-full object-cover" />
                  <CardHeader>
                    <CardTitle>{memory.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-violet-700">{memory.front}</p>
                  </CardContent>
                </Card>
                <Card className="backface-hidden rotate-y-180 absolute inset-0 grid place-items-center p-6">
                  <p className="font-script text-3xl leading-10 text-pink-600">{memory.back}</p>
                </Card>
              </motion.div>
            </button>
          );
        })}
      </div>
      <UnlockButton complete={complete} onClick={onContinue} label="Continue Journey" />
    </>
  );
}

function FriendshipQuiz({ progress, update, onContinue }: { progress: ProgressState; update: (next: Partial<ProgressState>) => void; onContinue: () => void }) {
  const currentIndex = Math.min(progress.quizCorrect.length, quizQuestions.length - 1);
  const current = quizQuestions[currentIndex];
  const complete = progress.quizCorrect.length === quizQuestions.length;
  const [feedback, setFeedback] = useState("");

  function answer(option: string) {
    if (complete) return;
    if (option === current.answer) {
      setFeedback("Correct, obviously. She knows the friendship lore.");
      update({ quizCorrect: [...progress.quizCorrect, currentIndex] });
    } else {
      setFeedback("Close, but the heart knows the right answer.");
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Progress value={(progress.quizCorrect.length / quizQuestions.length) * 100} />
      <Card className="mt-5">
        <CardHeader>
          <CardTitle>{complete ? "Quiz complete" : current.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {complete ? (
            <p className="text-lg text-violet-800">Five tiny proofs that this friendship is elite.</p>
          ) : (
            current.options.map((option) => (
              <Button key={option} variant="outline" className="w-full justify-start rounded-lg py-6 text-left" onClick={() => answer(option)}>
                <Heart className="h-4 w-4 text-pink-400" /> {option}
              </Button>
            ))
          )}
          <AnimatePresence>{feedback ? <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="font-semibold text-pink-600">{feedback}</motion.p> : null}</AnimatePresence>
        </CardContent>
      </Card>
      <UnlockButton complete={complete} onClick={onContinue} label="Unlock the Treasure Hunt" />
    </div>
  );
}

function TreasureHunt({ progress, update, onContinue }: { progress: ProgressState; update: (next: Partial<ProgressState>) => void; onContinue: () => void }) {
  const [active, setActive] = useState<(typeof treasureObjects)[number] | null>(null);
  const complete = progress.treasuresFound.length === treasureObjects.length;

  function findTreasure(item: (typeof treasureObjects)[number]) {
    setActive(item);
    if (!progress.treasuresFound.includes(item.id)) update({ treasuresFound: [...progress.treasuresFound, item.id] });
  }

  return (
    <>
      <div className="relative h-[520px] overflow-hidden rounded-[1.5rem] border border-white/70 bg-gradient-to-b from-sky-100 via-pink-50 to-cream-100 shadow-inner">
        <div className="absolute inset-x-8 bottom-16 h-40 rounded-t-full bg-white/45" />
        <div className="absolute bottom-0 h-24 w-full bg-lavender-100/80" />
        {treasureObjects.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap];
          const found = progress.treasuresFound.includes(item.id);
          return (
            <button
              key={item.id}
              aria-label={`Find ${item.label}`}
              onClick={() => findTreasure(item)}
              className={cn("absolute grid h-16 w-16 place-items-center rounded-full bg-white/80 shadow-glow transition hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary", found && "bg-pink-100")}
              style={{ left: `${item.x}%`, top: `${item.y}%` }}
            >
              <Icon className="h-8 w-8 text-violet-800" />
            </button>
          );
        })}
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-[1fr_auto]">
        <Card>
          <CardContent className="pt-6">
            <p className="font-semibold text-violet-900">{active ? active.compliment : "Tap the hidden objects to reveal compliments and clues."}</p>
            <p className="mt-2 text-pink-600">{active ? active.clue : `${progress.treasuresFound.length}/${treasureObjects.length} clues found`}</p>
          </CardContent>
        </Card>
        <UnlockButton complete={complete} onClick={onContinue} label="Use Surprise Key" />
      </div>
    </>
  );
}

function SecretPuzzle({ progress, update, onContinue }: { progress: ProgressState; update: (next: Partial<ProgressState>) => void; onContinue: () => void }) {
  const [words, setWords] = useState(() => shuffle(puzzleWords));
  const complete = progress.puzzleSolved;
  const dragging = useRef<number | null>(null);

  function swap(from: number, to: number) {
    const next = [...words];
    [next[from], next[to]] = [next[to], next[from]];
    setWords(next);
    if (next.join(" ") === puzzleWords.join(" ")) update({ puzzleSolved: true });
  }

  function keyboardMove(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "ArrowLeft" && index > 0) swap(index, index - 1);
    if (event.key === "ArrowRight" && index < words.length - 1) swap(index, index + 1);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="flex flex-wrap justify-center gap-3 rounded-[1.5rem] border border-white/70 bg-white/45 p-5">
        {words.map((word, index) => (
          <button
            key={`${word}-${index}`}
            draggable={!complete}
            onDragStart={() => (dragging.current = index)}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => dragging.current !== null && swap(dragging.current, index)}
            onKeyDown={(event) => keyboardMove(event, index)}
            className="rounded-full bg-white px-4 py-3 font-semibold text-violet-800 shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {word}
          </button>
        ))}
      </div>
      <AnimatePresence>
        {complete ? (
          <motion.p initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="mt-6 text-center font-script text-4xl text-pink-600 sm:text-5xl">
            You are the bestest person in my life
          </motion.p>
        ) : null}
      </AnimatePresence>
      <UnlockButton complete={complete} onClick={onContinue} label="Reveal More Reasons" />
    </div>
  );
}

function ReasonsWheel({ progress, update, onContinue }: { progress: ProgressState; update: (next: Partial<ProgressState>) => void; onContinue: () => void }) {
  const [rotation, setRotation] = useState(0);
  const [reason, setReason] = useState("");

  function spin() {
    const index = Math.floor(Math.random() * wheelReasons.length);
    setRotation((value) => value + 1080 + index * 30);
    setReason(wheelReasons[index]);
    update({ wheelSpun: true });
  }

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[420px_1fr]">
      <div className="relative mx-auto aspect-square w-full max-w-[360px]">
        <motion.div animate={{ rotate: rotation }} transition={{ duration: 1.4, ease: "easeOut" }} className="grid h-full w-full place-items-center rounded-full border-[14px] border-white bg-[conic-gradient(from_0deg,#f9a8d4,#d8b8ff,#bae6fd,#fff1d6,#f9a8d4)] shadow-glow">
          <div className="grid h-36 w-36 place-items-center rounded-full bg-white/90 text-center font-display text-xl text-violet-900">Amazing</div>
        </motion.div>
        <div className="absolute -right-2 top-1/2 h-0 w-0 -translate-y-1/2 border-y-[16px] border-l-[28px] border-y-transparent border-l-pink-500" />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Spin for a reason</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={spin}>
            <RotateCw className="h-5 w-5" /> Spin the Wheel
          </Button>
          <motion.p key={reason} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mt-6 font-script text-4xl text-pink-600">
            {reason || "A reason will bloom here."}
          </motion.p>
          <UnlockButton complete={progress.wheelSpun} onClick={onContinue} label="Open Gift Boxes" />
        </CardContent>
      </Card>
    </div>
  );
}

function GiftBoxes({ progress, update, onContinue }: { progress: ProgressState; update: (next: Partial<ProgressState>) => void; onContinue: () => void }) {
  const complete = progress.openedGifts.length === gifts.length;

  function openGift(id: string) {
    if (!progress.openedGifts.includes(id)) update({ openedGifts: [...progress.openedGifts, id] });
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {gifts.map((gift) => {
          const opened = progress.openedGifts.includes(gift.id);
          return (
            <motion.button key={gift.id} whileHover={{ y: -5 }} onClick={() => openGift(gift.id)} className="min-h-56 rounded-lg border border-white/70 bg-white/55 p-5 text-left shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <Gift className={cn("mb-4 h-10 w-10", opened ? "text-pink-500" : "text-violet-500")} />
              <h3 className="font-display text-2xl text-violet-950">{opened ? gift.title : "Wrapped Surprise"}</h3>
              <p className="mt-3 leading-7 text-violet-700">{opened ? gift.message : "Tap to unwrap this tiny birthday gift."}</p>
            </motion.button>
          );
        })}
      </div>
      <UnlockButton complete={complete} onClick={onContinue} label="Approach the Final Vault" />
    </>
  );
}

function FinalVault({ ready, progress, update }: { ready: boolean; progress: ProgressState; update: (next: Partial<ProgressState>) => void }) {
  const [confetti, setConfetti] = useState(false);
  const letterLines = [
    `Dear ${friend.friendName},`,
    "Today I just want to remind you how grateful I am that you exist.",
    "Thank you for every laugh,",
    "every conversation,",
    "every moment,",
    "and every memory.",
    "You make life brighter simply by being yourself.",
    "I hope this year brings you happiness,",
    "success,",
    "good health,",
    "and countless reasons to smile.",
    "Happy Birthday ❤️",
    "Always cheering for you,",
    friend.yourName,
  ];

  function unlock() {
    if (!ready) return;
    setConfetti(true);
    update({ vaultUnlocked: true });
  }

  return (
    <div className="text-center">
      <p className="mb-5 text-lg text-violet-800">One last lock remains...</p>
      <button onClick={unlock} disabled={!ready} className="mx-auto grid h-56 w-56 place-items-center rounded-full border-8 border-white bg-gradient-to-br from-violet-300 via-pink-300 to-sky-200 shadow-glow transition hover:scale-105 disabled:cursor-not-allowed disabled:grayscale">
        {ready ? <KeyRound className="h-16 w-16 text-white" /> : <Lock className="h-16 w-16 text-white" />}
      </button>
      {!ready ? <p className="mt-4 font-semibold text-violet-700">Complete every previous stage to open the vault.</p> : null}
      {confetti || progress.vaultUnlocked ? <Confetti /> : null}
      <AnimatePresence>
        {progress.vaultUnlocked ? (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mx-auto mt-8 max-w-2xl rounded-lg border border-pink-100 bg-white/80 p-6 text-left shadow-soft sm:p-10">
            {letterLines.map((line, index) => (
              <motion.p key={line + index} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.18 }} className={cn("leading-8 text-violet-900", index === 0 || index > 10 ? "font-script text-3xl text-pink-600" : "text-lg")}>
                {line}
              </motion.p>
            ))}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

function Extras() {
  const [lightbox, setLightbox] = useState<string | null>(null);
  const count = useCountdown(friend.friendshipStarted);

  return (
    <section className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Time since our friendship began</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-3 text-center">
          {[
            ["Days", count.days],
            ["Hours", count.hours],
            ["Minutes", count.minutes],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg bg-white/70 p-3">
              <div className="font-display text-3xl text-pink-500">{value}</div>
              <div className="text-xs font-bold uppercase tracking-wider text-violet-600">{label}</div>
            </div>
          ))}
        </CardContent>
      </Card>
      <div>
        <h2 className="mb-4 font-display text-3xl text-violet-950">Photo Gallery</h2>
        <div className="masonry">
          {gallery.map((src, index) => (
            <button key={src} onClick={() => setLightbox(src)} className="mb-4 block w-full overflow-hidden rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
              <img src={src} alt={`Gallery memory ${index + 1}`} className="w-full break-inside-avoid rounded-lg object-cover shadow-soft transition duration-500 hover:scale-105" />
            </button>
          ))}
        </div>
      </div>
      <Dialog open={Boolean(lightbox)} onOpenChange={() => setLightbox(null)} title="A little memory">
        {lightbox ? <img src={lightbox} alt="Selected gallery memory" className="max-h-[70vh] w-full rounded-lg object-contain" /> : null}
      </Dialog>
    </section>
  );
}

function PersonalizedMessage() {
  return (
    <section className="scroll-mt-24">
      <div className="rounded-[2rem] border border-white/65 bg-white/32 p-4 shadow-soft backdrop-blur-md sm:p-6">
        <div className="mb-5">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-pink-500">A Personal Note</p>
          <h2 className="font-display text-3xl text-violet-950 sm:text-4xl">For Jahnvi</h2>
        </div>
        <Card className="mx-auto max-w-3xl bg-white/75">
          <CardContent className="space-y-5 pt-6">
            {personalizedMessage.map((line, index) => (
              <motion.p
                key={line}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.08 }}
                className={cn(
                  "text-lg leading-8 text-violet-900",
                  index >= personalizedMessage.length - 2 && "font-script text-3xl leading-10 text-pink-600",
                )}
              >
                {line}
              </motion.p>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function MusicPlayer() {
  const audioRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const stopRef = useRef<(() => void) | null>(null);
  const [track, setTrack] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [volume, setVolume] = useState(0.45);

  useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = muted ? 0 : volume;
  }, [muted, volume]);

  useEffect(() => {
    stopRef.current?.();
    stopRef.current = null;
    if (!playing) return;

    const AudioCtor = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return;

    const context = audioRef.current ?? new AudioCtor();
    audioRef.current = context;
    const gain = gainRef.current ?? context.createGain();
    gainRef.current = gain;
    gain.gain.value = muted ? 0 : volume;
    gain.connect(context.destination);

    const patterns = [
      [392, 523.25, 587.33, 659.25],
      [329.63, 440, 493.88, 587.33],
    ];
    let step = 0;
    const playNote = () => {
      const oscillator = context.createOscillator();
      const noteGain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = patterns[track % patterns.length][step % 4];
      noteGain.gain.setValueAtTime(0.0001, context.currentTime);
      noteGain.gain.exponentialRampToValueAtTime(0.12, context.currentTime + 0.08);
      noteGain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.9);
      oscillator.connect(noteGain);
      noteGain.connect(gain);
      oscillator.start();
      oscillator.stop(context.currentTime + 1);
      step += 1;
    };
    void context.resume();
    playNote();
    const interval = window.setInterval(playNote, 950);
    stopRef.current = () => window.clearInterval(interval);

    return () => {
      window.clearInterval(interval);
    };
  }, [playing, muted, volume, track]);

  return (
    <div className="fixed bottom-4 right-4 z-40 w-[min(92vw,360px)] rounded-lg border border-white/70 bg-white/75 p-3 shadow-soft backdrop-blur">
      <div className="flex items-center gap-2">
        <Music className="h-5 w-5 text-pink-500" />
        <select className="min-w-0 flex-1 rounded-full border border-violet-100 bg-white px-3 py-2 text-sm" value={track} onChange={(event) => setTrack(Number(event.target.value))} aria-label="Choose song">
          {playlist.map((song, index) => (
            <option key={song.title} value={index}>
              {song.title}
            </option>
          ))}
        </select>
        <Button size="icon" variant="outline" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Pause music" : "Play music"}>
          {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button size="icon" variant="outline" onClick={() => setMuted((value) => !value)} aria-label={muted ? "Unmute music" : "Mute music"}>
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
      </div>
      <input className="mt-3 w-full accent-pink-500" type="range" min="0" max="1" step="0.05" value={volume} onChange={(event) => setVolume(Number(event.target.value))} aria-label="Music volume" />
    </div>
  );
}

function UnlockButton({ complete, onClick, label }: { complete: boolean; onClick: () => void; label: string }) {
  return (
    <div className="mt-5 flex justify-center">
      <Button disabled={!complete} onClick={onClick}>
        <KeyRound className="h-5 w-5" /> {label}
      </Button>
    </div>
  );
}

function FloatingElements() {
  const items = useMemo(() => Array.from({ length: 24 }, (_, index) => ({ index, left: Math.random() * 100, delay: Math.random() * 8, kind: index % 3 })), []);
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {items.map((item) => (
        <span key={item.index} className="absolute animate-drift text-pink-300/70" style={{ left: `${item.left}%`, animationDelay: `${item.delay}s` }}>
          {item.kind === 0 ? <Heart className="h-4 w-4" /> : item.kind === 1 ? <Star className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
        </span>
      ))}
    </div>
  );
}

function Confetti() {
  const pieces = useMemo(() => Array.from({ length: 90 }, (_, index) => ({ index, left: Math.random() * 100, delay: Math.random() * 1.5, color: ["#f9a8d4", "#d8b8ff", "#7dd3fc", "#fde68a"][index % 4] })), []);
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((piece) => (
        <span key={piece.index} className="absolute h-3 w-2 animate-drift rounded-sm" style={{ left: `${piece.left}%`, animationDelay: `${piece.delay}s`, backgroundColor: piece.color }} />
      ))}
    </div>
  );
}

function LoadingScreen() {
  return (
    <motion.div className="fixed inset-0 z-[60] grid place-items-center bg-cream-50" exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
      <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 1.4 }} className="text-center">
        <Sparkles className="mx-auto h-12 w-12 text-pink-500" />
        <p className="mt-4 font-display text-3xl text-violet-900">Preparing the surprise...</p>
      </motion.div>
    </motion.div>
  );
}
