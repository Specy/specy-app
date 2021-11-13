<script>
	import Input from '../components/Input.svelte'
	import PasswordInput from '../components/PasswordInput.svelte'
	import * as EmailValidator from 'email-validator'
	import checkStrenght from '../lib/checkPassword'
	import { toast } from '../components/toast'
	import { useMutation,useQuery } from '$lib/apiFetch'
import { goto } from '$app/navigation';
	let email = ''
	let verificationCode = ''
	let newPassword = ''
	let step = 1
	let isLoading = false
	const [sendCode, isLoadingToken] = useMutation("/account/token/send",{
		method: "POST",		
		onSuccess: (res) => {
			step = 2
			toast.success("Verification code sent")
		},
		onError: (e) => {
			console.log(e)
			toast.error("There was an error sending the token")
		}
	})
	const [sendReset,isLoadingReset] = useMutation("/account/recover",{
		method:"POST",
		onSuccess: (res) => {
			toast.success("Password succesfully reset")
			goto('/login')
		},
		onError: (e) => {
			console.log(e)
			toast.error("There was an error sending the token")
		}
	})
	$: isLoading = $isLoadingToken || $isLoadingReset
</script>

<div class="page">
	<div class="center-wrapper">
		<div class="big-title" style="margin:  2rem 0;">Reset password</div>
		<div class="floating-middle">
			{#if step === 1}
				<form
					on:submit={(e) => {
						e.preventDefault()
						if (!EmailValidator.validate(email)) return toast.error("Invalid email")
						sendCode({email})
					}}
				>
					<div>
						<Input
							bind:value={email}
							title="Email"
							status={EmailValidator.validate(email) ? 'correct' : 'wrong'}
						/>
					</div>
					<div class="form-buttons-wrapper">
						<div class="note">A code will be sent to your email to reset the password</div>
						<input
							type="submit"
							class="form-btn"
							style="background-color: rgb(85, 143, 144)"
							value={isLoading ? 'Loading...' : 'Send code'}
						/>
					</div>
				</form>
			{:else if step === 2}
				<form
					on:submit={(e) => {
						e.preventDefault()
						sendReset({email,password:newPassword},{params: verificationCode})
					}}
				>
					<div>
						<Input bind:value={verificationCode} title="Verification code" hideStatus={true} />
					</div>
					<div>
						<PasswordInput bind:value={newPassword} title="New password" />
					</div>
					<div class="form-buttons-wrapper">
						<div class="note">* You will use those credentials to login in all apps</div>
						<input
							type="submit"
							class="form-btn"
							style="background-color: rgb(85, 143, 144)"
							value={isLoading ? 'Loading...' : 'Reset password'}
						/>
					</div>
				</form>
			{/if}
			{#if step === 3}
				<div>
					Password changed successfully. You can now login
					<a href="/login" class="form-btn" style="background-color: rgb(85, 143, 144)">
						Go to login
					</a>
				</div>
			{/if}
		</div>
	</div>
</div>

<style lang="scss">
	@import '../variables.scss';
	.form-btn {
		width: 100%;
		padding: 0.5rem;
		margin-top: 0.5rem;
		border-radius: 0.5rem;
		color: white;
		text-align: center;
		font-weight: bold;
		display: flex;
		transition: all 0.2s;
		padding-left: 0.8rem;
		font-size: 1rem;
		justify-content: center;
		border: none;
		cursor: pointer;
	}
	.form-btn:hover {
		filter: brightness(1.2);
	}
	form {
		display: flex;
		flex-direction: column;
		flex: 1;
		> div {
			margin-bottom: 1rem;
		}
	}
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
	.big-title {
		font-size: 2.5rem;
	}
	.floating-middle {
		display: flex;
		flex-direction: column;
		width: 30rem;

		background-color: rgba(246, 246, 246, 0.8);
		backdrop-filter: blur(4px);
		box-shadow: 1px 1px 5px rgba(69, 69, 89, 0.25);
		padding: 1rem;
		border-radius: 0.5rem;
	}
	.center-wrapper {
		display: flex;
		align-items: center;
		flex-direction: column;
		flex: 1;
	}
	@media (max-width: 480px) {
		.floating-middle {
			width: 95vw;
		}
	}
</style>
