---
    datePublished: '2025-07-07'
    title: 'Being a psychologist to your (over)thinking LLM'
    description: 'How reasoning models tend to overthink and why they are not always the best choice.'
    tags: ['AI']
    relatedProjects: ['discerns']
---
<script>
    import WaveText from "$cmp/blog/WaveText.svelte";    
</script>

# A little introduction

When LLMs became mainstream years ago, people all over the world started using them to automate tasks, generate content, classify things, etc...
People started becoming prompt engineers, perfecting their prompts to make the LLM do exactly what they wanted to achieve. 

But LLMs are stubborn and unreliable, so people started writing step-by-step instructions inside of a prompt, things like:

- Read the input carefully.
- Now analyze X.
- Then do Y.
- And finally, write Z.

This was with the hope of "steering" the LLM to follow instructions more closely, but it didn't always work.

So people added a new detail. Instead of trying to steer the LLM into "thinking internally" (something that it cannot really do), they thought:

> "Why don't we make the LLM _actually_ write out thoughts?"

That's when the concept of the "scratchpad" was introduced. Prompters would give the LLM instructions about the task and also tell it to "think out loud", by writing its thoughts inside of an XML tag claled the "scratchpad". A prompt would look something like this:

```
You are an AI doing ...

Follow those instructions:
- Read the input carefully.
- Now analyze X.
- Then do Y.
- And finally, write Z.

Before writing your answer, use the <scratchpad> tag to think of an answer.
```

The answer of the LLM would look something like:
```xml
<scratchpad>
Ok, I read the input carefully.
To do X I need to ...
Now I need to do Y, so ...
...
</scratchpad>

Here is your answer: Z
```

What a developer had to do afterward was simply remove everything inside the scratchpad, and what was left was the final answer.

This increased latency, but it forced the LLM to follow a strict set of rules, hopefully increasing the reliability and quality of the LLM.

Model providers picked up on this idea and thought:

> "What if LLMs could create their own thinking rules, think for themselves like the scratchpad, but without having to explicitly write it out?". 

This is where reasoning models like openai's `o1`, google's `gemini2.5-pro`, or deepseek `R1` were born.

# Prior tokens matter (inline thinking)

An important detail I learned during the time that I've been working with LLMs is that everything in your context, be the message you wrote, or the currently generated tokens from the LLM. matter enormously to the quality of your output.

Imagine you are doing classification. You have a list of facts:
```ts
type Fact = {
    content: string
    id: number
}
```

That you want to classify as being "true" or "false".

You write out a prompt that asks the LLM to return a list of classifications. You obviously want to match the ID with the result from the LLM so you ask to give both the ID and the classification. Your prompt might look something like

```xml
You need to classify a set of facts as being true or false:

Here are the facts:
{facts}

Write your classification like this:
<result>
    <classification>
        classification: true if the fact is true, else false
        ID: the id of the fact
    </classification>
    ... continue with the rest 
</result>
```

This might work with few facts, but say you give it 20, you will see that the LLM starts giving out random answers or forgets to classify some facts.

One reason for this is that the "classification" property in our result comes *before* the ID, LLMs generate content top-down and every token that has been generated so far will be useful for the LLM to predict the next token.

So let's switch the order, let's write the ID **first**, _then_ the classification:
```xml
<classification>
    ID: the id of the fact
    classification: true if the fact is true, else false
</classification>
```

This is better, but now the LLM is putting random IDs and mixing the facts. Numbers and identifiers are a hard thing to grasp for LLMs, they need to be able to reference content that is "far away" and it has no easy way to match the ID to what we had written prior. So let's move the reference down. 

Let's ask the AI to *rewrite* the fact, write the ID, and then classify it:

```diff
<classification>
+   fact: the content of the fact
    ID: the id of the fact
    classification: true if the fact is true, else false
</classification>
```
When we parse the result, we will simply ignore the rewritten fact. It was only used to make it easier for the LLM to match the fact to the ID.

This is much better, but under what rules does the LLM think if a fact is true or not? 
Even if we add rules to the prompt, as it is right now, the LLM will just output true/false for whatever reason it might have.
We can add a *mini scratchpad* **before** giving the classification. This way the LLM can give reasoning as to why it *thinks* that an answer might be true or false:

```diff
<classification>
    fact: the content of the fact
    ID: the id of the fact
+   reason: your analysis of why the fact might be true or false
    classification: true if the fact is true, else false
</classification>
```

This will be our final prompt, this way the LLM:

- Writes out the fact to more easily map the original fact's ID to the classification ID.
- Thinks of a reason why the fact might be true or false.

# Model thinking

We explored two ways to improve prompts, either by "think then act" when using the scratchpad, or by doing inline thinking, adding more context to the LLM's current generation. 

Recently "reasoning" models came out. They behave similarly to the "think then act" prompting. The LLM will first reason about its answer, and then write out the answer.

The difference between this approach and the prompting one is that the model itself has been trained to behave like this. It has its own thinking rules, it will continue thinking until it reaches a good enough "thought chain", and then it will spit out its answer.

One thing to note is that the "think then act" approach does not fully solve the issue we were having with classification.
It is still hard for a reasoning model to match things accurately, but it allows us to remove the "reason" property in our classification, as it will be done prior to the generation of the output. 

# Our problem

At [discerns.ai](https://discerns.ai), there is one piece of our knowledge uploading pipeline that has the job of classifying documents in a set of "topics". 
Topics explain the contents of a document, highlighting the important concepts that can be used to quickly understand what the document talks about. They are made as "questions", and the document is supposed to answer those questions. 
We then save those topics, which represent what the knowledge base "knows".

Imagine we are uploading part of a book about front-end development explaining HTML, generated topics could be:
- "What does HTML stand for?"
- "What is a tag in HTML?"
- "What are the most common HTML tags?"
- ...

The pipeline will do something like:

- Convert the PDF into markdown
- Split the markdown at its headers (those *should* be chapters)
- Get 10 chapters at a time and ask the LLM to classify them by generating "questions"

Now an important step in our pipeline is that there *should* **not** be duplicate questions. 
Imagine we are uploading a part of another book about frontend development, which also has a part that talks about HTML. Similar questions as those mentioned before will be generated, but we don't want to save two topics that talk about the same thing, so we added another step to the pipeline:

Once the questions are generated, we get a few existing similar questions (using similarity search) and we ask the AI "Out of those new questions, which are duplicated and which do not already exist?".

And as you can see, this is very similar to what we were discussing before.

# (Over)thinking

I had to work on this feature around a year ago, reasoning models had just come out so I wanted to experiment with them.

I started writing my prompt, following the suggestion of including rules and step-by-step instructions on what the LLM is *supposed* to be doing. But I omitted both the scratchpad and the inline reasoning. 

I executed the prompt and saw what the model was "thinking" about. It behaved exactly like a scratchpad but way better, following the rules, analyzing every question, iterating over what it said to itself, re-analyzing every question, iterating again what it said to itself...

I started noticing that the pipeline did not seem to filter out duplicate questions properly, and there would be many similar but *sliiiightly* different questions. For example "What does the HTML acronym mean?" and "What does HTML stand for?"

I started debugging by looking at the thought chain of the LLM and noticed things like 

- "Hm this question is similar to this other"
- "One mentions what the acronym means, while the other asks what HTML stands for"
- "Hm no I think they are the same"
- "But wait actually, maybe the second question is actually asking for a more general explanation of what the HTML language does?"
- "Yeah I think that's it, then they are not the same"

Well yeah, just like me, reasoning LLMs overthink, and they do it *a lot*. 

Uhhhh, let me try to add another rule to the prompt. 

> "If two questions answer the same topic, or are very similar, then they can be considered the same"

Ok, this seems to fix some issues but causes others, now the LLM is overthinking the other way around, it thinks that two different questions are actually the same because they share the same concept. Ok well let me add another rule:

> "Ok but actually, if two things are very similar **BUT** the topics are not the exact same, then they are not the same question"

It gets things *sliiightly* better but still not perfect, now it has issues with ...
Ok fine, let me add anoth... Wait, am I being a psychologist right now?

# Numbing the pain

Well, we saw the tendency of the LLM to overthink when we try to give it rules.
It always seems to want to think of something, even if it doesn't really need to, and this is not only a problem for classification, in fact, I noticed that:

- Classifying things works badly because it's hard to give exact rules on what content should fall into one category and which should fall into another.
- Conditionally doing something does not work reliably, say we want to "tell me X only if Y happens, if Y does not happen then tell me that nothing has to be done", the reasoning model will try its hardest to try to find if Y happens or not, and will overthink if the rules you give it are not perfect, so you roleplay as a psychologist to try to tame the overthinking.

If overthinking is such an issue, what could I do to fix it? 

Very simple, numb it down.

# Reasoning is not always better

Seeing how reasoning models don't seem to do what I wanted, I tried to apply the approach of "inline thinking" to the original task. After a little bit of trial and error, I managed to get a pretty good result.

Inline thinking allows you to still reason about your answer while limiting the issue of overthinking. It is ideal for tasks that need just a little reasoning to improve the accuracy of your results, while reasoning models are best for tasks that "plan then execute" or "solve then explain".