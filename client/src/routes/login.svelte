<script>
	import Input from '../components/Input.svelte'
	import PasswordInput from '../components/PasswordInput.svelte';
	let email = ''
	let password = ''
	async function login(){
		let body = {
				email: email,
				password: password
			}
		let response = await fetch('someApi',{
			method: 'POST',
			body: JSON.stringify(body)
		})
		console.log(response)
	}
</script>

<div class="page">
	<div class="center-wrapper">
		<div class="big-title" style="margin:  2rem 0;">
			Login
		</div>
		<div class="floating-middle">
			<form on:submit={(e) =>{e.preventDefault(); login()}}>
				<div class="input-wrapper">
					<Input 
						bind:value={email} 
						title='Email' 
						hideStatus = {true}
					/>
				</div>
				<div class="input-wrapper">
					<PasswordInput 
						bind:value={password} 
						title='Password'
						hideStatus = {true}
					/>
				</div>
				<div class="form-buttons-wrapper">
					<div class="note">
						* You will use those credentials in all apps
					</div>
					<input type="submit" class="form-btn" style="background-color: rgb(219, 0, 97)" value="Login"> 
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
		cursor: pointer;
	}
	.form-btn:hover {
		filter:brightness(1.2);
	}
	.form-buttons-wrapper {
		display: flex;
		flex: 1;
		justify-content: flex-end;
		flex-direction: column;
		align-items: center;
	}
	form{
		display: flex;
		flex-direction: column;
		flex:1;
		> .input-wrapper{
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
		min-height: 20rem;
		background-color: #f6f6f6c4;
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
	.note{
		font-size: 0.9rem;
		color: #999;
		text-align: left;
		width: 100%;
	}
	@media (max-width: 480px) {
		.floating-middle {
			width:95vw;
		}
	}
</style>
