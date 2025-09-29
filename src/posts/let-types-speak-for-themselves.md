---
    datePublished: '2025-09-28'
    title: 'Let your types speak for themselves'
    description: 'How to write TypeScript so that the shape of your code encodes the correctness of your program'
    tags: ['typescript', 'web-dev', 'rust']
    relatedProjects: []
---
<script>
    import Monaco from "$cmp/blog/BlogMonaco.svelte"
    import WaveText from "$cmp/blog/WaveText.svelte"
</script>


Don't you worry, this won't be a Rust shill post. It will be about the incredibly good type inference in TypeScript and how to use it to write better, more robust code.

# Introduction

I've been a frontend developer for years, doing all sorts of crazy apps and integrations using TypeScript. I was comfortable with my stack, making anything that I could ever need with TypeScript + HTML + CSS.

I initially thought that I did not need to learn any other languages, as those were versatile enough to do anything that came to mind.

Being the curious person that I am, wanting to always experiment with niche and not widely used technologies, I decided to go completely against what my environment pushed me to learn (C++, Java, C#, etc.) and decided to learn a new language, but it had to be something different enough from what I already knew. 

I felt like I knew everything there was to know about TypeScript; I could code anything however I wanted with it. But boy, was I wrong.

I considered many languages, each of them with very different approaches to programming:

- [Haskell](https://www.haskell.org/): Fully functional and incredibly opinionated, but I did not feel like pushing myself *that much further* from what I know. I could also not find any projects I could do that would allow me to learn the language properly
- [OCaml](https://ocaml.org/): A little bit better than Haskell for me. I'm still considering picking it up, but this has the same issue of being a somewhat niche language for niche use cases
- [Rust](https://rust-lang.org/): This felt different and similar enough. And since it could compile to WASM, it allows me to use it wherever I can use JavaScript, so pretty much everywhere.

After thinking about it for a few days, I decided to go with Rust to code [an assembly interpreter](https://github.com/Specy/s68k) for my [assembly editor app](https://asm-editor.specy.app/) since I really liked the idea of the [match](https://doc.rust-lang.org/rust-by-example/flow_control/match.html) statement and the strictness of the language.


# Rust types ✨flow✨

One thing that I really liked about Rust is its type inference.

In TypeScript you might think of generics and not having to write `const a: SomeType = ...`, but in Rust, type inference shapes what code is run depending on your target type.

The way it works there is by using [traits](https://doc.rust-lang.org/book/ch10-02-traits.html). It's a way to tell the compiler "This type has this trait (something it can do)". It is similar to interfaces in OOP, but with the difference that by using type inference, you never have to define what concrete type you want a variable/constant to contain (well, sometimes you do, looking at you [turbo fish](https://doc.rust-lang.org/reference/glossary.html?highlight=turbo#turbofish)). But the way your code *flows*, as in where that value is used, decides what the concrete type will be. 

```rust
fn add(a: f32, b: f32) -> f32 {
    return a + b
}

fn main() {
    //explicit, boring
    let num_a: f32 = "3.14".parse().unwrap();
    
    //the type magically ✨flows✨
    let num_b = "42".parse().unwrap();
    
    let added = add(num_a, num_b);
    println!("Result is {}", added);
}
```

See how we did not specify the concrete type of `num_b`? The `parse` method can parse a string into many different types, but since we are using `num_b` in the `add` function, which expects an `f32`, Rust automatically picks the correct method to convert the string to the number I need.

# Let's apply it to TypeScript

Learning Rust taught me a lot of new approaches to coding. If you come from an OOP/C/TypeScript environment, I highly suggest giving it a shot.

But what it has taught me the most is:

- How nice it is to be **explicit**. Types should encode correctness. The more logic you push to the type system, the less you need to do as a developer to keep your code correct and bug-free.
- That code should be **concrete**. Do as little casting as you can, be as close to your real-world data as possible, and try not to erase information from a type.
- That type inference is **really helpful** to keep you from distancing yourself from the behavior of code. Every time you don't let type inference do the work, it is your job as a human to make sure types are correct, and that brings bugs.

Let's go through each of those steps, I'll show some tips that make my typescript code much safer than it used to be.

# Be explicit

Many developers tend to write code just to finish the task. I see this a ton when it comes to objects that contain optional properties or that have different structure based on some condition.

Let's take a very simple use case that many developers went through, especially with React. We simulate a piece of code that just made a fetch requests, and we wrapped the request to show the different stages of it.

```typescript
type LoadingState = {
    loading: boolean
    data?: number
    error?: string
}
```

Ok, that works, I guess? This is how it is commonly implemented in many libraries. You as a developer need to know that if some `data` exists, then the request went well. 

But what happens if I do the same call again, where `loading` becomes true? Will whatever library I'm using set the `data` to undefined? Do I need to check that both loading is true and data is not undefined? 

Same thing with the error: what happens if I did the call twice and the library decided to keep both data and error?

<WaveText text="So many scenarios" style="font-size: 1.3rem; margin: -1rem 0" />

You see that this is not nice? We have so many implicit things we need to remember as consumers of code (consumers as in developers that use code written and maintained by another developer) and most importantly, we assume that this "contract" that we once encoded in our code stays true even if the `LoadingState` implementation changes under the hood.

One day our coworker might decide to change `LoadingState`, breaking those assumptions, causing subtle issues to pop up elsewhere in the code.

## ADTs and Discriminated Unions

So instead, why not make it *Explicit*. This might seem much more annoying at first, both for the creator of `LoadingState`, because they have to think of the different states that the values might be in, but also to the consumer, as they are forced by the type checker to check every state of the value if they want to access the data.

In this scenario, and my first tip is: ***Use [discriminated unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions) as much as you can***

Let me give a super simple example at first:

```ts
type Result<T,E> = {
    ok: true
    value: T
} | {
    ok: false
    error: E
}
```

Discriminated unions are really useful whenever you need to encode the existence of specific properties if some condition or property has a specific value.

They have a property called the `discriminant` whose unique value identifies the whole block. In this case, we have the first object with a value of `true` for the `ok` property. If that is true, then `value` is our data. If `ok` is `false`, then we cannot access `value` as there exists only the error `E`.

When we write our code, if a function returns a `Result<T,E>` and we want to access the `T` value, we are forced by the type checker to check if `ok` is true.

Let's rewrite our initial loading state to have the same behavior:

<Monaco height="24rem" language="typescript" code={`
type LoadingState = {
    status: "loading"
} | {
    status: "error"
    error: string
} | {
    status: "success"
    value: number
}\n
//pretend this was returned by some function
const state = { status: "loading"} as LoadingState\n
const val = state.value //Error! 
if (state.status === "success") {
    const val = state.value //Ok!
}
`} />

<WaveText text="Hell yeah" style="font-size: 1.3rem; margin-top: 1rem" />

# Be concrete

One super powerful typescript feature that not so many languages have is the ability to *derive* types from objects and create new types from existing types.

I use this very often whenever I have a constant that is used globally in a program (like a theme or configs). I get the default value and derive types from it.

The magic concepts in typescript: `as const`, [`satisfies`](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator), [`keyof`](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html), [`typeof`](https://www.typescriptlang.org/docs/handbook/2/typeof-types.html), [mapped types](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html), [conditional types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html), [generic constraints](https://www.typescriptlang.org/docs/handbook/2/generics.html#generic-constraints)

The flow is:

- Create immutable constants
- Derive types from it
- Manipulate those types to create more types
- Create objects that look like a specific type

Let's take an example: I made an [app to compose music](https://sky-music.specy.app/), where I have a constant of all instruments that are available in the app. I also translated the app into other languages by creating a record of the instrument name and its translation. Let's code it in two different ways:

<Monaco height="26.5rem" language="typescript" code={`
const instruments = ["piano", "guitar", "trumpet"]
const italianTranslation = {
    piano: "Pianoforte",
    guitar: "Chitarra",
    trumpet: "Tromba",
}\n
//We can now derive types from these!
type Instruments = typeof instruments
//And we can tell typescript that when we index "Instruments"
//We want to know what value we'd receive
type InstrumentName = Instruments[number]\n
function getTranslation(ins: InstrumentName){
    return italianTranslation[ins]
}\n
const guitar = getTranslation('guitar') //Ok!
const theremin = getTranslation('theremin') //huh, no error?
`} />

This *works*, but if you hover over `Instruments` and `InstrumentName` you might see that it says `string[]` and `string`. This caused our `getTranslation` to not warn us if we put an invalid value. 

At the same time, there is another issue: what if we add a new instrument? We need to remember to update the `italianTranslation` to include the new instrument too.

We just created two assumptions that the developer needs to check and remember, which is really bad.

Let's try to make it differently, but before that, let me explain `as const`, `satisfies`, and mapped types.

## As const

With `as const` we can define a value to be constant and immutable. What this lets the compiler do is create a more accurate type of the object, not only mapping shallowly, but deeply, especially for arrays and values of objects.

<Monaco height="12rem" language="typescript" code={`
const arr = [1, 2, 3] as const
const obj = {
    key: "value",
    key2: 42
} as const\n
type ArrType = typeof arr
type Objtype = typeof obj
`} />

We can apply this logic to our `instruments` object! But let's go deeper.

Many times we want to create an object that has the *shape* of a type, as in, it *satisfies* the shape of the final object that we want.

This happens very often at boundaries of code, like when you are passing an object to a function.

## Satisfies

This is where the `satisfies` operator comes to help. It tells the compiler: *does this object satisfy the shape of this type?* 

But most importantly, it does ***NOT*** change the shape of our type! It just allows us to add a contract to that object. This is really useful in conjunction with `as const`, let's see:

<Monaco height="16rem" language="typescript" code={`
//bad! We wanted "arr" to be an array of numbers
//this works, but we lose the concrete type that we
//want "with as const"
const bad: number[] = [1, 2, 3] as const\n
//This way we create the concrete type and assert
//That it must be an array of numbers
const good = [1, 2, 3] as const satisfies number[]\n
//See! it warns us of our error
const test = [1, 2, "3"] as const satisfies number[]
`} />

## Mapped types

We then have mapped types, this is especially useful in utility types.

We could go through a black hole on how to use them but let's keep it simple.

Mapped types are a way to tell typescript what keys an object should have. It is very similar to the javascript syntax of allowing to use values as keys to objects, but this time with types:

<Monaco height="24rem" language="typescript" code={`
//this is the javascript syntax
const myObj = {
    ["life1"]: 42,
    life2: 43,
}\n
//Typescript types are very similar!
type MyKeys = "life1" | "life2"
type MyObj = {
    [key in MyKeys]: number
}\n
//Let's use satisfies!
const myObj2 = {
    life1: 100,
    //life2: 200
} satisfies MyObj
`} />

Let's recreate my favourite utility type [`Record<K, V>`](https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type). This says that we want an object with keys K, where each key has value V

<Monaco height="5rem" language="typescript" code={`
type MyRecordBad<K, V> = {
    [key in K]: V
}
`} />

You thought this could work? Well almost, as the error says, keys in javascript can only be of types `string | number | symbol`. We could remove the `K` generic and say that the key must be one of those types, but then we'd lose all the work we have been doing to keep things concrete.

## Generic constraints

That's why we have generic constraints! This works similarly to how `satisfies` works, but with generic types. It allows us to say that our generic must extend (or satisfy) a specific type:

<Monaco height="5rem" language="typescript" code={`
type MyRecord<K extends string | number | symbol, V> = {
    [key in K]: V
}
`} />

## Conditional types

And just because I find these really useful, but they are more niche, I wanted to include them in this post.

Conditional types can be seen as a sort of ternary operator but for types. The only check you can do is seeing if an object *extends* another, like we say in generic constraints. 

Let's make a type that:
- when given an array, it returns it as is
- when given a (non array) value, it returns this value inside of an array.

With conditional types we can "extract" the type by checking the two variants:

<Monaco height="6rem" language="typescript" code={`
type ToArray<T> = T extends unknown[] ? T : T[]\n
type A = ToArray<number>
type B = ToArray<string[]>
`} />

## Let's put it all together

Ok now we can put all that we have learned to improve the code we had written in my music app.


<Monaco height="24rem" language="typescript" code={`
const instruments2 = ["piano", "guitar", "trumpet"] as const
type Instruments2 = typeof instruments2
type InstrumentName2 = Instruments2[number]\n
const italianTranslation2 = {
    piano: "Pianoforte",
    guitar: "Chitarra",
    //trumpet: "Tromba",
} satisfies MyRecord<InstrumentName2, string>\n
function getTranslation2(ins: InstrumentName2){
    return italianTranslation2[ins]
}\n
//we also get code completion!
const guitar2 = getTranslation2('guitar')
const theremin2 = getTranslation2('theremin')
`} />

To recap:
- We kept the instruments object concrete
- We derived types from it
- We manipulated that type to create another
- Created a new object by using the constraints of that type

This obviously is just a simple example, but I tried to get through every footgun so you can hopefully recognize if you ever made those mistakes and understand how to make it better!

# Let your types speak for themselves

I wanted the same powers of Rust, together with the powers of TypeScript, so here are some do's and don'ts:


## Don't widen your types

When working with keys, known values, or in general union types, try your best to keep this information. Never widen the type.

Widening the type means converting a specific value to its more general one, like converting the union `"hello" | "hi"` to `string`.

For example, if you have a function that gets a list of strings and returns an object whose keys are the elements of the list, use the utility types that TypeScript provides to *keep this information*.

Even if the way you will use this function won't need this concreteness, if in the future you convert a part of your code to be more concrete, this function will still work well and won't ruin your efforts.
```ts
//❌
function makeDefault<T>(keys: string[], def: T): Record<string, T>

//✅ use generic constraints to specify that K must be a string
function makeDefault<K extends string, V>(keys: K[], def: V): Record<K, V>
```
If you hear about [`type narrowing`](https://www.typescriptlang.org/docs/handbook/2/narrowing.html), this is the opposite of type widening. It means that your code gets a generic type and makes it more specific. It is the same thing that we did in the first examples with the `LoadingState`. We initially have the 3 variants of loading, success, and error. 

In the if statement, we check if status is "success", then TypeScript *narrows* the type to the variant that has the "success" status, letting us access the value.

## Don't use type annotations 

They erase information about the type you assign to a variable. Especially when you are assigning the result of a function call, you want to keep the *EXACT* value that the function returned, not cast it to something less specific. 


```ts
//❌
const a: Record<string, number> = ...

//✅ Use satisfies when you just want to check
//that an object is of some type
const b = ... satisfies Record<string, number>

//you can use annotations for special cases like empty arrays
const c: number[] = []
```
Say we use the `makeDefault` function that we explained before. If we use type assertions, we erase the information of the keys:

<Monaco height="10rem" language="typescript" code={`
function makeDefault<K extends string, V>(keys: K[], def: V): Record<K, V> {
    return Object.fromEntries(keys.map(k => [k, def])) as Record<K, V>
}\n
const a: Record<string, number> = makeDefault(['c', 'd'], 42)\n
const b = makeDefault(['c', 'd'], 42)
`} />

Ignoring type assertions, we get something similar to what Rust does, but simpler. Since we are keeping as much concrete information as possible, if we change the implementation of a function, or the value we give to that function changes, we might get a type error warning us of a bug because this change breaks some assumptions we made about that type.

## Use const

Try to get the habit of using `const` as your default variable kind, use `let` only if *absolutely necessary*.

If you need to "reassign" a variable with the same type, create a new variable. This has the added benefit of making your code auto commenting, by looking at variable names you can understand the flow of your code.

```ts
//❌ don't use let
let numbers = [1, 2, 3]
numbers = myArr.map(v => v * 2)

//✅ use const and create new variables
const numbers = [1, 2, 3]
const doubledNumbers = myArr.map(v => v * 2)
```

## Don't use `as`

You might sometimes see `as` giving you errors when you cannot assert that a type is some completely different type. That's because TypeScript still tries to prevent you from shooting yourself in the foot with a nuke, but this might give you the false sense of safety that TypeScript will do what's right. 

You should use `as` only if you, the programmer, can **absolutely guarantee** that the assertion is true, and you should either check if the assertion is true before doing it, or reason behind the assertion.

As TypeScript is really flexible with types, there will be many times where the language cannot guarantee what you know is true. That's why `as` exists. If there is a way (even if it is more cumbersome) to NOT use `as`, but instead fiddle with your types until they match your expectations, do so.

In the `makeDefault` example, I used `as` because TypeScript could not guarantee that what I did was correct, so I had to use it. But I did so because I knew the code I wrote is 100% correct. I could have returned `{} as Record<K, V>` which is clearly wrong, but TypeScript would not have complained.

## Don't rely on parameter positioning for correctness

This is more of a general tip, but when you have a function that accepts two numbers as parameters, or in general two or more parameters of the same type, prefer to create an object instead. The key of the object makes it more explicit to whoever uses your function to understand which data to pass to the function.

```ts
//❌
function deleteSong(songId: number, userId: number) 

//✅
function deleteSong(data: { songId: number, userId: number })
```
This applies also to non-adjacent parameters.

## Use guards and don't nest ifs

We mentioned that using discriminated unions is really helpful, but you might be tempted to nest if statements to narrow your types. This might be necessary at times, but 99% of your code can be defined as a "happy path" - the path of branches of logic that is most likely to execute. The other paths can be considered secondary and might just be there to handle exceptions or different logic.

```ts
//❌
function getVal(data: LoadingState) {
    if(data.status !== "loading"){
        if(data.status === "error"){
            throw new Error(data.error)
        } else {
            return data.value
        }
    }
    return null
}
```
This code above is hard to follow. Your happy path is an else branch nested inside two if statements. Instead, make your happy branch be the one that flows at the end of your code. You are aiming to have your last line of code be the most likely outcome of your function. If you have a branch you must execute at the end, then create functions that handle each case, and just return the result of those functions in your two branches.

<Monaco height="16rem" language="typescript" code={`
function getVal(data: LoadingState) {
    if(data.status === "loading"){
        return null
    }\n
    if(data.status === "error"){
        throw new Error(data.error)
    }\n
    return data.value
}
`}/>

Whenever there is a `return` or `throw` (in general when there is the type `never`), TypeScript narrows down the type, excluding the variant you just checked, making your code more and more specific as you go down.

This has the added benefit that, if you add a new variant to `LoadingState`, then this function will error out, as the last `data.value` won't be narrowed down to the success variant, warning you that you have to update this function.

In the first example, if we had added a new variant, no type errors would happen, and the default branch of returning null would be executed.

This mimics a feature that Rust has but that TypeScript does not yet have (without some hacks): exhaustive match, where the compiler forces you to check every variant of a discriminated union so that you don't forget to update your code.

## Map object parameters in functions


As you saw before, when assigning a value to a variable, TypeScript automatically infers the type of the variable by doing a `typeof` inference, but by default, this does not use `as const`, so if you defined some concrete types inside of it, you will lose that information. 

When you are calling a function, and you need to pass an object/array to it as a parameter that you first have to create, try to create it directly inside the function call instead of creating a new variable.

This is not that necessary as it might worsen code readability if the mapping is complex code, but if you just have to select some properties, then it is better to do it.

In cases where your mapping is simple and not used elsewhere, it is (in my opinion) more readable to inline it in the function rather than creating a new variable. This way you know that the "path" of this piece of code ends there.

```ts
//❌
const toDelete = {
    userId: myUser.id,
    songId: mySong.id,
}
deleteSong(toDelete)

//✅
deleteSong({
    userId: myUser.id,
    songId: mySong.id,
})
```

The other useful thing is that if you have the object inline, and you make a mistake on what type you pass the function, the type checker will warn you of what mistake you made, exactly where you made it, instead of giving you a "*Type A is wrong i expected B*"

<Monaco height="18rem" language="typescript" code={`
function deleteSong(data: { userId: number, songId: number }){}\n
const toDelete = {
    userId: 10,
    songId: "20",
}\n
deleteSong(toDelete) //oh no, a non too helful error\n
deleteSong({
    userId: 10,
    songId: "20", //right where i need it!
})
`} />

But most importantly, assigning a concrete object to a variable widens the type (unless you use as const), just like we saw previously, which can be really bad:

<Monaco height="13rem" language="typescript" code={`
const keys = ["firstName", "nickname"]
const person = makeDefault(keys, "unknown")
//no type error even if lastName does not exist.
person.nickname = \`\${person.firstName} \${person.lastName.toLowerCase()}\`\n\n
const person2 = makeDefault(["firstName", "nickname"], "unknown")
//we have an error now! The runtime logic is the same.
person2.nickname = \`\${person2.firstName} \${person2.lastName.toLowerCase()}\`
`} />

## The end, maybe?

There are so many more tips that I want to share on how to write better TypeScript code, but I use them so often that I forget which ones they are. Those are my most commonly used ones. If I encounter more, I'll update this post or create a new one.

And as we youngsters would say:

<WaveText text="Let your types cook" style="font-size: 1.3rem;" />
