<script lang="ts">
	import { run } from 'svelte/legacy';

	type statusType = '' | 'correct' | 'wrong'
	import FaExclamationCircle from 'svelte-icons/fa/FaExclamationCircle.svelte'
	import FaCheckCircle from 'svelte-icons/fa/FaCheckCircle.svelte'
	import FaRegCircle from 'svelte-icons/fa/FaRegCircle.svelte'
	interface Props {
		title?: string;
		value?: string;
		status?: statusType;
		type?: string;
		hideStatus?: boolean;
	}

	let {
		title = '',
		value = $bindable(''),
		status = $bindable(''),
		type = 'text',
		hideStatus = false
	}: Props = $props();
	const setType = (node) => {
		node.type = type
	}
	run(() => {
		if (value === '') status = ''
	});
</script>

<div class="input-wrapper">
	<div>{title}</div>
	<div class="input-row">
		<input
			bind:value
			class="form-input"
			use:setType
			placeholder={title.toUpperCase()}
			style={hideStatus ? 'border:none;' : '' + value === '' ? ' border: none;' : ''}
		/>
		{#if !hideStatus}
			<div class={status + ' icon-wrapper'}>
				{#if status === 'wrong'}
					<FaExclamationCircle />
				{:else if status === 'correct'}
					<FaCheckCircle />
				{:else}
					<FaRegCircle />
				{/if}
			</div>
		{/if}
	</div>
</div>

<style lang="scss">
	.input-row {
		display: flex;
		align-items: center;
		border-radius: 0.4rem;
		background-color: rgba(var(--RGB-tertiary), 0.5);
		color: var(--tertiary-text);
		padding: 0.2rem;
		margin-top: 0.2rem;
	}
	.input-wrapper {
		display: flex;
		flex-direction: column;
	}
	.icon-wrapper {
		height: 1.2rem;
		width: 1.2rem;
		margin: 0 0.5rem;
		display: flex;
		align-items: center;
		color: transparent;
		cursor: pointer;
	}
	.correct {
		color: rgb(16, 185, 129);
	}
	.wrong {
		color: rgb(239, 68, 68);
	}
	.form-input {
		display: flex;
		flex: 1;
		border: none;
		border-right: solid 1px gray;
		background-color: transparent;
		padding: 0.6rem 1rem;
	}
	input::placeholder {
		color: rgb(116, 116, 116);
		font-size: 0.8rem;
	}
</style>
