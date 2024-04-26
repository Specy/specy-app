<div class="wrapper">
	<div class="contact" id="contact">
		<a href="#contact" class="title">Contact me</a>
		<div class="text">
			If you have any questions, bug reports, suggestions, work proposal,
			anything, you can contact me at:
			<table>
				<tr class="contact-info">
					<td>Email: </td>
					<td style="width: 1rem;"></td>
					<td>specy.dev@gmail.com</td>
				</tr>
				<tr class="contact-info">
					<td>Discord: </td>
					<td style="width: 1rem;"></td>
					<td>@Specy</td>
				</tr>
			</table>
		</div>
	</div>
</div>

<style lang="scss">
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

		> :nth-child(1) {
			color: var(--accent);
		}
		> :last-child{
			user-select: all;
		}
	}
	.title {
		font-size: 1.6rem;
		font-weight: bold;
	}

</style>
