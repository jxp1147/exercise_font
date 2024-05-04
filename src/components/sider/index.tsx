import { menus } from "./index.meta"
import { history } from "umi";

export const BasicLayoutSider = () => {
    return (
        <>
            {
                menus.map((item) => {
                    return (
                        <div className="color-white text-center py-4 cursor-pointer" onClick={() => { history.push(item.path) }} key={item.name}>{item.name}</div>
                    )
                })
            }
        </>
    );
};
export default BasicLayoutSider;