import { useSession } from "next-auth/react"

const useWallet = () => {
  const { data } = useSession()
  return data?.user.walletAddress
}

export default useWallet