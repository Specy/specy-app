<script lang="ts">
	import MdClose from 'svelte-icons/md/MdClose.svelte';
	import MdMenu from 'svelte-icons/md/MdMenu.svelte';
	let logoToggled = false;
	let menuOpen = false;
</script>

<nav class="nav" id="nav">

	<div
		class="logo-wrapper"
		on:mouseenter={() => (logoToggled = true)}
		on:mouseleave={() => (logoToggled = false)}
	>
		<img src="/images/logo.png" alt="logo" class="logo" />
		<div class="name">
			<div>Specy</div>
			<div class="overflow-wrapper">
				<div class="logo-line-wrapper">
					<div class="logo-line" class:logoToggled />
					<div class="logo-app">
						<span> . </span>
						app
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="links">
		<a href="/">Home</a>
		<a href="/login">Login</a>
		<a href="/register">Register</a>
		<a href="/support">Support me</a>
	</div>
	<div class="mobile-menu">
		<div class="top-mobile-menu"  on:click={() => menuOpen = !menuOpen	}>
			{#if menuOpen}
				<MdClose />
			{:else}
				<MdMenu />
			{/if}
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
	.mobile-menu {
		position: absolute;
		right: 0;
		padding: 0.5rem;
		width: 100%;
		min-height: 4rem;
		justify-content: flex-end;
		align-items: center;
		display: none;
	}
	.top-mobile-menu {
		height: 2.5rem;
	}
	.logo {
		width: 3rem;
		height: 3rem;
		margin-right: 0.5rem;
	}
	.overflow-wrapper {
		width: 62px;
		overflow: hidden;
	}
	.logo-line-wrapper {
		display: flex;
		flex-direction: row;
		align-items: center;
		margin-top: -0.2rem;
		height: 1.2rem;
		width: 140px;
		> .logo-line {
			width: 30px;
			height: 2px;
			background-color: $accent;
			transition: all 0.3s ease-in-out;
		}
		> .logo-app {
			font-size: 0.8rem;
			margin-left: 2px;
			color: $accent;
			display: flex;
			flex-direction: row;
			font-weight: bold;
			> span {
				font-size: 1.2rem;
				height: 0.8rem;
				margin-top: -0.4rem;
			}
		}
	}
	.logoToggled {
		width: 62px !important;
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
		z-index: 2;
		flex-direction: column;
		position: absolute;
		top: 4rem;
		left:0%;
		padding:0.5rem;
		background-color: #fff;
		transform: translateX(100%) translateY(calc(-100% - 4rem));
		opacity: 0;
		display: flex;
		transition: all 0.2s ease-in-out;
		border-top: solid 2px $accent;
		border-bottom: solid 2px $accent;
		> a {
			padding: 0.5rem;
		}
	}
	.menuOpen{	
		opacity: 1;
		transform: translateX(0) translateY(0);
	}
	.links a:hover {
		color: $accent;
	}
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
		color: white;
	}
	.name {
		font-size: 1.3rem;
		font-weight: bold;
	}
	.logo-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: row;
	}
	.nav {
		padding: 0.2rem;
		border-radius: 0.5rem;
		margin: 3rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	@media screen and (orientation: portrait) {
		.mobile-menu{
			display:flex
		}
		.nav {
			margin: 0rem;
			padding: 1rem;
		}
		.links {
			display: none;
			flex-direction: column;
		}
	}
</style>
