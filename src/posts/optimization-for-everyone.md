---
    datePublished: '2025-08-27'
    title: 'Optimization for Everyone: A magical way to solve problems'
    description: 'Bringing operational research and optimization models to more people, by making it easier to write and solve.'
    tags: ['operational research', 'rust', 'web-dev', 'svelte']
    relatedProjects: ['rooc']
---
<script>
    import WaveText from "$cmp/blog/WaveText.svelte";    
</script>


# A magical way to solve problems

Before diving deeper, imagine if there was a way to forget about algorithms, forget thinking "how should i solve this", but instead, the only thing you need to worry about is "what are my requirements?", "what is my goal?".

Imagine all you had to do was write thosoe things down, click a button, and have a magic algorithm automatically find the best solution.

This is what Operational Research, and more specifically, optimization modeling does. You write your requirements, write your goal, and the algorithm under the hood finds the best set of values that give you the best result, while still adhering to your requirements.

## An example model

To catch your interest, let's try to immediately try to make a model, i will not explain the details of it now, but they will be explained afterwards.

> You are a thief, you just broke into a jewellery, you have a backpack on you, but you can carry at most 100kg of stolen items (your poor back). In front of you, you have a bunch of jewellery, each of them weights a certain amount and has a certain value. You obviously want to steal the highest possible value, but how do you decide which items to steal? 
If you have a programming background you probably recognise this as the `knapsack problem`. It might seem easy at first, but if you try to solve it by hand you will realize that, if you pick one item, you might not be able to pick another as it would weight too much to fit the backpack. 

You could try all combinations, or write a program to solve it, but why don't we instead try to write it as a optimization model? 

We want to:
- *Goal*: Maximise the sum of all the values of the items we picked
- *Requirement*: We want the sum of all items we picked to not weight more than 100kg

<iframe style="width: 100%; height: 20rem; border: solid 0.2rem var(--tertiary); border-radius: 1rem; padding-bottom: 0.1rem" src="https://rooc.specy.app/projects/share?project=N4IgbgpgTgzglgewHYgFwEYA0I4BM0gwAWAhlBCNlAK5IAucAthaiAPQBUAOkgMbIw6AAgBmcADYQYQgLxCA4gFEAKgH0AYgEkAMooDKACgCUPHuQDmcQdAPAeQh0KQlmqIQHIYARyh13me0dcKV4oOAAHBmQ3dwBhEnFeanESOgghOiJ072oydKgEBGEEESESJ2pGACNof0CHcLIXCDTYNwBtdvcS1SRK-yEABTDGOAZIADoAOUqaqABdeYCkRyFyOmooJBg3YaYxuEmZ6uhl1d4E8TcDPsYjWQA+ITsV1cd1zZXgOgBPcIg3FwQMc5kDMEIwAlqAChABZVJECbeXw3SoTSHiaFGAC+9SEuKQ2JMSB4-G2dBI9Bgtnqg00AAkEiI3MAMn8YUCQdAwRCoTD4ZkJnShGwhAAmfE8Ik8DhsSggGj0JgQABqVjgVUkaBECRgEGwzmYBAA0s5wjASLwANby4IwUIRKIoVjy0IQVIQXAAQToaHQAHYAKwANjFAE50ABmMNhgAcgYALNhqOFcB7vb6MEHQxGE-6xQAGSOB7BiSQwNDtJYgMlpegENhseEAD32eoyWSEMEqQhKZXE4g76Qx0Okfcy6TGEEY0gA7ulwnBrZ6eIwSM2u5UDAYR-qhHB7nAVhBbtAPTu+TAjPdWbuhBwhM3VHBJdtqFUAFYQXjCOgIPGNsonbdowvalJc+5pDOQjzkIi7LrgQiMNQghOEUMEQHA5hEMIjAIOQHaUkI6AFgWVrmHiIHbvOWE4eCB77sep5QOeNHYXQV43hhtHCA+T4vtiQgADxyBcjS8GMPw8LOWTkHikjCGxOHSLIQjtCWQjBpG4KRrG4JihpkZYOKBb6aZ4qBvM8ktLymJSI4cjtMZJHgugGkJuZwbmWG5kJhpblWa8DgKUIYmWpJqkkQWPDBGISAQHi-FlNIABChSSERIj4fujFCAWEwTJISAGEpHFGPKi7-BWqDtKAlUsKZIAIP8zo6uIerYpgdURCwWBNS12q6hAnXdf8aBitgzUnoN7XDV1ID1Wg2n9dNqBtR182LRgfVTc6dA0MN8zYkAA&embed=true" />

See? There is no logic in it. You write it down, click *run* and it just gives you the best answer.

Now let's dive deeper into the field of Operational Research and Optimization modeling.


# What is Operational Research?

Operational Research (OR) is a field that uses *models* and data to optimize and improve complex systems.

It is a small niche of mostly experts that given some requirements, constraints and goals, manage to find the best solution to a problem.

The most common use of Operational Research is inside big companies that want to optimize various systems, a few examples are:

- ***Logistics and Transportation***: Companies like delivery services and airlines use optimization to plan routes, schedule deliveries, and manage fleets. The goal might be to minimize fuel consumption, delivery times, or overall costs.
- ***Manufacturing and Production***: In manufacturing, optimization is used to determine the best production schedules, manage inventory levels, and design efficient production lines. The goal might be to maximize production output, minimize waste, or reduce production costs. For example, a factory might use optimization to determine the optimal mix of products to manufacture given limited resources like raw materials and machine time.
- ***Finance and Investment***: Financial institutions use optimization to build investment portfolios that maximize returns while minimizing risk. Optimization techniques can help determine the best allocation of assets across different investment classes.
- ***Energy and Utilities***: Power companies use optimization to manage the distribution of electricity, optimize energy production, and schedule maintenance. The goal might be to minimize energy losses, reduce costs, or ensure a reliable power supply.
- And much more...

But since when i studied the subject at my university, i fell in love with how simple it _could_ be and at the same time realized how unapproachable it is from someone with no knowledge in coding, mathematics and logic. 

# The simplex algorithm

When i started studying OR at my university, i found solving models to be quite annoying. We were meant to solve them by hand, to learn how the "algorithm™" that solves the model worked. 

This algorithm is called the "[Simplex](https://en.wikipedia.org/wiki/Simplex_algorithm)", made by [George Dantzig](https://en.wikipedia.org/wiki/George_Dantzig), which is one of the most important algorithms of the 1950s and onwards. 

It allowed companies to improve their manufacturing, perfected schedules for vehicles, helped allocate resources in the military, and much more.

I wanted something to help me practice for the OR exam, so i made a simple script which implemented the simplex algorithm and gave me the solution, so i could compare it with the manual work i did.

Then after a while i thought: _What if, instead of writing a script for it, i could just write the numbers and variables themselves, by following the same notation i was taught at university?_

But my perfectionism took over myself, and this simple task spiraled into a half a year work on developing my own modeling language, the chain of thought was something along the lines of:

- _Ok now i can write it as text and solve it, but it takes a long time to write down all the numbers and variables, what if there was a way to write the "idea" behind the model instead of the model itself?_
- _Ok but now writing the model is a bit harder, sometimes i write some mistakes and things don't work, what if i add a way to recognize where i did a mistake and let the language tell me where the issue is?_
- _Ok now it's somewhat more usable, but running it through the command line is a bit uncomfortable, why don't i make it run on the web so i can use it anywhere and easily?_
- _Ok now i can run it on the web, but it's hard to understand what each variable is and what it does. I also often forget of all the functions that are available and how to use them_
- _Ok but there are not that many functions defined in the language, what if i could write new ones outside of the language so anyone can make them?_
- _Ok but now i want to be able to add data from outside the language, like a CSV or something else_

<br/>
<WaveText text="And many many more" style="font-size: 1.3rem; margin: -1rem 0" />


# ROOC

After this clown parade of me saying "ok just this one more feature" for half a year came to an end, i considered [rooc](https://rooc.specy.app/) to be usable, and released it to the public.

It's an editor + language + solver combo that allows you to write and solve optimization models on the web. If you want to learn how to use it, visit the [documentation](https://rooc.specy.app/docs/rooc) page!

