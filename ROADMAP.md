# 🛤️ Aurora OS Roadmap

![Roadmap Progress](<https://img.shields.io/badge/Roadmap%20Progress-Stage%200%20(Foundation)-blue>)

> **Vision**  
> Aurora OS evolves in clearly defined stages: first as a functional desktop OS sandbox, then as a playable single-player hacking game, and finally as a persistent multiplayer hacking experience.

Versioning follows semantic principles _(explained at the bottom)_:

- **0.x.x** → Functional virtual OS _(no game systems)_
- **1.x.x** → Playable single-player hacking game _(Steam Early Access)_
- **2.x.x** → Persistent multiplayer hacking world _(Steamworks)_

---

## 🚦 Stage 0 — Foundation & Usability (`0.x.x`)

**Versions:** `0.1.0 → 0.9.x`  
**Distribution:** GitHub / Web (no Steam)

### Goal

Deliver a **functional desktop OS** with real applications and natural usability, **without any game mechanics**.

### Success Criteria

- Desktop interaction feels natural _(windows, drag & drop, file handling)_
- Core apps are fully functional _(no placeholders)_
- Persistent filesystem with configurable users
- Stable and repeatable onboarding / first-boot experience

### Core Deliverables

#### 📁 Virtual Filesystem

- Persistent storage
- User accounts: `root`, `guest`, player-defined `user`
- Permissions and isolation foundations

#### 🧭 Onboarding & First Boot

- Fresh install / “New Game” flow
- User creation and environment setup

#### 📦 Core Applications (Fully Functional)

- **Photos** — browse and open images
- **Videos** — playback support
- **Music** — playlists and playback
- **Notepad** — edit and persist text

#### 🖥️ Desktop UX & System Tools

- Window management
- File associations
- Basic shell / terminal

### Milestones

- `0.1.0` — Early functional desktop
- `0.3.0` — Core UX stabilized
- `0.6.0` — OS usable end-to-end
- `0.9.x` — No placeholder apps remain

---

## 🎮 Stage 1 — Single-Player Hacking Game (`1.x.x`)

**Versions:** `1.0.0 → 1.9.x`  
**Distribution:** Steam Early Access _(single-player only)_

### Goal

Transform Aurora OS into a **playable single-player hacking game**, built directly on top of the OS foundation.

### Success Criteria

- Complete single-player gameplay loop _(start → progression → end state)_
- OS and game mechanics integrate naturally
- Player progression and objectives are clear and coherent

### Core Deliverables

#### 🎯 Game Systems

- Missions and objectives
- Progression and difficulty scaling

#### 🕹️ Hacking Mechanics

- Virtual systems and targets
- Ports, logs, tools, traces, and challenges

#### 🧠 Puzzle & Scripting Layer

- Logic-based hacking challenges
- In-OS scripting and automation

#### 🎛️ Game UI Integration

- Diegetic UI embedded in the desktop
- Non-intrusive overlays that preserve OS usability

#### 📖 Narrative & World-Building

- Lore fragments
- Guidance and contextual storytelling

### Milestones

- `1.0.0` — Fully playable single-player experience _(Steam Early Access launch)_
- `1.3.0` — Expanded hacking systems
- `1.7.0` — Content-complete and polished
- `1.9.x` — Stable, public-ready single-player

---

## 🌐 Stage 2 — Multiplayer Hacking World (`2.x.x`)

**Distribution:** Steam _(Steamworks-powered)_

### Goal

Evolve Aurora OS into a **connected, persistent multiplayer hacking environment**, inspired by long-lived worlds such as _Grey Hack_ and _Hackmud_.

### Success Criteria

- Reliable multiplayer sessions
- Persistent shared game state
- Secure, fair, and server-authoritative interactions

### Core Deliverables

#### 🌍 Networking & Persistence

- Session and identity management
- Long-lived, persistent servers

#### 🧑‍🤝‍🧑 Multiplayer Systems

- Cooperative and competitive hacking
- Shared targets and objectives

#### 🏆 Progression & Reputation

- Rankings and leaderboards
- Shared achievements and long-term identity

#### 🔐 Security & Permissions

- Anti-abuse systems
- Server authority and validation

### Milestones

- `2.0.0` — Multiplayer alpha
- `2.5.0` — Feature-complete multiplayer core
- `2.9.x` — Public multiplayer beta

---

## 🔢 Version Number Meaning

### MAJOR (`x.0.0`)

Incremented when **fundamental system paradigms change**.

This includes:

- Breaking changes to internal or external APIs
- Core architecture rewrites _(filesystem, runtime, process model)_
- Major UX paradigm shifts
- Removal or redesign of existing core systems
- Any change that breaks backward compatibility

**Examples:**

- `1.0.0` — Aurora transitions from OS-only to playable game
- `2.0.0` — Multiplayer and persistent world architecture introduced

> Major versions are **rare and intentional**.

---

### MINOR (`x.y.0`)

Incremented when **new functionality or meaningful expansion** is added **without breaking compatibility**.

This is the most common increment during active development.

#### Triggers

**Core App Graduation**

- App transitions from placeholder to functional
- Real UI, filesystem integration, persistence

**System & UX Expansion**

- New desktop workflows
- Improved window management
- Onboarding improvements
- New system utilities

**Examples:**

- `0.3.0` — Desktop interactions stabilized
- `0.4.0` — File associations implemented
- `1.1.0` — Expanded onboarding and player systems

---

### PATCH (`x.y.z`)

Incremented for **fixes and polish only**.

Patch releases:

- Do not introduce new features
- Do not break existing behavior

#### Triggers

- Bug fixes
- Performance improvements
- UI and consistency polish
- Edge-case handling

**Examples:**

- `0.4.1` — Fix file save bug
- `1.2.3` — Improve startup performance

---

## 🧭 Development Phases & Milestones

| Version Range | Meaning                                   |
| ------------- | ----------------------------------------- |
| `0.x.x`       | Experimental OS phase — APIs may change   |
| `0.5.0`       | Desktop usable, core apps functional      |
| `1.0.0`       | Playable single-player baseline           |
| `1.x.x`       | Single-player expansion and stabilization |
| `2.0.0`       | Persistent multiplayer architecture       |

---

## 🧩 Commit → Version Mapping (Guideline)

Recommended commit conventions:

- `feat:` → **MINOR** bump
- `fix:` → **PATCH** bump
- `feat!:` or breaking change → **MAJOR** bump
- `refactor:` → PATCH unless behavior changes

This enables predictable versioning and future automation.
