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

interface OrderConfirmationEmailProps {
  orderNumber: string;
  customerName: string;
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  deliveryAddress: {
    line1: string;
    line2?: string;
    city: string;
    postcode: string;
  };
  deliveryDate: string;
  deliveryTimeSlot: string;
  subtotal: number;
  deliveryFee: number;
  discount: number;
}

export const OrderConfirmationEmail = ({
  orderNumber = "BH-123456789",
  customerName = "Valued Customer",
  total = 5500,
  items = [
    { name: "Chicken Bunny Chow", quantity: 2, price: 1200 },
    { name: "Lamb Durban Curry", quantity: 1, price: 1500 },
  ],
  deliveryAddress = {
    line1: "123 Main Street",
    city: "London",
    postcode: "SW1A 1AA",
  },
  deliveryDate = "Monday, December 25, 2024",
  deliveryTimeSlot = "afternoon",
  subtotal = 5000,
  deliveryFee = 500,
  discount = 0,
}: OrderConfirmationEmailProps) => {
  const formatPrice = (price: number) => {
    return `£${(price / 100).toFixed(2)}`;
  };

  return (
    <Html>
      <Head />
      <Preview>Your BunnyAtHome order is confirmed! Order #{orderNumber}</Preview>
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
            <Heading style={h1}>Sorted, {customerName}! 🎉</Heading>
            <Text style={text}>
              Your bunny chow order is confirmed and we're getting it ready for you, sharp sharp!
            </Text>

            <Section style={orderBox}>
              <Text style={orderNumber}>Order #{orderNumber}</Text>
            </Section>

            <Hr style={hr} />

            <Heading as="h2" style={h2}>
              What you ordered
            </Heading>

            {items.map((item, index) => (
              <Row key={index} style={itemRow}>
                <Column style={itemName}>
                  <Text style={itemText}>
                    {item.quantity}x {item.name}
                  </Text>
                </Column>
                <Column style={itemPrice}>
                  <Text style={itemText}>{formatPrice(item.price * item.quantity)}</Text>
                </Column>
              </Row>
            ))}

            <Hr style={hr} />

            <Row style={totalRow}>
              <Column>
                <Text style={totalLabel}>Subtotal</Text>
              </Column>
              <Column>
                <Text style={totalValue}>{formatPrice(subtotal)}</Text>
              </Column>
            </Row>

            <Row style={totalRow}>
              <Column>
                <Text style={totalLabel}>Delivery</Text>
              </Column>
              <Column>
                <Text style={totalValue}>{formatPrice(deliveryFee)}</Text>
              </Column>
            </Row>

            {discount > 0 && (
              <Row style={totalRow}>
                <Column>
                  <Text style={discountLabel}>Discount</Text>
                </Column>
                <Column>
                  <Text style={discountValue}>-{formatPrice(discount)}</Text>
                </Column>
              </Row>
            )}

            <Hr style={hr} />

            <Row style={totalRow}>
              <Column>
                <Text style={grandTotalLabel}>Total</Text>
              </Column>
              <Column>
                <Text style={grandTotalValue}>{formatPrice(total)}</Text>
              </Column>
            </Row>

            <Hr style={hr} />

            <Heading as="h2" style={h2}>
              Delivery details
            </Heading>

            <Text style={text}>
              <strong>Address:</strong>
              <br />
              {deliveryAddress.line1}
              {deliveryAddress.line2 && (
                <>
                  <br />
                  {deliveryAddress.line2}
                </>
              )}
              <br />
              {deliveryAddress.city}, {deliveryAddress.postcode}
            </Text>

            <Text style={text}>
              <strong>When:</strong> {deliveryDate}
              <br />
              <strong>Time slot:</strong> {deliveryTimeSlot}
            </Text>

            <Section style={buttonContainer}>
              <Button style={button} href={`https://bunnyathome.com/track/${orderNumber}`}>
                Track your order
              </Button>
            </Section>

            <Hr style={hr} />

            <Text style={footer}>
              Questions? Just reply to this email or visit our{" "}
              <a href="https://bunnyathome.com/help" style={link}>
                help center
              </a>
              .
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

export default OrderConfirmationEmail;

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

const h2 = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "700",
  margin: "30px 0 15px",
};

const text = {
  color: "#525252",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "16px 0",
};

const orderBox = {
  backgroundColor: "#fef3c7",
  borderRadius: "8px",
  padding: "20px",
  margin: "24px 0",
  textAlign: "center" as const,
};

const orderNumber = {
  color: "#1a1a1a",
  fontSize: "24px",
  fontWeight: "700",
  margin: "0",
};

const hr = {
  borderColor: "#e5e5e5",
  margin: "26px 0",
};

const itemRow = {
  marginBottom: "12px",
};

const itemName = {
  width: "70%",
};

const itemPrice = {
  width: "30%",
  textAlign: "right" as const,
};

const itemText = {
  color: "#1a1a1a",
  fontSize: "16px",
  margin: "0",
};

const totalRow = {
  marginBottom: "8px",
};

const totalLabel = {
  color: "#525252",
  fontSize: "16px",
  margin: "0",
};

const totalValue = {
  color: "#1a1a1a",
  fontSize: "16px",
  margin: "0",
  textAlign: "right" as const,
};

const discountLabel = {
  color: "#059669",
  fontSize: "16px",
  margin: "0",
};

const discountValue = {
  color: "#059669",
  fontSize: "16px",
  margin: "0",
  textAlign: "right" as const,
};

const grandTotalLabel = {
  color: "#1a1a1a",
  fontSize: "20px",
  fontWeight: "700",
  margin: "0",
};

const grandTotalValue = {
  color: "#1a1a1a",
  fontSize: "20px",
  fontWeight: "700",
  margin: "0",
  textAlign: "right" as const,
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

const footer = {
  color: "#737373",
  fontSize: "14px",
  lineHeight: "24px",
  margin: "16px 0",
};

const link = {
  color: "#f97316",
  textDecoration: "underline",
};

