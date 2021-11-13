<script lang="ts">
	import { User } from '../lib/user'
	import Input from '../components/Input.svelte'
	import FaTrash from 'svelte-icons/fa/FaTrash.svelte'
	import { useMutation, useQuery } from '../lib/apiFetch'
	import { toast } from '../components/toast'
	import { onMount } from 'svelte'
	const { user, fetchUser} = User
	let username = $user?.username || ''
	let isLoading = false
	let tokens = []
	user.subscribe(() => {
		username = $user?.username
	})
	const [updateTokens, isLoadingTokens ] = useQuery('/users/tokens',{
		onSuccess:(res) =>{
			if(res) tokens = res
		}
	})
	const [deleteToken, isDeletingToken ] = useMutation('/users/tokens',{
		method: "DELETE",
		onSuccess: () => {
			toast.success("Token deleted")
			updateTokens()
		},
		onError: () => {
			toast.error("Error deleting token")
			fetchUser()
		}
	})
	const [ updateUser, isUpdatingUser ] = useMutation('/users',{
		method: "PATCH",
		onError: (err) => {
			console.log(err)
			toast.error("Error updating")
		},
		onSuccess: (res) => {
			console.log(res)
			toast.success("Profile updated")
			fetchUser()
		}
	})
	onMount(() => {
		updateTokens()
	})
	function update(){
		updateUser({username},{params:`/${$user.id}`})
	}
	$: isLoading = $isUpdatingUser || $isDeletingToken
</script>

<div class="page">
	<div class="center-wrapper">
		<div class="big-title" style="margin:  2rem 0;">Profile</div>
		<div class="floating-middle">
			{#if $user}
				<div>
					<Input bind:value={username} title="Username" hideStatus={true} /> 
				</div>
				<div class="tokens-wrapper">
					Tokens
					<div class="tokens-wrapper-inner">
						{#each tokens as token}
							<div class="token">
								{new Date(token.createdAt).toLocaleString()}
								<div class="token-icons">
									<div style='color: rgb(237, 79, 79)' on:click={() => deleteToken({id: token.id})}>
										<FaTrash />
									</div>
									
								</div>
							</div>
						{/each}
					</div>

				</div>
				<div class="note" style="margin-top: 2rem;">* Here you can manage your account,it
					can be used in every app in this website by logging in here.
				</div>

				<input
					type="submit"
					class="form-btn"
					on:click={update}
					style="background-color: rgb(219, 0, 97);"
					disabled={isLoading}
					value={isLoading ? 'Loading...' : 'Update profile'}
				/>	
			{:else}
				Not logged in
				<a class="form-btn" href="/login" style="background-color: rgb(219, 0, 97); margin-top:2rem;">
					Go to login
				</a>
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
	.tokens-wrapper{
		display:flex;
		flex-direction: column;
		margin-top: 1rem;
	}
	.tokens-wrapper-inner{
		margin-top: 0.2rem;
		display: flex;
		flex-direction: column;

	}
	.token{
		background: rgba(214, 214, 214, 0.5);
		padding: 0.4rem 0.8rem;
		margin-top: 0.2rem;
		border-radius: 0.4rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.token-icons{
		display: flex;
		align-items: center;
	}
	.token-icons div{
		height: 1.5rem;
	}
	.note{
		font-size: 0.9rem;
		color: $hint;
		text-align: left;
		width: 100%;
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
