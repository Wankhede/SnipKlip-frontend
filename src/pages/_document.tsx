import { Html, Head, Main, NextScript } from 'next/document';
import { BRAND } from 'config/branding';

export default function Document() {
    return (
        <Html>
            <Head>
                <meta name="theme-color" content="#2296f3" />
                <meta name="title" content={BRAND.META.title} />
                <meta name="description" content={BRAND.META.description} />
                <meta name="keywords" content="salon, haircuts, coloring, spa treatments, online booking, appointments" />

                <link rel="shortcut icon" href={BRAND.FAVICON} />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap&family=Public+Sans:wght@400;500;600;700"
                    rel="stylesheet"
                />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
