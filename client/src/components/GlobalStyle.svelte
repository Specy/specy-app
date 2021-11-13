<style lang="scss">
	@import '../variables.scss';
	:global(body),
	:global(html) {
		min-height: 100vh;
		width: 100%;
		display: flex;
		flex-direction: column;
		overflow-x: hidden;
	}
	:global(html) {
		overflow-y: scroll;
	}
	:global(#svelte) {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
	:global(*) {
		margin: 0;
		padding: 0;
		font-family: Orienta;
		box-sizing: border-box;
		-webkit-tap-highlight-color: transparent;
		outline: none;
	}
	:global(a) {
		text-decoration: none;
		color: $textDark;
	}
	@media (min-width: 650px) {
		:global(::-webkit-scrollbar) {
			width: 6px;
		}
		:global(::-webkit-scrollbar-track) {
			background: rgb(206, 206, 206);
		}
		:global(::-webkit-scrollbar-thumb) {
			background: #888;
		}
		:global(::-webkit-scrollbar-thumb:hover) {
			background: #555;
		}
	}
</style>
