import React, { useContext } from "react";
import { MyContext } from "../context";
import moment from 'moment';
interface PriceViewProps {
    subscribedProducts?: string[];
}


const PriceView: React.FC<PriceViewProps> = ({ subscribedProducts = [] }) => {
    const { prices }: any = useContext(MyContext);
    const generateRaw = () => {
        if (prices && subscribedProducts.length > 0) {
            return subscribedProducts.map((item) => (
                <tr key={item} className="hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{prices[item]?.product_id}</td>
                    <td className="py-2 px-4 border-b">{prices[item]?.trade_id}</td>
                    <td className={`py-2 px-4 border-b ${prices[item]?.side === "buy" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>{prices[item]?.side}</td>
                    <td className="py-2 px-4 border-b">{prices[item]?.quantity}</td>
                    <td className="py-2 px-4 border-b">{prices[item]?.price}</td>
                    <td className="py-2 px-4 border-b">{moment(prices[item]?.time).format('DD/MM/YYYY')} {moment(prices[item]?.time).format('HH:mm:ss')}</td>
                </tr>
            ))
        } else {
            return (
                <tr key="nodata" className="hover:bg-gray-50 text-center">
                    <td className="py-2 px-4 border-b" colSpan={8}>No data yet</td>
                </tr>)
        }

    }
    return (
        <div className="overflow-x-auto">
            <h2>Price View</h2>
            <div className="h-60 overflow-y-auto">
                <table className="min-w-full bg-white border border-gray-200 w-[640px]">
                    <thead>
                        <tr className="bg-gray-100 text-gray-600">
                            <th className="py-2 px-4 border-b">Product</th>
                            <th className="py-2 px-4 border-b">Trade id</th>
                            <th className="py-2 px-4 border-b">Side</th>
                            <th className="py-2 px-4 border-b">Quantity</th>
                            <th className="py-2 px-4 border-b">Price</th>
                            <th className="py-2 px-4 border-b">Time</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-700">
                        {generateRaw()}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PriceView;
