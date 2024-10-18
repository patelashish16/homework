import React, { useContext} from "react";
import SubscriptionComponent from "../components/SubscriptionComponent";
import PriceView from "../components/PriceView";
import { MyContext } from '../context/index.jsx';

const SoketTest = () => {
  const { subscribedProducts }: any = useContext(MyContext);

  return (
    <section className="text-gray-400 items-center justify-center  body-font">
       
      <div className="container  px-5 py-24 mx-auto">
        {/* <div className="flex flex-col  w-full mb-12">
         
        </div> */}
        <div className="flex lg:w-2/3 w-full   justify-center sm:flex-row flex-col mx-auto px-8 sm:px-0 items-end sm:space-x-4 sm:space-y-0 space-y-4">
        <SubscriptionComponent />
          <PriceView subscribedProducts={subscribedProducts} />
        </div>
      </div>
    </section>
  );
};

export default SoketTest;

