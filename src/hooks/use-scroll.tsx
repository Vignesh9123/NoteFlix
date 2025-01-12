import {useEffect, useState} from 'react'

function useScroll() {
    const [isScrollingDown, setIsScrollingDown] = useState(false)
    const [prevScrollPos, setPrevScrollPos] = useState(0)

    useEffect(() => {
        const handleScroll = () => {

            if (window.scrollY > prevScrollPos && window.scrollY > 50) {
                setIsScrollingDown(true)
            } else {
                setIsScrollingDown(false)
            }
            setPrevScrollPos(window.scrollY)

            
        }
        window.addEventListener('scroll', handleScroll)
        return () => {
            window.removeEventListener('scroll', handleScroll)
        }
    },[prevScrollPos])
  return {isScrollingDown}
}

export default useScroll
