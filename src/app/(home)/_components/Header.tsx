'use client'

import { useEffect, useState } from "react"
import { ConvexHttpClient } from "convex/browser"
import { api } from "../../../../convex/_generated/api"
import Link from "next/link"
import { Code2, Sparkles, Trophy, FileCode2 } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import ThemeSelector from "./ThemeSelector"
import LanguageSelector from "./LanguageSelector"
import { useUser } from "@clerk/nextjs"
import HeaderProfileBtn from "./HeaderProfileBtn"
import { Button } from "@/components/ui/button"

const navItems = [
  { id: 'challenges', href: "/challenges", icon: Code2, text: "Challenges" },
  { id: 'snippets', href: "/snippets", icon: FileCode2, text: "Snippets" },
  { id: 'leaderboard', href: "/leaderboard", icon: Trophy, text: "Leaderboard" },
  { id: 'theme', component: ThemeSelector },
  { id: 'language', component: LanguageSelector }
]

const navItemVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
}

const floatingAnimation = {
  initial: { y: 0 },
  animate: {
    y: [-1, 1, -1],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

const glowAnimation = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: [0.5, 0.7, 0.5],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

function Header() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [convexUser, setConvexUser] = useState<any>(null)
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const { user } = useUser()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 10)
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  useEffect(() => {
    const fetchUser = async () => {
      if (user?.id) {
        const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)
        const userData = await convex.query(api.users.getUser, { userId: user.id })
        setConvexUser(userData)
      }
    }
    fetchUser()
  }, [user])

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ 
        opacity: isVisible ? 1 : 0,
        y: isVisible ? 0 : -100,
      }}
      transition={{ duration: 0.3 }}
      className="h-30 border-b border-slate-700 bg-slate-900/90 backdrop-blur-sm sticky z-50"
    >
      <motion.div
        initial="initial"
        animate="animate"
        variants={floatingAnimation}
        className="relative mx-4 mt-2"
      >
        <motion.div
          variants={glowAnimation}
          className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-xl"
        />
        
        <div className="relative rounded-xl backdrop-blur-md bg-gray-900/90 shadow-lg shadow-blue-500/5">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity" />
                  <div className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] p-1 rounded-lg ring-1 ring-white/10 group-hover:ring-white/20 transition-all">
                    <Image
                      src="/logo.png"
                      width={42}
                      height={42}
                      alt="CodeX Logo"
                      className="rounded-md"
                    />
                  </div>
                </motion.div>

                <div className="flex flex-col">
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="block text-base font-bold bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 text-transparent bg-clip-text"
                  >
                    CodeX
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="block text-[10px] text-blue-400/60 font-medium"
                  >
                    Open Source Code Editor | 2025
                  </motion.span>
                </div>
              </Link>

              <nav className="hidden md:flex items-center space-x-2">
                {navItems.map((item, i) => (
                  <motion.div
                    key={item.id}
                    custom={i}
                    variants={navItemVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ y: -2 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    {item.component ? (
                      item.id === 'language' ? (
                        <LanguageSelector hasAccess={Boolean(convexUser?.isPro)} />
                      ) : (
                        <ThemeSelector />
                      )
                    ) : (
                      <Link href={item.href!} passHref legacyBehavior>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-300 hover:text-white hover:bg-gray-800/50 transition-all duration-300"
                        >
                          <item.icon className="w-4 h-4 mr-2" />
                          {item.text}
                        </Button>
                      </Link>
                    )}
                  </motion.div>
                ))}
              </nav>

              <div className="flex items-center gap-2">
                <AnimatePresence mode="wait">
                  {!convexUser?.isPro && (
                    <motion.div
                      key="pro-button"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <Link href="/pricing" passHref legacyBehavior>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-gradient-to-r from-amber-500 to-orange-500 text-white border-none
                            hover:from-amber-600 hover:to-orange-600 transition-all duration-300
                            shadow-lg hover:shadow-amber-500/20"
                        >
                          <Sparkles className="w-3.5 h-3.5 mr-2" />
                          Go Pro
                        </Button>
                      </Link>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.div
                  key="profile-button"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  whileHover={{ y: -2 }}
                >
                  <HeaderProfileBtn />
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.header>
  )
}

export default Header