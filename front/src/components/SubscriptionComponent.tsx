import React, { useContext, useState } from "react";
import { MyContext } from "../context";
import { products } from "../initials";
import { Checkbox } from 'semantic-ui-react'
import BTC_Icon from '../assets/coins/btc.png';
import ETH_Icon from '../assets/coins/eth.png';
import XRP_Icon from '../assets/coins/xrp.png';
import LTC_Icon from '../assets/coins/ltc.png';
import DEFAULT_Icon from '../assets/coins/default.png';



const SubscriptionComponent: React.FC = () => {
    const { subscribedProducts, unsubscribe, subscribe }: any = useContext(MyContext);
    const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

    const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>, data: any) => {
        const { value } = data;
        if (selectedOptions.includes(value)) {
            // If already selected, remove it from the array
            setSelectedOptions(selectedOptions.filter(option => option !== value));
            // unsubscribe from products
            unsubscribe(value);
        } else {
            // If not selected, add it to the array
            setSelectedOptions([...selectedOptions, value]);
            // subscribe to products
            if(!subscribedProducts.includes(value)){
                subscribe(value);
            } 

        }
    };

    const getimage = (productname: string) => {
        const symbolname = productname.replace(/usdt.*/, '').toUpperCase()
        if (symbolname === 'BTC') {
            return BTC_Icon;
        } else if (symbolname === 'ETH') {
            return ETH_Icon;
        } else if (symbolname === 'XRP') {
            return XRP_Icon;
        } else if (symbolname === 'LTC') {
            return LTC_Icon;
        }else{
            return DEFAULT_Icon;
        }
    }
    return (
        <div className="p-4">
                <h2 className="text-2xl font-bold mb-4">Subscribe/Unsubscribe Products</h2>
                <ul className="flex flex-col justify-center list-none space-y-4">
                    {products.map((option) => (
                        <li key={option} className="flex items-center py-2 px-4">

                            <img src={getimage(option)} alt={option} style={{ width: '25px', margin: '0 8px' }} />
                            <Checkbox
                                key={`product${option}`}
                                label={option}
                                value={option}
                                checked={selectedOptions.includes(option)}
                                onChange={handleCheckboxChange}
                            />
                        </li>
                    ))}
                </ul>
        </div>
    );
};

export default SubscriptionComponent;
