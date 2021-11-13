<script lang="ts">
	import FaGithub from 'svelte-icons/fa/FaGithub.svelte'
	import FaDiscord from 'svelte-icons/fa/FaDiscord.svelte'
</script>

<footer class="footer">
	<div class="footer-inner">
		<div class="footer-justify">
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
				<a
					class="icon"
					href="https://discord.gg/Arsf65YYHq"
					target="_blank"
					style="margin-top: 0.2rem;"
				>
					<FaDiscord />
				</a>
			</div>
		</div>
		<div class="copyright">
			© {new Date().getFullYear()} Specy. All rights reserved.
		</div>
	</div>
</footer>

<style lang="scss">
	@import '../variables.scss';
	.logo-wrapper {
		display: flex;
		align-items: center;
		> .logo {
			width: 2rem;
			height: 2rem;
			margin-right: 0.5rem;
		}
		> div {
			font-size: 1rem;
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
		align-items: center;
		> .icon {
			display: flex;
			align-items: center;
			width: 2rem;
			margin-left: 1rem;
		}
	}
	.copyright {
		font-size: 0.8rem;
		margin-top: 0.3rem;
		color: lightgray;
	}
	.footer {
		margin-top: auto;
	}
	.footer-justify {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.footer-inner {
		height: 6rem;
		background-color: $dark;
		color: $textWhite;
		padding: 1.5rem;
		padding-bottom: 0rem;
		display: flex;
		margin-top: 3rem;
		flex-direction: column;
	}
	@media (max-width: 480px) {
		.footer-inner {
			padding: 1rem;
			height: unset;
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
	}
</style>
