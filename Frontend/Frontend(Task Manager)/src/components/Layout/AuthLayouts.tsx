import { ReactNode } from "react";
import UI_IMG from "../../assets/naruto.jpg"
interface AuthLayoutsProps {
  children: ReactNode;
}


export const AuthLayouts = ({ children }: AuthLayoutsProps) => {
  return (
    <div className="flex">
        <div className="w-screen h-screen md:w-[60vw] px-12 pt-8 pb-12">
            <div className="text-lg font-medium text-black">Task Manager</div>
                {children}
        </div>
{/* bg-[url('/483.jpg.webp')] */}
        <div className="hidden md:flex w-[40vw] h-screen items-center justify-center bg-blue-200 bg-cover bg-no-repeat bg-center overflow-hidden p-8">
            <img src={UI_IMG} className="w-64 lg:w-[90%]" />
        </div>
    </div>
  )
}

export default AuthLayouts
