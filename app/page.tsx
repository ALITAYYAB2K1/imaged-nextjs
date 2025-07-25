import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="pt-36">
        <section className="py-20 text-center">
          <div>
            <h2>
              Ready to
              <span> transform your images?</span>
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
