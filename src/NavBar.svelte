<script lang="ts">
	let logoToggled = false
</script>

<div class="nav">
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
		<div>Apps</div>
		<div>Contact</div>
		<div>Support Me</div>
	</div>
	<button class="login"> Login </button>
</div>

<style lang="scss">
	@import "variables.scss";
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
	.links {
		display: flex;
		flex-direction: row;
		> div {
			margin: 1.5rem;
			transition: all 0.2s ease-in-out;
			cursor: pointer;
		}
	}
	.links div:hover {
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
</style>
