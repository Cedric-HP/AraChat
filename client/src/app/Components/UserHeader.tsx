import type { FC } from "react";

type Iprops = {
    name: string,
    src: string,
    height: number,
    width: number
}

const UserHeader: FC<Iprops> = ({ 
        name = "---", 
        src = "https://api.dicebear.com/7.x/rings/svg?seed=quidghsfihgdfhsdfhsdfiojhsdjfhsoidjfhisdfhoiushd", 
        height = 35,
        width = 35
    }) => {
    return <>
        <div className="user-side-barre">
            
            <img
                src={src}
                alt={`Avatar of ${name}`}
                height={height}
                width={width}
            />
            <h2>{name}</h2>
        </div>
    </>
};

export default UserHeader;