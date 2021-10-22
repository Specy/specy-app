<script lang="ts">
</script>

<div class="page">
	<div class="center-wrapper">
		<div class="big-title" style="margin:  2rem 0;">Support me</div>
		<div class="floating-middle">
			<div class="text">
				Each App I develop takes months of learning and development. Added to that are also the
				costs of hosting. With a higher budget I can afford to not worry so much about how much I
				spend on the server, giving you the best possible experience.<br /><br />
				I care about giving users all features without having to pay for it, neither having intrusive
				ads which can be annoying. For this same reason, there is no source of income except donations.
				<br /><br />
				I would be really thankful if you could consider donating in order to fund development and costs.
			</div>
			<div class="donation-wrapper">
				<a href="https://www.buymeacoffee.com/specy" target="_blank">
					<img src="/images/buymeacoffee.svg" alt="buymeacoffee" class="donation-img" />
				</a>
				<a href="https://paypal.me/specyDev" target="_blank" class="paypal">
					<img src="/images/paypalme.png" alt="buymeacoffee" class="donation-img" />
				</a>
			</div>
		</div>
	</div>
</div>

<style lang="scss">
	.big-title {
		font-size: 2.5rem;
	}

	.center-wrapper {
		display: flex;
		align-items: center;
		flex-direction: column;
		flex: 1;
	}
	.floating-middle {
		display: flex;
		flex-direction: column;
		width: 35rem;
		min-height: 20rem;
		background-color: #fbfbfb;
		box-shadow: 1px 1px 5px rgba(69, 69, 89, 0.25);
		padding: 1rem;
		border-radius: 0.5rem;
	}
	.donation-wrapper {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-around;
		margin-top: 2rem;
	}
	.donation-wrapper a {
		margin-top: 0.5rem;
	}
	.donation-img {
		height: 4rem;
	}
	.paypal {
		background-color: #efefef;
		padding-left: 1rem;
		height: 4rem;
		border-radius: 0.8rem;
	}
	@media (max-width: 480px) {
		.floating-middle {
			width: 95vw;
		}
	}
</style>
