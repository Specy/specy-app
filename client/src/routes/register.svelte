<script>
	import Input from '../components/Input.svelte'
	import PasswordInput from '../components/PasswordInput.svelte'
	import * as EmailValidator from 'email-validator'
	import checkStrenght from '../lib/checkPassword'
	import {toast} from "../components/toast"
	let email = ''
	let password = ''
	let username = ''
	let confirmPassword = ''
	let verificationCode = ''
	let step = 1
	async function register() {

		let body = {
			email: email,
			password: password,
			confirmPassword: confirmPassword,
			username: username,
			token: parseInt(verificationCode)
		}	
		let response = await fetch('http://localhost:3001/account/register', {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(data => data.json())
		console.log(response)
		if(response.error) return toast.set({title:"Error", message:response.message, duration:3000});
		return toast.set({title:"Success", message:response.message, duration:3000});
	}
	async function sendVerificationCode(){
		if(!EmailValidator.validate(email)) return toast.set({title:"Error", message:"Invalid email", duration:3000});
		if(username.length < 4) return toast.set({title:"Error", message:"Username must be at least 4 characters", duration:3000});
		if(checkStrenght(password).id < 1 ) return toast.set({title:"Error", message:"Password must be at least 8 characters long, have An uppercase letter and one number", duration:4000});
		if (password !== confirmPassword) return toast.set({title:"Error", message:"Passwords don't match", duration:3000});
		let obj = {
			email:email
		}
		let response = await fetch("http://localhost:3001/account/verify",{
			method: 'POST',
			body: JSON.stringify(obj),
			headers: {
				'Content-Type': 'application/json'
			}
		}).then(data => data.json())
		console.log(response)
		if(response.status === 'success'){
			return 	step = 2
		}	
		if(response.error) return toast.set({title:"Error", message:response.message, duration:3000});

	}
</script>

<div class="page">
	<div class="center-wrapper">
		<div class="big-title" style="margin:  2rem 0;">Register</div>
		<div class="floating-middle">
			{#if step === 1}
			<form
				on:submit={(e) => {
					e.preventDefault();
					sendVerificationCode();
				}}
			>
				<div>
					<Input 
						bind:value={email} 
						title="E-mail" 
						status={EmailValidator.validate(email) ? "correct" : "wrong"}
					/>
				</div>
				<div>
					<Input 
						bind:value={username} 
						title="Username"  
						status={username.length > 3 ? "correct" : "wrong"}
					/>
				</div>
				<div style="margin-bottom: 0;">
					<PasswordInput 
						bind:value={password} 
						title="Password" 
					/>
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
			{/if}
			{#if step === 2}
				<form
					on:submit={(e) => {
						e.preventDefault();
						register();
					}}
				>
					<div>
						A verification code was sent to the email "{email}" please paste it here.
					</div>
					<Input 
						bind:value={verificationCode} 
						title="Verification code" 
					/>
					<div class="form-buttons-wrapper">
						<input
							type="submit"
							class="form-btn"
							style="background-color: rgb(85, 143, 144)"
							value="Register"
						/>
					</div>
				</form>
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
		filter:brightness(1.2);
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
	.note{
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
		
		background-color: rgba(246, 246, 246, 0.8);;
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
