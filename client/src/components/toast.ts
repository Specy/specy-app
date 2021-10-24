import { writable } from 'svelte/store';

export const toast = writable({
    title:"",
    message:"",
    duration:0,
});