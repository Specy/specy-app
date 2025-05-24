<script lang="ts">
    let {
        color = $bindable(),
        cssFunction,
        style
    } = $props<{
        color: string,
        cssFunction: string,
        style: string
    }>()
</script>


<div class="container"
     style="--bg: {color}; {style}"
>
    <input type="color" bind:value={color}/>
    <div
            class="text-inner"
            style="color: {cssFunction}"
    >
        Click to change color
    </div>
</div>

<style>
    input {
        border: none;
        width: calc(100% + 1.5rem);
        margin-top: -1rem;
        margin-left: -1rem;
        height: calc(100% + 1.5rem);
        outline: none;
        cursor: pointer;
        appearance: none;
    }

    .container {
        position: relative;
        height: 3rem;
        border-radius: 0.5rem;
        overflow: hidden;
    }

    .text-inner {
        pointer-events: none;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
</style>