<script>
</script>

<div class="page">
	<div class="center-wrapper">
		<div class="big-title" style="margin: 2rem 0;">Welcome</div>
		<div class="floating-middle">
			<div>
				Here you can decide to login or create a new account that will work for all apps contained
				in this website.
			</div>
			<div class="form-buttons-wrapper">
				<a href="/login" class="form-btn" style="background-color: rgb(219, 0, 97)"> Login </a>
				<div>or</div>
				<a href="/register" class="form-btn" style="background-color: rgb(85, 143, 144)">
					Register
				</a>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.form-btn {
		width: 100%;
		padding: 0.5rem;
		margin-top: 0.5rem;
		border-radius: 0.5rem;
		color: white;
		text-align: center;
		font-weight: bold;
		display: flex;
		transition: all 0.2s;
		padding-left: 0.8rem;
		justify-content: center;
	}
	.form-buttons-wrapper {
		display: flex;

		flex: 1;
		justify-content: flex-end;
		flex-direction: column;
		align-items: center;
		> div {
			margin: 0.5rem;
			text-align: center;
		}
	}
	.big-title {
		font-size: 2.5rem;
	}
	.floating-middle {
		display: flex;
		flex-direction: column;
		width: 30rem;

		background-color: #fbfbfb;
		box-shadow: 1px 1px 5px rgba(69, 69, 89, 0.25);
		padding: 1rem;
		border-radius: 0.5rem;
	}
	.center-wrapper {
		display: flex;

		align-items: center;
		flex-direction: column;
		flex: 1;
	}
	@media (max-width: 480px) {
		.floating-middle {
			width: 95vw;
		}
	}
</style>
