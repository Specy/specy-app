export type ProjectData = {
    title: string;
    description: string;
    image: string;
    url: string;
    github: string;
    id: string;
    color: string;
    hidden?: boolean;
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
    },
    {
        title: 'Genshin music Nightly',
        description: 'A website to compose and practice music for genshin',
        image: '/images/genshinMusicNightly.png',
        url: 'https://genshin-music.specy.app',
        github: 'https://github.com/Specy/genshin-music',
        id: 'genshin-music',
        color: '#7e4baac8',
    },
    {
        title: 'ASM Editor',
        description:
            'An IDE for assembly in the web. With M68K, MIPS, RISC-V and x86 support',
        image: '/images/asmEditor.png',
        url: 'https://asm-editor.specy.app',
        github: 'https://github.com/Specy/asm-editor',
        id: 'asm-editor',
        color: '#7e4baac8',
    },
    {
        title: 'Tokeko',
        description: 'Interactive LR parsers visualization to learn compilers',
        image: '/images/tokeko.png',
        url: 'https://tokeko.specy.app',
        github: 'https://github.com/Specy/tokeko',
        id: 'tokeko',
        color: '#7e4baac8',
    },
    {
        title: 'Rooc',
        description: 'Modeling language to solve MILP problems in the browser',
        image: '/images/rooc.png',
        url: 'https://rooc.specy.app',
        github: 'https://github.com/Specy/rooc',
        id: 'rooc',
        color: '#7e4baac8',
    },
    {
        title: 'Learn',
        description:
            'Notes for computer science courses: analysis, physics, databases, networks, AI and more',
        image: '/images/logo.png',
        url: 'https://learn.specy.app',
        github: 'https://github.com/Specy/notes',
        id: 'learn',
        color: '#7e4baac8',
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

export { projects, desktopProjects, libraries };
