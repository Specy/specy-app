<script>
	import { run } from 'svelte/legacy';

	import Input from '$cmp/Input.svelte'
	import PasswordInput from '$cmp/PasswordInput.svelte'
	import FloatingContent from '$cmp/FloatingContent.svelte'
	import Submit from '$cmp/Submit.svelte';
	import * as EmailValidator from 'email-validator'
	import checkStrenght from '$lib/checkPassword'
	import Form from '$cmp/Form.svelte'
	import { toast } from '$cmp/toast'
	import { useMutation } from '$lib/apiFetch'
	import { goto } from '$app/navigation'
	let email = $state('')
	let verificationCode = $state('')
	let newPassword = $state('')
	let step = $state(1)
	let isLoading = $state(false)
	const [sendCode, isLoadingToken] = useMutation('/account/token/send', {
		method: 'POST',
		onSuccess: (res) => {
			step = 2
			toast.success('Verification code sent')
		},
		onError: (err) => {
			console.log(err.response)
			toast.error('There was an error sending the token')
		}
	})
	const [sendReset, isLoadingReset] = useMutation('/account/recover/', {
		method: 'POST',
		onSuccess: (res) => {
			toast.success('Password succesfully reset')
			goto('/login')
		},
		onError: (err) => {
			console.log(err.response)
			toast.error(err.response?.data?.message)
		}
	})
	run(() => {
		isLoading = $isLoadingToken || $isLoadingReset
	});
</script>
<title>
	Reset password
</title>
<div class="page">
	<FloatingContent title="Reset Password">
		{#if step === 1}
			<Form
				on:submit={(e) => {
					if (!EmailValidator.validate(email)) return toast.error('Invalid email')
					sendCode({ email })
				}}
			>
				<div class="margin-bottom-1">
					<Input
						bind:value={email}
						title="Email"
						status={EmailValidator.validate(email) ? 'correct' : 'wrong'}
					/>
				</div>
				<div class="form-buttons-wrapper">
					<div class="note">A code will be sent to your email to change your password</div>
					<Submit
						bg='rgb(85, 143, 144)'
						value={isLoading ? 'Loading...' : 'Send code'}
					/>
				</div>
			</Form>
		{:else if step === 2}
			<Form
				on:submit={(e) => {
					if (checkStrenght(newPassword).id < 1) return toast.error('Password too weak')
					sendReset({ email, password: newPassword }, { params: verificationCode })
				}}
			>
				<div class="margin-bottom-1">
					<Input bind:value={verificationCode} title="Verification code" hideStatus={true} />
				</div>
				<div class="margin-bottom-1">
					<PasswordInput bind:value={newPassword} title="New password" />
				</div>
				<div class="form-buttons-wrapper">
					<div class="note">* You will use those credentials to login in all apps</div>
					<Submit
						bg='rgb(85, 143, 144)'
						value={isLoading ? 'Loading...' : 'Reset password'}
					/>
				</div>
			</Form>
		{/if}
		{#if step === 3}
			<div>
				Password changed successfully. You can now login
				<a href="/login" class="form-btn" style="background-color: rgb(85, 143, 144)">
					Go to login
				</a>
			</div>
		{/if}
	</FloatingContent>
</div>

<style lang="scss">
	.form-buttons-wrapper {
		display: flex;
		flex: 1;
		justify-content: flex-end;
		flex-direction: column;
		align-items: center;
		margin: 0;
		margin-top: 1rem;
	}
	.note {
		font-size: 0.9rem;
		color: var(--hint);
		text-align: left;
		width: 100%;
	}
	.margin-bottom-1{
		margin-bottom: 1rem;
	}
</style>
