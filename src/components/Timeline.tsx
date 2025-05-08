import { motion } from "framer-motion";
import { useEffect } from "react";
import scrollama from "scrollama";

export default function Timeline() {
  useEffect(() => {
    const scroller = scrollama();
    scroller
      .setup({ step: ".step", offset: 0.5 })
      .onStepEnter(response => {
        console.log("step enter", response.index);
      });
    return () => scroller.destroy();
  }, []);

  return (
    <div className="timeline">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="step" style={{ height: "100vh", borderBottom: "1px solid #ccc" }}>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Step {i + 1}</h2>
          </motion.div>
        </div>
      ))}
    </div>
  );
}
