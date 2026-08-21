---
    datePublished: '2026-08-21'
    title: 'Through the lens photography'
    description: 'The pros of analog photography and a fixture to take photos through the viewport of the camera'
    tags: ['photography', '3D printing']
---
<script>
    import AnimatedText from "$cmp/blog/AnimatedText.svelte";
    import Slideshow from '$cmp/blog/Slideshow.svelte';
</script>

# Why analog photography

As the world is moving more and more towards digitalization and standardization, the analog world is having a resurgence.

I've always wanted to learn photography, never really cared about doing it professionally, just something good enough to look at. 

At the same time, I realized that so many of the photos I've taken throughout my life have always been meaningless and forgotten. Using a smartphone to take photos is so easy that you forget that you ever took them, and because it's so convenient, you whip your phone out way too often and even forget to enjoy the moment.

If you get a DSLR/mirrorless camera, you partially solve this problem. Instead of having something so convenient, you have a bulky object that you need to carry around, turn on, and set up before you can take a photo, which discourages you from just taking random photos all the time.

*But* the fact that each click on the shutter button is "free" still allows you to spam photographs, leaving you with 300 files to check, which will most likely just rot on an SD card or your computer.

So to prevent *both* issues, what is bulky, expensive, and hard to use properly?

<AnimatedText kind="wave" text="An analog camera!" style="font-size: 1.3rem;" />

# The analog choice

After weeks of indecision, I decided to buy a Canon A-1 with a 70-210mm Vivitar Series 1 lens and 400 ISO Kodak UltraMax. I chose the A-1 because it was the first camera to have both a fully automatic and a fully manual mode, letting my inexperienced self take photos without knowing much about lighting, but still manual enough that it makes you run through a small checklist in your head before taking a photo.

::: sidetrack
Another reason to choose analog cameras is that, if in the future you decide to buy a mirrorless camera, you can reuse all the lenses that you already have, as they can be adapted.

Or well, this is what I tell myself when I buy yet another lens. I really need to stop, I've got like 5 different lenses already. 

I also both enjoy and hate the process of manual focusing: it gives you more creative freedom to dial in exactly how you want it, but it is *sooo* slow to do properly.

Oh also, did you know that this camera (rather it's sibling Canon AE-1) with the autowinder is the same sound used by Apple's shutter sound? I must say this and how cool the camera looks was also a big factor in my decision.
:::

# The good and the bad

The good part is that I immediately felt excited about using it! Sometimes I'd go out just to take photos (shocking!). 

Whenever I went to some event or place that was photograph-worthy, I brought with me a small bag with the camera that I'd take out in case I wanted to photograph that moment. It felt like the camera was something that lived *alongside* the moment, not with it, and even when taking it out, the whole process felt more meaningful and *part* of the whole experience. Being limited to only 36 shots per roll means you have to be careful not to take too many photos. I noticed that this made me wait for the *perfect shot* rather than just taking a bunch of them hoping that at least one would be good. 

And... most of the good reasons come down to the fact that each time you press that button, €0.70 goes <AnimatedText kind="wave" text="flying"/> out of your pocket and into the cost of the film + developing + scanning, so you **better take that photo and make it good**.

# The eclipse

At this point I'd been using my camera for a few months and shot 4 rolls of film. There would be a (partial) eclipse in a few weeks, so I decided to be creative and take some photos using a solar film over my lens. 

The goal was to do a double exposure, one side of the photo with the eclipsed sun and the other side with a half moon. 

Being paranoid about security (cyber but also physical), I decided that I would take no chances and keep my eye away from the viewfinder. I already came very close to blinding myself once by taking photos at an airshow and accidentally focusing straight into the sun, so this time I had the idea of putting my phone camera right on the viewfinder so I could look through the screen of the phone to check the alignment of the sun in the photo.

# The fixture

Obviously, holding the phone precisely aligned to the back of the viewfinder is very uncomfortable, so I decided to find some way to fix it in the right place so I could see properly without using my hands.

I first started with some Kapton tape just to see if it was doable, then decided to create a 3D printed fixture to hold the phone in the right place and add some masking to prevent light leakage.

The first 3D printed prototype was not very precise. I had to glue things together and the alignment was not the best, you can see it in the photos, but the ~~second, third, fourth~~ fifth attempt was much better!

<Slideshow
    photos={[
        { src: '/images/blog/through-the-lens/fixture_0.jpg', alt: 'Kapton tape fixture attempt' },
        { src: '/images/blog/through-the-lens/fixture_1.jpg', alt: 'Kapton tape fixture attempt' },
        { src: '/images/blog/through-the-lens/fixture_2.jpg', alt: '3D printed prototype' },
        { src: '/images/blog/through-the-lens/fixture_3.png', alt: 'Final 3D model' },
        { src: '/images/blog/through-the-lens/fixture_4.png', alt: 'Final 3D model' },
    ]}
/>

But by making this fixture for solar photos I realized... What if I actually use it to take normal photos too?

# Through the lens

Have you ever thought "why do photos never come out exactly as I see them through the viewfinder?" Well, with this janky fixture, now they do!

While doing tests I was surprised by the style of the photos you could take with it. They feel warm, grainy, bokehy, and full of character. The focusing prism in the middle of the photo also adds a somewhat cool element, making it seem like you are looking through the camera taking the photo. 

If you hold down the metering button on the camera, it also shows the aperture and shutter speed that would be used to take the analog photo.

Let's look at some <AnimatedText kind="rainbow" text="examples" />. I took these while going on a hike. I had managed to finish the first prototype literally 5 minutes before leaving. (Yes, that's my dog!)

<Slideshow
    photos={[
        { src: '/images/blog/through-the-lens/photo_5.jpg', alt: 'Example 1' },
        { src: '/images/blog/through-the-lens/photo_6.jpg', alt: 'Example 2' },
        { src: '/images/blog/through-the-lens/photo_7.jpg', alt: 'Example 3' },
        { src: '/images/blog/through-the-lens/photo_8.jpg', alt: 'Example 4' },
        { src: '/images/blog/through-the-lens/photo_9.jpg', alt: 'Example 5' },
        { src: '/images/blog/through-the-lens/photo_10.jpg', alt: 'Example 6' },
    ]}
/>

As you can see, they are a bit crooked because of alignment issues with the prototype, but after printing the final fixture, this is how they look: (I still need to take more photos, so these are just some I took to test it out, and yes, that's my cat!)

<Slideshow
    photos={[
        { src: '/images/blog/through-the-lens/photo_11.jpeg', alt: 'Example 7' },
        { src: '/images/blog/through-the-lens/photo_12.jpeg', alt: 'Example 8' },
        { src: '/images/blog/through-the-lens/photo_13.jpg', alt: 'Example 9' },
        { src: '/images/blog/through-the-lens/photo_14.jpeg', alt: 'Example 10' },
    ]}
/>

Oh right, we cannot forget the *whole* reason why I made this: to photograph the eclipse.

After months of 0% cloud and full unbearable sunlight, **THE DAY** I needed it to be sunny was completely cloudy. I did not manage to take photos using the filter, but I managed to take some photos of the eclipse without it. I also tried to just take a random photo of the whole sun, and of the moon the day after the eclipse.

<Slideshow
    photos={[
        { src: '/images/blog/through-the-lens/sun.jpg', alt: 'The sun in eclipse' },
        { src: '/images/blog/through-the-lens/sun_filter.jpg', alt: 'The sun through the filter' },
        { src: '/images/blog/through-the-lens/moon.jpg', alt: 'The moon the day after the eclipse' },
    ]}
/>

# Conclusion

I did notice that even with this super bulky, uncomfortable, hard to set up rig, I still find myself taking way more photos than I should. I managed to break the only inconveniences that analog photography brings you, and that unconsciously made me take only 3 analog photos during those days of experimentation. 

On the other hand! I feel like this style of "through the lens" photography is really cool and wanted to make it my signature style. Now that the prototype is complete, I can start using it to take photos properly, expect another blog post (or a website with photos)!

<Slideshow
    photos={[
        { src: '/images/blog/through-the-lens/fixture_5.jpg', alt: 'Finished fixture' },
        { src: '/images/blog/through-the-lens/fixture_6.jpg', alt: 'Finished fixture' },
        { src: '/images/blog/through-the-lens/fixture_7.jpg', alt: 'Finished fixture' },
    ]}
/>
