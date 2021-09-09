<script lang="ts">
    import FaGithub from 'svelte-icons/fa/FaGithub.svelte'
    import FaDiscord from 'svelte-icons/fa/FaDiscord.svelte'
</script>

<div class="footer-wrapper ">
	<div class="footer">
		<div class="logo-wrapper">
			<img src="/images/logo.png" alt="logo" class="logo" />
			<div>Specy</div>
		</div>
        <div class="icon-wrapper">
            <div class="icon">
                <FaGithub/>
            </div>
            <div class="icon">
                <FaDiscord/>
            </div>
        </div>
	</div>

</div>

<style lang="scss">
	@import "variables.scss";
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
    .icon-wrapper{
        display: flex;
        flex-direction: row;
        > .icon {
            width: 2rem;
            margin-left: 1rem;
        }
    }
	.footer-wrapper {
		flex: 1;
		display: flex;
		flex-direction: column;
		margin-top: 5rem;
		justify-content: flex-end;
	}
	.footer {
		height: 5rem;
		background-color: $dark;
		color: $textWhite;
		padding: 3rem 3rem 3rem 3rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: absolute;
        width: 100%;
        left: 0;
	}
</style>
