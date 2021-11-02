<script>
</script>

<div class="page">
	<div class="center-wrapper">
		<div class="big-title" style="margin:  2rem 0;">Profile</div>
		<div class="floating-middle">
			You managed to successfully login, you can now use those credentials in all the other apps
		</div>
	</div>
</div>

<style lang="scss">
	@import '../variables.scss';
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
		font-size: 1rem;
		justify-content: center;
		border: none;
		cursor: pointer;
	}
	.form-btn:hover {
		filter: brightness(1.2);
	}
	.form-buttons-wrapper {
		display: flex;
		margin-top: 2rem;
		flex: 1;
		justify-content: flex-end;
		flex-direction: column;
		align-items: center;
	}
	form {
		display: flex;
		flex-direction: column;
		flex: 1;
		> .input-wrapper {
			margin-bottom: 1rem;
		}
	}
	.big-title {
		font-size: 2.5rem;
	}
	.floating-middle {
		display: flex;
		flex-direction: column;
		width: 30rem;
		background-color: rgba(246, 246, 246, 0.8);
		backdrop-filter: blur(4px);
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
	.note,
	.forgot-password {
		font-size: 0.9rem;
		color: $hint;
		text-align: left;
		width: 100%;
	}
	.forgot-password {
		text-align: right;
		color: $textDark;
		transition: all 0.2s;
	}
	.forgot-password:hover {
		color: $accent;
	}
	@media (max-width: 480px) {
		.floating-middle {
			width: 95vw;
		}
	}
</style>
