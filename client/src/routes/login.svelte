<script lang="ts">
	import Input from '$cmp/Input.svelte'
	import PasswordInput from '$cmp/PasswordInput.svelte'
	import FloatingContent from '$cmp/FloatingContent.svelte'
	import Form from '$cmp/Form.svelte'
	import Submit from '$cmp/Submit.svelte'
	import { toast } from '$cmp/toast'
	import storage from '../utils/storage'
	import { goto } from '$app/navigation'
	import { useMutation } from '$lib/apiFetch'

	let email = ''
	let password = ''
	import { User } from '../lib/user'

	const { fetchUser } = User
	const [executeLogin, isLogging] = useMutation('/auth/login', {
		method: 'POST',
		onError: (err) => {
			toast.error('Credentials are wrong')
			console.error(err)
		},
		onSuccess: (res) => {
			if (!res.accessToken) return toast.error('Error')
			storage.token = res.accessToken
			toast.success('Logged in')
			fetchUser()
			return goto('/profile')
		}
	})
</script>

<div class="page">
	<FloatingContent title="Login">
		<Form on:submit={() => executeLogin({ email, password })}>
			<div class="input-wrapper">
				<Input bind:value={email} title="E-mail" hideStatus={true} />
			</div>
			<div class="input-wrapper" style="margin-bottom: 0;">
				<PasswordInput bind:value={password} title="Password" hideStatus={true} />
			</div>
			<a class="forgot-password" href="/resetPassword"> Forgot password? </a>
			<div class="form-buttons-wrapper">
				<div class="note">* You will use those credentials in all apps</div>
				<Submit
					bg="rgb(219, 0, 97)"
					disabled={$isLogging}
					value={$isLogging ? 'Loading...' : 'Login'}
				/>
			</div>
		</Form>
	</FloatingContent>
</div>

<style lang="scss">
	@import '../variables.scss';

	.form-buttons-wrapper {
		display: flex;
		margin-top: 2rem;
		flex: 1;
		justify-content: flex-end;
		flex-direction: column;
		align-items: center;
	}
	.input-wrapper {
		margin-bottom: 1rem;
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
</style>
