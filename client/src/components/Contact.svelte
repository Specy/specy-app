<div class="wrapper">
	<div class="contact" id="contact">
		<div class="title">Contact me</div>
		<div class="text">
			If you have any questions, bug reports, suggestions, work proposal,
			anything, you can contact me at:
			<div class="contact-info">
				<span>Email: </span>&nbsp;&nbsp;&nbsp;
				<div>Specy.dev@gmail.com</div>
			</div>
			<div class="contact-info">
				<span>Discord: </span>
				<div>Specy#7347</div>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	@import "../variables.scss";
	.wrapper {
		width: 100%;
		display: flex;
		justify-content: center;
		margin-top: 6rem;
		margin-bottom: 5rem;
		padding: 1rem;
	}

	.contact {
		max-width: 50rem;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		> .text {
			margin: 1rem;
			line-height: 1.3rem;
			:nth-child(1) {
				margin-top: 1rem;
			}
		}
	}
	.contact-info {
		margin-top: 0.5rem;

		> span {
			color: $accent;
		}
		> div {
			display: inline;
			user-select: all;
		}
	}
	.title {
		font-size: 1.6rem;
		font-weight: bold;
	}

</style>
