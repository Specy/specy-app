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

/** A screenshot in the hero gallery, its size given so the frame does not shift */
export type AppScreenshot = {
    /** The full resolution file under /images, the page shows its generated preview */
    src: string;
    alt: string;
    width: number;
    height: number;
    /** A short line shown under the gallery while this screenshot is on screen */
    caption?: string;
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
    /** App introduction, one string per paragraph */
    about: string[];
    /** "Who it's for", one string per item */
    audience: string[];
    features: AppFeature[];
    /**
     * Full screenshots of the app, shown in the hero. The first one is the cover:
     * the gallery opens on it, it sets the frame's aspect ratio and it is the
     * page's share image.
     */
    screenshots: [AppScreenshot, ...AppScreenshot[]];
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
            'Compose and practice songs for Sky: Children of the Light',
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
                'A free browser app for Sky: Children of the Light instruments, with song practice, multitrack song composition, MIDI import and sheet export.',
            tagline:
                'A music player and composer for Sky: Children of the Light.',
            // The gold of the note and the star in the icon. Both music apps share a
            // teal theme color, which goes to Genshin Music, so the two stay apart.
            accent: '#ebd29a',
            about: [
                'Sky Music Nightly is a browser app for playing instruments from Sky: Children of the Light. It uses their in-game key layouts so you can learn how to play them and try it in the game. You can play with a computer keyboard, mouse, touch screen or MIDI keyboard.',
                'It includes a song player, practice modes, a composer with multiple instrument tracks and a rhythm game with a chart editor.',
                'You can install the app for fullscreen and offline use. The interface is available in 12 languages.',
            ],
            audience: [
                'Sky players learning songs for the in-game instruments',
                'Musicians arranging songs for Sky or adapting MIDI files',
                'Players using a computer, phone or MIDI keyboard',
            ],
            features: [
                {
                    title: 'Player and practice mode',
                    description:
                        'Play and record songs in any instrument. With the practice mode you can learn how to play a song, it is an interactive tool that shows you how to play the song and waits for you to copy it correctly.',
                },
                {
                    title: 'Composer',
                    description:
                        'Arrange instruments on separate tracks, adjust their pitch and set effects. Use the easy to use Sky keyboard layout or use the PRO composer for a full music editor.',
                },
                {
                    title: 'MIDI and audio',
                    description:
                        'Import MIDI files to create music sheets using the 15 key layout. Export songs as MIDI, WAV or MP3.',
                },
                {
                    title: 'Rhythm game',
                    description:
                        'Create charts with tap and hold notes in the VSRG composer, or generate charts from songs and play them in the rhythm game.',
                },
                {
                    title: 'Zen keyboard and sheets',
                    description:
                        'Use the zen keyboard to play freely, or view and print song sheets with the sheet visualizer.',
                },
                {
                    title: 'Keybinds and themes',
                    description:
                        'Change key bindings, create or choose a theme, connect a MIDI keyboard.',
                },
            ],
            screenshots: [
                {
                    src: '/images/apps/sky-music/01-practice.webp',
                    alt: "Practice mode playing Through the Fire and Flames, with three keys of the current chord highlighted in red, the next key outlined, and the song's sheet above.",
                    width: 1440,
                    height: 900,
                    caption: 'Practice with highlighted notes',
                },
                {
                    src: '/images/apps/sky-music/02-composer.webp',
                    alt: "The PRO composer with Nature's Crescendo from Stardew Valley open, the Grand Piano track selected and its notes shown in a piano roll alongside the other tracks' notes.",
                    width: 1440,
                    height: 900,
                    caption: 'PRO composer',
                },
                {
                    src: '/images/apps/sky-music/03-vsrg-player.webp',
                    alt: 'The rhythm game player on the Snowy Night theme, with notes falling down six lanes, a 70x combo and an Amazing rating.',
                    width: 1440,
                    height: 900,
                    caption: 'Rhythm game mode',
                },
                {
                    src: '/images/apps/sky-music/04-zen-keyboard.webp',
                    alt: "The zen keyboard's 15 translucent keys float over a blurred, sunlit Sky meadow.",
                    width: 1440,
                    height: 900,
                    caption: 'Zen keyboard, Sky theme',
                },
            ],
            disclaimer:
                'Sky Music Nightly is a fan made app, not affiliated with thatgamecompany.',
        },
    },
    {
        title: 'Genshin Music Nightly',
        description: 'Compose and practice songs for Genshin Impact',
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
                'A free browser app for Genshin Impact instruments, including the Windsong Lyre and Floral Zither, with song practice, multitrack song composition, MIDI import and sheet export.',
            tagline:
                'A music player and composer for Genshin Impact instruments.',
            // The app's theme color, also the lyre strings in its icon
            accent: '#63aea7',
            about: [
                'Genshin Music Nightly is a browser app for playing the Windsong Lyre, Floral Zither, Vintage Lyre and other Genshin Impact instruments. It uses their in-game key layouts so you can learn how to play them and try it in the game. You can play with a computer keyboard, mouse, touch screen or MIDI keyboard.',
                'It includes a song player, practice modes, a composer with multiple instrument tracks and a rhythm game with a chart editor.',
                'You can install the app for fullscreen and offline use, and the interface is available in 12 languages.',
            ],
            audience: [
                'Genshin players learning songs for the lyre, zither and other instruments',
                'Musicians arranging songs for Genshin or adapting MIDI files',
                'Players using a computer, phone or MIDI keyboard',
            ],
            features: [
                {
                    title: 'Player and practice mode',
                    description:
                        'Play and record songs with any instrument. Practice mode is an interactive tool that shows you how to play a song and waits for you to copy it correctly.',
                },
                {
                    title: 'Composer',
                    description:
                        'Arrange instruments on separate tracks, adjust their pitch and set effects. Use the Genshin keyboard layout for easy editing or use the PRO composer for a full music editor.',
                },
                {
                    title: 'MIDI and audio',
                    description:
                        'Import MIDI files to create music sheets using the 21-key layout. Export songs as MIDI, WAV or MP3.',
                },
                {
                    title: 'Rhythm game',
                    description:
                        'Create charts with tap and hold notes in the VSRG composer, or generate charts from songs and play them in the rhythm game.',
                },
                {
                    title: 'Zen keyboard and sheets',
                    description:
                        'Use the zen keyboard to play freely, or view and print song sheets with the sheet visualizer.',
                },
                {
                    title: 'Keybinds and themes',
                    description:
                        'Change key bindings, create or choose a theme, connect a MIDI keyboard.',
                },
            ],
            screenshots: [
                {
                    src: '/images/apps/genshin-music/01-practice.webp',
                    alt: "Practice mode playing Through the Fire and Flames on the lyre, with three red keys and one blue key to press now, teal rings on the next keys, and the song's note sheet above.",
                    width: 1440,
                    height: 900,
                    caption: 'Practice with highlighted notes',
                },
                {
                    src: '/images/apps/genshin-music/02-composer.webp',
                    alt: "The PRO composer with Nature's Crescendo from Stardew Valley, imported from a Sky sheet, with a piano track's notes highlighted among the song's other tracks.",
                    width: 1440,
                    height: 900,
                    caption: 'PRO composer',
                },
                {
                    src: '/images/apps/genshin-music/03-vsrg-player.webp',
                    alt: 'The rhythm game player on the Snowy Night theme, with notes falling down six lanes, a 40x combo and an Amazing rating.',
                    width: 1440,
                    height: 900,
                    caption: 'Rhythm game mode',
                },
                {
                    src: '/images/apps/genshin-music/04-zen-keyboard.webp',
                    alt: 'The 21-key lyre keyboard on an illustrated Liyue landscape at sunset.',
                    width: 1440,
                    height: 900,
                    caption: 'Zen keyboard, Liyue theme',
                },
                {
                    src: '/images/apps/genshin-music/05-approaching-circles.webp',
                    alt: 'Approach mode, with rings closing in on the lyre keys, green hits and 100% accuracy.',
                    width: 1440,
                    height: 900,
                    caption: 'Approaching circles mode',
                },
            ],
            disclaimer:
                'Genshin Music Nightly is a fan made app, not affiliated with HoYoverse.',
        },
    },
    {
        title: 'ASM Editor',
        description:
            'Write and debug M68K, MIPS, RISC-V, x86-64 and Z80 assembly in the browser',
        image: '/images/asmEditor.png',
        url: 'https://asm-editor.specy.app',
        github: 'https://github.com/Specy/asm-editor',
        id: 'asm-editor',
        color: '#7e4baac8',
        category: 'EducationalApplication',
        details: {
            metaTitle: 'ASM Editor - web IDE for learning assembly | Specy',
            metaDescription:
                'A free browser editor and debugger for M68K, MIPS, RISC-V, x86-64 and Z80 assembly, with backwards stepping, courses and exams.',
            tagline:
                'An editor and debugger for M68K, MIPS, RISC-V, x86-64 and Z80 assembly.',
            // The app's theme color, also the A in its icon
            accent: '#f2a65a',
            about: [
                'ASM Editor lets you write and run assembly in the browser. Step through a program one instruction at a time, inspect registers and memory, or step backwards to undo an instruction.',
                'It supports M68K, MIPS, RISC-V, x86-64 and Z80, with instruction references and interactive courses. Teachers can create exams and embed the editor in other websites.',
                'All architectures support terminal input and output. M68K, MIPS, RISC-V and Z80 also support graphics, keyboard input and sound. Mouse input is available on M68K and Z80. M68K, MIPS and RISC-V include a programmable synthesizer, while Z80 includes an AY-3-8910 sound chip.',
                'The project is described in the paper "ASM Editor: Understanding Language Abstractions Through Assembly Programming", presented at the 2026 IEEE Global Engineering Education Conference (EDUCON) in Cairo.',
            ],
            audience: [
                'Students learning computer architecture and assembly',
                'Teachers preparing lessons, exams or embedded exercises',
                'Programmers studying the assembly generated from C and C++',
            ],
            features: [
                {
                    title: 'Step forward and back',
                    description:
                        'Run a program, set breakpoints or step through instructions. Step backwards to inspect the state before an instruction ran.',
                },
                {
                    title: 'Registers, memory and stack',
                    description:
                        'Register and memory views highlight changes alongside previous values. Inspect the call stack and stack frames, with colors marking each frame. View values as hexadecimal, decimal, signed or unsigned.',
                },
                {
                    title: 'Documentation and completion',
                    description:
                        'Completion suggests instructions and valid addressing modes. The instruction reference includes examples, and errors point to the relevant code.',
                },
                {
                    title: 'From C and C++ to assembly',
                    description:
                        'Compile C or C++ to MIPS or 32-bit and 64-bit RISC-V assembly with Clang or GCC, or to x86-64 assembly with GCC. Source mapping shows which instructions came from each line.',
                },
                {
                    title: 'Courses',
                    description:
                        'Start with assembly fundamentals, then follow a course for M68K, MIPS, RISC-V, x86-64 or Z80. Lessons include interactive examples.',
                },
                {
                    title: 'Exams, test cases and embeds',
                    description:
                        'Define test cases with initial registers, memory and expected output. Restrict editor features for exams or embed the editor in your website.',
                },
            ],
            screenshots: [
                {
                    src: '/images/apps/asm-editor/02-c-to-assembly.webp',
                    alt: 'A C program computing gcd and lcm beside the MIPS assembly Clang generated, with three selected C lines and the assembly blocks they became highlighted in matching colors.',
                    width: 1440,
                    height: 900,
                    caption: 'C to assembly mapping',
                },
                {
                    src: '/images/apps/asm-editor/01-pacman-in-c.webp',
                    alt: 'ASM Editor running a Pac-Man game written in C for RISC-V, with the C source, the generated assembly highlighted on the current line, registers, memory and the game screen side by side.',
                    width: 1917,
                    height: 909,
                    caption: 'Pac-Man in C on RISC-V',
                },
                {
                    src: '/images/apps/asm-editor/03-debugger-tools.webp',
                    alt: 'An x86-64 recursive Fibonacci program paused at a breakpoint, with changed registers highlighted and the Stack pointer, History and Call stack panels showing the nested calls.',
                    width: 1440,
                    height: 900,
                    caption: 'Breakpoints and debug tools',
                },
                {
                    src: '/images/apps/asm-editor/04-course-lesson.webp',
                    alt: 'A Z80 course lesson with explanatory text above a playground whose program has drawn a house, a sun and grass on the screen.',
                    width: 1440,
                    height: 900,
                    caption: 'Interactive Z80 lesson',
                },
                {
                    src: '/images/apps/asm-editor/05-instruction-docs.webp',
                    alt: 'The M68K documentation page for the neg instruction, showing its flags, form, operands and an example that has been run, with changed registers highlighted.',
                    width: 1440,
                    height: 900,
                    caption: 'Instruction reference docs',
                },
            ],
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
        description: 'Build LR parsers and inspect how they read an input',
        image: '/images/tokeko.png',
        url: 'https://tokeko.specy.app',
        github: 'https://github.com/Specy/tokeko',
        id: 'tokeko',
        color: '#7e4baac8',
        category: 'EducationalApplication',
        details: {
            metaTitle: 'Tokeko - learn LR(1) and LALR parsers | Specy',
            metaDescription:
                'A free LR(1) and LALR parser visualizer. Write a grammar and inspect its automaton, parsing tables, parse trace and resulting tree.',
            tagline: 'An LR(1) and LALR parser visualizer.',
            // The nodes of the parse tree in the icon
            accent: '#903162',
            about: [
                'Tokeko builds an LR(1) or LALR parser from a grammar you write in the browser. Grammars can include terminals, non-terminals and tokens defined with regular expressions.',
                'You can inspect the FIRST and FOLLOW sets, automaton states and transitions, and ACTION and GOTO tables. Enter an input string to follow the parse one step at a time and see the resulting tree.',
                'The parser generator is dotlr, a Rust library also available on npm as @specy/dotlr.',
            ],
            audience: [
                'Students studying compilers and formal languages',
                'Teachers demonstrating parser construction and execution',
                'Developers testing a grammar against sample input',
            ],
            features: [
                {
                    title: 'LR(1) and LALR parsers',
                    description:
                        'Build either parser from the same grammar and compare the results.',
                },
                {
                    title: 'FIRST and FOLLOW sets',
                    description:
                        'Inspect the FIRST and FOLLOW sets for the symbols in your grammar.',
                },
                {
                    title: 'Automaton',
                    description:
                        'View parser states and transitions in a table or graph.',
                },
                {
                    title: 'ACTION and GOTO tables',
                    description:
                        'Inspect the actions and state transitions the parser uses for each input symbol.',
                },
                {
                    title: 'Parsing steps and parse tree',
                    description:
                        'Follow the state stack, symbol stack and remaining input at each step. Select a step for details, or inspect the final parse tree.',
                },
                {
                    title: 'Editor and TypeScript runner',
                    description:
                        'The grammar editor includes completion and error messages. Run TypeScript code in the app to work with the parser and its output.',
                },
            ],
            screenshots: [
                {
                    src: '/images/apps/tokeko/01-grammar-parse-tree.webp',
                    alt: 'A calculator grammar with precedence and parentheses beside the parse tree for the input (4+2)*3-8/2.',
                    width: 1440,
                    height: 900,
                    caption: 'Grammar to parse tree',
                },
                {
                    src: '/images/apps/tokeko/02-automaton-graph.webp',
                    alt: 'The LR(1) automaton drawn as a graph, with each state box listing its items and arrows labelled by symbols.',
                    width: 1440,
                    height: 900,
                    caption: 'Automaton graph',
                },
                {
                    src: '/images/apps/tokeko/03-first-follow-parsing-table.webp',
                    alt: 'The FIRST and FOLLOW sets for P, E, T and F above the parsing table with its ACTION and GOTO columns.',
                    width: 1440,
                    height: 900,
                    caption: 'FIRST, FOLLOW and ACTION/GOTO',
                },
                {
                    src: '/images/apps/tokeko/04-parse-trace.webp',
                    alt: 'A step-by-step table showing the state stack, symbol stack, remaining input and shift or reduce action at each step.',
                    width: 1440,
                    height: 900,
                    caption: 'Step-by-step parse trace',
                },
                {
                    src: '/images/apps/tokeko/05-typescript-runner.webp',
                    alt: 'A JSON grammar, TypeScript code that turns the parse tree into an object, the parse tree, and the console output.',
                    width: 1440,
                    height: 900,
                    caption: 'Run TypeScript on parses',
                },
            ],
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
        description:
            'Write and solve linear and mixed integer optimization models',
        image: '/images/rooc.png',
        url: 'https://rooc.specy.app',
        github: 'https://github.com/Specy/rooc',
        id: 'rooc',
        color: '#7e4baac8',
        category: 'DeveloperApplication',
        details: {
            metaTitle: 'ROOC - optimization modeling language | Specy',
            metaDescription:
                'A language and browser editor for linear and mixed integer optimization, with HiGHS and microlp solvers and libraries for Rust and TypeScript.',
            tagline:
                'A language and browser editor for linear and mixed integer optimization.',
            // The accent of the app's own theme, the color of its buttons
            accent: '#5256a4',
            about: [
                'In ROOC, you describe an optimization problem with an objective, constraints and variables. The web editor solves the model in your browser using HiGHS or microlp.',
                'Models can include data, sets, graphs and iteration. You can inspect each stage of compilation, see the linear model passed to the solver, and export it in CPLEX LP format.',
                'ROOC is also available as the rooc Rust crate and the @specy/rooc npm package. Both have type safe builders for defining models in code.',
            ],
            audience: [
                'Students studying operations research and combinatorial optimization',
                'People working with linear or mixed integer optimization problems',
                'Developers building optimization models in Rust or TypeScript',
            ],
            features: [
                {
                    title: 'Modeling language',
                    description:
                        'Define objectives and constraints using sums, indexed constraints, boolean logic, abs, min and max.',
                },
                {
                    title: 'Data, sets and graphs',
                    description:
                        'Keep data in the model and iterate over arrays, sets, graph nodes and edges.',
                },
                {
                    title: 'Solvers in the browser',
                    description:
                        'Run HiGHS or microlp in the browser, without a local installation.',
                },
                {
                    title: 'Compilation steps',
                    description:
                        'Inspect the output of each stage, from source code to the linear model sent to the solver.',
                },
                {
                    title: 'CPLEX LP export',
                    description:
                        'Export the linear model in CPLEX LP format for use with other solvers and tools.',
                },
                {
                    title: 'Rust and TypeScript libraries',
                    description:
                        'Define and solve models in code with the type safe builders in rooc and @specy/rooc.',
                },
            ],
            screenshots: [
                {
                    src: '/images/apps/rooc/01-model-editor.webp',
                    alt: 'The ROOC editor showing the diet problem model in syntax-highlighted code, with the solving pipeline from source code to auto solver listed on the right.',
                    width: 1440,
                    height: 900,
                    caption: 'Model and solving pipeline',
                },
                {
                    src: '/images/apps/rooc/02-graph-solution.webp',
                    alt: 'Results of a dominating set model on a 10-node graph, showing the generated linear constraints and the true or false value chosen for each node.',
                    width: 1440,
                    height: 900,
                    caption: 'Graph model, solved',
                },
                {
                    src: '/images/apps/rooc/03-simplex-steps.webp',
                    alt: 'A step-by-step simplex view of the diet problem, with a tableau that highlights the pivot row and column, followed by the optimal value.',
                    width: 1440,
                    height: 900,
                    caption: 'Simplex, step by step',
                },
                {
                    src: '/images/apps/rooc/04-logic-latex.webp',
                    alt: 'A project selection model rendered as LaTeX math, mixing a budget sum with implication, negation and "or" constraints, with an optimal value of 220.',
                    width: 1440,
                    height: 900,
                    caption: 'Logic models as LaTeX',
                },
                {
                    src: '/images/apps/rooc/05-docs.webp',
                    alt: 'The ROOC documentation page on logic models, listing the logic operators and a vertex cover example over a graph.',
                    width: 1440,
                    height: 900,
                    caption: 'Language documentation',
                },
            ],
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
                'My university computer science notes in Italian, covering calculus, physics, databases, networks, AI and data mining. Free to read without an account.',
            tagline:
                'My computer science notes from university, written in Italian.',
            // The accent of the site's own theme, the same as the hub's
            accent: '#a65ee0',
            about: [
                'Learn is where I publish the notes I took while studying computer science. They are in Italian and organized by course and year, covering subjects from first year calculus and physics to databases, networks, artificial intelligence and data mining.',
                'Alongside lecture notes, there are formula sheets, summaries and exam exercises, with equations, diagrams, callouts and code examples.',
            ],
            audience: [
                'Computer science students who read Italian',
                'Readers reviewing these subjects with notes, formula sheets and exam exercises',
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
                        'Read lectures in teaching order, with formula sheets, summaries and exam exercises for each course.',
                },
                {
                    title: 'Equations',
                    description:
                        'Inline and display equations are typeset with KaTeX.',
                },
                {
                    title: 'Diagrams',
                    description:
                        'Diagrams accompany the notes and worked physics problems.',
                },
                {
                    title: 'Search',
                    description: 'Search all notes from any page with Ctrl+K.',
                },
                {
                    title: 'Code and themes',
                    description:
                        'Code blocks have syntax highlighting. Both light and dark themes are available.',
                },
            ],
            screenshots: [
                {
                    src: '/images/apps/learn/01-physics-lecture.webp',
                    alt: 'A dark-theme physics lecture showing an exam problem in a purple-bordered callout, a line diagram of a spring launching a block over a hill and up a slope, and worked equations below.',
                    width: 1440,
                    height: 900,
                    caption: 'Lectures with diagrams and math',
                },
                {
                    src: '/images/apps/learn/02-math-light.webp',
                    alt: 'A light-theme calculus lecture on integration by parts with large typeset integral equations between short explanations.',
                    width: 1440,
                    height: 900,
                    caption: 'Equations in the light theme',
                },
                {
                    src: '/images/apps/learn/03-courses.webp',
                    alt: 'The Informatica degree page listing courses such as Analisi Matematica, Fisica, Basi di Dati and Reti di Calcolatori, each with a short description and a year tag.',
                    width: 1440,
                    height: 900,
                    caption: 'Notes organised by course',
                },
                {
                    src: '/images/apps/learn/04-search.webp',
                    alt: 'The search dialog opened over the Reti di Calcolatori course page, with the query "routing" and a list of matching lectures and sections with the term highlighted.',
                    width: 1440,
                    height: 900,
                    caption: 'Search with Ctrl+K',
                },
                {
                    src: '/images/apps/learn/05-code-light.webp',
                    alt: 'A light-theme database lab page with syntax-highlighted SQL stored procedures, each introduced by a short callout.',
                    width: 1440,
                    height: 900,
                    caption: 'Syntax-highlighted code',
                },
            ],
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
