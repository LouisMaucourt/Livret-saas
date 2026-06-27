import * as React from 'react';
import { Html, Button } from "react-email";

export function Email(props: { url: string }) {
  const { url } = props;

  return (
    <Html lang="fr">
      <Button href={url}>Click me</Button>
    </Html>
  );
}

export default Email;