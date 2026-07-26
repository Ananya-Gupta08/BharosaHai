import Homepage from "@/components/Homepage";
import {TemporaryLanding} from "@/components/TemporaryLanding";
import {SHOW_TEMP_LANDING} from "@/lib/feature-flags";

export default function HomePage() {
  if (SHOW_TEMP_LANDING) {
    return <TemporaryLanding />;
  }

  return <Homepage />;
}
