import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { NextAuthOptions } from 'next-auth'

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // نظام بسيط جداً - مستخدمين افتراضيين
        const users = [
          {
            id: '1',
            email: 'admin@kitabi.com',
            password: 'admin123',
            name: 'مدير النظام',
            role: 'admin'
          },
          {
            id: '2', 
            email: 'user@kitabi.com',
            password: 'user123',
            name: 'مستخدم عادي',
            role: 'user'
          }
        ]

        const user = users.find(u => u.email === credentials.email)
        
        if (user && user.password === credentials.password) {
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        }

        // إذا لم يكن موجود، أنشئ حساب جديد
        if (credentials.email && credentials.password) {
          const newUser = {
            id: Date.now().toString(),
            email: credentials.email,
            name: credentials.email.split('@')[0],
            role: 'user'
          }
          
          // في التطبيق الحقيقي، احفظ في قاعدة البيانات
          console.log('Creating new user:', newUser)
          
          return newUser
        }

        return null
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth/login',
    signUp: '/auth/register'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub
        session.user.role = token.role
      }
      return session
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
