---
    datePublished: '2024-11-20'
    title: 'Automatic text color from background in CSS'
    description: 'Creating a CSS rule that automatically changes the text color based on the background color of the element.'
    tags: ['css', 'web-dev']
    relatedProjects: ['sky-music']
---
<script>
    import ColorAndPreview from "$cmp/blog/ColorAndPreview.svelte";    
</script>

# Introduction

As you might have experienced in the past, handling themes in a website can be quite tedious, as you have to make the whole website respond nicely to any variation of the theme.

I had this happen in the themes selection of [Sky Music](https://sky-music.specy.app/theme), where users have the ability to choose *any* color they want for the background, and the text color must be readable.

In that project I solved the issue by using JavaScript, but I wanted to explore if there was a way to do this in pure CSS.

# The problem

Throughout the years I reimplemented theming in every project I've made, now I landed on a good solution which allows you all the freedom, flexibility and ease of use you could want.

Let's define a theme as a typescript type:
```typescript
type SurfaceColor = {
    name: string,
    color: string
}

type BrandColor = {
    name: string,
    base: string,
    defaultWeight: number,
    weights: Record<number, string>
}

type Theme = {
    surfaces: Record<string, SurfaceColor>,
    brand: Record<string, BrandColor>
}
```
In the surfaces backgrounds, variants will be created which slightly change the background to be lighter/darker (layers) based on the base color. 
For example, we want to create surfaces that are 3, 5, 7% lighter/darker than the base color.
This will generate a `--{name}-layer-{layerNumber}` css variable for each surface color. 

In the branded colors, each weight will have its own name `--{name}-{weight}`.

As you can see, there is no text color in the theme, that's because we will automatically generate it based on the background color.

We could use javascript for this, and create a new css variable for each color we just defined `--{computedName}-text`, but what if we want to mingle with the color before using it? 
For example by using the [`color-mix()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/color-mix) CSS function, or generating a color dynamically, etc...

We should also consider using different text and background colors to represent the `inactive`, `active`, `hover`, and `disabled` states of elements. 
However, specifying colors for every state individually can be tedious. 
It would be much more convenient to define a single base color and have all the state variations generated automatically.
# The Javascript solution

In the Javascript implementation we can do a very simple:
```ts
function getTextColor(color: string){
    if(luminance(color) > 0.5){
        return 'black';
    } else {
        return 'white';
    }
}
```
But how can we do this in CSS? There clearly are no if statements, and neither functions that can return the lightness of a color... or are there?

# The CSS solution

In modern CSS, there exists the `lch`, `hsl`, `rgb`..., functions which allow you to specify a color in a different color space.
Another cool thing it allows you to do, is to "parse" a color, and then use its individual components to create a new color.

For example the [lch](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/lch) CSS color function,
parses the color into Lightness, Chroma and Hue. So we can do something like this:
```css
lch(from #663399 calc(l + 10) c h)
```
This is exactly what we need! We can get the lightness of a color, now we just need to figure out how to `if` in CSS.

Thing is, we don't really need a comparison, if we have a color with high luminance, we want to use a dark color for the text, and the opposite is true for a color with low luminance.

--- 

The luminance of the color will be accessible inside the `l` variable.

Instead of hardcoding the color, let's use a `--bg` variable so that
we can make this rule generic. The `--bg` variable can be *anything* that resolves to a color, including `color-mix()` etc... 
which will be used as the background of the element, but also used to compute the text color:
```css
color: lch(from var(--bg) calc(100 - l) c h)
```

<ColorAndPreview color="#663399" cssFunction="lch(from var(--bg) calc(100 - l) c h)"/>

This works, but it just inverts the luminance of the color, we need to select either `black` or `white`.

--- 

Let's try to use the [`clamp()`](https://developer.mozilla.org/en-US/docs/Web/CSS/clamp) function, which will round the value to its nearest bound.
```css
color: lch(from var(--bg) round((100 - l), 100) c h);
```

<ColorAndPreview color="#663399" cssFunction="lch(from var(--bg) round((100 - l), 100) c h)"/>

Much better! But this text is not exactly black or white, it still has a little bit of the original color in it.

It's actually kinda cool and could be used for buttons. 

If we want more of the original color to blend in, we can change
the `round((100 - l), 100)` to `round((90 - l), 90)` etc...
I'm gonna save this for future projects.

--- 

To remove the color leak, we just need to set the chroma and hue to 0, and we will have a perfectly black or white color.
```css
color: lch(from var(--bg) round((100 - l), 100) 0 0);
```

<ColorAndPreview color="#663399" cssFunction="lch(from var(--bg) round((100 - l), 100) 0 0)"/>

--- 

But rarely we use pure black or white, so let's use slightly off colors.

We can do that by clamping the luminance to a specific range, where the higher value represents the light color, and the lower value represents the dark color.
```css
--dark-luminance: 8;
--light-luminance: 95;
color: lch(
    from var(--bg) 
    clamp(
        var(--dark-luminance),
        round((100 - l), 100),
        var(--light-luminance)
    )
    0 0
);
```
<ColorAndPreview 
    color="#663399" 
    style="--light-luminance: 95; --dark-luminance: 8;"
    cssFunction="lch(from var(--bg) clamp(var(--dark-luminance), round((100 - l), 100), var(--light-luminance)) 0 0)"
/>

---

A bit of a monster, but it works, we can just create a single class `.auto-color` and give it a `--bg` variable to have the text color automatically generated.

```html
<style>
    .auto-color {
        --dark-luminance: 8;
        --light-luminance: 95;
        background: var(--bg);
        color: lch(
            from var(--bg) 
            clamp(
                var(--dark-luminance),
                round((100 - l), 100),
                var(--light-luminance)
            )
            0 0
        );
    }
</style>

<button style="--bg: rebeccapurple" class="auto-color">
    Hello world!
</button>
```

<iframe title="Code playground" src="https://codepen.io/specy-the-bold/embed/BaXgoPE" style="width: 100%; height: 300px; border-radius: 0.5rem"></iframe>

# Conclusion

There are different levels of complexity that you can choose from, pick whichever you feel best suits your needs.

I recommend to use it as a default value when you don't know/can't specify the text color.
Or if you have a component that often changes its background depending on some state.