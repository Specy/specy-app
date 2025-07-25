---
    datePublished: '2025-07-25'
    title: 'Learn and teach assembly with asm-editor'
    description: "A website to teach and learn assembly, with an IDE, courses and exams, all in one app."
    tags: ['assembly']
    relatedProjects: ['asm-editor']
---

<a href="https://asm-editor.specy.app" style="cursor: pointer;" target="_blank">

![asm-editor](/images/blog/asm-editor/asm-editor.webp)

</a>

# Introduction

[Asm-editor](https://asm-editor.specy.app) is a website built to make assembly easier to learn by providing an IDE that runs directly on the web, where you can manage your projects, run and debug them easily.

It supports different assembly languages, currently M68K, MIPS, RISC-V, and X86, with more coming in the future. 

It also allows professors and teachers to create their own interactive assembly courses, together with the possibility to make exams directly on the web, reducing the time needed to correct and grade student's work. [GitHub repository](https://github.com/Specy/asm-editor).

# Features (for learners)

![Asm editor features](/images/blog/asm-editor/asm-editor-features-1.webp)

The IDE has a lot of assembly specific features and learning tools:


- (1, 2, 3) **Code completion, syntax highlighting, and documentation**: When you code, you will receive suggestions for instructions, directives, and the correct addressing modes for each instruction, along with documentation that explains what each instruction does. There is also a more detailed, interactive documentation that provides in-depth information about all features of each assembly language.
- (4) **Useful compiler errors**: When writing and compiling code, if there are errors, the compiler/assembler will provide helpful error messages pointing exactly at the problem so that it can be more easily understood.
- (5) **Share code, settings, documentation**: You can share the project you are working on so that other people can instantly edit and run it on their device. There are also settings that you can change for both the editor and the assemblers for each language, or read the documentation for the language you are working on.

![Asm editor features](/images/blog/asm-editor/asm-editor-features-2.webp)

- (1) **Step, execution, and breakpoints**: You can run the whole code to completion, execute step by step, but most importantly, **Undo**, one of the most important features while learning, which allows you to step back through the execution to more easily figure out what each instruction did at a specific moment. 
- (2, 4) **Function tracking and recursion tools**: Whenever a function (procedure or subroutine) is called, the function call will be tracked, and the function call frame will be shown in memory to make it easier to debug recursion.
- (3, 5, 6) **Step information**: Each time you run or step through the program, all modifications that happened will be shown, such as which registers or memory values were changed. You can also view what the value at the previous step was and convert numbers from hex to signed and unsigned decimal.
- **Test cases**: Other than writing code, you can also specify test cases to check the correctness of the program. You can write the starting register and memory values, along with I/O and the expected output.
- **And much more**...

# Embed the IDE

If you have an assembly course on your website (or want to create one), you can [create an embedded IDE](https://asm-editor.specy.app/embed) that allows you to run assembly code directly on your website through an iframe. This way you can teach assembly in a more interactive way.

# Create exams 
If you work in a school or university, you can [create exams](https://asm-editor.specy.app/exam), which will "lock" the editor and, together with other restrictions and features, help prevent cheating. If you add test cases, the exam can be instantly verified for correctness, making it easier to grade what the student created.

# Assembly Courses

For more interactive courses, you can write lectures directly in the website by contributing your course to the [GitHub repository](https://github.com/Specy/asm-editor).

# Learn Assembly

If you want to learn assembly, I made an [introductory course](https://asm-editor.specy.app/learn/courses/assembly-basics) covering all assembly languages, which gives you all the terminology and concepts that you need to know to dive deeper into learning assembly.