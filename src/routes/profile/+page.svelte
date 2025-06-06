<script lang="ts">
	import { run } from 'svelte/legacy';

	import { User } from '$lib/user'
	import Input from '$cmp/Input.svelte'
	import ButtonLink from '$cmp/ButtonLink.svelte';
	import FaTrash from 'svelte-icons/fa/FaTrash.svelte'
	import { useMutation, useQuery } from '../../lib/apiFetch'
	import FloatingContent from '$cmp/FloatingContent.svelte'
	import { toast } from '$cmp/toast'
	import { onMount } from 'svelte'
	import Button from '$cmp/Button.svelte'
	import { goto } from '$app/navigation'
	import storage from '../../utils/storage'
	const { user, fetchUser } = User
	let username = $state($user?.username || '')
	let isLoading = $state(false)
	let tokens = $state([])
	user.subscribe(() => {
		username = $user?.username
	})
	const [updateTokens, isLoadingTokens] = useQuery('/users/tokens', {
		onSuccess: (res) => {
			if (res) tokens = res
		}
	})
	const [logout] = useMutation('/auth/logout', {
		method: 'POST',
		onSuccess: () => {
			toast.success('Logged out')
			storage.token = ''
			fetchUser()
			goto('/login')
		}
	})
	const [deleteToken, isDeletingToken] = useMutation('/users/tokens', {
		method: 'DELETE',
		onSuccess: () => {
			toast.success('Token deleted')
			updateTokens()
		},
		onError: (err) => {
			console.log(err.response)
			toast.error(err.response?.data?.message)
			fetchUser()
		}
	})
	const [updateUser, isUpdatingUser] = useMutation('/users', {
		method: 'PATCH',
		onError: (err) => {
			console.log(err.response)
			toast.error(err.response?.data?.message)
		},
		onSuccess: (res) => {
			toast.success('Profile updated')
			fetchUser()
		}
	})

	onMount(() => updateTokens())
	function update() {
		updateUser({ username }, { params: `/${$user.id}` })
	}
	run(() => {
		isLoading = $isUpdatingUser || $isDeletingToken
	});
</script>
<title>
	Profile
</title>
<div class="page">
	<FloatingContent title="Profile">
		{#if $user}
			<div>
				<Input bind:value={username} title="Username" hideStatus={true} />
			</div>
			<a href="/resetPassword" class="change-psw" > Change password </a>
			<div class="tokens-wrapper">
				Active sessions
				<div class="tokens-wrapper-inner" >
					{#each tokens as token}
						<div class="token">
							{new Date(token.createdAt).toLocaleString()}
							<div class="token-icons">
								<div style="color: rgb(237, 79, 79)" onclick={() => deleteToken({ id: token.id })}>
									<FaTrash />
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
			<div class="note" style="margin-top: 2rem;">
				* Here you can manage your account,it can be used in every app in this website by logging in
				here.
			</div>

			<Button
				on:click={update}
				bg="rgb(219, 0, 97)"
				disabled={isLoading}
				value={isLoading ? 'Loading...' : 'Update profile'}
			/>
			<Button bg="rgb(85, 143, 144)" on:click={logout} value="Logout" />
		{:else}
			Not logged in
			<ButtonLink href="/login" bg='rgb(219, 0, 97)' style='margin-top:2rem'>
				Go to login
			</ButtonLink>
		{/if}
	</FloatingContent>
</div>

<style lang="scss">
	.tokens-wrapper {
		display: flex;
		flex-direction: column;
		margin-top: 1rem;
	}
	.tokens-wrapper-inner {
		margin-top: 0.2rem;
		display: flex;
		flex-direction: column;
	}
	.token {
		background: rgba(214, 214, 214, 0.5);
		padding: 0.4rem 0.8rem;
		margin-top: 0.2rem;
		border-radius: 0.4rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.token-icons {
		display: flex;
		align-items: center;
	}
	.token-icons div {
		height: 1.2rem;
	}
	.note {
		font-size: 0.9rem;
		color: var(--hint);
		text-align: left;
		width: 100%;
	}
	.change-psw {
		width: 100%;
		margin-top: 0.5rem;
		border-radius: 0.5rem;
		color: white;
		text-align: center;
		display: flex;
		transition: all 0.2s;
		font-size: 1rem;
		justify-content: center;
		border: none;
		cursor: pointer;
		background-color: rgba(214, 214, 214, 0.5);
		color: var(--textFlip);
		padding: 0.5rem;
	}
	.change-psw:hover {
		filter: brightness(0.9);
	}
	.note{
		font-size: 0.9rem;
		color: var(--hint);
		text-align: left;
		width: 100%;
	}
	.dark{
		background-color: rgba(47, 51, 53, 0.5);
		color: #bfbfbf;
	}
</style>
