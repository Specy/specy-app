<script lang="ts">
    import {toast} from "./toast"
    import {onDestroy} from "svelte"
    import FaTimes from "svelte-icons/fa/FaTimes.svelte"
    let title = ""
    let message = ""
    let toastVisible = false
    let timeout = setTimeout(() =>{},100)
    let unsubscribe = toast.subscribe(data =>{
        if(data.title === "") return
        title = data?.title
        message = data?.message
        toastVisible = true
        clearTimeout(timeout)
        timeout = setTimeout(()=>{
            toastVisible = false
        }, data?.duration)
    })
    onDestroy(unsubscribe)
</script>

<div >
    <slot/>
    <div class="toast-wrapper" class:toastVisible>
        <div class="toast-title">
            <div >
                {title}
            </div>
            <div class="close-icon" on:click={() => toastVisible = false}>
                <FaTimes />
            </div>
        </div>
        <div class="toast-text">
            {message}
        </div>
    </div>
</div>

<style lang="scss">
    @import "../variables.scss";
    .toast-wrapper{
        display: flex;
        position: fixed;
        right:1rem;
        top: 1rem;
        padding: 1rem;
        height: 10rem;
        width: 20rem;
		background-color: #f6f6f6c4;
    	backdrop-filter: blur(4px);
        border-radius: 0.5rem;
		box-shadow: 1px 1px 5px rgba(69, 69, 89, 0.25);
        z-index: 20;
        transform: translateY(-13rem);
        transition: transform 0.3s ease-out;
        flex-direction: column;
    }
    .close-icon{
        color: $textDark;
        width:1.5rem;
        height: 1.5rem;
        cursor: pointer;
    }
    .close-icon:hover{
        color: $accent;
    }
    .toastVisible{
        transform: translateY(0);
    }
    .toast-title{
        width:100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: row;
        font-size:1.5rem;
        padding-bottom: 0.2rem;
        margin-bottom: 0.2rem;
        border-bottom: solid 1px $accent;
    }
    .toast-text{
        display: flex;
        margin-top: auto;
    }
    @media (max-width: 480px) {
        .toast-wrapper{
            left: 0;
            transform: translateX(calc(50vw - 50%)) translateY(-13rem);
        }
        .toastVisible{
            transform: translateX(calc(50vw - 50%)) translateY(1rem);
        }
    }
</style>