import { ReactElement } from 'react';

// next
import { NextPageContext } from 'next';
import { getProviders, getCsrfToken } from 'next-auth/react';
// project import
import Layout from 'layout';
import Page from 'components/Page';
import Landing from 'sections/landing';
export default function HomePage() {
  return (
    <Page title="Landing">
      <Landing />
    </Page>
  );
}

HomePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout variant="landing">{page}</Layout>;
};


export async function getServerSideProps(context: NextPageContext) {
  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);

  return {
    props: { providers, csrfToken }
  };
}

