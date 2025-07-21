import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <>
      <div className="bg-black min-h-screen flex items-center justify-center flex-col text-white">
        <h1>Welcome to the Home Page</h1>
        <p>This is a simple Next.js application.</p>
        <br />
        <Button variant="primary" size="lg" className="mb-4">
          Click Me
        </Button>
        <Button variant={"glass"} size="lg">
          Glass Button
        </Button>
      </div>
    </>
  );
}
