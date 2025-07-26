import { PricingTable } from "@clerk/nextjs";
import React from "react";

function Pricing() {
  return (
    <section className="py-20 " id="pricing">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6">
            Simple{" "}
            <span className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent pb-6">
              Pricing
            </span>
          </h2>

          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose the plan that fits your needs. All plans include access to
            our powerful AI image editing tools, with no hidden fees or
            commitments.
          </p>
        </div>
        <PricingTable />
      </div>
    </section>
  );
}

export default Pricing;
