export type ProjectData = {
    title: string;
    description: string;
    image: string;
    url: string;
    github: string;
    color: string;
}
const projects = [
    {
        "title": "Sky Music Nightly",
        "description": "Website to compose and practice music for sky children of the light",
        "image": "/images/skyMusicNightly.png",
        "url": "https://sky-music.specy.app",
        "github": "c",
        "color": "rgb(186, 167, 128)"
    },
    {
        "title": "Genshin music Nightly",
        "description": "A website to compose and practice music for genshin",
        "image": "/images/genshinMusicNightly.png",
        "url": "https://genshin-music.specy.app",
        "github": "",
        "color": "rgb(85, 143, 144)"
    },{
        "title": "ASM Editor",
        "description": "An editor and interpreter for M68K assembly",
        "image": "images/asmEditor.png",
        "url": "https://asm-editor.specy.app",
        "github": "",
        "color": "#f2a65a"
    },{
        "title": "Tokeko",
        "description": "Interactive LR parsers visualization to learn compilers",
        "image": "images/tokeko.png",
        "url": "https://tokeko.specy.app",
        "github": "",
        "color": "rgb(100 78 117)"
    },
    {
        "title": "Soundboard",
        "description": "An app to create soundboards that you can share",
        "image": "images/logo.png",
        "url": "https://soundboard.specy.app",
        "github": "",
        "color": "#243B4A"
    },
    {
        "title": "Conway generator",
        "description": "An app to create backgrounds with Conway's game of life",
        "image": "images/logo.png",
        "url": "https://conway-generator.specy.app",
        "github": "",
        "color": "#243B4A"
    },
    {
        "title": "Portfolio",
        "description": "My portfolio website where i list what i made",
        "image": "images/logo.png",
        "url": "https://portfolio.specy.app",
        "github": "",
        "color": "rgb(219, 0, 97)"
    },
] satisfies ProjectData[]

const desktopProjects = [
    {
        "title": "Scapix",
        "description": "A desktop app to upscale and denoise images, gifs and videos",
        "image": "images/scapix.png",
        "url": "https://github.com/Specy/Scapix",
        "github": "",
        "color": "#f2a65a"
    }
] satisfies ProjectData[]


export { 
    projects,
    desktopProjects
 }