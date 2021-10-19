<script>
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
			<div>You will use those credentials to login in all apps</div>
			<form
				on:submit={(e) => {
					e.preventDefault();
					register();
				}}
			>
				<div>
					<div>E-mail</div>
					<input bind:value={email} class="form-input" placeholder="Email"/>
				</div>
				<div>
					<div>Username</div>
					<input bind:value={username} class="form-input" placeholder="Username"/>
				</div>
				<div>
					<div>Password</div>
					<input type='password' bind:value={password} class="form-input" placeholder="Password"/>
				</div>
				<div>
					<div>Rewrite password</div>
					<input type='password' bind:value={verifyPassword} class="form-input" placeholder="Rewrite password"/>
				</div>

				<div class="form-buttons-wrapper">
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
	.form-input {
		width: 100%;
		height: 2rem;
		border-radius: 0.5rem;
		border: 1px solid #ccc;
		padding: 0.5rem;
	}
    input::placeholder{
        color:#ccc
    }
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
	.form-buttons-wrapper {
		display: flex;
		flex: 1;
		justify-content: flex-end;
		flex-direction: column;
		align-items: center;
	}
	form {
		display: flex;
		flex-direction: column;
		flex: 1;
		margin-top: 2rem;
        > div{
            margin-top: 1rem;
        }
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
	@media screen and (orientation: portrait) {
		.floating-middle {
			width: 95vw;
		}
	}
</style>
