<script lang="ts">
	import Input from '../components/Input.svelte'
	import PasswordInput from '../components/PasswordInput.svelte'
	import { toast } from '../components/toast'
	import storage from '../utils/storage'
	import { goto } from '$app/navigation'
	import { useMutation } from '$lib/apiFetch'
	let email = ''
	let password = ''
	import { User } from '../lib/user'
	
	const { fetchUser }  = User
	const [executeLogin,isLogging] = useMutation('/auth/login',{
		method:"POST",
		onError: (err) => { 
			toast.error("Credentials are wrong")
			console.error(err)
		},
		onSuccess: (res) => {
			if(!res.accessToken) return toast.error("Error")
			storage.token = res.accessToken
			toast.success("Logged in")
			fetchUser()
			return goto('/profile')
		}
	})
</script>

<div class="page">
	<div class="center-wrapper">
		<div class="big-title" style="margin:  2rem 0;">Login</div>
		<div class="floating-middle">
			<form
				on:submit={(e) => {
					e.preventDefault()
					executeLogin({ email, password })
				}}
			>
				<div class="input-wrapper">
					<Input bind:value={email} title="E-mail" hideStatus={true} />
				</div>
				<div class="input-wrapper" style="margin-bottom: 0;">
					<PasswordInput bind:value={password} title="Password" hideStatus={true} />
				</div>
				<a class="forgot-password" href="/resetPassword"> Forgot password? </a>
				<div class="form-buttons-wrapper">
					<div class="note">* You will use those credentials in all apps</div>
					<input
						type="submit"
						class="form-btn"
						style="background-color: rgb(219, 0, 97)"
						disabled={$isLogging}
						value={$isLogging ? 'Loading...' : 'Login'}
					/>
				</div>
			</form>
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
	.form-buttons-wrapper {
		display: flex;
		margin-top: 2rem;
		flex: 1;
		justify-content: flex-end;
		flex-direction: column;
		align-items: center;
	}
	form {
		display: flex;
		flex-direction: column;
		flex: 1;
		> .input-wrapper {
			margin-bottom: 1rem;
		}
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
	.note,
	.forgot-password {
		font-size: 0.9rem;
		color: $hint;
		text-align: left;
		width: 100%;
	}
	.forgot-password {
		text-align: right;
		color: $textDark;
		transition: all 0.2s;
	}
	.forgot-password:hover {
		color: $accent;
	}
	@media (max-width: 480px) {
		.floating-middle {
			width: 95vw;
		}
	}
</style>
