import React from 'react'
import { SidebarTrigger } from './ui/sidebar'
import useScroll from '@/hooks/use-scroll'
import { motion } from 'framer-motion'
function MobileNavbar() {
    const {isScrollingDown} = useScroll()
  return (
    <>
    {!isScrollingDown && <motion.div initial={{ opacity: 0, y:-10 }} animate={{ opacity: 1, y:0 }} transition={{ duration: 0.3 }} exit={{ opacity: 0, y:-10 }} className={`md:hidden fixed z-[5000] flex items-center justify-between px-4 py-2 shadow-black shadow-md top-0 bg-muted w-full`}>
      <SidebarTrigger />
      <div className=' w-min font-bold'>Vidscribe</div>
      <div className='w-8'></div>
    </motion.div>}
    </>
  )
}

export default MobileNavbar
