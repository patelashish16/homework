import React, { useContext} from "react";
import SubscriptionComponent from "../components/SubscriptionComponent";
import PriceView from "../components/PriceView";
import { MyContext } from '../context/index.jsx';

const SoketTest = () => {
  const { subscribedProducts }: any = useContext(MyContext);

  return (
    <section className="text-gray-400 items-center justify-center  body-font">
       
      <div className="container  px-5 py-24 mx-auto">
        <div className="flex lg:w-2/3 w-full   justify-center sm:flex-row flex-col mx-auto px-8 sm:px-0 items-end sm:space-x-4 sm:space-y-0 space-y-4">
         {/* subscribe and unsubscribe product */}
          <SubscriptionComponent />
          {/* listing of subscirbed product of latest price list */}
          <PriceView subscribedProducts={subscribedProducts} />
        </div>
      </div>
    </section>
  );
};

export default SoketTest;

