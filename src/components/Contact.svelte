<!-- @migration-task Error while migrating Svelte code: `<tr>` is invalid inside `<table>` -->
<div class="wrapper">
    <div class="contact" id="contact">
        <a href="#contact" class="title">Contact me</a>
        <div class="text">
            For questions, bug reports, suggestions or work proposals, you can
            reach me here:
            <div class="contact-grid">
                <div>Email:</div>
                <div class="highlight">specy.dev@gmail.com</div>

                <div>LinkedIn:</div>
                <a
                    class="highlight"
                    href="https://www.linkedin.com/in/enrico-menichelli-5862a4211"
                    target="_blank"
                    rel="me noreferrer">Enrico Menichelli</a
                >
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
        gap: 0.5rem 0.8rem;
        margin-top: 1rem;
        grid-template-columns: max-content 1fr;
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
    a.highlight {
        justify-self: start;
        user-select: auto;
        text-decoration: underline;
        text-underline-offset: 0.15em;
    }

    .title {
        font-size: 1.6rem;
        font-weight: bold;
    }

    .text {
        line-height: 1.4;
        font-size: 1.1rem;
        color: #dbdbdb;
    }
</style>
