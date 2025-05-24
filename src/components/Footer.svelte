<script lang="ts">
	import FaGithub from "svelte-icons/fa/FaGithub.svelte"
	import FaDiscord from "svelte-icons/fa/FaDiscord.svelte"
	import FaSun from "svelte-icons/fa/FaSun.svelte"
	import FaMoon from "svelte-icons/fa/FaMoon.svelte"
	import { themeStorage } from "$stores/themeStore"
	const current = $themeStorage.current

	function toggleTheme() {
		const themes = $themeStorage.themes
		const light = themes.find((t) => t.meta.name === "light")!
		const dark = themes.find((t) => t.meta.name === "dark")!
		themeStorage.setCurrentTheme($current.meta.name === "light" ? dark : light)
	}
</script>

<footer class="footer">
	<div class="footer-inner">
		<div class="footer-justify">
			<div class="logo-mobile">
				<a
					class="logo-wrapper"
					href="https://portfolio.specy.app"
					target="_blank"
				>
					<img src="/images/logo.png" alt="logo" class="logo" />
					<div>Portfolio</div>
				</a>
			</div>
			<div class="logo-desktop">
				<div class="logo-wrapper">
					<img src="/images/logo.png" alt="logo" class="logo" />
					<div class="logo-text">Specy</div>
				</div>
			</div>

			<div class="desktop-portfolio">
				<a href="https://portfolio.specy.app" target="_blank"> Portfolio </a>
			</div>
			<div class="icon-wrapper">
				<a title="Open github profile" class="icon" href="https://github.com/Specy" target="_blank">
					<FaGithub />
				</a>
				<a
					title="Enter Discord server"
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
		color: var(--footer-text);
		transition: all 0.2s ease-in-out;
	}
	a:hover {
		color: var(--accent);
	}
	.icon-wrapper {
		display: flex;
		flex-direction: row;
		align-items: center;
		> .icon {
			display: flex;
			align-items: center;
			width: 2rem;
			color: var(--footer-text);
			margin-left: 1rem;
			cursor: pointer;
			&:hover {
				color: var(--accent);
			}
		}
	}
	.copyright {
		font-size: 0.8rem;
		margin-top: 0.3rem;
	}
	.footer {
		margin-top: auto;
		z-index: 2;
	}
	.footer-justify {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.footer-inner {
		height: 6rem;
		padding: 1.5rem;
		padding-bottom: 0rem;
		display: flex;
		z-index: 2;
		flex-direction: column;
		background-color: var(--footer);
		color: var(--footer-text);
	}
	.logo-mobile {
		display: none;
	}
	@media (max-width: 480px) {
		.footer-inner {
			padding: 1rem;
			height: unset;
		}
		.copyright {
			margin-top: 1.2rem;
		}
		.logo-wrapper {
			> .logo {
				width: 2rem;
				height: 2rem;
			}
		}
		.logo-mobile {
			display: flex;
		}
		.logo-desktop {
			display: none;
		}
		.desktop-portfolio {
			display: none;
		}
	}
</style>
