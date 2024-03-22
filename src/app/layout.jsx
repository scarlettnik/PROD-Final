'use client'
import UserProvider from "@/provider/UserProvider";
import "./globals.css";
import AuthProvider from "@/provider/AuthProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body>
        <AuthProvider>
          <UserProvider>{children}</UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
