<script lang="ts">
	import FaGithub from "svelte-icons/fa/FaGithub.svelte";
	import FaDiscord from "svelte-icons/fa/FaDiscord.svelte";
</script>

<footer class="footer">
	<div class="logo-wrapper">
		<img src="/images/logo.png" alt="logo" class="logo" />
		<div>Specy</div>
	</div>
	<div>
		<a href="https://specy.github.io/" target="_blank"> Portfolio </a>
	</div>
	<div class="icon-wrapper">
		<a class="icon" href="https://github.com/Specy" target="_blank">
			<FaGithub />
		</a>
		<a class="icon" href="https://discord.gg/kBUjXGqnut" target="_blank">
			<FaDiscord />
		</a>
	</div>
</footer>

<style lang="scss">
	@import "../variables.scss";
	.logo-wrapper {
		display: flex;
		align-items: center;
		> .logo {
			width: 3rem;
			height: 3rem;
			margin-right: 0.5rem;
		}
		> div {
			font-size: 1.5rem;
		}
	}
	a {
		color: white;
		transition: all 0.2s ease-in-out;
	}
	a:hover {
		color: $accent;
	}
	.icon-wrapper {
		display: flex;
		flex-direction: row;
		> .icon {
			width: 2rem;
			margin-left: 1rem;

		}
	}
	.footer {
		height: 5rem;
		background-color: $dark;
		color: $textWhite;
		padding: 3rem;
		display: flex;
		justify-content: space-between;
		align-items: center;
		left: 0;
	}
	@media screen and (orientation: portrait) {
		.footer {
			padding: 1rem;
			border-top: 2px solid $textDark;
			background-color: transparent;
			color: $textDark;
		}
		.logo-wrapper {
			> .logo {
				width: 2rem;
				height: 2rem;
			}
			> div {
				font-size: 1.2rem;
			}
		}
		.icon-wrapper .icon{
			color: $dark;
		}
		a {
		color: $textDark;
		transition: all 0.2s ease-in-out;
	}
	}
</style>
