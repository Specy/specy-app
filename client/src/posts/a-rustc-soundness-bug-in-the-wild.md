---
    datePublished: '2024-11-13'
    title: 'A rustc soundness bug in the wild'
    description: 'How a bug in the rustc compiler drove me to madness for two days'
    tags: ['rust', 'rooc']
    relatedProjects: ['rooc']
---
<script>
    import WaveText from "$cmp/blog/WaveText.svelte";    
</script>


# How it started
I was working on [rooc](https://rooc.specy.app), a modeling language for optimization problems running in the web; 
After months of "just one more feature" I decided to stop adding new things to the language, and instead focus on improving the 
solvers, which so far implemented only a very simple one which I developed.

My goal was to be able to run everything in the browser, so solvers must be able to compile to WebAssembly.

The easiest way to do this is to find pure rust libraries, which would allow me to simply compile the rust code to the wasm target.

After many failed attempts at compiling for wasm, searching through the whole crates.io, I stumbled upon [minilp](https://github.com/ztlpn/minilp), a rust only linear programming library. Perfect! 

But wait... _"The project was archived 2 years ago, last commit 4 years ago"_, oh well, I heard that rust is a stable language, so it should be fine, right?

<WaveText text="Right??" style="font-size: 1.3rem; margin: -1rem 0" />

# Implementation
After discovering the library I immediately added it as a solver to rooc, which was as easy as [adding an adapter](https://github.com/Specy/rooc/blob/main/src/solvers/milp_solver.rs#L66)
that transformed a `LinearModel` into a `minilp::Problem`. 

Let's see how that goes!

> `cargo test`

```
Running tests\solver_tests.rs
running 18 tests
...
test result: ok. 18 passed; 0 failed; 0 measured; 0 filtered out; finished in 0.03s
```
Looks good to me! Let's publish a new version of the library to npm with this newly added solver!

But wait, right, before that I should probably test it in the browser, *just to make sure*.
```
Uncaught (in promise) RuntimeError: unreachable
    at __rust_start_panic (http://127.0.0.1:8080/wasm_bg.wasm:wasm-function[346]:0x274ec)
    at rust_panic (http://127.0.0.1:8080/wasm_bg.wasm:wasm-function[254]:0x26d0b)
    ...
```
Huh? A panic? Oh well, I guess even this library does not work on the web...

Being a bit discouraged, I kept searching on crates.io for alternatives, but sadly found none. 

My only chance was getting minilp to work, it seemed like there were no weird dependencies, no usage of OS specific things, so it _should_ have worked on the web.

# Debugging begins

Maybe it's a web only problem? WASM stack traces are a bit... cryptic, you don't really know where or what happened, as it completely strips away any kind of debug information to keep bundle sizes small.
But let's try using [wasm2map](https://github.com/mtolmacs/wasm2map) to add debug map information to the wasm file, and see if we can get a better stack trace.

```
called `Option::unwrap()` on a `None` value
stack backtrace:
   ...
   3: core::option::unwrap_failed
   4: microlp::order_simple
   5: microlp::main
```
Ah ok, it's just a simple unwrap on a None value, I probably messed up somewhere in the adapter code. 
Let me create a new test using the same model that had issues, so I don't have a regression in the future.

> `cargo test`

```
Running tests\solver_tests.rs
running 19 tests
...
test result: ok. 19 passed; 0 failed; 0 measured; 0 filtered out; finished in 0.03s
```
What??? The test passed? 
<WaveText text="How??" style="font-size: 1.3rem; margin: -1rem 0" /> 

I just had this panic on me a *few seconds ago*?

Ah whatever, let's go to the issues page of the minilp repository, maybe someone else had this issue before.

[One random issue](https://github.com/ztlpn/minilp/issues/6) shows another panic at runtime, so I guess the library doesn't guarantee the lack of panics,
and it being archived, I should probably just fork it and fix it myself.

Let's look at the `minilp::order_simple` function and see what's going on there.

```rust
pub fn order_simple<'a>(size: usize, get_col: impl Fn(usize) -> &'a [usize]) -> Perm {
    let mut cols_queue = ColsQueue::new(size);
    //some code...
    let mut new2orig = Vec::with_capacity(size);
    while new2orig.len() < size {
        let min = cols_queue.pop_min();
        println!("min {:?}", min);
        new2orig.push(min.unwrap());
    }
    //other code...
}
```
It seems correct? `cols_queue` is initialized with `size` so it should never be out of elements to pop, is there something else
that is modifying the `cols_queue`?

I put a breakpoint in the `while` loop to see what's going on, and... *it did not panic*?

Ok this is starting to get weird, let's look more in depth at the `fn pop_min(&mut self) -> Option<usize>` function, 
it is returning a `None` value, so let's put some debug prints to see:
```rust
fn pop_min(&mut self) -> Option<usize> {
    let col = loop {
        if self.min_score >= self.score2head.len() {
            println!("None on min_score: {}", self.min_score);
            return None;
        }
        if let Some(col) = self.score2head[self.min_score] {
            break col;
        }
        self.min_score += 1;
    };
    self.remove(col, self.min_score);
    Some(col)
}
```
> `cargo run`

```bash
min: Some(1)
min: Some(2)
min: Some(3)
called `Option::unwrap()` on a `None` value
```
Ok good, at least the bug happens now? *I guess?* But where is the `None on min_score: {}` print that I put in the *only* place where `None` is returned?

Let's add more prints!

<video src=https://github.com/user-attachments/assets/2631f7bf-4363-4305-8950-03b94b018d61 style="width: 100%; border-radius: 0.5rem" controls></video>

*Yeeeeeeah*, no, this cannot be sound, there must be something wrong somewhere, I did see an [unsafe](https://github.com/ztlpn/minilp/blob/master/src/helpers.rs#L26)
in the library, so maybe some memory corruption is happening?

Running miri did not show any issues, but going step by step with my debugger did show an illegal memory access, so definitely something is wrong with the library.

I also noticed that the bug happens *only* when running in release mode, so that does narrow down the issue a bit.

Just to be sure I ran the same code in debug mode but disabling all debug checks like bound checking and overflow checking, but the bug
did not reproduce. I managed to narrow it down to `opt-level = 1` causing the panic.

I try to remove all `unsafe` usage everywhere in the library to make sure that's not the issue. But the panic is still there.

Hm, the only dependency of the crate is `sprs` which has *a ton* of unsafe code, let's file [an issue](https://github.com/sparsemat/sprs/issues/370#issuecomment-2446583795) to see if i'm breaking some invariants.

> It is not clear it is a bug in sprs, try the following:
> ```rust
> order_simple(4, |c| {
>        match c {
>            0 => &[0, 1, 2, 3],
>            1 => &[2],
>            2 => &[0, 1],
>            3 => &[1, 2, 3],
>            _ => unreachable!(),
>        }
>    });
> ```

Which... still panics? *Ok, ok, ok*, let's recap:

- The bug happens only in release mode
- There is no unsafe code anywhere in the library
- Miri does not report any issues
- There are no dependencies which might cause issues
- There is only 100% plain safe rust code

So how can it be panicking? Isn't the whole purpose of rust to not have this kind of issues if you are not using unsafe code?

# The bug report 

I decided to make sure I wasn't making any silly mistakes and tried to build a [minimal reproduction](https://play.rust-lang.org/?version=nightly&mode=debug&edition=2021&gist=0b00575c9057e816cddce89d00a0d856) using no dependencies or unsafe code:
```rust
fn main() {
    order_simple(4, |c| {
        match c {
            0 => &[0, 1, 2, 3],
            1 => &[2],
            2 => &[0, 1],
            3 => &[1, 2, 3],
            _ => unreachable!(),
        }
    });
    println!("All ok! Try running in release mode")
}
```
> `cargo run`

```
All ok! Try running in release mode
```
> `cargo run --release`

```bash
thread 'main' panicked at 'called `Option::unwrap()` on a `None` value'
```
Yup. Checks out. Time to file a [bug report](https://github.com/rust-lang/rust/issues/132353) to the rustc repository!

# The fix
After a few minutes the bug was minimized to just:
```rust
fn pop_min(mut score2head: Vec<Option<usize>>) -> Option<usize> {
    loop {
        if let Some(col) = score2head[0] {
            score2head[0] = None;
            return Some(col);
        }
    }
}
```
which turns out to have been an unsound mir optimization in the rustc compiler, affecting rust nightly versions 1.83.0 and 1.84.0. 
The issue was given a `P-critical` priority, the bugged code fixed in a few days, and released a week later.

# Conclusion
After the bug was resolved I managed to publish the new version of the [rooc library](https://github.com/specy/rooc) which *now does* 
work in the browser, also forked the [minilp](https://github.com/Specy/microlp) crate to fix some bugs and add some new features.

I'm by no means a rust expert, nor a good low-level programmer, i'm just a frontender after all! But this experience taught
me a ton about debugging so I wanted to share the thought process going through this bug.
