import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

interface AbandonedCartEmailProps {
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
  total: number;
  cartUrl: string;
  promoCode?: string;
  promoDiscount?: number;
}

export const AbandonedCartEmail = ({
  customerName = "Valued Customer",
  items = [
    {
      name: "Chicken Bunny Chow",
      quantity: 2,
      price: 1200,
      image: "/curries/chicken-bunny-placeholder.png",
    },
  ],
  total = 3900,
  cartUrl = "https://bunnyathome.com/cart",
  promoCode = "COMEBACK10",
  promoDiscount = 10,
}: AbandonedCartEmailProps) => {
  const formatPrice = (price: number) => {
    return `£${(price / 100).toFixed(2)}`;
  };

  return (
    <Html>
      <Head />
      <Preview>Your bunny chow is waiting for you! Complete your order now.</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Img
              src="https://bunnyathome.com/logo.png"
              width="120"
              height="40"
              alt="BunnyAtHome"
              style={logo}
            />
          </Section>

          <Section style={content}>
            <Heading style={h1}>Eish, {customerName}! Forget something? 🍛</Heading>
            <Text style={text}>
              You left some lekker items in your cart. Don't miss out on that Durban goodness!
            </Text>

            <Section style={itemsSection}>
              {items.map((item, index) => (
                <Row key={index} style={itemRow}>
                  <Column style={itemImageColumn}>
                    <Img src={item.image} width="80" height="80" style={itemImage} />
                  </Column>
                  <Column style={itemDetailsColumn}>
                    <Text style={itemName}>
                      {item.quantity}x {item.name}
                    </Text>
                    <Text style={itemPrice}>{formatPrice(item.price * item.quantity)}</Text>
                  </Column>
                </Row>
              ))}
            </Section>

            <Hr style={hr} />

            <Row style={totalRow}>
              <Column>
                <Text style={totalLabel}>Cart Total</Text>
              </Column>
              <Column>
                <Text style={totalValue}>{formatPrice(total)}</Text>
              </Column>
            </Row>

            {promoCode && promoDiscount && (
              <Section style={promoBox}>
                <Text style={promoText}>
                  🎉 <strong>Special offer just for you!</strong>
                </Text>
                <Text style={promoCode}>Use code: {promoCode}</Text>
                <Text style={promoDiscount}>Save {promoDiscount}% on your order</Text>
              </Section>
            )}

            <Section style={buttonContainer}>
              <Button style={button} href={cartUrl}>
                Complete my order, sharp sharp!
              </Button>
            </Section>

            <Text style={urgency}>
              ⏰ Your cart items are reserved for the next 24 hours
            </Text>

            <Hr style={hr} />

            <Text style={footer}>
              Changed your mind? No stress, bru. We'll keep your cart safe for a bit longer.
            </Text>

            <Text style={footer}>
              Lekker vibes,
              <br />
              The BunnyAtHome Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default AbandonedCartEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const header = {
  padding: "32px 48px",
  backgroundColor: "#f97316",
};

const logo = {
  margin: "0 auto",
};

const content = {
  padding: "0 48px",
};

const h1 = {
  color: "#1a1a1a",
  fontSize: "32px",
  fontWeight: "700",
  margin: "40px 0 20px",
  padding: "0",
};

const text = {
  color: "#525252",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
};

const itemsSection = {
  margin: "32px 0",
};

const itemRow = {
  marginBottom: "20px",
  borderRadius: "8px",
  border: "2px solid #e5e5e5",
  padding: "16px",
};

const itemImageColumn = {
  width: "100px",
};

const itemImage = {
  borderRadius: "8px",
};

const itemDetailsColumn = {
  paddingLeft: "16px",
};

const itemName = {
  color: "#1a1a1a",
  fontSize: "18px",
  fontWeight: "600",
  margin: "0 0 8px 0",
};

const itemPrice = {
  color: "#f97316",
  fontSize: "16px",
  fontWeight: "700",
  margin: "0",
};

const hr = {
  borderColor: "#e5e5e5",
  margin: "26px 0",
};

const totalRow = {
  marginBottom: "8px",
};

const totalLabel = {
  color: "#1a1a1a",
  fontSize: "20px",
  fontWeight: "700",
  margin: "0",
};

const totalValue = {
  color: "#1a1a1a",
  fontSize: "20px",
  fontWeight: "700",
  margin: "0",
  textAlign: "right" as const,
};

const promoBox = {
  backgroundColor: "#fef3c7",
  borderRadius: "12px",
  padding: "24px",
  margin: "24px 0",
  textAlign: "center" as const,
  border: "2px solid #f97316",
};

const promoText = {
  color: "#1a1a1a",
  fontSize: "16px",
  margin: "0 0 12px 0",
};

const promoCode = {
  color: "#f97316",
  fontSize: "28px",
  fontWeight: "700",
  margin: "0 0 8px 0",
  letterSpacing: "2px",
};

const promoDiscount = {
  color: "#525252",
  fontSize: "14px",
  margin: "0",
};

const buttonContainer = {
  margin: "32px 0",
  textAlign: "center" as const,
};

const button = {
  backgroundColor: "#f97316",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "700",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 32px",
};

const urgency = {
  backgroundColor: "#fee2e2",
  borderRadius: "8px",
  color: "#991b1b",
  fontSize: "14px",
  fontWeight: "600",
  padding: "12px 16px",
  margin: "24px 0",
  textAlign: "center" as const,
};

const footer = {
  color: "#737373",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "16px 0",
};

