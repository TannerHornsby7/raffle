import Header from './components/Header'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Raffle Ticket Shop',
    description: 'Buy raffle tickets from your favorite celebrities',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className + ' bg-background'}>
                <Header />
                {children}
            </body>
        </html>
    )
}
