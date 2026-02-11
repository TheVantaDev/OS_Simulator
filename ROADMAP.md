# 🛤️ EduOS Roadmap

![Roadmap Progress](https://img.shields.io/badge/Roadmap%20Progress-Stage%200%20(Foundation)-blue)

> **Vision**
> EduOS evolves in clearly defined stages: first as a functional desktop OS simulator, then as an interactive educational platform with structured curricula, and finally as a classroom-ready tool with multi-student support.

Versioning follows semantic principles _(explained at the bottom)_:

- **0.x.x** → Functional virtual OS _(foundation)_
- **1.x.x** → Interactive educational platform _(structured learning)_
- **2.x.x** → Classroom integration _(multi-student, instructor tools)_

---

## 🚦 Stage 0 — Foundation & Usability (`0.x.x`)

**Versions:** `0.1.0 → 0.9.x`
**Distribution:** GitHub / Web

### Goal

Deliver a **functional desktop OS** with real applications and natural usability, plus core educational tools.

### Success Criteria

- Desktop interaction feels natural _(windows, drag & drop, file handling)_
- Core apps are fully functional _(no placeholders)_
- Persistent filesystem with configurable users
- Educational terminal commands and simulation tools are working
- Stable and repeatable onboarding / first-boot experience

### Core Deliverables

#### 📁 Virtual Filesystem

- Persistent storage
- User accounts: `root`, `guest`, player-defined `user`
- Permissions and isolation foundations

#### 🧭 Onboarding & First Boot

- Fresh install / "New Game" flow
- User creation and environment setup

#### 📦 Core Applications (Fully Functional)

- **Photos** — browse and open images
- **Music** — playlists and playback
- **Notepad** — edit and persist text

#### 🎓 Educational Applications

- **CPU Scheduler** — Visual scheduling algorithm simulator
- **OS Learning Hub** — Interactive learning modules with embedded practice terminal
- **Educational Terminal Commands** — `ps-sim`, `schedule`, `mem-sim`, `page-fault`, `deadlock`, `banker`

#### 🖥️ Desktop UX & System Tools

- Window management
- File associations
- Bash-like terminal

### Milestones

- `0.1.0` — Early functional desktop
- `0.3.0` — Core UX stabilized
- `0.6.0` — OS usable end-to-end
- `0.9.x` — No placeholder apps remain
- `1.0.0-alpha` — Educational tools integrated

---

## 🎓 Stage 1 — Interactive Educational Platform (`1.x.x`)

**Versions:** `1.0.0 → 1.9.x`
**Distribution:** Web (GitHub Pages / self-hosted)

### Goal

Transform EduOS into a **structured educational platform** with guided learning paths, assessment, and comprehensive OS curriculum coverage.

### Success Criteria

- Complete learning paths for core OS concepts
- Interactive assessments and quizzes
- Progress tracking within the simulator
- Curriculum alignment with standard CS courses

### Core Deliverables

#### 🎯 Structured Curriculum

- Guided learning modules with prerequisites
- Progressive difficulty scaling
- Assessment checkpoints

#### 🧪 Interactive Labs

- Hands-on exercises with automated validation
- Sandbox environments for experimentation
- Step-by-step walkthroughs

#### 📊 Progress Tracking

- Per-student progress visualization
- Completion badges and achievements
- Performance analytics

#### 📖 Extended Modules

- File Systems and I/O
- Networking basics
- Security fundamentals

### Milestones

- `1.0.0` — Structured curriculum with core modules
- `1.3.0` — Assessment and progress tracking
- `1.7.0` — Content-complete educational platform
- `1.9.x` — Stable, polished for classroom use

---

## 🌐 Stage 2 — Classroom Integration (`2.x.x`)

**Distribution:** Web (self-hosted / cloud)

### Goal

Evolve EduOS into a **classroom-ready tool** with multi-student support, instructor dashboards, and institutional integration.

### Success Criteria

- Multi-student concurrent sessions
- Instructor assignment and grading tools
- Exportable progress reports
- LMS integration capabilities

### Core Deliverables

#### 🏫 Multi-Student Environment

- Individual student instances
- Shared lab environments
- Real-time collaboration features

#### 👩‍🏫 Instructor Tools

- Assignment creation and distribution
- Automated grading for lab exercises
- Class progress dashboards

#### 📈 Analytics & Reporting

- Student performance insights
- Curriculum effectiveness metrics
- Exportable reports

### Milestones

- `2.0.0` — Multi-student environment alpha
- `2.5.0` — Instructor tools and grading
- `2.9.x` — Production-ready classroom tool

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

- `1.0.0` — EduOS transitions from OS-only to structured educational platform
- `2.0.0` — Classroom integration and multi-student architecture introduced

> Major versions are **rare and intentional**.

---

### MINOR (`x.y.0`)

Incremented when **new functionality or meaningful expansion** is added **without breaking compatibility**.

This is the most common increment during active development.

#### Triggers

**Core App Graduation**

- App transitions from placeholder to functional
- Real UI, filesystem integration, persistence

**Educational Module Addition**

- New learning modules or simulation tools
- New terminal commands for OS concepts

**System & UX Expansion**

- New desktop workflows
- Improved window management
- Onboarding improvements
- New system utilities

**Examples:**

- `0.3.0` — Desktop interactions stabilized
- `0.4.0` — File associations implemented
- `1.1.0` — New learning modules added

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

| Version Range | Meaning                                         |
| ------------- | ----------------------------------------------- |
| `0.x.x`       | Foundation OS phase — APIs may change            |
| `0.5.0`       | Desktop usable, core apps functional             |
| `1.0.0`       | Structured educational platform baseline         |
| `1.x.x`       | Educational content expansion and stabilization  |
| `2.0.0`       | Classroom integration architecture               |

---

## 🧩 Commit → Version Mapping (Guideline)

Recommended commit conventions:

- `feat:` → **MINOR** bump
- `fix:` → **PATCH** bump
- `feat!:` or breaking change → **MAJOR** bump
- `refactor:` → PATCH unless behavior changes

This enables predictable versioning and future automation.
