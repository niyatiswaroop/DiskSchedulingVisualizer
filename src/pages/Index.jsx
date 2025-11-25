import { useState } from "react";
import { InputForm } from "@/components/InputForm";
import { DiskVisualization } from "@/components/DiskVisualization";
import { MetricsDisplay } from "@/components/MetricsDisplay";
import { ComparisonChart } from "@/components/ComparisonChart";
import { executeAlgorithm } from "@/lib/diskScheduling";
import { HardDrive } from "lucide-react";

const Index = () => {
  const [metrics, setMetrics] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentAlgorithm, setCurrentAlgorithm] = useState(null);
  const [diskSize, setDiskSize] = useState(200);
  const [requests, setRequests] = useState([]);
  const [algorithmResults, setAlgorithmResults] = useState(new Map());
  const [animationSpeed, setAnimationSpeed] = useState(800);

  const handleSubmit = (data) => {
    setCurrentAlgorithm(data.algorithm);
    setDiskSize(data.diskSize);
    setRequests(data.requests);

    const result = executeAlgorithm(
      data.algorithm,
      data.requests,
      data.head,
      data.diskSize,
      data.direction
    );

    setMetrics(result);

    // Add result to comparison map
    setAlgorithmResults((prev) => {
      const newMap = new Map(prev);
      newMap.set(data.algorithm, result);
      return newMap;
    });

    setIsAnimating(true);

    // Stop animation after all steps are complete
    setTimeout(() => {
      setIsAnimating(false);
    }, result.path.length * animationSpeed);
  };

  const handleReset = () => {
    setMetrics(null);
    setIsAnimating(false);
    setRequests([]);
    setCurrentAlgorithm(null);
    setAlgorithmResults(new Map());
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <HardDrive className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Disk Scheduling Visualizer</h1>
              <p className="text-sm text-muted-foreground">Interactive algorithm comparison and visualization tool</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Input Form */}
          <InputForm 
            onSubmit={handleSubmit} 
            onReset={handleReset} 
            isAnimating={isAnimating}
            animationSpeed={animationSpeed}
            onSpeedChange={setAnimationSpeed}
          />

          {/* Metrics Display */}
          <MetricsDisplay metrics={metrics} />

          {/* Visualization */}
          {metrics && (
            <DiskVisualization
              path={metrics.path}
              requests={requests}
              diskSize={diskSize}
              isAnimating={isAnimating}
              animationSpeed={animationSpeed}
            />
          )}

          {/* Comparison Chart */}
          {algorithmResults.size > 0 && (
            <ComparisonChart
              algorithmResults={algorithmResults}
              currentAlgorithm={currentAlgorithm}
            />
          )}

          {/* Algorithm Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AlgorithmCard
              title="FCFS"
              description="First Come First Serve processes requests in the order they arrive."
              complexity="Simple and fair"
            />
            <AlgorithmCard
              title="SSTF"
              description="Shortest Seek Time First selects the request closest to the current head position."
              complexity="Better performance"
            />
            <AlgorithmCard
              title="SCAN"
              description="Elevator algorithm moves in one direction serving requests until reaching the end."
              complexity="Prevents starvation"
            />
            <AlgorithmCard
              title="C-SCAN"
              description="Circular SCAN moves in one direction and jumps back to the beginning."
              complexity="More uniform wait time"
            />
            <AlgorithmCard
              title="LOOK"
              description="Similar to SCAN but only goes as far as the last request in each direction."
              complexity="Optimized SCAN"
            />
            <AlgorithmCard
              title="C-LOOK"
              description="Circular LOOK combines the benefits of C-SCAN and LOOK algorithms."
              complexity="Best overall performance"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-12 bg-card/50">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Built with React, JavaScript, and Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
};

const AlgorithmCard = ({ title, description, complexity }) => (
  <div className="p-4 border border-border rounded-lg bg-card hover:shadow-md transition-shadow">
    <h3 className="font-semibold text-foreground mb-2">{title}</h3>
    <p className="text-sm text-muted-foreground mb-2">{description}</p>
    <span className="inline-block px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
      {complexity}
    </span>
  </div>
);

export default Index;
