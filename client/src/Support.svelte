<script lang='ts'> 

</script>
<div class="wrapper">
	<div class="support" id="support">
		<div class="title">Support Me</div>
		<div class="text">
			Each App I develop takes months of learning and development. Added to that
			are also the costs of hosting. With a higher budget I can afford to not
			worry so much about how much I spend on the server, giving you the best
			possible experience.<br />I care about giving users all features without
			having to pay for it, neither having intrusive ads which can be annoying.
			For this same reason, there is no source of income except donations.
			<br /><br />
			I would be really thankful if you could consider donating in order to fund
			development and costs
		</div>
		<div class="row">
			<a href="https://www.buymeacoffee.com/specy" target="_blank">
				<img src="/images/buymeacoffee.svg" alt="buymeacoffee" />
			</a>
			<a href="https://paypal.me/specyDev" target="_blank" class="paypal">
				<img src="/images/paypalme.png" alt="buymeacoffee" />
			</a>
		</div>
	</div>
</div>

<style lang="scss">
	.wrapper {
		width: 100%;
		display: flex;
		justify-content: center;
		margin-top: 6rem;
	}

	.support {
		width: 60%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;

		> .row {
			display: flex;
			justify-content: space-around;
			width: 80%;
			margin-top: 1rem;
			> a img {
				height: 4rem;
				margin-right: 2rem;
			}
		}
		> .text {
			margin: 1rem;
			width: 80%;
			line-height: 1.3rem;
		}
	}
	.title {
		font-size: 1.6rem;
		font-weight: bold;
	}
	@media (max-width: 480px) {
		.support {
			width: 100%;
			.text {
				width: 100%;
				margin: 0;
				margin-top: 1rem;
			}

			.row {
				flex-direction: column;
				align-items: center;
				width: 100%;
				> a img {
					margin-right: 0;
					margin-bottom: 0.5rem;
				}
			}
		}
	}
	.paypal {
		background-color: #efefef;
		padding-left: 1rem;
		height: 4rem;
		border-radius: 0.8rem;
	}
</style>
