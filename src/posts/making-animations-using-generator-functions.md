---
    datePublished: '2025-12-12'
    title: 'Making animations using generator functions'
    description: 'Learn generator functions, the `using` keyword and Symbols in JavaScript by making a very simple animation library'
    tags: ['typescript', 'web-dev']
    relatedProjects: []
---
<script>
    import Monaco from "$cmp/blog/BlogMonaco.svelte"
    import WaveText from "$cmp/blog/WaveText.svelte"
</script>

Have you ever seen one of those really pretty videos on YouTube with fancy visuals to show programming and mathematics concepts? Chances are they were made using [Manim](https://www.manim.community/) or a more recent alternative called [Motion Canvas](https://motioncanvas.io/).

I've always been fascinated by how easy it was to understand concepts through visuals, so I wanted to learn how to do them myself!

I'm a huge [3 Blue 1 Brown](https://www.youtube.com/@3blue1brown) fan, so the first thing I've done was look at Manim, but I immediately learned that it uses Python, which (unpopular opinion) I don't really like using. 

Luckily I'm also a huge [aarthificial](https://www.youtube.com/@aarthificial) fan! (I'm starting to see a pattern), so I went on the [Motion Canvas](https://motioncanvas.io/) website to understand how to use it to make my own animations.

## Motion Canvas

It's a JavaScript editor and library to create videos *procedurally* using:

<WaveText text="Generator functions" style="font-size: 1.3rem; margin: -1rem 0"  />

Fancy right? Just look at this:

```js
yield* circle().scale(2, 0.3);
yield* all(
  circle().scale(1, 0.3),
  circle().position.y(200, 0.3),
);
yield* circle().fill('green', 0.3);
```

But the first time I saw this code I thought "I have no idea what any of this means!" and that's because generator functions are not that common in the JavaScript world, but they are really cool and really powerful.

We are now going to learn what generator functions are by creating our own very simple Motion Canvas. If you want to learn more about making proper procedural animations, look at this [video](https://www.youtube.com/watch?v=WTUafAwrunE).

# Generator functions 

At a high level, you can think of generator functions as functions that can "return" multiple times (we say that they *yield* values). More concretely, using the generator function syntax, we declare a [Generator Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/GeneratorFunction) that, when called, returns a [Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator). 

Generators also implement the [Iterable protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterator_protocol), which is what you use in `for...of` loops.

An iterable is just an object that has a `next()` function that returns a `{ done: boolean, value: T }`. 

Another cool detail of generator functions is that they are *lazily loaded*, as in, they don't actually execute until you call the `.next()` function.

JavaScript gives us some syntactic sugar both for defining a function and for yielding a value, which makes using generator functions really easy:

```ts
function* range(start, end){
    for(let i = start; i < end; i++){
        yield i;
    }
}

for(const v of range(0, 10)){
    console.log(v)
}
```
You use the `function*` syntax to mark the function as being a generator, then inside of the body of the generator you can do three things, `yield` a value, `return` from the function, or `yield*` to delegate the generation to **another generator**.

Let's look at all 3 of them at the same time:

```ts
function* subGenerator() {
  yield 'A';
  yield 'B';
}

function* mainGenerator() {
  // 1. yield a value
  yield 1; 
  
  // 2. yield* to delegate to another generator
  yield* subGenerator(); 
  
  yield 2;

  // 3. return from the function (ends the generator)
  return 'finish'; 
}

const gen = mainGenerator();

console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 'A', done: false }
console.log(gen.next()); // { value: 'B', done: false }
console.log(gen.next()); // { value: 2, done: false }

// Careful! in iterators when `done === true` the value
// is discarded and not returned
console.log(gen.next()); // { value: 'finish', done: true }
```

One insanely cool detail about generator functions is that when the code reaches a `yield`, the value is yielded but then execution is **stopped** until `.next()` is called again. This allows us to build *resumable* code, which will come very handy soon.

# The intersection between generator functions and animations

When we create an animation we have objects in a "screen" that move, transform themselves, get added, removed, etc. But they do it while transitioning from one state to the other (for example, a square moving from the left to the right). 

Let's take as an example a square moving from `left: 0px` to `right: 60px`. We want the animation to last 1 second (at 60fps). What we would like to do is start from the initial state of `left: 0px` and then do a step (yield) every `16ms` while moving the square to the right by 1px, and do this for a total of 60 times (1 second because we are at 60fps).

This concept of interpolation is called **tweening**, and we can build it using generator functions!

## Tweening generator function

A tweening function takes as input an initial and final state, how many steps it should take, and an easing function (like `linear`, `ease-in`, `ease-out`, etc.):

```js
function* tween(from, to, duration, easingFn) {
  for (let i = 0; i <= duration; i++) {
    const progress = easingFn(i / duration);
    const newState = {};

    for (const key in from) {
      const start = from[key];
      const end = to[key];
      newState[key] = start + (end - start) * progress;
    }

    yield newState;
  }
}

function linear(from, to, duration){
    return tween(from, to, duration, (t) => t)
}

const tweenToTheRight = linear({ left: 0 }, { left: 60 }, 60)
for(const v of tweenToTheRight){
    console.log(v.left) //0, 1, 2, 3...
}
```

Now that we have the code to tween be<span style="color: var(--accent)">tween</span> two states, we just need to apply this style to an HTML element to animate it!

```js
const wait1Fps = () => new Promise(res => setTimeout(res, 16))

const el = document.createElement('div')
el.style = 'position: fixed; width: 50px; height: 50px; background: red;'
document.body.appendChild(el)

for(const v of linear({ left: 0 }, { left: 60 }, 60)){
    await wait1Fps()
    el.style.left = `${v.left}px`
}

el.remove()
```

## Making it more complete

Let's start building a small animation library! As you saw from the example before we need a few components:

- **View**: Which is the element where we "render" things into (in our previous example it was the body element). We want to be able to add and remove elements from the view.
- **Elements**: They are the individual elements that we add to the view and that we want to animate. We want to be able to create them, and transition their style.
- **Tweening**: The function that allows us to tween from initial to final state
- And a few other utilities which we will see afterwards

Here are some interfaces that we could implement: 

```ts
export interface View {
  element: HTMLElement;
  add(toAdd: ViewElement): void;
  remove(toRemove: ViewElement): void;
}
  
export interface ViewElement {
  element: HTMLElement;
  style: (style: string) => void;
  to: (
    style: Partial<NumericProps>,
    duration: number,
    easing?: ((t: number) => number),
  ) => Generator;
}
```

And let's now implement them!

```ts
function view(style?: string) {
  const el = document.createElement('div')
  if(style) el.style = style

  return {
    element: el,
    add(e: ViewElement) {
      el.appendChild(e.element);
    },
    remove(e: ViewElement) {
      el.removeChild(e.element);
    },
  };
}

function el(view: View, style?: string): ViewElement {
  const element = document.createElement("div");
  if (style) element.style = style

  const viewElement = {
    element,
    style: (p: string) => {
        element.style = p;
    },
    to: function* (
      target: Partial<NumericProps>,
      duration: number,
      easing: ((t: number) => number) = ((v) => v),
    ) {
      const initial = numberOnly(window.getComputedStyle(element), target);

      const tweenGen = tween(initial, target, duration, easing);
      for (const state of tweenGen) {
        Object.assign(element.style, toCssValue(state));
        yield state;
      }
    },
  };

  view.add(viewElement);

  return viewElement;
}
```
You can ignore the `numberOnly` and `toCssValue` functions, they are the annoying parts to convert from CSS to numbers and the other way around.

With this boilerplate done, we have a standard way to make animations. Let's pretend we have an `animation` function available. To play it, we simply do:

```ts
for(const el of animation()){
    await wait1Fps()
}
```

Let's now make a very simple animation!

<iframe style="width: 100%; height: 17.5rem; border-radius: 0.8rem" src="https://gen-animation.pages.dev/?code=E4UwLgrsB2AEBmFoGMwEsD20BUsCG0aAtnulgBQBuaIA7gJSwDeAULLMlgM5ixcCOEPKFgBeWCAA2VGrQA0zNu1i00AEzAALAFywARAFYADAAcAHnrlL2mkGgDmmsLsOmLV5bABGeZAGt7YAwkNQBhDEkMYF0AclA1GI9lEwwuNDJoFzwvLgiIMBBLJQBfegBuFiUATxpJNVwBIVAAOjAMciZYSRB4Z1gANiNYYoVB8ura%2Br5BYRBW9s7u3t0hkYGjceKgA"></iframe>

But what if we want to animate more than one element at a time? This is where the magic of generator functions really shines. Since they are *resumable*, we can create all sorts of utility functions to make animations easier to build.


## Multiple elements at the same time

This allows us to animate multiple elements at once:

```ts
export function* all(...gens: Generator[]) {
  while (true) {
    const results = gens.map((g) => g.next());
    if (results.every((r) => r.done)) {
      return;
    }
    yield results.map((r) => r.value);
  }
}
```

## Loop an animation

Using `yield*`, we can delegate to the animation generator and replay it multiple times. We pass a function that returns a generator because we want to be able to "rebuild" it as many times as needed:


```ts
export function* loop(
  times: number,
  generatorFactory: () => Generator,
) {
  for (let i = 0; i < times; i++) {
    yield* generatorFactory();
  }
}
```

## Delay

Or we can delay for a few frames!

```ts
export function* delay(frames: number){
  for (let i = 0; i < frames; i++) {
    yield;
  }
}
```

---

With this we can make animations procedural, as in, make functions that return animated elements:

<iframe style="width: 100%; height: 25rem; border-radius: 0.8rem" 
src="https://gen-animation.pages.dev/?code=E4UwLgrsB2AEBmFoGMwEsD20BUsCG0aAtnulgBQBuaIA7gJSwDeAULLAJ40A2AJrnm7dybdvkIkwIAMoBHCHlBUatADSwArAAZ1ARi07YAclC8j9VaPYFipGfMUhldPdr0H1RgEbcIIc5Zi4rZScgpK1C6wAExusPqGRgDmoCDQAaL0ANwsolwgfLi8BXgc5NFa2Xk8-LDcGBgADuXq5IwAvAB8wZL24U6RavFxCZ4cBfW05lUAvrmIKGQ4PXZhjs5D3CDwYOpgTerIGPXAjKzsR9AAzmCwVw6gsO2wBRvq52K0aLxgABYAXLAAETaRoADyBgTEvxAaCSvzAgJBWnBkKssC8eGQAGsUhgkLwAMLHDDAQFHE5Q9iNDBXNBLJF4LxXY4QKRooJbHaAgAGABImFywDNwTyqbB9o1eQLJSKwWLRDMqtUCrV7v0AHT7chMOrbRF6nawADU8Q8EoOsGAGDAdkBugAHFpYDN1ABmSo5dj5Qp3B4gLUYHWG3YWxrqa22qSAt0ANmdrtgHtmLCAA"
></iframe>

But we can notice that when a generator finishes executing, the element does not get removed from the view.

## `Using` generators

This is another really cool feature in JavaScript that I wanted to experiment with: the [**using** statement](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/using).

What it allows us to do is define an object as being **Disposable**, meaning an object that has a cleanup function with the key `Symbol.dispose`.

If you don't know what [Symbols](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol) are, you could see them as "values" that are *guaranteed to be unique*. The only way that `a === b` is true is if both `a` and `b` are the same reference to the Symbol. 

You can create a new symbol like this:

```ts 
const tag = Symbol("my_symbol")

console.log(Symbol("my_symbol") === Symbol("my_symbol")) // false

console.log(tag === tag) // true
```

JavaScript also provides a few built-in Symbols that are used internally by the JavaScript engine. 

One that we just implicitly used is `Symbol.iterator`, which is used internally by the `for...of` statement.

Once we have an object that is `Disposable`, we can use it with the `using` statement.

What the `using` statement does is *cleanup* at the end of the execution of the function. In more technical terms, the function located at the `Symbol.dispose` key is called when the object goes out of scope.

It is very similar to doing:
```ts
function test(){
    const myObj = MyObject()
    try{
        someCode(myObj)
        /*...*/
    } finally {
        myObj.dispose()
    }
}
```
And we implement and use it this way:
```ts
function MyObject(){
    return {
        [Symbol.dispose]: () => {
            console.log('disposed')
        }
    }
}

function test2(){
    using myObj = MyObject()
    someCode(myObj)
    /*...*/
}
```

In our animation library, we would like to remove the element from the view once the function finishes executing. To do that, we can implement `Disposable` and let JavaScript handle it for us! Let's edit the `el` function by adding:


```ts
function el(view: View, style?: string): ViewElement {
  const element = document.createElement("div");
  if (style) element.style = style
  const viewElement = {
    /*...*/
    [Symbol.dispose]() {
      view.remove(element);
      element.remove();
    },
  };

  view.add(viewElement);

  return viewElement;
}
```

And in our animation we just need to replace `const` with `using` and that's it!

(if you are on Safari, `using` is not available yet so the animation wont work)


<iframe style="width: 100%; height: 25rem; border-radius: 0.8rem; margin-bottom: 1rem" 
src="https://gen-animation.pages.dev/?code=E4UwLgrsB2AEBmFoGMwEsD20BUsCG0aAtnulgBQBuaIA7gJSwDeAULLAJ40A2AJrnm7dybdvkIkwIAMoBHCHlBUatADSwArAAZ1ARi07YAclC8j9VaPYFipGfMUhldPdr0H1RgEbcIIc5Zi4rZScgpK1C6wAExusPqGRgDmoCDQAaL0ANwsolwgfLi8BXgc5NFa2Xk8-LDcGBgADuXq5IwAvAB8wZL24U6RavFxCZ4cBfW05lUAvrmIKGQ4PXZhjs5D3CDwYOpgTerIGPXAjKzsEADOaNBJsJcOoLDtsAUb6uditGi8YAAWAC5YAAibSNAAewMCYj%2BIDQST%2BYCBoK0EKhVlgXjwyAA1ikMEheABhY4YYBAo4naHsRoYa5LZF4LyXY4QKTooJbHZAgAGABImFywDMITzqbB9o1eQLJSLwWLRDMqtUCrUHv0AHT7chMOrbJF6nawADU8Q8EoOsGAGDAdiBugAHFpYDN1ABmSo5dj5Qr3R4gLUYHWG3YWxrqa22qRAt0ANmdrtgHtmLCAA"> </iframe>


## Recording animations to a video

Since our animation is resumable (we can step through it), we can also do other things between one frame and the other. 

For example, we can capture the current frame and add it as a frame to a video. This way we can **record** the animation and download it!

For simplicity, we used HTML elements which are a bit tricky to convert to an image. Luckily, there are tools like [html2canvas](https://github.com/yorickshan/html2canvas-pro) that allow us to do that. 

If we were building a proper animation library, we'd use something like [pixi.js](https://pixijs.com/) or other 2d rendering libraries.

# The end

I hope this post helped you understand how generators, `using`, and symbols work! If you want to create your own animations, you can try the [animation editor](https://gen-animation.pages.dev/) or look at the complete source code [here](https://github.com/Specy/gen-animation).


<iframe style="width: 100%; height: 20rem; border-radius: 0.8rem"
src="https://gen-animation.pages.dev/?autoplay=true&code=E4UwLgrsB2AEBmFoGMwEsD20BUsC2AhmtAILRqHpYAUAbmiAO4CUsA3gFCyzJYDOYBGlCMMwANZ8AwhiSCAvLACMABgDcXHv0G8ANmL6xFAbQDkoACamANLFPIAngWg27uiiFemHIXfsZehADmINBgBF5iziFejAAWaGCeALoa3PFouiCw1GDAECCsnNzcvNACsOF8kkawxqma3PBiOVmCaLXqsB0APEIiYpIycmrdANRjRY0lZRXAzhYYeAAatQCsKrBjsACyBGBxAHTz0It41Ky4AGwqXdOl2rAnZwCatQBM75vbewfHC0sLrBcAAOO73LTlQTPJYyfTAWp6AzGX5HeD6MTUVH-U6Ay5aeF8Q5ZaBBA7MBoQqqSQ4ABwgfDi1HgwiYgzoDEYthhK25ALwLz5uLwcLEzGYaRKAF9pg4GLoLLg%2BCAAI4FFAgahKNa2Q566l8CWaGUyjiIFBUHD9NkSDlMWwCAjAMDLB3hZ2Cgli9iaWaCdFoIJxMAACRAgeDtSUX1GAHpY7AAEogCwQZApyrzWi%2BWAWNCOjUIFp8Qh%2BEAI5DOWgEPgcTTFEoM4hBJ4YZDicC1Xx2rk%2BkolRhoCwHABcsAARFdaQAPce2OLhoNgMfj7UzuewABGBHbQWAslOouAY6RwGsENpGD4iUw0BXBE3fAwuggSQ3WXgy9gAAMACRsR1nWWKUZ2-WwwAwWkxz-AD3TAF4QOnMCIU3MQLHLRMCDzBkVwAFnXaYpSNft41gAAxXQHFgCBaUqDBKgXWAQGnWl9GvLBYEvYgwFleVFVbdtwEOCDqDYOioNgQD4NgABaBB3CXMMI0EKVbAAZhUWxTBAGsQAAeVfUxiNgKVYDrB4oR4VZFCk5ZJT9Hg3hsuC3jkgNFMXYNJU0UiAAUnXQZAskMPICGzXRWwgINKNgG4ZLBGdbBZMB0FJWBBwOYgGOyNSvhnSEBHmbja24OVfH4gg-GoaZaQCtAgs1eh7Ss2xkE9GSblsDrNK9YBmFsGq6oantWtdRzbB6%2BKetPfqSkG516qyEaWvG2LJs63rZrM-taoW4amt7ZAxrarqwQm1rnzFWxuHmwKloO0bWs9M7YGmy6%2Buum6dqG%2B7OUe1butsDaZuu27Fsav6VpO17bBekH%2BzB-bIaOp6gZ64H3q27bYCNU1zVQW9cF2u6Iea6dbAcWwLHJ3NKc2vtqOvNLaMUbsHoZ9Ih1HCcp1nedPK-Sd11sbdd33JALCPE93vPHarxvLB70fZ9XxAd8QE-aD-2nRCwPErW2AcXWRbQjCsLQHCJw2ABScdjWMzQyoVInhIwUTYA-L9py2XMaYgiSqO2Cw6cgndEgcMdNlU2BcJ67TdIMsAjI0KUgA">