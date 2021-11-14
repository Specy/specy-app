<script lang="ts">
	import MdClose from 'svelte-icons/md/MdClose.svelte'
	import MdMenu from 'svelte-icons/md/MdMenu.svelte'
	import FaUser from 'svelte-icons/fa/FaUser.svelte'
	import Logo from './logo.svelte'
	import { page } from '$app/stores';	
	import { User } from '../lib/user'
	import { theme } from "$lib/theme";
	const { user} = User
	let path = $page.path
	$: path = $page.path
	let scrollY = 0
	let lastPosition = 10
	let navHidden = false
	let menuOpen = false;
	$: {
		if(!menuOpen && scrollY > 300){
			navHidden = scrollY > lastPosition
			lastPosition = scrollY
		}else{
			navHidden = false
		}
	}
</script>
<svelte:window bind:scrollY />
<nav class="nav">
	<div class="desktop-menu">
		<Logo />
		<div class="links" style={$user ? "margin-right:7rem": ""} class:whiteText={$theme === 'dark'}>
			<a href="/" style={path === "/" ? "color:#b00752" : ""}>Home</a>
			<a href="/register" style={path === "/register" ? "color:#b00752" : ""}>Register</a>
		</div>
		{#if $user}
			<a href="/profile" class="profile" class:darkIcon={$theme === 'dark'}>
				<FaUser /> 
			</a>
		{:else}	
			<a href="/login" class='login'>Login</a>
		{/if}

		
	</div>

	<div class="mobile-menu" class:navHidden class:mobileMenuDark={$theme === 'dark'}>
		<div class="mobile-row">
			<Logo logoToggled={menuOpen}/>
			<div class="top-mobile-menu" >
				{#if $user}
					<a href="/profile" class="profile" class:darkIcon={$theme === 'dark'}>
						<FaUser /> 
					</a>
				{/if}
				<div on:click={() => {menuOpen = !menuOpen}} style='height:2rem' class:darkIcon={$theme === 'dark'}>
					{#if menuOpen}
						<MdClose />
					{:else}
						<MdMenu />
					{/if}
				</div>

			</div>
		</div>

		<div class="links-mobile" class:menuOpen class:mobileMenuDark={$theme === 'dark'}>
			<a 
				href="/" 
				on:click={() => menuOpen = false}
				style={path === "/" ? "color:#b00752" : ""}
			>Home</a>
			<a 
				href="/login" 
				on:click={() => menuOpen = false}
				style={path === "/login" ? "color:#b00752" : ""}
			>Login</a>
			<a 
				href="/register" 
				on:click={() => menuOpen = false}
				style={path === "/register" ? "color:#b00752" : ""}
			>Register</a>
			{#if $user}
				<a 
				href="/profile" 
				on:click={() => menuOpen = false}
				style={path === "/profile" ? "color:#b00752" : ""}
				>Profile</a>
			{/if}

		</div>
	</div>
</nav>

<style lang="scss">
	@import '../variables.scss';
	.login {
		background-color: transparent;
		border: solid 2px $accent;
		color: $accent;
		padding: 0.5rem 1.5rem;
		border-radius: 2rem;
		transition: all 0.2s ease-in-out;
	}
	.login:hover {
		background-color: $accent;
		color: white !important;
	}
	.desktop-menu{
		width: 100%;
		display: flex;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.mobile-row{
		display: flex;
		padding: 0.75rem;
		justify-content: space-between;
		align-items: center;
	}
	.profile{
		display: flex;
		align-items: center;
		height:2rem;
		color: $textFlip;
		transition: all 0.3s;
	}
	.profile:hover{
		color: $accent;
	}
	.mobile-menu {
		position: absolute;
		top: 0;
		right:0;
		padding-bottom: 0;
		background-color: rgba(255,255,255, 0.96);
		width: 100%;
		display: none;
		flex-direction: column;
		transition: all 0.2s ease-out;
		
		transform: translateY(0);
	}
	.mobileMenuDark{
		background-color: rgba(29, 32, 33, 0.9);
		color: #bfbfbf;
		> * {
			color: #bfbfbf;
		}
	}
	.navHidden{
		transform: translateY(-5rem);
		transition: all 0.5s ease-out;
	}
	.top-mobile-menu {
		height: 2rem;
		display: flex;
		align-items: center;
	}

	.links{
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-right: 3rem;
		> a {
			margin-left: 1.5rem;
			transition: all 0.2s ease-in-out;
			cursor: pointer;
			text-decoration: none;
		}
	}
	.whiteText{
		color: #bfbfbf;
		> * {
			color:#bfbfbf;
		}
	}

	.links-mobile{
		width: 100%;
		flex-direction: column;
		overflow: hidden;
		height: 0;
		display: flex;
		padding:0;
		transition: all 0.4s ease-out;
		justify-content: space-around;
		> a {
			padding: 0.2rem;
			margin-left: 2rem ;
		}
	}
	.menuOpen{	
		opacity: 1;
		border-bottom: solid 2px $accent;
		height: 10rem;
	}
	.links a:hover {
		color: $accent;
	}
	.nav {
		padding: 0.2rem;
		margin: 3rem;
		margin-top: 2rem;
		margin-bottom: 0;
		display: flex;
		z-index: 10;
		justify-content: space-between;
		align-items: center;
	}
	.darkIcon{
		color: #bfbfbf;
	}
	@media (max-width: 650px) {
		.mobile-menu{
			display:flex
		}
		.desktop-menu{
			display:none
		}
		.profile{
			margin-right: 1rem;
			padding: 0.3rem;
		}
		.nav {
			position: fixed;
			width: 100%;
			margin: 0rem;
			margin-bottom: 2rem;
			padding: 1rem;
		}
		.links {
			display: none;
			flex-direction: column;
		}
	}

</style>
