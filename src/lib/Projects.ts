/** The schema.org `applicationCategory` values the hub's apps fall under */
export type AppCategory =
    | 'MultimediaApplication'
    | 'EducationalApplication'
    | 'DeveloperApplication'
    | 'DesignApplication';

export type AppFeature = {
    title: string;
    description: string;
};

export type AppLink = {
    label: string;
    url: string;
};

/**
 * The longer copy behind an app's `/apps/[id]` page. Only apps with a page carry it,
 * so its presence is what decides whether the page, the card's info button and the
 * sitemap entry exist. Every sentence here comes from the app's own repository,
 * site or blog posts.
 */
export type AppDetails = {
    /** The page's <title> and meta description */
    metaTitle: string;
    metaDescription: string;
    /** One line under the app name in the hero */
    tagline: string;
    /**
     * The app's own brand color, which its page is themed with. The readable shades
     * for buttons and text are derived from it in `appAccent.ts`. Separate from
     * `color`, which the home cards keep sharing.
     */
    accent: string;
    /** "What it is", one string per paragraph */
    about: string[];
    /** "Who it is for", one string per item */
    audience: string[];
    features: AppFeature[];
    /** A full screenshot of the app, its size given so the hero does not shift */
    screenshot: {
        src: string;
        alt: string;
        width: number;
        height: number;
    };
    /** Docs, courses and the like, shown next to the source code link */
    links?: AppLink[];
    /** Fan apps say they are not affiliated with the company behind the game */
    disclaimer?: string;
};

export type ProjectData = {
    title: string;
    description: string;
    image: string;
    url: string;
    github: string;
    id: string;
    color: string;
    hidden?: boolean;
    category?: AppCategory;
    /** Defaults to running in any browser, desktop apps say where they run */
    operatingSystem?: string;
    details?: AppDetails;
};

export type LibraryLanguage = 'TypeScript' | 'Rust' | 'Java' | 'C';
export type LibraryRegistry = 'npm' | 'crates.io';

export type LibraryData = {
    title: string;
    description: string;
    languages: LibraryLanguage[];
    registry: LibraryRegistry;
    url: string;
    github: string;
    id: string;
    color: string;
};

const projects = [
    {
        title: 'Sky Music Nightly',
        description:
            'Website to compose and practice music for sky children of the light',
        image: '/images/skyMusicNightly.webp',
        url: 'https://sky-music.specy.app',
        github: 'https://github.com/Specy/genshin-music',
        id: 'sky-music',
        color: '#7e4baac8',
        category: 'MultimediaApplication',
        details: {
            metaTitle:
                'Sky Music Nightly - music app for Sky: Children of the Light | Specy',
            metaDescription:
                'Sky Music Nightly is a free web app to play, practice and compose songs for the Sky: Children of the Light instruments, with MIDI import and sheet export.',
            tagline:
                'Play, practice and compose songs for the instruments of Sky: Children of the Light.',
            // The gold of the note and the star in the icon. Both music apps share a
            // teal theme color, which goes to Genshin Music, so the two stay apart.
            accent: '#ebd29a',
            about: [
                'Sky Music Nightly is a free web app for the in-game instruments of Sky: Children of the Light. Each instrument keeps its in-game layout, like the 15 keys of the piano, and you can play it with your computer keyboard, the mouse, a touch screen or a MIDI keyboard.',
                'Around that keyboard there is a player to learn songs note by note, a composer to write songs with as many instruments as you want, a zen keyboard to play freely, and a rhythm game with its own chart editor.',
                'It installs as an app for fullscreen and offline use, and the interface is available in 12 languages.',
            ],
            audience: [
                'Sky: Children of the Light players who want to learn and practice songs for the in-game instruments',
                'Composers who write and arrange songs for the game, from scratch or starting from a MIDI file',
                'Anyone who wants to play the Sky instruments on a computer, a phone or a MIDI keyboard',
            ],
            features: [
                {
                    title: 'Player and practice mode',
                    description:
                        'Play songs, record your own, or learn one with practice mode, which waits for you to press each note before moving on, or with the approaching circles mode.',
                },
                {
                    title: 'Composer',
                    description:
                        'Write songs with as many instruments as you want, each on its own track with its own pitch, and undo any edit. The PRO composer shows every note on a full pitch axis for complex songs.',
                },
                {
                    title: 'MIDI and audio',
                    description:
                        'Turn a MIDI file into a song you can edit, export songs back to MIDI, or export them as WAV or MP3 audio.',
                },
                {
                    title: 'Rhythm game',
                    description:
                        'Make rhythm game charts with tap and held notes in the VSRG composer, or generate them from your songs, then play them in the VSRG player.',
                },
                {
                    title: 'Zen keyboard and sheets',
                    description:
                        'Play freely on the zen keyboard, and read or print any song as a sheet in the sheet visualizer.',
                },
                {
                    title: 'Keybinds, themes and backups',
                    description:
                        'Rebind the keys, connect a MIDI keyboard, pick or make a theme, and back up your songs.',
                },
            ],
            screenshot: {
                src: '/images/apps/sky-music.webp',
                alt: 'The Sky Music Nightly zen keyboard with the Sky Music theme',
                width: 1280,
                height: 720,
            },
            disclaimer:
                'Sky Music Nightly is a fan made app, not affiliated with thatgamecompany.',
        },
    },
    {
        title: 'Genshin Music Nightly',
        description: 'A website to compose and practice music for genshin',
        image: '/images/genshinMusicNightly.png',
        url: 'https://genshin-music.specy.app',
        github: 'https://github.com/Specy/genshin-music',
        id: 'genshin-music',
        color: '#7e4baac8',
        category: 'MultimediaApplication',
        details: {
            metaTitle:
                'Genshin Music Nightly - music app for Genshin Impact | Specy',
            metaDescription:
                'Genshin Music Nightly is a free web app to play, practice and compose songs for the Windsong Lyre, Floral Zither and other Genshin Impact instruments.',
            tagline:
                'Play, practice and compose songs for the Windsong Lyre, the Floral Zither and the other instruments of Genshin Impact.',
            // The app's theme color, also the lyre strings in its icon
            accent: '#63aea7',
            about: [
                'Genshin Music Nightly is a free web app for the in-game instruments of Genshin Impact, like the Windsong Lyre, the Floral Zither and the Vintage Lyre. Each instrument keeps its in-game layout, like the 21 keys of the lyre, and you can play it with your computer keyboard, the mouse, a touch screen or a MIDI keyboard.',
                'Around that keyboard there is a player to learn songs note by note, a composer to write songs with as many instruments as you want, a zen keyboard to play freely, and a rhythm game with its own chart editor.',
                'It is built from the same code as Sky Music Nightly, so both apps get the same tools. It installs as an app for fullscreen and offline use, and the interface is available in 12 languages.',
            ],
            audience: [
                'Genshin Impact players who want to learn and practice songs for the lyre, the zither and the other in-game instruments',
                'Composers who write and arrange songs for the game, from scratch or starting from a MIDI file',
                'Anyone who wants to play the Genshin instruments on a computer, a phone or a MIDI keyboard',
            ],
            features: [
                {
                    title: 'Player and practice mode',
                    description:
                        'Play songs, record your own, or learn one with practice mode, which waits for you to press each note before moving on, or with the approaching circles mode.',
                },
                {
                    title: 'Composer',
                    description:
                        'Write songs with as many instruments as you want, each on its own track with its own pitch, and undo any edit. The PRO composer shows every note on a full pitch axis for complex songs.',
                },
                {
                    title: 'MIDI and audio',
                    description:
                        'Turn a MIDI file into a song you can edit, export songs back to MIDI, or export them as WAV or MP3 audio.',
                },
                {
                    title: 'Rhythm game',
                    description:
                        'Make rhythm game charts with tap and held notes in the VSRG composer, or generate them from your songs, then play them in the VSRG player.',
                },
                {
                    title: 'Zen keyboard and sheets',
                    description:
                        'Play freely on the zen keyboard, and read or print any song as a sheet in the sheet visualizer.',
                },
                {
                    title: 'Keybinds, themes and backups',
                    description:
                        'Rebind the keys, connect a MIDI keyboard, pick or make a theme, and back up your songs.',
                },
            ],
            screenshot: {
                src: '/images/apps/genshin-music.webp',
                alt: 'The Genshin Music Nightly composer, with four tracks above the 21 key lyre keyboard',
                width: 1280,
                height: 720,
            },
            disclaimer:
                'Genshin Music Nightly is a fan made app, not affiliated with HoYoverse.',
        },
    },
    {
        title: 'ASM Editor',
        description:
            'An IDE for assembly in the web. With M68K, MIPS, RISC-V, x86 and Z80 support',
        image: '/images/asmEditor.png',
        url: 'https://asm-editor.specy.app',
        github: 'https://github.com/Specy/asm-editor',
        id: 'asm-editor',
        color: '#7e4baac8',
        category: 'EducationalApplication',
        details: {
            metaTitle: 'ASM Editor - web IDE for learning assembly | Specy',
            metaDescription:
                'ASM Editor is a free web IDE to write, run and debug M68K, MIPS, RISC-V, x86-64 and Z80 assembly, with backwards stepping, courses and exams.',
            tagline:
                'Write, run and debug M68K, MIPS, RISC-V, x86-64 and Z80 assembly in your browser, and learn it along the way.',
            // The app's theme color, also the A in its icon
            accent: '#f2a65a',
            about: [
                'ASM Editor is a web IDE for assembly, made for learning it. You write a program, run it or step through it one instruction at a time, and see every register and memory value it changes. You can also step backwards, undoing instructions to see what each one did.',
                'It supports M68K, MIPS, RISC-V, x86-64 and Z80, with documentation for each instruction set, interactive courses, an exam mode for schools and an editor you can embed in your own website. On M68K, MIPS, RISC-V and Z80, programs can also draw on a screen, read the mouse and keyboard and use a terminal.',
                'ASM Editor is described in the paper "ASM Editor: Understanding Language Abstractions Through Assembly Programming", presented at the 2026 IEEE Global Engineering Education Conference (EDUCON) in Cairo.',
            ],
            audience: [
                'Students taking a computer architecture or assembly course',
                'Teachers and universities who want courses, exams with test cases, or an editor embedded in their own pages',
                'Anyone curious about how C and C++ turn into assembly',
            ],
            features: [
                {
                    title: 'Step forward and back',
                    description:
                        'Run the program, step through it, set breakpoints, and undo the execution one instruction at a time to see what each step did.',
                },
                {
                    title: 'Registers, memory and stack',
                    description:
                        'Changed values are highlighted next to their old ones, function calls build a call stack, and the stack is colored by function frame. Values convert between hex, decimal, signed and unsigned.',
                },
                {
                    title: 'Documentation and completion',
                    description:
                        'Code completion suggests instructions and their valid addressing modes, the documentation explains each instruction with examples, and errors point at the exact problem.',
                },
                {
                    title: 'From C and C++ to assembly',
                    description:
                        'Compile C or C++ to MIPS or RISC-V assembly with Clang or GCC, and see which assembly each line of C became.',
                },
                {
                    title: 'Courses',
                    description:
                        'Interactive courses start from the basics every assembly language shares, then go deeper with one course each for M68K, MIPS, RISC-V, x86-64 and Z80.',
                },
                {
                    title: 'Exams, test cases and embeds',
                    description:
                        'Write test cases with starting registers, memory and expected output, lock the editor down for exams, or embed it in your own website.',
                },
            ],
            screenshot: {
                src: '/images/apps/asm-editor.webp',
                alt: 'ASM Editor running an M68K bubble sort, with registers, memory and the program output',
                width: 1600,
                height: 900,
            },
            links: [
                {
                    label: 'Documentation',
                    url: 'https://asm-editor.specy.app/documentation',
                },
                {
                    label: 'Courses',
                    url: 'https://asm-editor.specy.app/learn/courses',
                },
                {
                    label: 'EDUCON 2026 paper',
                    url: 'https://doi.org/10.1109/EDUCON67543.2026.11574463',
                },
            ],
        },
    },
    {
        title: 'Tokeko',
        description: 'Interactive LR parsers visualization to learn compilers',
        image: '/images/tokeko.png',
        url: 'https://tokeko.specy.app',
        github: 'https://github.com/Specy/tokeko',
        id: 'tokeko',
        color: '#7e4baac8',
        category: 'EducationalApplication',
        details: {
            metaTitle: 'Tokeko - learn LR(1) and LALR parsers | Specy',
            metaDescription:
                'Tokeko is a free web app to learn parsers: write a grammar and see the LR(1) or LALR tables, automaton, parsing steps and parse tree it produces.',
            tagline:
                'Write a grammar and watch an LR(1) or LALR parser build its tables and parse your input, step by step.',
            // The nodes of the parse tree in the icon
            accent: '#903162',
            about: [
                'Tokeko is a web app for learning how parsers work. You write the grammar of a language, with terminals, non-terminals and regex tokens, and Tokeko builds an LR(1) or LALR parser for it.',
                'Along the way it shows the FIRST and FOLLOW sets, the automaton as a table and as a graph, and the ACTION and GOTO tables. Give it an input string and it walks through every step the parser takes, then shows the parse tree.',
                'Tokeko runs on dotlr, a Rust library for LR(1) and LALR parsers, published on npm as @specy/dotlr.',
            ],
            audience: [
                'Students of a compilers or formal languages course who want to see how parse tables are built',
                'Teachers who want to show a parser at work, one step at a time',
                'Anyone designing a small grammar who wants to try it on real input',
            ],
            features: [
                {
                    title: 'LR(1) and LALR parsers',
                    description:
                        'Build either kind of parser from the same grammar.',
                },
                {
                    title: 'FIRST and FOLLOW sets',
                    description:
                        'See the FIRST and FOLLOW set of every symbol in your grammar.',
                },
                {
                    title: 'Automaton',
                    description:
                        "Inspect the parser's states and transitions as a table or as a graph.",
                },
                {
                    title: 'ACTION and GOTO tables',
                    description:
                        'The full table the parser follows to decide every move.',
                },
                {
                    title: 'Parsing steps and parse tree',
                    description:
                        'Step through how an input is parsed, click any step for its details, and view the resulting parse tree.',
                },
                {
                    title: 'Editor and TypeScript runner',
                    description:
                        'Write grammars with completion and clear error messages, then use your parser from TypeScript code that runs in the app.',
                },
            ],
            screenshot: {
                src: '/images/apps/tokeko.webp',
                alt: 'Tokeko showing the FIRST and FOLLOW sets and the automaton graph of a grammar',
                width: 1600,
                height: 1036,
            },
            links: [
                {
                    label: 'Introduction to LR parsing',
                    url: 'https://tokeko.specy.app/docs/dotlr',
                },
            ],
        },
    },
    {
        title: 'ROOC',
        description: 'Modeling language to solve MILP problems in the browser',
        image: '/images/rooc.png',
        url: 'https://rooc.specy.app',
        github: 'https://github.com/Specy/rooc',
        id: 'rooc',
        color: '#7e4baac8',
        category: 'DeveloperApplication',
        details: {
            metaTitle: 'ROOC - optimization modeling language | Specy',
            metaDescription:
                'ROOC is a modeling language and web platform to write and solve linear and mixed integer optimization models in the browser, also as a Rust and TypeScript library.',
            tagline:
                'Write linear and mixed integer optimization models in a readable language, and solve them in your browser.',
            // The accent of the app's own theme, the color of its buttons
            accent: '#5256a4',
            about: [
                'ROOC is a modeling language and web platform for linear and mixed integer optimization. You describe a problem by its objective, constraints and variables, and ROOC solves it in your browser with the HiGHS or microlp solvers.',
                'Models can be built from data, with sets, graphs and iteration. Every step from your source to the solver is visible, which helps to learn how a model is solved and to debug it, and models can be exported in the CPLEX LP format.',
                'The same engine is a Rust crate, rooc, and an npm package, @specy/rooc, both with a type safe builder to write models in code.',
            ],
            audience: [
                'Students of operations research and combinatorial optimization courses',
                'Anyone with an optimization problem who would rather describe the goal and the requirements than write an algorithm',
                'Developers who want to build and solve models from Rust or TypeScript',
            ],
            features: [
                {
                    title: 'A language for models',
                    description:
                        'Write objectives and constraints with sums, indexed constraints, boolean logic and the abs, min and max blocks.',
                },
                {
                    title: 'Data, sets and graphs',
                    description:
                        'Define the data inside the model and iterate over arrays, sets, and the nodes and edges of graphs.',
                },
                {
                    title: 'Solvers in the browser',
                    description:
                        'Solve models with HiGHS or microlp without installing anything.',
                },
                {
                    title: 'A visible pipeline',
                    description:
                        'Follow the model through each step, from the compiler to the linear model, and see the result of every one.',
                },
                {
                    title: 'CPLEX LP export',
                    description:
                        'Export a model in the CPLEX LP format to use it with other tools.',
                },
                {
                    title: 'Rust and TypeScript library',
                    description:
                        'Build models in code with the type safe builders of the rooc crate and the @specy/rooc package.',
                },
            ],
            screenshot: {
                src: '/images/apps/rooc.webp',
                alt: 'A diet problem written in ROOC, next to the steps of its solving pipeline',
                width: 1600,
                height: 757,
            },
            links: [
                {
                    label: 'Language documentation',
                    url: 'https://rooc.specy.app/docs/rooc',
                },
                {
                    label: 'rooc on crates.io',
                    url: 'https://crates.io/crates/rooc',
                },
                {
                    label: '@specy/rooc on npm',
                    url: 'https://www.npmjs.com/package/@specy/rooc',
                },
            ],
        },
    },
    {
        title: 'Learn',
        description:
            'Notes for computer science courses: analysis, physics, databases, networks, AI and more',
        image: '/images/logo.png',
        url: 'https://learn.specy.app',
        github: 'https://github.com/Specy/learn',
        id: 'learn',
        color: '#7e4baac8',
        category: 'EducationalApplication',
        details: {
            metaTitle: 'Learn - university computer science notes | Specy',
            metaDescription:
                'Learn is a free website of university computer science notes in Italian, from analysis and physics to databases, networks, AI and data mining.',
            tagline:
                'University computer science notes in Italian, free to read, with math, diagrams and code rendered on the page.',
            // The accent of the site's own theme, the same as the hub's
            accent: '#a65ee0',
            about: [
                "Learn is a public website with Specy's university computer science notes. They are organised by course and by year, from first year analysis and physics to databases, networks, artificial intelligence and data mining, and anyone can read them without signing up.",
                'The notes are written in Italian. They are kept as an Obsidian vault and published as a static site, with math, diagrams, callouts and code rendered on the page.',
            ],
            audience: [
                'Computer science students who read Italian and are studying the same subjects',
                'Anyone who wants to review one of these topics, with formula sheets and exam exercises included',
            ],
            features: [
                {
                    title: 'Eight courses',
                    description:
                        'Analisi Matematica, Fisica, Basi di Dati, Statistica e Probabilità, Algoritmica Avanzata, Reti di Calcolatori, Intelligenza Artificiale and Data Mining.',
                },
                {
                    title: 'Lectures in order',
                    description:
                        'Each course lists its lectures in the order they were taught, together with formula sheets, summaries and exam exercises.',
                },
                {
                    title: 'Math',
                    description:
                        'Formulas are typeset with KaTeX, both inline and as display equations.',
                },
                {
                    title: 'Diagrams',
                    description:
                        'Excalidraw drawings and Mermaid diagrams are part of the notes.',
                },
                {
                    title: 'Search',
                    description: 'Search every note from any page with Ctrl K.',
                },
                {
                    title: 'Code and themes',
                    description:
                        'Code blocks are syntax highlighted, in both the light and the dark theme.',
                },
            ],
            screenshot: {
                src: '/images/apps/learn.webp',
                alt: 'A thermodynamics lecture on Learn, with its equations',
                width: 1600,
                height: 1067,
            },
            links: [
                {
                    label: 'The notes on GitHub',
                    url: 'https://github.com/Specy/notes',
                },
            ],
        },
    },
    /*
        {
        title: 'Soundboard',
        description: 'An app to create soundboards that you can share',
        image: '/images/logo.png',
        url: 'https://soundboard.specy.app',
        github: '',
        id: 'soundboard',
        color: '#243B4A',
    },
    */
    {
        title: 'Conway generator',
        description: "An app to create backgrounds with Conway's game of life",
        image: '/images/logo.png',
        url: 'https://conway-generator.specy.app',
        github: '',
        id: 'conway-generator',
        color: '#7e4baac8',
        category: 'DesignApplication',
    },
    {
        title: 'Portfolio',
        description: 'My portfolio website where i list what i made',
        image: '/images/logo.png',
        url: 'https://portfolio.specy.app',
        github: '',
        id: 'portfolio',
        color: '#7e4baac8',
    },
    {
        title: 'Discerns',
        description:
            'An auto improving AI platform to create clones of people with their knowledge.',
        image: '/images/discerns.png',
        url: 'https://discerns.ai',
        github: '',
        id: 'discerns',
        hidden: true,
        color: '#7e4baac8',
    },
] satisfies ProjectData[];

const desktopProjects = [
    {
        title: 'Scapix',
        description:
            'A desktop app to upscale and denoise images, gifs and videos',
        image: '/images/scapix.png',
        url: 'https://github.com/Specy/Scapix',
        github: '',
        id: 'scapix',
        color: '#7e4baac8',
        category: 'MultimediaApplication',
        // the releases ship a Windows installer only
        operatingSystem: 'Windows',
    },
] satisfies ProjectData[];

const libraries = [
    {
        title: '@specy/rooc',
        description:
            'Write and solve mixed integer linear optimization models, with a type safe model builder',
        languages: ['Rust', 'TypeScript'],
        registry: 'npm',
        url: 'https://www.npmjs.com/package/@specy/rooc',
        github: 'https://github.com/Specy/rooc',
        id: 'specy-rooc',
        color: '#7e4baac8',
    },
    {
        title: '@specy/s68k',
        description:
            'Assemble, run and debug M68K assembly, with semantic checking and step by step execution',
        languages: ['Rust', 'TypeScript'],
        registry: 'npm',
        url: 'https://www.npmjs.com/package/@specy/s68k',
        github: 'https://github.com/Specy/s68k',
        id: 'specy-s68k',
        color: '#7e4baac8',
    },
    {
        title: '@specy/mips',
        description:
            'Assemble, run and debug MIPS assembly, with step by step execution and full access to registers and memory',
        languages: ['Java', 'TypeScript'],
        registry: 'npm',
        url: 'https://www.npmjs.com/package/@specy/mips',
        github: 'https://github.com/Specy/mars',
        id: 'specy-mips',
        color: '#7e4baac8',
    },
    {
        title: '@specy/risc-v',
        description:
            'Assemble, run and debug RISC-V assembly, with step by step execution and full access to registers and memory',
        languages: ['Java', 'TypeScript'],
        registry: 'npm',
        url: 'https://www.npmjs.com/package/@specy/risc-v',
        github: 'https://github.com/Specy/rars',
        id: 'specy-risc-v',
        color: '#7e4baac8',
    },
    {
        title: '@specy/x86',
        description:
            'Assemble, run and debug x86-64 assembly, with step by step execution and full access to registers and memory',
        languages: ['C', 'TypeScript'],
        registry: 'npm',
        url: 'https://www.npmjs.com/package/@specy/x86',
        github: 'https://github.com/Specy/x86-js',
        id: 'specy-x86',
        color: '#7e4baac8',
    },
    {
        title: '@specy/z80',
        description:
            'Assemble, run and debug Z80 assembly, with step by step execution and full access to registers and memory',
        languages: ['TypeScript'],
        registry: 'npm',
        url: 'https://www.npmjs.com/package/@specy/z80',
        github: 'https://github.com/Specy/trs80',
        id: 'specy-z80',
        color: '#7e4baac8',
    },
    {
        title: '@specy/dotlr',
        description:
            'Generate LR(1) and LALR parsers and trace step by step how they parse an input',
        languages: ['Rust', 'TypeScript'],
        registry: 'npm',
        url: 'https://www.npmjs.com/package/@specy/dotlr',
        github: 'https://github.com/Specy/dotlr',
        id: 'specy-dotlr',
        color: '#7e4baac8',
    },
    {
        title: 'microlp',
        description:
            'Solve linear programming problems with real, integer and boolean variables',
        languages: ['Rust'],
        registry: 'crates.io',
        url: 'https://crates.io/crates/microlp',
        github: 'https://github.com/Specy/microlp',
        id: 'microlp',
        color: '#7e4baac8',
    },
    {
        title: 'rooc',
        description:
            'A modeling language to write and solve mixed integer linear optimization models',
        languages: ['Rust'],
        registry: 'crates.io',
        url: 'https://crates.io/crates/rooc',
        github: 'https://github.com/Specy/rooc',
        id: 'rooc-crate',
        color: '#7e4baac8',
    },
] satisfies LibraryData[];

export type AppPageProject = ProjectData & { details: AppDetails };

/** The apps that have their own `/apps/[id]` page, in the order the hub lists them */
const appPageProjects = (projects as ProjectData[]).filter(
    (project): project is AppPageProject => !!project.details,
);

export { projects, desktopProjects, libraries, appPageProjects };
