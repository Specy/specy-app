<script lang="ts">
	import MdClose from 'svelte-icons/md/MdClose.svelte';
	import MdMenu from 'svelte-icons/md/MdMenu.svelte';
	import Logo from './logo.svelte'
	let menuOpen = false;
</script>

<nav class="nav" id="nav">
	<div class="desktop-menu">
		<Logo />
		<div class="links">
			<a href="/">Home</a>
			<a href="/login">Login</a>
			<a href="/register">Register</a>
			<a href="/support">Support me</a>
		</div>
	</div>

	<div class="mobile-menu">
		<div class="mobile-row">
			<Logo logoToggled={menuOpen}/>
			<div class="top-mobile-menu"  on:click={() => menuOpen = !menuOpen	}>
				{#if menuOpen}
					<MdClose />
				{:else}
					<MdMenu />
				{/if}
			</div>
		</div>

		<div class="links-mobile" class:menuOpen>
			<a href="/" on:click={() => menuOpen = false}>Home</a>
			<a href="/login" on:click={() => menuOpen = false}>Login</a>
			<a href="/register" on:click={() => menuOpen = false}>Register</a>
			<a href="/support" on:click={() => menuOpen = false}>Support me</a>
		</div>
	</div>
</nav>

<style lang="scss">
	@import '../variables.scss';
	.desktop-menu{
		width: 100%;
		display: flex;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.mobile-row{
		display: flex;
		padding: 1rem;
		justify-content: space-between;
		align-items: center;
	}
	.mobile-menu {
		position: absolute;
		top: 0;
		right:0;
		background-color: white;
		padding-bottom: 0;
		width: 100%;
		display: none;
		flex-direction: column;
	}
	.top-mobile-menu {
		height: 2.5rem;
	}

	.links{
		display: flex;
		flex-direction: row;
		> a {
			margin: 1.5rem;
			transition: all 0.2s ease-in-out;
			cursor: pointer;
			text-decoration: none;
		}
	}


	.links-mobile{
		width: 100%;
		flex-direction: column;
		overflow: hidden;
		background-color: #fff;
		height: 0;
		display: flex;
		border-top-left-radius: 0.5rem;
		border-top-right-radius: 0.5rem;
		padding:0;
		border-bottom: solid 2px $accent;
		transition: all 0.4s ease-out;
		justify-content: space-around;
		> a {
			padding: 0.2rem;
			margin-left: 2rem ;
		}
	}
	.menuOpen{	
		opacity: 1;
		height: 10rem;
	}
	.links a:hover {
		color: $accent;
	}
	.nav {
		padding: 0.2rem;
		margin: 3rem;

		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	@media (max-width: 650px) {
		.mobile-menu{
			display:flex
		}
		.desktop-menu{
			display:none
		}
		.nav {
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
