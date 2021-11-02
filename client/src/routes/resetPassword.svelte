<script>
	import Input from '../components/Input.svelte';
    import PasswordInput from '../components/PasswordInput.svelte';
	import * as EmailValidator from 'email-validator';
    import checkStrenght from '../lib/checkPassword';
	import {toast} from "../components/toast"
	let email = ''
	let verificationCode = ''
    let newPassword = ''
	let step = 1
	let isFetching = false
	async function sendEmail() {
		if (!EmailValidator.validate(email)) return toast.set({title:"Error", message:"Invalid email", duration:3000});
		isFetching = true
		let response = await fetch('http://localhost:3001/account/sendCode', {
			method: 'POST',
			body: JSON.stringify({email: email}),
			headers: {
				'Content-Type': 'application/json'
			}
		})
		isFetching = false
		let data = await response.json()
		if(response.ok){
			step = 2
			newPassword = ''

			return toast.set({title:"Success", message:"Verification code sent", duration:3000})	
		}
		return toast.set({title:"Error", message:data.message, duration:3000})
	}
	async function resetPassword() {
        if(checkStrenght(newPassword).id < 1 ) return toast.set({title:"Error", message:"Password must be at least 8 characters long, have An uppercase letter and one number", duration:4000});
        toast.set({title:"Warning", message:"Feature coming soon", duration:3000});
        let body = {
			email: email,
			token: verificationCode,
			password: newPassword
		}
		isFetching = true
		let response = await fetch('http://localhost:3001/account/changePassword', {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json'
			}
		})
		let data = await response.json()
		isFetching = false
		if(response.ok){
			step = 3
			return toast.set({title:"Success", message:"Password successfully reset", duration:4000});
		}
		return toast.set({title:"Error", message:data.message, duration:4000});
    }
</script>

<div class="page">
	<div class="center-wrapper">
		<div class="big-title" style="margin:  2rem 0;">Reset password</div>
		<div class="floating-middle">
			{#if step === 1}
				<form
					on:submit={(e) => {
						e.preventDefault();
						sendEmail();
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
							value={isFetching ? 'Loading...' : 'Send code'}
						/>
					</div>
				</form>
			{:else if step === 2}
                <form
                    on:submit={(e) => {
                        e.preventDefault();
                        resetPassword();
                    }}
                >
                    <div>
                        <Input
                            bind:value={verificationCode}
                            title="Verification code"
                            hideStatus={true}
                        />
                    </div>
                    <div>
                        <PasswordInput
                            bind:value={newPassword}
                            title="New password"
                        />
                    </div>
                    <div class="form-buttons-wrapper">
                        <div class="note">* You will use those credentials to login in all apps</div>
                        <input
                            type="submit"
                            class="form-btn"
                            style="background-color: rgb(85, 143, 144)"
                            value={isFetching ? 'Loading...' : 'Reset password'}
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
