import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

export const DiskVisualization = ({ path, requests, diskSize, isAnimating, animationSpeed }) => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!isAnimating) {
      setCurrentStep(0);
      return;
    }

    if (currentStep < path.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, animationSpeed);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, currentStep, path.length, animationSpeed]);

  const visiblePath = isAnimating ? path.slice(0, currentStep + 1) : path;
  const currentPosition = visiblePath[visiblePath.length - 1];

  return (
    <Card className="p-6 bg-card">
      <h3 className="text-lg font-semibold mb-4 text-foreground">Disk Head Movement</h3>

      {/* Number Line */}
      <div className="relative h-32 bg-muted rounded-lg p-4 overflow-x-auto">
        <div className="relative h-full flex items-center">
          {/* Track Line */}
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-border transform -translate-y-1/2" />

          {/* Tick marks for boundaries and key positions */}
          {[0, diskSize].map((pos) => (
            <div key={`boundary-${pos}`} className="absolute" style={{ left: `${(pos / diskSize) * 100}%` }}>
              <div className="absolute top-1/2 w-0.5 h-8 bg-border transform -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute top-full mt-2 text-xs text-muted-foreground transform -translate-x-1/2 whitespace-nowrap">
                {pos}
              </div>
            </div>
          ))}

          {/* Request markers - showing all requests */}
          {requests.map((pos, idx) => {
            const visitIndex = visiblePath.indexOf(pos);
            const isVisited = visitIndex !== -1;

            return (
              <motion.div
                key={`request-${idx}-${pos}`}
                className={`absolute w-4 h-4 rounded-full border-2 ${
                  isVisited ? "bg-accent border-accent" : "bg-background border-muted-foreground"
                }`}
                style={{
                  left: `${(pos / diskSize) * 100}%`,
                  transform: "translate(-50%, -50%)",
                  top: "50%",
                }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
              >
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-foreground whitespace-nowrap">
                  {pos}
                </div>
                {isVisited && (
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-accent text-accent-foreground px-1.5 py-0.5 rounded text-xs font-bold whitespace-nowrap">
                    {visitIndex}
                  </div>
                )}
              </motion.div>
            );
          })}

          {/* Current Head Position */}
          <motion.div
            className="absolute w-6 h-6 bg-primary rounded-full border-4 border-background shadow-lg z-20"
            style={{
              left: `${(currentPosition / diskSize) * 100}%`,
              top: "50%",
              transform: "translate(-50%, -50%)",
            }}
            animate={{
              left: `${(currentPosition / diskSize) * 100}%`,
            }}
            transition={{ duration: animationSpeed / 1000, ease: "easeInOut" }}
          >
            <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-bold whitespace-nowrap shadow-md">
              Head: {currentPosition}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Path Sequence */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-foreground mb-2">Movement Sequence:</h4>
        <div className="flex flex-wrap gap-2">
          {visiblePath.map((pos, idx) => (
            <div key={idx} className="flex items-center">
              <span
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  idx === currentStep ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
                }`}
              >
                {pos}
              </span>
              {idx < visiblePath.length - 1 && <span className="mx-2 text-muted-foreground">→</span>}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
