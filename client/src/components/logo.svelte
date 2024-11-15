<script>
	/** @type {{logoToggled?: boolean}} */
	let { logoToggled = $bindable(false) } = $props();
</script>

<a
	class="logo-wrapper"
	onmouseenter={() => (logoToggled = true)}
	onmouseleave={() => (logoToggled = false)}
	href="/"
>
	<img src="/images/logo.png" alt="logo" class="logo" />
	<div class="name">
		<div>Specy</div>
		<div class="overflow-wrapper">
			<div class="logo-line-wrapper">
				<div class="logo-line" class:logoToggled></div>
				<div class="logo-app">
					<span> . </span>
					app
				</div>
			</div>
		</div>
	</div>
</a>

<style lang="scss">
	.logo-wrapper {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: row;
	}
	.logo {
		width: 3rem;
		height: 3rem;
		margin-right: 0.5rem;
	}

	.logoToggled {
		width: 70px !important;
	}
	.whiteText{
		color: #bfbfbf;
	}
	.name {
		font-size: 1.3rem;
		font-weight: bold;
	}
	.overflow-wrapper {
		width: 70px;
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
			background-color: var(--accent);
			transition: all 0.4s ease-in-out;
		}
		> .logo-app {
			font-size: 0.8rem;
			margin-left: 2px;
			color: var(--accent);
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
	@media (max-width: 650px) {
		.logo {
			width: 2.5rem;
			height: 2.5rem;
		}
	}
</style>
