import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { App, ConfigProvider, theme } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import "@/styles/globals.css";
//import "antd/dist/reset.css"; // For the confirmation prompt (handleDeletion()) on exoplanet profile page
import WebSocketProvider from "@/components/WebSocketProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Exoplanet Hunting",
  description: "sopra-fs25-template-client",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <ConfigProvider
          theme={{
            algorithm: theme.defaultAlgorithm,
            token: {
              // general theme options are set in token, meaning all primary elements (button, menu, ...) will have this color
              colorPrimary: "#22426b", // selected input field boarder will have this color as well
              borderRadius: 8,
              colorText: "#fff",
              fontSize: 16,

              // Alias Token
              colorBgContainer: "#16181D",
            },
            // if a component type needs special styling, setting here will override default options set in token
            components: {
              Button: {
                colorPrimary: "#75bd9d", // this will color all buttons in #75bd9d, overriding the default primaryColor #22426b set in token line 35
                algorithm: true, // enable algorithm (redundant with line 33 but here for demo purposes)
                controlHeight: 38,
              },
              Input: {
                colorBorder: "gray", // color boarder selected is not overridden but instead is set by primary color in line 35
                colorTextPlaceholder: "#888888",
                algorithm: false, // disable algorithm (line 32)
              },
              Form: {
                labelColor: "#fff",
                algorithm: theme.defaultAlgorithm, // specify a specifc algorithm instead of true/false
              },
              Card: {},
              Modal: { // Confirmation when trying to delete exoplanet
                colorBgElevated: "#1e1e1e",
                colorText: "#ffffff",
                titleFontSize: 22,
              },
            },
          }}
        >
          <App>
            <WebSocketProvider>            
              <AntdRegistry>{children}</AntdRegistry>
            </WebSocketProvider>
          </App>
          
        </ConfigProvider>
      </body>
    </html>
  );
}
