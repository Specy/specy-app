<script>
	import Input from '../components/Input.svelte';
	import * as EmailValidator from 'email-validator';
	import { passwordStrength } from 'check-password-strength'
	let email = '';
	let password = '';
	let username = '';
	let verifyPassword = '';
	async function register() {
		let body = {
			email: email,
			password: password,
			username: username,
			verifyPassword: verifyPassword
		};
		let response = await fetch('someApi', {
			method: 'POST',
			body: JSON.stringify(body)
		});
		console.log(response);
	}
</script>

<div class="page">
	<div class="center-wrapper">
		<div class="big-title" style="margin:  2rem 0;">Register</div>
		<div class="floating-middle">
			<form
				on:submit={(e) => {
					e.preventDefault();
					register();
				}}
			>
				<div>
					<Input bind:value={email} title="Email" status={EmailValidator.validate(email) ? "correct" : "wrong"}/>
				</div>
				<div>
					<Input bind:value={username} title="Username"  status={username.length > 3 ? "correct" : "wrong"}/>
				</div>
				<div>
					<Input bind:value={password} title="Password" type="password" status={passwordStrength(password).id > 0 ? "correct": "wrong"}/>
				</div>
				<div>
					<Input bind:value={verifyPassword} title="Confirm password" type="password" status={password === verifyPassword ? "correct" : "wrong"}/>
				</div>

				<div class="form-buttons-wrapper">
					<div class="note">
						* You will use those credentials to login in all apps
					</div>
					<input
						type="submit"
						class="form-btn"
						style="background-color: rgb(85, 143, 144)"
						value="Register"
					/>
				</div>
			</form>
		</div>
	</div>
</div>

<style lang="scss">
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
		margin-top: 2rem;
	}
	.note{
		font-size: 0.9rem;
		color: #999;
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
		min-height: 20rem;
		background-color: #fbfbfb;
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
