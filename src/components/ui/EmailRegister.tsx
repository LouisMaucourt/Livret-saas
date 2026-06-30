import {
  Html,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Button,
  Hr,
} from "react-email";

export function Email({ url }: { url: string }) {
  return (
    <Html lang="fr">
      <Body
        style={{
          backgroundColor: "#f6f9fc",
          fontFamily:
            "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          margin: 0,
          padding: "40px 0",
        }}
      >
        <Container
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "12px",
            padding: "40px",
            maxWidth: "520px",
            margin: "0 auto",
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
          }}
        >
          <Section>
            <Heading
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#111827",
                marginBottom: "16px",
              }}
            >
              Confirme ton compte ✨
            </Heading>

            <Text
              style={{
                fontSize: "16px",
                lineHeight: "26px",
                color: "#4b5563",
                marginBottom: "24px",
              }}
            >
              Merci pour ton inscription. Clique sur le bouton ci-dessous pour
              valider ton adresse email et activer ton compte.
            </Text>

            <Button
              href={url}
              style={{
                backgroundColor: "#111827",
                color: "#ffffff",
                padding: "14px 24px",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: "600",
                display: "inline-block",
              }}
            >
              Confirmer mon compte
            </Button>

            <Text
              style={{
                fontSize: "14px",
                lineHeight: "22px",
                color: "#6b7280",
                marginTop: "28px",
              }}
            >
              Si le bouton ne fonctionne pas, copie et colle ce lien dans ton
              navigateur :
            </Text>

            <Text
              style={{
                fontSize: "14px",
                color: "#2563eb",
                wordBreak: "break-all",
              }}
            >
              {url}
            </Text>

            <Hr
              style={{
                borderColor: "#e5e7eb",
                margin: "32px 0",
              }}
            />

            <Text
              style={{
                fontSize: "12px",
                color: "#9ca3af",
                textAlign: "center",
              }}
            >
              Si tu n’es pas à l’origine de cette inscription, tu peux ignorer
              cet email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export default Email;