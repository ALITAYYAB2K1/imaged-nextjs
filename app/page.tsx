import Hero from "@/components/Hero";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  const stats = [
    {
      label: "Images Processed",
      value: 10000,
      icon: "+",
    },
    {
      label: "Active Users",
      value: 500,
      icon: "+",
    },
    {
      label: "AI Transformations",
      value: 1000,
      icon: "+",
    },
    {
      label: "User Satisfaction",
      value: 99,
      icon: "%",
    },
  ];
  return (
    <>
      <div className="pt-36">
        {/* Hero Section */}

        <Hero />

        {/* Stats Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                return (
                  <div key={index} className="text-center">
                    <div className="text-4xl font-bold mb-2 lg:text-5xl bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
                      {stat.value.toLocaleString()}
                      {stat.icon}
                    </div>
                    <div className="text-gray-400 uppercase tracking-wider text-sm">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="py-20 text-center">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-red-500 to-green-400 text-transparent bg-clip-text">
              Ready to{" "}
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
                transform your images?
              </span>
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join us today and experience the power of AI-driven image
              processing.
            </p>
            <Link href="/dashboard">
              <Button variant="primary" size="xl">
                {" "}
                🌟 Get Started
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
