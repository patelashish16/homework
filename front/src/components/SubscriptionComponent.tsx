import React, { useContext, useState } from "react";
import { MyContext } from "../context";
import { products } from "../initials";
import { Checkbox } from 'semantic-ui-react';

// Coin Icons
import BTC_Icon from '../assets/coins/btc.png';
import ETH_Icon from '../assets/coins/eth.png';
import XRP_Icon from '../assets/coins/xrp.png';
import LTC_Icon from '../assets/coins/ltc.png';
import DEFAULT_Icon from '../assets/coins/default.png';

const iconMap: { [key: string]: string } = {
  BTC: BTC_Icon,
  ETH: ETH_Icon,
  XRP: XRP_Icon,
  LTC: LTC_Icon,
};

const SubscriptionComponent: React.FC = () => {
  const { subscribedProducts, unsubscribe, subscribe } = useContext(MyContext);
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);

  const handleCheckboxChange = (_: React.ChangeEvent<HTMLInputElement>, data: any) => {
    const { value } = data;

    if (selectedOptions.includes(value)) {
      // Unsubscribe from product
      setSelectedOptions(prev => prev.filter(option => option !== value));
      unsubscribe(value);
    } else {
      // Subscribe to product
      setSelectedOptions(prev => [...prev, value]);
      if (!subscribedProducts.includes(value)) {
        subscribe(value);
      }
    }
  };

  const getIcon = (productName: string) => {
    const symbol = productName.replace(/usdt.*/i, '').toUpperCase();
    return iconMap[symbol] || DEFAULT_Icon;
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Subscribe/Unsubscribe Products</h2>
      <ul className="flex flex-col list-none space-y-4">
        {products.map((product) => (
          <li key={product} className="flex items-center py-2 px-4">
            <img src={getIcon(product)} alt={product} style={{ width: '25px', marginRight: '8px' }} />
            <Checkbox
              label={product}
              value={product}
              checked={selectedOptions.includes(product)}
              onChange={handleCheckboxChange}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubscriptionComponent;
