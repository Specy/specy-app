<!-- @migration-task Error while migrating Svelte code: `<tr>` is invalid inside `<table>` -->
<div class="wrapper">
    <div class="contact" id="contact">
        <a href="#contact" class="title">Contact me</a>
        <div class="text">
            If you have any questions, bug reports, suggestions, work proposal,
            anything, you can contact me at:
            <div class="contact-grid">
                <div>Email:</div>
                <div class="highlight">specy.dev@gmail.com</div>

                <div>Discord:</div>
                <div class="highlight">@Specy</div>
            </div>
        </div>
    </div>
</div>

<style lang="scss">
  .wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 2rem;
    margin-bottom: 5rem;
    padding: 1rem;
  }

  .contact-grid {
    display: grid;
    gap: 0.5rem;
    margin-top: 1rem;
    grid-template-columns: 4rem 1fr;
  }

  .contact {
    max-width: 50rem;
    width: min(100%, 50rem);
    display: flex;
    gap: 1rem;
    flex-direction: column;
    align-items: flex-start;
  }

  .highlight {
    color: var(--accent);
    user-select: all;
  }

  .title {
    font-size: 1.6rem;
    font-weight: bold;
  }

</style>
