import React from 'react'
import Header from "../components/Header";
import Footer from "../components/Footer";
const UserLayout = ({ children }:any) => {
    return (
        <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-grow">
            {children}
        </div>
        <Footer />
      </div>
    );
  }
  export default UserLayout;