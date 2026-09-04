import { useState } from "react";
import Hero from "./Hero";
import CreateTicket from "./CreateTicket";

function SupportPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="support-page bg-white">
      {/* Search Header Section */}
      <Hero search={search} setSearch={setSearch} />

      {/* Main Content & Accordion Section */}
      <CreateTicket search={search} setSearch={setSearch} />
    </div>
  );
}

export default SupportPage;
