<script>
	import Input from '$cmp/Input.svelte'
	import PasswordInput from '$cmp/PasswordInput.svelte'
	import FloatingContent from '$cmp/FloatingContent.svelte'
	import Form from '$cmp/Form.svelte'
	import Submit from '$cmp/Submit.svelte'
	import { toast } from '$cmp/toast'
	import * as EmailValidator from 'email-validator'
	import checkStrenght from '../lib/checkPassword'
	import { useMutation } from '../lib/apiFetch'
	let email = ''
	let password = ''
	let username = ''
	let confirmPassword = ''
	let verificationCode = ''
	let step = 1
	let isFetching = false
	const [sendCode, isSendingCode] = useMutation('/account/activate/send', {
		method: 'POST',
		onSuccess: () => {
			step = 2
			//TODO make all errors and success statuses log data from response
			toast.success('Code was sent to your email')
		},
		onError: (err) => {
			toast.error(err.message)
		}
	})
	const [register, isRegistering] = useMutation('/account/create', {
		method: 'POST',
		onSuccess: () => {
			step = 3
		},
		onError: () => {
			toast.error('Invalid token')
		}
	})
	function validateAndSend() {
		if (!EmailValidator.validate(email)) return toast.error('Invalid email')
		if (username.length < 4) return toast.error('Username must be at least 4 characters long')
		if (checkStrenght(password).id < 1)
			return toast.error(
				'Password must be at least 8 characters long, have An uppercase letter and one number'
			)
		if (password !== confirmPassword) return toast.error("Passwords don't match")
		sendCode({ email })
	}
	function registerUser() {
		register(
			{
				email,
				password,
				username,
				confirmPassword
			},
			{ params: `/${verificationCode}` }
		)
	}
	$: isFetching = $isRegistering || $isSendingCode
</script>

<div class="page">
	<FloatingContent title="Register">
		{#if step === 1}
			<Form on:submit={() => validateAndSend()}>
				<div>
					<Input
						bind:value={email}
						title="E-mail"
						status={EmailValidator.validate(email) ? 'correct' : 'wrong'}
					/>
				</div>
				<div>
					<Input
						bind:value={username}
						title="Username"
						status={username.length > 3 ? 'correct' : 'wrong'}
					/>
				</div>
				<div style="margin-bottom: 0;">
					<PasswordInput bind:value={password} title="Password" />
				</div>
				<div>
					<PasswordInput
						bind:value={confirmPassword}
						title="Confirm password"
						passwordToCheck={password}
					/>
				</div>
				<div class="note">
					Passwords must be at least 8 characters long, have an uppercase letter and one number
				</div>
				<div class="form-buttons-wrapper">
					<div class="note">* You will use those credentials to login in all apps</div>
					<Submit
						disabled={isFetching}
						bg="rgb(85, 143, 144)"
						value={!isFetching ? 'Register' : 'Loading...'}
					/>
				</div>
			</Form>
		{/if}
		{#if step === 2}
			<Form on:submit={(e) => registerUser()}>
				<div>
					A verification code was sent to the email "{email}" please paste it here.
				</div>
				<Input bind:value={verificationCode} title="Verification code" />
				<div class="form-buttons-wrapper">
					<Submit
						disabled={isFetching}
						bg="rgb(85, 143, 144)"
						value={!isFetching ? 'Register' : 'Loading...'}
					/>
				</div>
			</Form>
		{/if}
		{#if step === 3}
			<div>
				You successfully registered! You can now proceed to login.
				<a href="/login" class="form-btn" style="background-color: rgb(85, 143, 144)">
					Go to login
				</a>
			</div>
		{/if}
	</FloatingContent>
</div>

<style lang="scss">
	@import '../variables.scss';
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
		color: $hint;
		text-align: left;
		width: 100%;
	}
</style>
